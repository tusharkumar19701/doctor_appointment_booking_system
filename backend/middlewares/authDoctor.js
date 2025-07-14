import jwt from "jsonwebtoken";

//doctor auth 
const authDoctor = async(req,res,next) => {
    try {
        const {dtoken} = req.headers;
        if(!dtoken) {
            return res.status(400).json({success:false,message:"Not authorized. Login again!"});
        }
        const decode = jwt.verify(dtoken,process.env.JWT_SECRET);
        req.docId = decode.id;
        next();
    } catch(error) {
        console.error("Error:",error);
        return res.status(500).json({success:false,message:error.message});
    }
}

export default authDoctor;