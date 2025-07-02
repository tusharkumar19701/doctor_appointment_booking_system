import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDb from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/admin.js";

const app = express();
const PORT = process.env.PORT || 4000;

connectDb();
connectCloudinary();

//Middlewares
app.use(express.json());
app.use(cors());

app.use("/api/admin",adminRouter);

//API endpoint
app.get("/",(req,res) => {
    res.send("API IS LIVE");
})

app.listen(PORT,()=>console.log(`Server started at PORT:${PORT}`));