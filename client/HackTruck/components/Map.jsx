import React from 'react';
import { GoogleMap } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: -6.2088, // Example: Jakarta, Indonesia
  lng: 106.8456,
};

const mapOptions = {
  zoom: 10,
  mapTypeId: 'roadmap',
  disableDefaultUI: false,
  zoomControl: true,
};

const Map = () => {
  // We're not using useLoadScript here as it's loaded in App.jsx
  // This prevents duplicate loading of the Google Maps API

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={mapOptions.zoom}
      options={mapOptions}
    />
  );
};

export default Map;