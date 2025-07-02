import validator from "validator";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary";
import doctorModel from "../models/Doctor.js";

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
            address: JSON.parse(address),
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

export {addDoctor};