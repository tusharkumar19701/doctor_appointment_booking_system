import React, { useState } from 'react'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Login = () => {
  const {backendUrl,token,setToken} = useContext(AppContext);
  const [state,setState] = useState('signup');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [name,setName] = useState('');

  const navigate = useNavigate();

  const onSubmitHandler = async(e) => {
    e.preventDefault();
    try {
      if(state === 'signup') {
        const {data} = await axios.post(backendUrl+'/api/user/register',{name,email,password});
        if(data.success) {
          localStorage.setItem("token",data.token);
          setToken(data.token);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } else {
        const {data} = await axios.post(backendUrl+'/api/user/login',{email,password});
        if(data.success) {
          localStorage.setItem("token",data.token);
          setToken(data.token);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch(error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if(token) {
      navigate('/');
    }
  },[token]);

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 rounded-xl text-zinc-600 text-sm shadow-lg '>
        <p className='text-2xl font-semibold'>{state === "signup" ? "Create Account" : "Login"}</p>
        <p>Please {state === "signup" ? "sign up" : "Login"} to book appointment.</p>
        {state === "signup" && <div className='w-full'>
          <p>Full Name</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e)=>setName(e.target.value)} value={name} />
        </div>}
        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e)=>setEmail(e.target.value)} value={email} />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e)=>setPassword(e.target.value)} value={password} />
        </div>
        <button type="submit" className='text-base rounded-md py-2 w-full text-white bg-[#5f6FFF]'>{state === "signup" ? "Create Account" : "Login"}</button>
        {
          state === "signup" ? 
          <p>Already have an account? <span onClick={()=>setState("login")} className='text-[#5f6FFF] underline cursor-pointer'>Login here</span></p> :
          <p>Create a new account? <span onClick={()=>setState("signup")} className='text-[#5f6FFF] underline cursor-pointer'>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login;