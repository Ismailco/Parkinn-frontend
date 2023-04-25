import React from 'react';

const Home = () => {
  return (
    <div className="text-white w-full flex flex-col justify-center items-center text-xl">
      <h1 className="text-center text-2xl font-bold mt-10 font-merriweatherSans">
        Welcome to
        <br /> <span className="font-merriweather text-5xl font-normal"> Park Inn</span>
      </h1>
      <p className='w-52 text-center mt-5 mb-10'>Your reliable solution for stress free Parking </p>
      <div className="flex flex-col justify-center items-center my-10">
        <input type="text" placeholder="Where to?" className="text-center my-10 p-3 border rounded-xl bg-gray-100" />
        <p className="w-52 text-center my-10">Est. in 2024 Park Inn has since helped 1 Million motorist locate cheap reliable parking.</p>
      </div>
    </div>
  );
};

export default Home;
