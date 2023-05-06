import React from 'react';
import GpsBar from '../components/GpsBar';

const Home = () => {
  return (
    <div className="text-white w-full flex flex-col justify-between items-center text-xl">
      <p className="w-52 text-center mt-5 mb-10 font-merriweatherSans">Your reliable solution for stress free Parking </p>
      <div className="flex flex-col justify-center items-center my-10">
        <div>
          <input type="text" className="text-center my-10 p-2 border rounded-full bg-gray-100 text-gray-500" />
          <button className="relative -left-10 bg-[#F69E1A] py-4 px-2 rounded-full shadow shadow-black active:shadow-none text-black">
            <i className="fal fa-search fa-2xl"></i>
          </button>
        </div>
        <p className="w-72 text-center my-10"> Established in 2024, has already helped 1 million motorists find affordable and dependable parking!</p>
      </div>
      <GpsBar />
    </div>
  );
};

export default Home;
