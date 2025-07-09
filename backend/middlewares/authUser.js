import jwt from "jsonwebtoken";

//user auth 
const authUser = async(req,res,next) => {
    try {
        const {token} = req.headers;
        if(!token) {
            return res.status(400).json({success:false,message:"Not authorized. Login again!"});
        }
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = decode.id;
        next();
    } catch(error) {
        console.error("Error:",error);
        return res.status(500).json({success:false,message:error.message});
    }
}

export default authUser;