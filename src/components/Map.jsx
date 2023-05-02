import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxClient from '@mapbox/mapbox-sdk';
import MapboxDirections from '@mapbox/mapbox-sdk/services/directions';
import polyline from '@mapbox/polyline';

const Map = () => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [parkingData, setParkingData] = useState([]);
  const [closestParking, setClosestParking] = useState(null);
  const [location, setLocation] = useState(null);

  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const client = MapboxClient({ accessToken });
  const directionsClient = MapboxDirections(client);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error obtaining location:', error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const fetchData = async () => {
    const response = await fetch(`https://parkinn-api.azurewebsites.net/api/parking-meters?rows=${500}`);
    const data = await response.json();
    setParkingData(data);

    if (!location) return;

    const closest = data.reduce((prev, curr) => {
      const prevDistance = getDistance(location.latitude, location.longitude, prev.latitude, prev.longitude);
      const currDistance = getDistance(location.latitude, location.longitude, curr.latitude, curr.longitude);
      return currDistance < prevDistance ? curr : prev;
    });

    setClosestParking(closest);
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLon = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  useEffect(() => {
    if (!location) {
      getUserLocation();
      return;
    }

    fetchData();
    if (!map || !parkingData.length || !closestParking) return;
    directionsClient
      .getDirections({
        profile: 'driving',
        waypoints: [{ coordinates: [location.longitude, location.latitude] }, { coordinates: [closestParking.longitude, closestParking.latitude] }],
      })
      .send()
      .then((response) => {
        if (!response || !response.body || !response.body.routes || !response.body.routes.length) {
          alert('No parking found in your area!');
          return;
        }
        const directions = response.body.routes[0].geometry;
        const decodedPolyline = polyline.toGeoJSON(directions);

        map.on('load', () => {
          if (!map.getSource('parking-data')) {
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
          }

          if (!map.getSource('route')) {
            map.addSource('route', {
              type: 'geojson',
              data: decodedPolyline,
            });

            map.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': '#1db7dd',
                'line-width': 7,
              },
            });
          } else {
            map.getSource('route').setData(decodedPolyline);
          }

          map.loadImage('/img/parkingIcon.png', (error, image) => {
            if (error) throw error;
            if (!map.hasImage('parking-icon')) {
              map.addImage('parking-icon', image);
            }
            if (!map.getLayer('parking-layer')) {
              map.addLayer({
                id: 'parking-layer',
                type: 'symbol',
                source: 'parking-data',
                layout: {
                  'icon-image': 'parking-icon',
                  'icon-size': 0.2,
                },
              });
            }
          });
        });
      });
  }, [map, parkingData, closestParking, location]);

  useEffect(() => {
    if (!location) return;
    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [location.longitude, location.latitude],
      zoom: 18,
    });

    setMap(map);
    return () => map.remove();
  }, [location]);

  return <div className="w-full h-screen absolute" ref={mapContainer}></div>;
};

export default Map;
