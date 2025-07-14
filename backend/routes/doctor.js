import express from "express";
import { appointmentCancel, appointmentComplete, doctorAppointments, doctorList, loginDoctor } from "../controllers/Doctor.js";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter = express.Router();

doctorRouter.get('/list',doctorList);
doctorRouter.post('/login',loginDoctor);
doctorRouter.get('/appointments',authDoctor,doctorAppointments);
doctorRouter.post('/complete-appointment',authDoctor,appointmentComplete);
doctorRouter.post('/cancel-appointment',authDoctor,appointmentCancel);

export default doctorRouter;