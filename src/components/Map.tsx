import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const Map = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaXNtYWlsY28iLCJhIjoiY2xoMDZhNjU0MHFxcjNscXhhdnNvc3g3aSJ9.9nr4OzENJJGMPg-sbpWOqg';

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 10, // starting zoom
    });

    return () => map.remove();
  }, []);

  return <div className="w-full h-screen absolute" ref={mapContainer}></div>;
};

export default Map;
