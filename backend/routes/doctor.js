import express from "express";
import { doctorList } from "../controllers/Doctor.js";

const doctorRouter = express.Router();

doctorRouter.get('/list',doctorList);

export default doctorRouter;