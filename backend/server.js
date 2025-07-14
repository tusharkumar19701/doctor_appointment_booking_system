import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDb from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/admin.js";
import doctorRouter from "./routes/doctor.js";
import userRouter from "./routes/user.js";

const app = express();
const PORT = process.env.PORT || 4000;

connectDb();
connectCloudinary();

//Middlewares
app.use(express.json());
app.use(cors({
    origin:"*",
}));

app.use("/api/admin",adminRouter);
app.use('/api/doctor',doctorRouter);
app.use('/api/user',userRouter);

//API endpoint
app.get("/",(req,res) => {
    res.send("API IS LIVE");
})

app.listen(PORT,()=>console.log(`Server started at PORT:${PORT}`));