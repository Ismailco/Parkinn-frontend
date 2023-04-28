import React from 'react'

const GpsBar = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-12 bg-[#D9D9D9]">
      <p className='text-gray-600 text-sm'>GPS</p>
      <button className="bg-[#F69E1A]">
        <i className="fal fa-map-marker-alt"></i>
      </button>
    </div>
  );
}

export default GpsBar
