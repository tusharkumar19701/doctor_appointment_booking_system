import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            <div className=''>
                <img className='mb-5 w-40' src={assets.logo} alt="" />
                <p className="w-full md:w-2/3 text-gray-600 leading-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia dolorem praesentium dolore fuga optio consequatur quam. Reprehenderit natus ducimus voluptatibus vel alias veritatis obcaecati deserunt possimus tenetur eligendi laborum reiciendis qui sapiente placeat eveniet numquam error rerum repellendus, molestiae nisi, blanditiis eius beatae. Eveniet, eos modi neque porro accusantium adipisci?</p>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+91-7004459446</li>
                    <li>tusharkumar19701@gmail.com</li>
                </ul>
            </div>
        </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2025 @ Doctor - All Rights Reserved.</p>
        </div>
    </div>
  )
}

export default Footer