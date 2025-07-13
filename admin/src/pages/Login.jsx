import React, { useContext, useState } from 'react';
import {assets} from "../assets/assets_admin/assets";
import { AdminContext } from '../context/AdminContext';
import axios from "axios";
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext';

const Login = () => {
  const [state,setState] = useState("Admin");
  const {setAToken,backendUrl} = useContext(AdminContext);
  const {setDToken} = useContext(DoctorContext);


  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if(state === "Admin") {
        const {data} = await axios.post(backendUrl+'/api/admin/login',{email,password});
        if(data.success) {
          localStorage.setItem("aToken",data.token);
          setAToken(data.token);
          toast.success(data.message)
        } else {
          console.log("HELLO");
          toast.error(data.message);
        }
      } else {
        console.log("YHA HU")
        const {data} = await axios.post(backendUrl+'/api/doctor/login',{email,password});
        if(data.success) {
          localStorage.setItem('dToken',data.token);
          setDToken(data.token);
          toast.success(data.message)
        } else toast.error(data.message);
      }
    } catch(error) {
      toast.error(error.message);
      console.log("Error: ",error);
    }
  }
  console.log(state);
  console.log(email)
  console.log(password)
  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'><span className='text-[#5f6FFF]'>{state}</span> Login</p>
        <div className='w-full'>
          <p>Email</p>
          <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" onChange={(e)=>setPassword(e.target.value)} value={password} required />
        </div>
        <button type="submit" className='bg-[#5f6FFF] text-white cursor-pointer text-center text-base py-2 w-full rounded '>Login</button>
        {
          state === "Admin" ? <p>Doctor Login? <span className='text-[#5f6FFF] underline cursor-pointer' onClick={()=>setState("Doctor")}>Click here</span></p> : <p>Admin Login? <span className='text-[#5f6FFF] underline cursor-pointer' onClick={()=>setState("Admin")}>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login;