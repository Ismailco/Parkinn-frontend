import React, { useState } from 'react';
import GpsBar from '../components/GpsBar';
import Map from '../components/Map';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  const navigate = useNavigate();

  const fetchCitySuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`);
      const data = await response.json();

      if (data.features) {
        const citySuggestions = data.features.map((feature) => feature.place_name);
        setSuggestions(citySuggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error with the Geocoding API', error);
      setSuggestions([]);
    }
  };

  const handleInputChange = (event) => {
    const query = event.target.value;
    setCity(query);
    fetchCitySuggestions(query);
  };

  const handleSuggestionClick = async (suggestion) => {
    setSelectedCity(suggestion);
    setCity(suggestion);
    setSuggestions([]);

    // Fetch the coordinates of the selected city
    try {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(suggestion)}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`);
      const data = await response.json();

      // The coordinates are in the 'center' property of the first feature
      if (data.features && data.features.length > 0) {
        setCoordinates(data.features[0].center);
      } else {
        console.error('No features found for this city');
      }
    } catch (error) {
      console.error('Error with the Geocoding API', error);
    }
  };

  const handleSearch = () => {
    // console.log('Search for', selectedCity);
    // console.log('Coordinates', coordinates);
    navigate('/map', { state: { coordinates: coordinates } });
  };

  return (
    <div className="text-white w-full flex flex-col justify-between items-center text-xl">
      <p className="w-52 text-center font-merriweatherSans my-5">Your reliable solution for stress free Parking </p>
      <div className="flex flex-col justify-center items-center my-5">
        <div className="my-5">
          <input type="text" className="text-center p-2 border rounded-full bg-gray-100 text-gray-500" value={city} onChange={handleInputChange} />
          <button className="relative -left-10 bg-[#F69E1A] py-4 px-2 -mr-10 rounded-full shadow shadow-black active:shadow-none text-black" onClick={handleSearch}>
            <i className="fal fa-search fa-2xl"></i>
          </button>
        </div>
        <div className={`${suggestions.length ? 'block' : 'hidden'} absolute mt-20 w-96 h-52 text-center rounded-md bg-blue-500 overflow-y-scroll`}>
          {suggestions.map((suggestion, index) => (
            <div key={index} onClick={() => handleSuggestionClick(suggestion)} className="p-4 m-1 rounded-md hover:bg-blue-400 bg-blue-600 border border-gray-500">
              {suggestion}
            </div>
          ))}
        </div>
        <p className="w-72 text-center py-5"> Established in 2024, has already helped 1 million motorists find affordable and dependable parking!</p>
      </div>
      {/* {selectedCity && coordinates && <Map coordinates={coordinates} />} */}
      <GpsBar />
    </div>
  );
};

export default Home;
