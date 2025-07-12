import validator from 'validator';
import bcrypt from "bcrypt";
import userModel from '../models/User.js';
import doctorModel from "../models/Doctor.js";
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from "cloudinary";
import appointmentModel from '../models/Appointment.js';
import razorpay from "razorpay";

const registerUser = async(req,res) => {
    try {
        const {email,name,password} = req.body;
        console.log("REGISTER HO RHA HU");
        if(!name || !password || !email) {
            return res.status(400).json({success:false,message:"Missing details"});
        }
        
        if(!validator.isEmail(email)) {
            return res.status(400).json({success:false,message:"Enter a valid email"});
        }
        
        if(password.length < 8) {
            return res.status(400).json({success:false,message:"Password should be of atleast 8 digits"});
        }

        //password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const userData = {
            email,
            name,
            password: hashedPassword
        }

        const newUser = new userModel(userData);
        const user = await newUser.save();
        
        const token = await jwt.sign({id:user._id}, process.env.JWT_SECRET);
        return res.status(200).json({success:true,message:"User registered",token});

    } catch(error) {
        console.log(error);
        return res.status(500).json({success:false,message:error.message});
    }
}


const loginUser = async(req,res) => {
    try {
        const {email,password} = req.body;
        const user = await userModel.findOne({email});

        console.log("LOGIN HO RHA HU");

        if(!user) {
            return res.status(400).json({success:false,message:"User does not exist"});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(isMatch) {
            const token = await jwt.sign({id:user._id},process.env.JWT_SECRET);
            return res.status(200).json({success:true,message:"Login successfull",token});
        } else return res.status(400).json({success:false,message:"Invalid credentials"});

    } catch(error) {
        return res.status(500).json({success:false,message:error.message});
    }
}

const getProfile = async(req,res) => {
    try {
        const id = req.userId;
        const userData = await userModel.findById(id).select("-password");

        return res.status(200).json({
            success:true,
            message:"Profile fetched successfully",
            userData
        });
    } catch(error) {
        return res.status(500).json({success:false,message:error.message});
    }
}

const updateProfile = async(req,res) => {
    try {
        const id = req.userId;
        const {name,phone,address,dob,gender} = req.body;
        const imageFile = req.file;

        if(!name || !phone || !address || !dob || !gender) {
            return res.status(400).json({success:false,message:"Missing details"});
        }

        await userModel.findByIdAndUpdate(id,{name,phone,dob,gender,address});

        if(imageFile) {
            //upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'});
            const imageUrl = imageUpload.secure_url;

            await userModel.findByIdAndUpdate(id,{image:imageUrl});
        }

        return res.status(200).json({success:true,message:"Profile updated"});

    } catch(error) {
        return res.status(500).json({success:false,message:error.message});
    }
}

const bookAppointment = async(req,res) => {
    try {
        const {docId,slotTime,slotDate} = req.body;
        const userId = req.userId;
        // console.log(id)
        const docData = await doctorModel.findById(docId).select("-password");

        if(!docData.available) {
            return res.json({success:false,message:"Doctor not available"});
        }

        let slots_booked = docData.slots_booked;

        if(slots_booked[slotDate]) {
            if(slots_booked[slotDate].includes(slotTime)) {
                return res.json({success:false,message:"Slot not available"});
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }

        const userData = await userModel.findById(userId).select("-password");
        delete docData.slots_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
        }

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        await doctorModel.findByIdAndUpdate(docId,{slots_booked});
        return res.status(200).json({success:true,message:"Appointment booked successfully"});
    } catch(error) {
        return res.status(500).json({success:false,message:error.message});
    }
}

const getAppointment = async(req,res) => {
    try {   
        const userId = req.userId;
        const appointments = await appointmentModel.find({userId});

        return res.status(200).json({success:true,appointments});
    } catch(error) {
        return res.status(500).json({success:false,message:error.message});
    }
}


const cancelAppointment = async(req,res) => {
    try {
        const userId = req.userId;
        const {appointmentId} = req.body;

        const appointment = await appointmentModel.findById(appointmentId);

        if(appointment.userId !== userId) {
            return res.status(400).json({success:false,message:"Not authorized for this action."});
        }

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});

        // removing booked slot
        const doc = await doctorModel.findById(appointment.docId);
        let slots_booked = doc.slots_booked;
        const {docId,slotDate,slotTime} = appointment;

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
        
        //updating slots in doctor model
        await doctorModel.findByIdAndUpdate(docId,{slots_booked});
        return res.status(200).json({success:true,message:"Appointment cancelled"});


    } catch(error) {
        return res.status(500).json({success:false,message:error.message});
    }
}


const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
});

const paymentRazorpay = async(req,res) => {
    try {
        const {appointmentId} = req.body;
        const appointment = await appointmentModel.findById(appointmentId);

        if(!appointment || appointment.cancelled) {
            return res.status(400).json({success:false,message:"Appointment cancelled or not found"});
        }

        // creating options for razorpay payment
        const options = {
            amount: appointment.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creating order 
        const order = await razorpayInstance.orders.create(options);
        return res.status(200).json({success:true,order});
    } catch(error) {
        return res.status(500).json({success:false,message:error.message});
    }
}


// verify razorpay payment
const verifyRazorpay = async(req,res) => {
    try {
        const {razorpay_order_id} = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        if(orderInfo.status === "paid") {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
            return res.status(200).json({success:true,message:"Payment sucessfull"});
        } else return res.status(400).json({success:false,message:"Payment failed"});

    } catch(error) {
        return res.status(500).json({success:false,message:error.message});
    }
}

export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,getAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay};