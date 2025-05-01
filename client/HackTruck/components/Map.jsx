import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

class MapErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    console.error('Map Error:', error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Failed to load map. Please try again later.</div>;
    }
    return this.props.children;
  }
}

const Map = ({ center }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  });

  const mapStyles = {
    height: '400px',
    width: '100%',
  };

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <MapErrorBoundary>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={8}
        center={center || { lat: -6.2088, lng: 106.8456 }}
      >
        {center && <Marker position={center} />}
      </GoogleMap>
    </MapErrorBoundary>
  );
};

export default Map;