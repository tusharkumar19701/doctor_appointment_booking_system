import mongoose from "mongoose";

const connectDb = async() => {
    try {
        mongoose.connection.on('connected',()=> console.log("Db connected"));
        await mongoose.connect(`${process.env.MONGODB_URL}/doctor`)
    } catch(error) {
        console.log(error);
    }
}

export default connectDb;