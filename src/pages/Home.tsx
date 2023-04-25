import React from 'react';

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
    <div className="text-white w-full flex flex-col justify-center items-center text-xl">
      <h1 className="text-center text-2xl font-bold mt-10 font-merriweatherSans">
        Welcome to
        <br /> <span className="font-merriweather text-5xl font-normal"> Park Inn</span>
      </h1>
      <p className="w-52 text-center mt-5 mb-10">Your reliable solution for stress free Parking </p>
      <div className="flex flex-col justify-center items-center my-10">
        <input type="text" placeholder="Where to?" className="text-center my-10 p-3 border rounded-xl bg-gray-100 text-gray-500" onChange={handleInput} />
        <button className={`${isInput ? 'block' : 'hidden'} bg-[#56AA2F] py-3 px-20 rounded-xl shadow-md shadow-black active:shadow-none`}>Find Parking</button>
        <p className={`${isInput ? 'hidden' : 'block'} w-52 text-center my-10`}>Est. in 2024 Park Inn has since helped 1 Million motorist locate cheap reliable parking.</p>
      </div>
    </div>
  );
};

export default Home;
