import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';

const App = () => {
  return (
    <div>
      {/* <div className="w-screen min-h-screen bg-hero bg-cover bg-no-repeat"> */}
      <div className="min-h-screen flex flex-col justify-between items-center bg-[#2418EB]">
        <Navbar />
        <Home />
      </div>
    </div>
  );
};

export default App;
