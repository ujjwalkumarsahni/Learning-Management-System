import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gray-900 py-8 md:px-36 text-left w-full mt-10">
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30">
        {/* Left Section */}
        <div className="flex flex-col md:items-start items-center w-full">
          <img src={assets.logo} alt="Logo" className='w-28 lg:w-32 cursor-pointer' />
          <p className="mt-6 text-center md:text-left text-sm text-white/80">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text.
          </p>
        </div>

        {/* Center Section */}
        <div className="flex flex-col md:items-start items-center w-full">
          <h3 className="mb-5 font-semibold text-white">Company</h3>
          <ul className="flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">About us</a></li>
            <li><a href="#" className="hover:text-white">Contact us</a></li>
            <li><a href="#" className="hover:text-white">Privacy policy</a></li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex flex-col items-start w-full">
          <h3 className="mb-5 font-semibold text-white">Subscribe to our newsletter</h3>
          <p className="text-white/80 text-sm">The latest news, articles, and resources, sent to your inbox weekly.</p>
          <div className="flex items-center gap-2 pt-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="border border-gray-500/30 placeholder-gray-500 w-64 h-8 rounded px-2 text-sm bg-gray-800 text-gray-500 outline-none"
            />
            <button className="bg-blue-600 text-white w-24 h-9 rounded hover:bg-blue-700">Subscribe</button>
          </div>
        </div>
      </div>
      
      {/* Bottom Section */}
      <p className="py-4 text-center text-xs md:text-sm text-white/60">Copyright 2025 © LearFlow All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
