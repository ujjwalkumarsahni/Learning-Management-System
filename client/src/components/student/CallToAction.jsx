import React from 'react';
import { assets } from '../../assets/assets';

const CallToAction = () => {
  return (
    <div className="flex flex-col items-center text-cente pt-10 pb-24 px-8 md:px-0 gap-4 ">
      <h1 className="text-xl md:text-4xl font-semibold text-gray-800">Learn anything, anytime, anywhere</h1>
      <p className="text-gray-500 sm:text-sm">
        Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur commodo do ea.
      </p>
      <div className="flex items-center gap-6 mt-4 font-medium">
        <button className="bg-blue-600 text-white px-10 py-3 rounded-md shadow-md  hover:bg-blue-700 transition-all">
          Get Started
        </button>
        <button className="flex items-center gap-2 border border-blue-600 text-blue-600 px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 hover:text-white transition-all">
          Learn more <img src={assets.arrow_icon} alt="arrow_icon" className="w-5" />
        </button>
      </div>
    </div>
  );
};

export default CallToAction;
