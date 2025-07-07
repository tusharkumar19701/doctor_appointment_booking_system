import express from "express";
import { addDoctor, allDoctors, loginAdmin } from "../controllers/Admin.js";
import authAdmin from "../middlewares/authAdmin.js";
import upload from "../middlewares/multer.js";
import { changeAvailability } from "../controllers/Doctor.js";


const adminRouter = express.Router();

adminRouter.post("/add-doctor",authAdmin,upload.single('image'),addDoctor);
adminRouter.post("/login",loginAdmin);
adminRouter.post("/all-doctors",authAdmin,allDoctors);
adminRouter.post("/change-availability",authAdmin,changeAvailability);

export default adminRouter;