import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxClient from '@mapbox/mapbox-sdk';
import MapboxDirections from '@mapbox/mapbox-sdk/services/directions';
import polyline from '@mapbox/polyline';

const Map = () => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [parkingData, setParkingData] = useState([]);
  // const [closestParking, setClosestParking] = useState(null);
  const [location, setLocation] = useState(null);

  const [navigation, setNavigation] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [iconDimensions, setIconDimensions] = useState({ width: 0, height: 0 });

  const [selectedParkingMeter, setSelectedParkingMeter] = useState(null);

  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const client = MapboxClient({ accessToken });
  const directionsClient = MapboxDirections(client);

  const fetchData = async () => {
    const response = await fetch(`https://parkinn-api.azurewebsites.net/api/parking-meters?rows=${1000}`);
    const data = await response.json();
    setParkingData(data);

    /* Get the closest parking meter to the user's location
    -The commented code include the calculation of the closest spot in the fetchData() function wich get all the parking meters in the area and
    the getDistance() function whitch calculate the distance from the user current location-
    */

    //  if (!location) return;

    //  const closest = data.reduce((prev, curr) => {
    //    const prevDistance = getDistance(location.latitude, location.longitude, prev.latitude, prev.longitude);
    //    const currDistance = getDistance(location.latitude, location.longitude, curr.latitude, curr.longitude);
    //    return currDistance < prevDistance ? curr : prev;
    //  });

    //  setClosestParking(closest);
  };

  //  const getDistance = (lat1, lon1, lat2, lon2) => {
  //    const R = 6371e3;
  //    const lat1Rad = (lat1 * Math.PI) / 180;
  //    const lat2Rad = (lat2 * Math.PI) / 180;
  //    const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
  //    const deltaLon = ((lon2 - lon1) * Math.PI) / 180;

  //    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  //    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  //    return R * c;
  //  };
  // End of Getting the closest parking meter to the user's location

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

  const formatDuration = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    return `${hours ? `${hours}h ` : ''}${minutes ? `${minutes}m ` : ''}${seconds ? `${seconds}s` : ''}`;
  };

  const initNavigation = () => {
    if (!selectedParkingMeter) {
      alert('Please select a parking meter first!');
      return;
    }

    directionsClient
      .getDirections({
        profile: 'driving',
        waypoints: [{ coordinates: [location.longitude, location.latitude] }, { coordinates: [selectedParkingMeter.longitude, selectedParkingMeter.latitude] }],
      })
      .send()
      .then((response) => {
        if (!response || !response.body || !response.body.routes || !response.body.routes.length) {
          alert('No parking found in your area!');
          return;
        }
        const directions = response.body.routes[0].geometry;
        const decodedPolyline = polyline.toGeoJSON(directions);

        const distanceInMeters = response.body.routes[0].distance;
        const durationInSeconds = response.body.routes[0].duration;

        setDistance(distanceInMeters);
        setDuration(durationInSeconds);

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
                })),
              },
            });
          } else {
            map.getSource('parking-data').setData({
              type: 'FeatureCollection',
              features: parkingData.map((parking) => ({
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [parking.longitude, parking.latitude],
                },
              })),
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
      });
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
            })),
          },
        });
      } else {
        map.getSource('parking-data').setData({
          type: 'FeatureCollection',
          features: parkingData.map((parking) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [parking.longitude, parking.latitude],
            },
          })),
        });
      }

      map.loadImage('/img/parkingIcon.png', (error, image) => {
        if (error) throw error;
        if (!map.hasImage('parking-icon')) {
          map.addImage('parking-icon', image);
          setIconDimensions({ width: image.width, height: image.height });
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

      // Add user location to the map
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
      updateArrowPosition();
    });

    map.on('click', 'parking-layer', (e) => {
      if (!e.features.length) return;

      const clickedLongitude = e.features[0].geometry.coordinates[0];
      const clickedLatitude = e.features[0].geometry.coordinates[1];

      const parkingMeter = parkingData.find((pm) => Math.abs(pm.longitude - clickedLongitude) < 1e-6 && Math.abs(pm.latitude - clickedLatitude) < 1e-6);

      if (!parkingMeter) {
        console.error('No matching parking meter found');
        return;
      }

      const point = map.project(e.lngLat);
      const left = point.x;
      const top = point.y;

      // Start  */ Calculate the position for the dialog
      const dialogWidth = 200;
      const dialogHeight = 120;
      const iconWidth = iconDimensions.width * 0.2;
      const iconHeight = iconDimensions.height * 0.2;
      const adjustedLeft = left - dialogWidth / 2 + iconWidth / 2;
      const adjustedTop = top - dialogHeight - iconHeight / 2;
      // End
      setSelectedParkingMeter(parkingMeter);
      setDialogData({
        ...parkingMeter,
        left: adjustedLeft,
        top: adjustedTop,
      });
      setShowDialog(true);
    });

    map.on('click', (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['parking-layer'],
      });
      if (!features.length) {
        setShowDialog(false);
      }
    });
  };

  const handleNavigation = () => {
    if (selectedParkingMeter) {
      setNavigation((prev) => !prev);
      if (!navigation) {
        setShowDialog(false);
        map.resize();
        map.flyTo({
          center: [location.longitude, location.latitude],
          zoom: 20,
        });
      } else {
        setSelectedParkingMeter(null);
        setDuration(0);
        setDistance(0);
        map.resize();
        map.flyTo({
          center: [location.longitude, location.latitude],
          zoom: 15,
        });

        if (map.getSource('route')) {
          map.removeLayer('route');
          map.removeSource('route');
        }
      }
    } else {
      alert('Please select a parking meter first!');
    }
  };

  useEffect(() => {
    if (parkingData.length >= 0) {
      fetchData();
    }
  }, [location]);

  useEffect(() => {
    if (!location) {
      getUserLocation();
      return;
    }

    if (parkingData.length >= 0) {
      if (map) {
        if (navigation) {
          initNavigation();
        } else {
          initMap();
        }
      }
    } else {
      fetchData();
    }
  }, [map, parkingData, navigation, location]);

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
  }, [location, navigation, parkingData]);

  const renderDialog = () => {
    if (!showDialog || !dialogData) return null;

    return (
      <div className="absolute bg-white rounded p-4 shadow-md z-10" style={{ top: dialogData.top, left: dialogData.left }}>
        <h3 className="text-xl font-bold mb-2">Location</h3>
        <p className="text-gray-700">Street: {dialogData.streetName}</p>
        <p className="text-gray-700">Street Number: {dialogData.streetNum}</p>
      </div>
    );
  };

  return (
    <>
      <div className="w-full h-screen absolute" ref={mapContainer}></div>
      {renderDialog()}
      <div className="z-10 flex w-full justify-st items-center">
        <div className="flex flex-col items-center justify-center w-full h-16 bg-[#D9D9D9] font-merriweatherSans font-bold">
          <p className="text-gray-600 text-xs">From current Location</p>
          <p className="text-gray-600 text-xs">{formatDuration(duration)}</p>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-16 bg-[#D9D9D9] font-merriweatherSans font-bold">
          <button className={`${navigation ? 'hidden' : 'block'} bg-green-500 flex justify-center items-center p-1 w-14 h-14 rounded-full duration-100 border border-gray-500`} onClick={handleNavigation}>
            <p className={`${navigation ? 'hidden' : 'block'}`}>Start</p>
          </button>
          <button className={`${navigation ? 'block' : 'hidden'} bg-red-500 flex justify-center items-center p-1 w-14 h-14 rounded-full duration-100 border border-gray-500`} onClick={handleNavigation}>
            <p className={`${navigation ? 'block' : 'hidden'}`}>Stop</p>
          </button>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-16 bg-[#D9D9D9] font-merriweatherSans font-bold">
          <p className="text-gray-600 text-xs">Distance</p>
          <p className="text-gray-600 text-xs">{distance.toFixed(2)} m</p>
        </div>
      </div>
    </>
  );
};

export default Map;
