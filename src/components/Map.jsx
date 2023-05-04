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

  const [navigation, setNavigation] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);

  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const client = MapboxClient({ accessToken });
  const directionsClient = MapboxDirections(client);

  const handleNavigation = () => {
    setNavigation((prev) => !prev);
  };

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

  const initNavigation = () => {
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

          // Start code for the navigation arrow
          // Add a source for the arrow
          if (!map.getSource('arrow-source')) {
            map.addSource('arrow-source', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [],
              },
            });
          }

          // Add a layer for the arrow
          if (!map.getLayer('arrow-layer')) {
            map.addLayer({
              id: 'arrow-layer',
              type: 'symbol',
              source: 'arrow-source',
              layout: {
                'icon-image': 'arrow-image', // Use a custom arrow image
                'icon-size': 0.1, // Adjust the size of the arrow
                'icon-anchor': 'bottom',
              },
            });
          }

          map.loadImage('/img/location.png', (error, image) => {
            if (error) throw error;
            if (!map.hasImage('arrow-image')) {
              map.addImage('arrow-image', image);
            }
          });

          const updateArrowPosition = () => {
            if (map.getSource('arrow-source')) {
              map.getSource('arrow-source').setData({
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: [location.longitude, location.latitude],
                    },
                  },
                ],
              });
            }
          };
          // end
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
          updateArrowPosition();
        });
        // map.on('click', 'parking-layer', (e) => {
        //   if (!e.features.length) return;

        //   const feature = e.features[0];
        //   const { streetName, streetNum, latitude, longitude } = feature.properties;

        //   // Calculate the position for the dialog
        //   const [left, top] = map.project(e.lngLat);

        //   // Set the dialog data and show it
        //   setDialogData({ streetName, streetNum, latitude, longitude, left, top });
        //   console.log('dialogData', dialogData);
        //   setShowDialog(true);
        // });
      });
    // console.log('closestParking', closestParking);
  };

  const initMap = () => {
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

      map.on('click', 'parking-layer', (e) => {
        if (!e.features.length) return;

        const feature = e.features[0];
        const { streetName, streetNum, latitude, longitude } = feature.geometry.coordinates;
        // Calculate the position for the dialog
        const [left, top] = map.project(e.lngLat);

        // Set the dialog data and show it
        setDialogData({ streetName, streetNum, latitude, longitude, left, top });
        setShowDialog(true);
      });
    });
  };
  useEffect(() => {
    if (!location) {
      getUserLocation();
      return;
    }

    if (!parkingData.length || !closestParking) {
      fetchData();
      return;
    }

    if (!map || !parkingData.length || !closestParking) return;
    if (navigation) {
      initNavigation();
    } else {
      initMap();
    }
  }, [map, location, parkingData, closestParking, navigation]);

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

  // const renderDialog = () => {
  //   if (!showDialog || !dialogData) return null;

  //   return (
  //     <div className="absolute bg-white rounded p-4 shadow-md z-10" style={{ top: dialogData.top, left: dialogData.left }}>
  //       <h3 className="text-xl font-bold mb-2">Location</h3>
  //       <p className="text-gray-700">Street: {dialogData.streetName}</p>
  //       <p className="text-gray-700">Street Number: {dialogData.streetNum}</p>
  //       <p className="text-gray-700">
  //         Location: {dialogData.latitude}, {dialogData.longitude}
  //       </p>
  //     </div>
  //   );
  // };

  return (
    <>
      <div className="w-full h-screen absolute" ref={mapContainer}></div>
      {/* {renderDialog()} */}
      <div className="z-10 flex w-full">
        <div className="flex flex-col items-center justify-center w-full h-16 bg-[#D9D9D9] font-merriweatherSans font-bold">
          <p className="text-gray-600 text-xs">From current Location</p>
          <p className="text-gray-600 text-xs">4 min</p>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-16 bg-[#D9D9D9] font-merriweatherSans font-bold">
          <p className="text-gray-600 text-xs">Navigation</p>
          <button className={`${navigation ? 'bg-green-500 flex-row-reverse' : 'bg-[#F69E1A]'} flex justify-between items-center p-1 w-24 rounded-full duration-100`} onClick={handleNavigation}>
            <img src="/img/gps.png" alt="navigation" className="bg-gray-300 rounded-full" />
            <p className={`${navigation ? 'block' : 'hidden'} pl-2`}>ON</p>
            <p className={`${navigation ? 'hidden' : 'block'} pr-2`}>OFF</p>
          </button>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-16 bg-[#D9D9D9] font-merriweatherSans font-bold">
          <p className="text-gray-600 text-xs">Distance</p>
          <p className="text-gray-600 text-xs">2.0 mi</p>
        </div>
      </div>
    </>
  );
};

export default Map;
