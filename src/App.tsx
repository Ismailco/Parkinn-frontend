import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';

const App = () => {
  return (
    <div className="w-screen min-h-screen">
      <Navbar />
      <Home />
    </div>
  );
};

export default App;
