import validator from 'validator';
import bcrypt from "bcrypt";
import userModel from '../models/User.js';
import jwt from "jsonwebtoken";


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

export {registerUser,loginUser};