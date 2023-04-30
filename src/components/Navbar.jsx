import React from 'react';

const Navbar = () => {
  return (
    <div className="z-10 w-full flex flex-col justify-center items-center h-40 bg-[#2418EB]/70 px-10">
      <div className="self-end ">
        <ul className="flex justify-between items-center">
          <li className="text-black font-bold pl-2">
            <i className="fab fa-twitter"></i>
          </li>
          <li className="text-black font-bold pl-2">
            <i className="fab fa-instagram"></i>
          </li>
          <li className="text-black font-bold pl-2">
            <i className="fab fa-facebook"></i>
          </li>
          <li className="text-black font-bold pl-2">
            <i className="fab fa-tiktok"></i>
          </li>
        </ul>
      </div>
      <img src="./img/NavLogo.svg" alt="Navigation Logo" />
      {/* <div className="bg-gray-300 w-20 h-10 text-center">Logo</div>
      <button type="button">
        <i className="fas fa-bars fa-xl text-gray-600"></i>
      </button> */}
    </div>
  );
};

export default Navbar;
