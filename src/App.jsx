import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);
  return null;
}

function App() {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const { latitude, longitude } = location.coords;
        setPosition([latitude, longitude]);
        setLoading(false);
      },
      (err) => {
        setError(`Location access denied: ${err.message}`);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return (
    <div className="relative w-screen h-screen m-0 p-0 overflow-hidden">
      {loading && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[1000] bg-white text-slate-800 font-medium px-5 py-2.5 rounded-lg shadow-xl border border-slate-100 flex items-center gap-2">
          <span className="animate-spin text-blue-500">🔄</span>
          <span>Pinging browser satellite GPS coordinates...</span>
        </div>
      )}

      {error && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[1000] bg-rose-50 text-rose-700 font-medium px-5 py-2.5 rounded-lg shadow-lg border border-rose-200 flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <MapContainer 
        center={[25.4920, 81.8656]} 
        zoom={13} 
        style={{ width: '100vw', height: '100vh' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {position && (
          <>
            <Marker position={position}>
              <Popup>
                <div className="text-slate-800 p-1">
                  <span className="text-lg">📍</span> <strong className="font-semibold text-slate-900">You are here!</strong>
                  <p className="text-xs text-slate-500 mt-1">Your device GPS telemetry is active.</p>
                </div>
              </Popup>
            </Marker>
            <RecenterMap position={position} />
          </>
        )}
      </MapContainer>
    </div>
  );
}

export default App;