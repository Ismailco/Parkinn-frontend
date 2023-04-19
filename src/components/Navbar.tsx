import React from 'react';

const Navbar = () => {
  return (
    <div className="flex justify-between items-center h-20 bg-gray-100 px-10">
      <div className="bg-gray-300 w-20 h-10 text-center">Logo</div>
      <button type="button">
        <i className="fas fa-bars fa-xl text-gray-600"></i>
      </button>
    </div>
  );
};

export default Navbar;
