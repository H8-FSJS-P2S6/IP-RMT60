import React from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';

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
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (loadError) {
    return (
      <div className="alert alert-danger text-center">
        Error loading map. Please check your API key or network connection.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading map...</span>
        </div>
      </div>
    );
  }

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