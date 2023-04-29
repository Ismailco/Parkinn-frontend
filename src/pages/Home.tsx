import React from 'react';
import GpsBar from '../components/GpsBar';

const Home = () => {
  const [input, setInput] = React.useState<string>('');
  const [isInput, setIsInput] = React.useState<boolean>(false);
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      setInput(e.target.value);
      setIsInput(true);
    } else {
      setIsInput(false);
    }
  };

  return (
    <div className="text-white w-full flex flex-col justify-between items-center text-xl">
      <p className="w-52 text-center mt-5 mb-10 font-merriweatherSans">Your reliable solution for stress free Parking </p>
      <div className="flex flex-col justify-center items-center my-10">
        <div>
          <input type="text" className="text-center my-10 p-2 border rounded-full bg-gray-100 text-gray-500" onChange={handleInput} />
          {/* <button className={`${isInput ? 'block' : 'hidden'} bg-[#56AA2F] py-3 px-20 rounded-xsl shadow-md shadow-black active:shadow-none`}>Find Parking</button> */}
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
