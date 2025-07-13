import doctorModel from "../models/Doctor.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const changeAvailability = async(req,res) => {
    try {
        const {docId} = req.body;
        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId,{available: !docData.available});
        return res.status(200).json({success:true,message:"Availability Changed"});
    } catch(error) {
        return res.status(500).json({success:false,message:error.message});
    }
}

const doctorList = async(req,res) => {
    try {
        const doctors = await doctorModel.find({}).select(["-password","-email"]);
        return res.status(200).json({success:true,doctors});
    } catch(error) {
        return res.status(500).json({success:false,message:error.message});
    }
}


const loginDoctor = async(req,res) => {
    try {
        const {email,password} = req.body;
        console.log(email)
        if(!email || !password) {
            return res.status(400).json({success:false,message:"All fields are required"});
        }
        console.log("LOGIN DOCTOR")
        const doctor = await doctorModel.findOne({email});
        if(!doctor) {
            return res.status(400).json({success:false,message:"Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password,doctor.password);
        if(isMatch) {
            const token = await jwt.sign({id:doctor._id},process.env.JWT_SECRET);
            return res.status(200).json({success:true,message:"Login successfull",token});
        } else return res.status(400).json({success:false,message:"Invalid credentials"});
    } catch(error) {
        return res.status(500).json({success:false,message:error.message});
    }
}

export {changeAvailability,doctorList,loginDoctor};