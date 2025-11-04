import React, { useState } from 'react';
import { IoMenu } from "react-icons/io5";
 

import { FaAngleDown } from "react-icons/fa";
import Store from '../Store';
 
import { CiBellOn, CiSearch } from "react-icons/ci";
import name1 from "../Images/s.svg";
import { FaSquarePlus } from "react-icons/fa6";
import image3 from "../Images/avatar1.jpg";
import "./Navbar.css"

import { IoSettingsOutline } from "react-icons/io5";

import { observer } from 'mobx-react-lite';

 
 
 
const Navbar = observer(() => {
 
 
 
  return (
    <div className=' w-full flex justify-between relative '>
      {/* Sidebar */}
     
 
      {/* Navbar */}
      <div className='text-xs h-14 w-full justify-between lg:h-12 flex lg:justify-between  bg-red-600 lg:w-full lg:h-20 lg:flex  lg:justify-between lg:items-center z-10 relative bg-white drop-shadow-xl overflow-x-hidden'>
        <div className={` w-20   flex items-center h-full lg:justify-between ml-4 transition-all duration-500 ease-in-out -600 lg : w-36 `}>
          <div className=' w-48 h-full items-center flex justify-center'>
          <img src={name1} className={`w-8 h-8  lg:bg-none `} />
          </div>
          <div className={`  w-64 flex justify-around items-center h-full   lg:ml-0`}>
 
         
       
 
        <IoMenu
            onClick={Store.handleMenuClick}
            className='text-xl lg:text-3xl cursor-pointer text-gray-500'
          />
         
        </div>
       
        </div>
     
     
 
        <div className='w-40 justify-evenly  lg:w-[28.666667%] h-full flex lg:justify-evenly items-center relative'>
          {/* <img src={image2} className='w-10 h-6' alt="Country" />
          <TbLayoutGridAdd className='text-3xl text-gray-500' />
          <RiFullscreenFill className='text-3xl text-gray-500' /> */}
          <div className='w-6 relative lg:w-8'>
            <i className='text-2xl lg:text-3xl text-gray-500 '> <CiBellOn className='text-2xl w-full h-full lg:text-3xl'  /></i>
           
            <span className='bottom-4 left-2 absolute lg:bottom-6 lg:left-4 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full'>3</span>
          </div>
         
          <img src={image3} className='w-8 lg:w-12 rounded-full' alt="Avatar" />
          <div className='w-12 flex items-center justify-evenly hidden lg:block lg:flex lg:w-24'>
            <h4 className='text-gray-500'>{Store.username}</h4>
            <span className='text-xl text-gray-500 lg:text-2xl cursor-pointer' onClick={Store.setvisible2}><FaAngleDown /></span>
          </div>
          <IoSettingsOutline className=' text-xl lg:text-3xl text-gray-500 cursor-pointer' onClick={Store.setvisible1} />
 
 
       
        </div>
      </div>
    </div>
  );
});
 
export default Navbar;
 