import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

const Map = () => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [parkingData, setParkingData] = useState([]);

  const fetchData = async () => {
    const response = await fetch('https://parkinn-api.azurewebsites.net/api/parking-meters?rows=500');
    const data = await response.json();
    setParkingData(data);
  };

  useEffect(() => {
    fetchData();
    if (!map || !parkingData.length) return;
    map.on('load', function () {
      map.addSource('parking-data', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: parkingData.map((parking) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [parking.longitude, parking.latitude],
            },
            properties: {
              title: parking.postId,
              description: parking.streetName,
            },
          })),
        },
      });

      map.loadImage('/parkingIcon.png', function (error, image) {
        if (error) throw error;
        map.addImage('parking-icon', image);
        map.addLayer({
          id: 'parking-layer',
          type: 'symbol',
          source: 'parking-data',
          layout: {
            'icon-image': 'parking-icon',
            'icon-size': 0.2,
            'text-field': ['get', 'title'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 1.25],
            'text-anchor': 'top',
          },
        });
      });
    });
  }, [map, parkingData]);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaXNtYWlsY28iLCJhIjoiY2xoMDZhNjU0MHFxcjNscXhhdnNvc3g3aSJ9.9nr4OzENJJGMPg-sbpWOqg';
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-122.4146590007, 37.7722512008], // starting position [lng, lat]
      zoom: 10, // starting zoom
    });
    setMap(map);
    return () => map.remove();
  }, []);

  return <div className="w-full h-screen absolute" ref={mapContainer}></div>;
};

export default Map;
