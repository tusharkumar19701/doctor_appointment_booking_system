import express from "express";
import { registerUser,loginUser, getProfile, updateProfile } from "../controllers/User.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);
userRouter.get('/get-profile',authUser,getProfile);
userRouter.post('/update-profile',authUser,upload.single('image'),updateProfile);

export default userRouter;