import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../assets/assets_frontend/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const {docId} = useParams();
  const {doctors,currency,backendUrl,getDoctorsData,token} = useContext(AppContext);
  const [docInfo,setDocInfo] = useState(null);
  const [docSlots,setDocSlots] = useState([]);
  const [slotIndex,setSlotIndex] = useState(0);
  const [slotTime,setSlotTime] = useState('');

  const navigate = useNavigate();

  const days = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

  const fetchDocInfo = async () => {
    const docIn = doctors.find(doc=>doc._id === docId);
    setDocInfo(docIn);
  }

  const bookAppointment = async() => {
    try {
      if(!token) {
        toast.warn("Login to book appointment");
        return navigate('/login');
      }
      console.log(docSlots);
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth()+1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      const {data} = await axios.post(backendUrl+'/api/user/book-appointment',{docId,slotDate,slotTime},{headers:{token}});
      if(data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else toast.error(data.message);
    } catch(error) {
      console.log("Error: ",error);
      toast.error(error.message);
    }
  }

  const getAvailableSlots = async() => {
    setDocSlots([]);
    //getting current date
    let today = new Date();
    for(let i=0;i<7;i++) {
      //getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate()+i);

      //setting end time of date with index
      let endTime = new Date();
      endTime.setDate(today.getDate()+i);
      endTime.setHours(21,0,0,0);

      //setting hours
      if(today.getDate() == currentDate.getDate()) {
        currentDate.getHours(currentDate.getHours() > 10 ? currentDate.getHours()+1:10);
        currentDate.setMinutes(currentDate.getMinutes()>30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
      
      let timeSlots = [];

      while(currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([],{hour: '2-digit',minute:'2-digit'});
        
        //add slot to array
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })

        //increment time by 30 min
        currentDate.setMinutes(currentDate.getMinutes()+30);
      }
      setDocSlots((prev)=>([...prev,timeSlots]));
    }
  }

  useEffect(() => { 
    fetchDocInfo();
  },[doctors,docId]);

  useEffect(() =>{
    getAvailableSlots();
  },[docInfo]);

  useEffect(() => {
    console.log(docSlots);
  },[docSlots])

  return docInfo && (
    <div>
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg' src={docInfo.image} />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name} <img className='w-5' src={assets.verified_icon} /></p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>

          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
              About <img src={assets.info_icon} />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>Appointment fee: <span className='text-gray-600'>{currency}{docInfo.fees}</span></p>
        </div>
      </div>


      {/* Booking Slots  */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking slots</p>
        <div className='flex gap-3 w-full overflow-x-scroll items-center mt-4'>
          {
            docSlots.length && docSlots.map((item,index) => (
              item.length > 0 && <div onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? "bg-[#5f6FFF] text-white": "border border-gray-200"}`} key={index}>
                <p>{item[0] && days[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
          }
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots[slotIndex].map((item,index)=>(
            <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? "bg-[#5f6FFF] text-white":"border border-gray-300 text-gray-400"}`} key={index}>{item.time.toLowerCase()}</p>
          ))}
        </div>
        <button 
        onClick={bookAppointment}
         className="bg-[#5f6FFF] text-white font-light text-sm rounded-full my-6 px-14 py-3 cursor-pointer">Book an appointment</button>
      </div>
      
        {/* Related Doctors  */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />

    </div>
  )
}

export default Appointment;