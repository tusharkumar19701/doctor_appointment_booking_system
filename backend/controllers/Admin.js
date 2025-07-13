import validator from "validator";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary";
import doctorModel from "../models/Doctor.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/Appointment.js";
import userModel from "../models/User.js";

const addDoctor = async(req,res) => {
    try {
        const {name,email,password,speciality,degree,experience,fees,about,address} = req.body;
        const imageFile = req.file;
        if(!name || !email || !password || !experience || !fees || !degree || !speciality || !about || !address) {
            return res.status(400).json({success:false,message:"All fields are required"});
        }
        
        if(!validator.isEmail(email)) {
            return res.status(400).json({success:false,message:"Please enter a valid email"});
        }

        if(password.length < 8) {
            return res.status(400).json({success:false,message:"Password length must be greater than or equal to 8"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //image upload to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"});
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            fees,
            about,
            experience,
            address: address,
            date: Date.now(),
        }

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        return res.status(200).json({success:true,message:"Doctor added successfully",newDoctor});
    } catch(error) {
        console.log("Error:",error);
        return res.status(500).json({success:false,message:error.message});
    }
}


const loginAdmin = async(req,res) => {
    try {
        const {email,password} = req.body;
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = await jwt.sign(email+password,process.env.JWT_SECRET);
            return res.status(200).json({success:true,token,message:"Login successfull"});
        } else return res.json({success:false,message:"Invalid credentials"});


    }catch(error) {
        console.log("Error:",error);
        return res.status(500).json({success:false,message:error.message});
    }
}

const allDoctors = async(req,res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password');
        return res.status(200).json({success:true,message:"Doctors fetched successfully",doctors});
    } catch(error) {
        console.log("Error:",error);
        return res.status(500).json({success:false,message:error.message});
    }
}

// get all appointments for admin panel
const getAppointmentsAdmin = async(req,res) => {
    try {
        const appointments = await appointmentModel.find({});
        return res.status(200).json({success:true,appointments,message:"Appointment fetched successfully"});
    } catch(error) {
        return res.status(500).json({success:false,message:error.message});
    }
}

// cancel appointment
const appointmentCancel = async(req,res) => {
    try {
        const {appointmentId} = req.body;

        const appointment = await appointmentModel.findById(appointmentId);

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


// get dashboard data
const adminDashboard = async(req,res) => {
    try {
        const doctors = await doctorModel.find({});
        const users = await userModel.find({});
        const appointments = await appointmentModel.find({});

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }

        return res.status(200).json({success:true,dashData});
    } catch(error) {
        return res.status(500).json({success:false,message:error.message});
    }
}

export {addDoctor,loginAdmin,allDoctors,getAppointmentsAdmin,appointmentCancel,adminDashboard};