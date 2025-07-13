import { createContext, useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [aToken,setAToken] = useState(localStorage.getItem("aToken") ? localStorage.getItem("aToken") : "");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [appointments,setAppointments] = useState([]);
    const [dashData,setDashData] = useState(false);

    const getDashData = async() => {
        try {
            const {data} = await axios.get(backendUrl+'/api/admin/dashboard',{headers:{aToken}});
            if(data.success) {
                setDashData(data.dashData);
            } else toast.error(data.message);
        } catch(error) {
            console.log("Error: ",error);
            toast.error(error.message);
        }
    }

    const getAllAppointments = async() => {
        try {
            const {data} = await axios.get(backendUrl+'/api/admin/appointments',{headers:{aToken}});
            if(data.success) {
                setAppointments(data.appointments);
            } else toast.error(data.message);
        } catch(error) {
            console.log("Error: ",error);
            toast.error(error.message);
        }
    }

    const cancelAppointment = async(appointmentId) => {
        try {
            const {data} = await axios.post(backendUrl+'/api/admin/cancel-appointment',{appointmentId},{headers:{aToken}});
            if(data.success) {
                toast.success(data.message);
                getAllAppointments();
            } else toast.error(data.message);
        } catch(error) {
            console.log("Error: ",error);
            toast.error(error.message);
        }
    }

    const value = {
        aToken,setAToken,backendUrl,appointments,setAppointments,getAllAppointments,cancelAppointment,dashData,getDashData
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;