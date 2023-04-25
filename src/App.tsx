import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';

const App = () => {
  return (
    <div className="w-screen min-h-screen bg-hero">
      <div className="min-h-screen backdrop-blur-xs bg-gray-900/50">
        <Home />
      </div>
    </div>
  );
};

export default App;
