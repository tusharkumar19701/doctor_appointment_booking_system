import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets_admin/assets';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';

const Sidebar = () => {
    const {aToken} = useContext(AdminContext);
    const {dToken} = useContext(DoctorContext);

  return (
    <div className='min-h-screen bg-white'>
        {
            dToken && <ul className='text-[#515151] mt-5'>
                <NavLink className={({isActive}) => `flex items-center py-3.5 gap-3 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-[#5f6FFF]":""}`} to={'/doctor-dashboard'}>
                    <img src={assets.home_icon} alt="" />
                    <p className='md:block hidden'>Dashboard</p>
                </NavLink>
                <NavLink className={({isActive}) => `flex items-center py-3.5 gap-3 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-[#5f6FFF]":""}`} to={'/doctor-appointments'}>
                    <img src={assets.appointment_icon} alt="" />
                    <p className='md:block hidden'>Appointments</p>
                </NavLink>
                <NavLink className={({isActive}) => `flex items-center py-3.5 w-16 gap-3 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-[#5f6FFF]":""}`} to={'/doctor-profile'}>
                    <img src={assets.people_icon} alt="" />
                    <p className='md:block hidden'>Profile</p>
                </NavLink>
            </ul>
        }
        {
            aToken && <ul className='text-[#515151] mt-5'>
                <NavLink className={({isActive}) => `flex items-center py-3.5 w-16 gap-3 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-[#5f6FFF]":""}`} to={'/admin-dashboard'}>
                    <img src={assets.home_icon} alt="" />
                    <p className='md:block hidden'>Dashboard</p>
                </NavLink>
                <NavLink className={({isActive}) => `flex items-center py-3.5 gap-3 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-[#5f6FFF]":""}`} to={'/all-appointments'}>
                    <img src={assets.appointment_icon} alt="" />
                    <p className='md:block hidden'>Appointments</p>
                </NavLink>
                <NavLink className={({isActive}) => `flex items-center py-3.5 gap-3 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-[#5f6FFF]":""}`} to={'/add-doctor'}>
                    <img src={assets.add_icon} alt="" />
                    <p className='md:block hidden'>Add Doctor</p>
                </NavLink>
                <NavLink className={({isActive}) => `flex items-center py-3.5 gap-3 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-[#5f6FFF]":""}`} to={'/doctor-list'}>
                    <img src={assets.people_icon} alt="" />
                    <p className='md:block hidden'>Doctors List</p>
                </NavLink>
            </ul>
        }
    </div>
  )
}

export default Sidebar;