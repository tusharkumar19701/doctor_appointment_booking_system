import jwt from "jsonwebtoken";

//admin auth 
const authAdmin = async(req,res,next) => {
    try {
        const {atoken} = req.headers;
        if(!atoken) {
            return res.status(400).json({success:false,message:"Not authorized. Login again!"});
        }
        const decode = await jwt.verify(atoken,process.env.JWT_SECRET);
        if(decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(400).json({success:false,message:"Not authorized. Login again!"});
        }
        next();
    } catch(error) {
        console.error("Error:",error);
        return res.status(500).json({success:false,message:error.message});
    }
}

export default authAdmin;