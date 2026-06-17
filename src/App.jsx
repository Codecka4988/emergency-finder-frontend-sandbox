import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// A helper component to smoothly pan the map viewport when coordinates load
function RecenterMap({ position }) {
  const map = useMap();
  if (position) {
    map.setView(position, 15); // Zoom into level 15 when user location hits
  }
  return null;
}

function App() {
  // State Management: Store GPS coordinates
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Side-Effects: Fire browser location API immediately on boot
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    // Request high-accuracy GPS pins from the device hardware
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
  }, []); // Runs exactly once when page loads

 return (
  /* Use absolute layout parameters to force the container to expand */
  <div className="relative w-screen h-screen m-0 p-0 overflow-hidden">
    
    {/* Absolute Overlay Loading State HUD Bar */}
    {loading && (
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[1000] bg-white text-slate-800 font-medium px-5 py-2.5 rounded-lg shadow-xl border border-slate-100 flex items-center gap-2">
        <span className="animate-spin text-blue-500">🔄</span>
        <span>Pinging browser satellite GPS coordinates...</span>
      </div>
    )}

    {/* Error Indicator Panel */}
    {error && (
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[1000] bg-rose-50 text-rose-700 font-medium px-5 py-2.5 rounded-lg shadow-lg border border-rose-200 flex items-center gap-2">
        <span>⚠️</span>
        <span>{error}</span>
      </div>
    )}

    {/* Interactive Map Surface Viewport Container */}
    <MapContainer 
      center={[25.4920, 81.8656]} // Standard fallback center (MNNIT)
      zoom={13} 
      style={{ width: '100vw', height: '100vh' }} /* Force the map container to fill the window */
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* If position exists, render the user location marker pin */}
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