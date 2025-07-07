import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const DoctorsList = () => {

  const {backendUrl,aToken} = useContext(AdminContext);
  const [doctors,setDoctors] = useState([]);

  const getAllDoctors = async() => {
    try {
      const {data} = await axios.post(backendUrl+'/api/admin/all-doctors',{},{headers:{aToken}});
      if(data.success) {
        setDoctors(data.doctors);
      } else toast.error(data.message);
    } catch(error) {
      toast.error(error.message);
    }
  }

  const changeAvailability = async(docId) => {
    try {
      const {data} = await axios.post(backendUrl+'/api/admin/change-availability',{docId},{headers:{aToken}});
      if(data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else toast.error(data.message);
    } catch(error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if(aToken) {
      getAllDoctors();
    }
  },[aToken]);

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {
          doctors.map((item,index) => (
            <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
              <img className='bg-indigo-50 group-hover:bg-[#5f6FFF] transition-all duration-500 ' src={item.image} alt="" />
              <div className="p-4">
                <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                <p className='text-zinc-600 text-sm'>{item.speciality}</p>
                <div className='mt-2 items-center flex gap-1 text-sm'>
                  <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} />
                  <p>Available</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DoctorsList;