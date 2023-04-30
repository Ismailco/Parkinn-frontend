import React, { useState } from 'react';

const GpsBar = () => {
  const [gps, setGps] = useState(false);
  const [gpsLocation, setGpsLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const handleGps = () => {
    setGps((prev) => !prev);
    if (!gps) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setGpsLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-16 bg-[#D9D9D9] font-merriweatherSans font-bold">
      <p className="text-gray-600 text-xs">GPS</p>
      <button className={`${gps ? 'bg-green-500 flex-row-reverse' : 'bg-[#F69E1A]'} flex justify-between items-center p-1 w-24 rounded-full duration-100`} onClick={handleGps}>
        <img src="/img/gps.png" alt="gps" className="bg-gray-300 rounded-full" />
        <p className={`${gps ? 'block' : 'hidden'} pl-2`}>ON</p>
        <p className={`${gps ? 'hidden' : 'block'} pr-2`}>OFF</p>
      </button>
    </div>
  );
};

export default GpsBar;
