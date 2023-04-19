import React from 'react';

const Home = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="text-center text-2xl font-bold my-10">
        ParkINN
        <br /> Simple, Safe, Secure
      </h1>
      <div className="h-52 w-full bg-gray-300 flex justify-center items-center font-bold my-4">
        <p>Map</p>
      </div>
      <div className="flex flex-col justify-center items-center my-4">
        <p className="w-80 text-center">
          To better serve you
          <br /> please enter your location
        </p>
        <input type="text" placeholder="Location" className='text-center my-4 p-2 border rounded-md'/>
        <button type='button' className='border my-2 py-2 px-20 rounded-xl'>enter</button>
      </div>
    </div>
  );
};

export default Home;
