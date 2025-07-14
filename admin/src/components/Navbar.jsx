import React from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets_admin/assets'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'

const Navbar = () => {
    const {aToken,setAToken} = useContext(AdminContext);
    const {dToken,setDToken} = useContext(DoctorContext);
    const navigate = useNavigate();

    const logout = () => {
        aToken && setAToken("");
        aToken && localStorage.removeItem('aToken');
        dToken && setDToken("");
        dToken && localStorage.removeItem("dToken");
        navigate("/");
    }
  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white '>
        <div className='flex items-center gap-2 text-xs'>
            <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
            {aToken && <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">Admin</p>}
            {dToken && <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">Doctor</p>}
        </div>
        <button onClick={logout} className="bg-[#5f6FFF] text-white text-sm px-10 py-2 rounded-full">Logout</button>
    </div>
  )
}

export default Navbar