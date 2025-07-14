import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {
  const {backendUrl,token,getDoctorsData} = useContext(AppContext);
  const [appointments,setAppointments] = useState([]);
  const navigate = useNavigate();

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Sep","Oct","Nov","Dec"];

  const formatSlotDate = (slotDate) => {
    const date = slotDate.split('_');
    return date[0] +" "+ months[Number(date[1])] +" "+ date[2];
  }

  const getAppointments = async() => {
    try {
      const {data} = await axios.get(backendUrl+'/api/user/appointments',{headers:{token}});
      if(data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      } else toast.error(data.message);
    } catch(error) {
      toast.error(error.message);
      console.log("Error: ",error);
    }
  }

  const cancelAppointment = async(appointmentId) => {
    try {
      const {data} = await axios.post(backendUrl+'/api/user/cancel-appointment',{appointmentId},{headers:{token}});
      if(data.success) {
        toast.success(data.message);
        getAppointments();  
        getDoctorsData();
      } else toast.error(data.message);
    } catch(error) {
      toast.error(error.message);
      console.log("Error: ",error);
    }
  }

  const initializePayment = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount:order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt:order.receipt,
      handler: async (response) => {
        try {
          const {data} = await axios.post(backendUrl+'/api/user/verify-razorpay',response,{headers:{token}});
          if(data.success) {
            getAppointments();
            navigate('/my-appointments');
          }
        } catch(error) {
          console.log("Error: ",error);
          toast.error(error.message);
        }
      }
    }

    const rzp = new window.Razorpay(options);
    rzp.open();

  }

  const appointmentRazorpay = async(appointmentId) => {
    try {
      const {data} = await axios.post(backendUrl+'/api/user/payment-razorpay',{appointmentId},{headers:{token}});
      if(data.success) {
        console.log(data.order)
        initializePayment(data.order);
      }
    } catch(error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if(token) {
      getAppointments();
    }
  },[token]);

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b border-gray-300'>My Appointments</p>
      <div className=''>
        {
          appointments.map((item,index)=>(
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b border-gray-300' key={index}>
              <div>
                <img className='w-32 bg-indigo-50' src={item.docData.image} />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                <p className=''>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address: </p>
                <p className='text-xs'>{item.docData.address}</p>
                <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {formatSlotDate(item.slotDate)} | {item.slotTime}</p>
              </div>
              <div></div>
              <div className='flex flex-col gap-2 justify-end'>
                {item.isCompleted && <button className='sm:min-w-48 py-2 rounded text-slate-700 bg-blue-300'>Completed</button>}
                {item.payment && !item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 rounded text-white bg-green-700'>Paid</button>}
                {!item.cancelled && !item.payment &&!item.isCompleted && <button onClick={()=>appointmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#5f6FFF] transition-all duration-300 hover:text-white cursor-pointer'>Pay Online</button>}
                {!item.cancelled && !item.isCompleted && <button onClick={()=>cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 transition-all duration-300 hover:text-white cursor-pointer'>Cancel appointment</button>}
                {item.cancelled && <button className='text-sm text-red-500 sm:min-w-48 py-2 border rounded border-red-400'>Appointment Cancelled</button>}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MyAppointments;