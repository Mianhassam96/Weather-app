import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const Map = ({ lat, lon }) => {
  if (!lat || !lon) return null; // Ensure lat and lon are provided

  return (
    <div className="my-4">
      <h3>Location Map</h3>
      <MapContainer
        center={[lat, lon]}
        zoom={12}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[lat, lon]}>
          <Popup>
            Latitude: {lat}, Longitude: {lon}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
