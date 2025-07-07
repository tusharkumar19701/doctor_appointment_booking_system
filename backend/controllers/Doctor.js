import doctorModel from "../models/Doctor.js";

const changeAvailability = async(req,res) => {
    try {
        const {docId} = req.body;
        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId,{available: !docData.available});
        return res.status(200).json({success:true,message:"Availability Changed"});
    } catch(error) {
        return res.status(500).json({success:false,message:error.message});
    }
}

export {changeAvailability};