import { GoogleMap, Marker } from '@react-google-maps/api';

const Map = ({ center }) => {
  const mapStyles = {
    height: "400px",
    width: "100%"
  };

  return (
    <GoogleMap
      mapContainerStyle={mapStyles}
      zoom={8}
      center={center || { lat: -6.2088, lng: 106.8456 }}
    >
      {center && <Marker position={center} />}
    </GoogleMap>
  );
};

export default Map;