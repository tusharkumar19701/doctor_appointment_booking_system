import React, { useState } from 'react';
import {assets} from "../assets/assets_frontend/assets";
import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const navigate = useNavigate();
    const {token, setToken} = useContext(AppContext);
    const [showMenu, setShowMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const {userData} = useContext(AppContext);
    const ADMIN_URL = import.meta.env.VITE_ADMIN_URL;

    const logout = () => {
        setToken(false);
        localStorage.removeItem('token');
        setShowDropdown(false);
    }

    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 '>
            <img onClick={() => navigate("/")} className="w-44 cursor-pointer" src={assets.logo} />
            
            {/* Main nav links */}
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to="/"><li className='py-1'>HOME</li></NavLink>
                <NavLink to="/doctors"><li className='py-1'>ALL DOCTORS</li></NavLink>
                <NavLink to="/about"><li className='py-1'>ABOUT</li></NavLink>
                <NavLink to="/contact"><li className='py-1'>CONTACT</li></NavLink>
            </ul>

            {/* Right side */}
            <div className='flex items-center gap-4'>
                {
                    token && userData ? (
                        <div className='relative flex items-center gap-2 cursor-pointer' onClick={() => setShowDropdown(prev => !prev)}>
                            <img className='w-8 rounded-full' src={userData.image} />
                            <img className='w-2.5' src={assets.dropdown_icon} />
                            
                            {showDropdown && (
                                <div className='absolute top-12 right-0 z-20 min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 text-base font-medium text-gray-600'>
                                    <p onClick={() => {navigate("my-profile"); setShowDropdown(false);}} className='hover:text-black cursor-pointer'>My Profile</p>
                                    <p onClick={() => {navigate("my-appointments"); setShowDropdown(false);}} className='hover:text-black cursor-pointer'>My Appointments</p>
                                    <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='flex gap-2'>
                            <button onClick={() => navigate("/login")} className='bg-[#5f6FFF] cursor-pointer text-white px-8 py-3 rounded-full font-light hidden md:block'>
                                Create Account
                            </button>
                            <a className='bg-white border border-[#5f6FFF] cursor-pointer text-[#5f6FFF] px-4 py-3 rounded-full font-light hidden md:block' href={ADMIN_URL}>Admin/Doctor Login</a>
                        </div>
                    )
                }

                {/* Mobile Menu Toggle */}
                <img onClick={() => setShowMenu(true)} src={assets.menu_icon} className="w-6 md:hidden" alt="" />
                
                {/* Mobile Menu */}
                <div className={`md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all ${showMenu ? "fixed w-full" : "h-0 w-0"}`}>
                    <div className='flex items-center justify-between px-5 py-6'>
                        <img className='w-36' src={assets.logo} alt="" />
                        <img className='w-7' src={assets.cross_icon} onClick={() => setShowMenu(false)} alt="" />
                    </div>
                    <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                        <NavLink onClick={() => setShowMenu(false)} to="/"><p className='px-4 py-2'>Home</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to="/doctors"><p className='px-4 py-2'>ALL DOCTORS</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to="/about"><p className='px-4 py-2'>ABOUT</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to="/contact"><p className='px-4 py-2'>CONTACT</p></NavLink>
                        {!token && <NavLink onClick={() => setShowMenu(false)} to="/login"><p className='px-4 py-2'>Create Account</p></NavLink>}
                        {!token && <a href={ADMIN_URL}><p className='px-4 py-2'>Admin/Doctor Login</p></a>}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar;
