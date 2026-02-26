import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ambulanceAPI, emergencyAPI } from '../api/endpoints';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TrackingMap = () => {
  const [ambulances, setAmbulances] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [stats, setStats] = useState({ ambulances: 0, emergencies: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ambRes, emgRes] = await Promise.all([
          ambulanceAPI.getAllAmbulances(),
          emergencyAPI.getEmergencies()
        ]);
        const ambList = ambRes.data || [];
        const emgList = emgRes.data?.emergencies || [];
        setAmbulances(ambList);
        setEmergencies(emgList);
        setStats({
          ambulances: ambList.length,
          emergencies: emgList.filter(e => e.status !== 'completed' && e.status !== 'cancelled').length
        });
      } catch (error) {
        console.error('Error fetching tracking data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col">
      {/* Modern Header */}
      <div className="backdrop-blur-xl bg-gradient-to-r from-slate-900/80 to-blue-900/80 border-b border-white/20 px-6 py-4 flex items-center justify-between z-10">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            🗺️ Real-Time Tracking Map
          </h1>
          <p className="text-gray-300 text-sm mt-1">Live ambulance and emergency locations</p>
        </div>
        <div className="flex gap-6">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-3">
            <p className="text-gray-300 text-sm">🚑 Ambulances</p>
            <p className="text-2xl font-bold text-green-400">{stats.ambulances}</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-3">
            <p className="text-gray-300 text-sm">🚨 Active Emergencies</p>
            <p className="text-2xl font-bold text-red-400">{stats.emergencies}</p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer
          center={[28.7041, 77.1025]}
          zoom={12}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* Ambulance Markers */}
          {ambulances.map(amb => (
            amb.location?.coordinates && (
              <Marker
                key={amb._id}
                position={[amb.location.coordinates[1], amb.location.coordinates[0]]}
              >
                <Popup>
                  <div className="p-2">
                    <p className="font-bold text-green-700">🚑 {amb.ambulanceId}</p>
                    <p className="text-sm text-gray-700">Status: <span className="font-semibold">{amb.status}</span></p>
                    {amb.driver && (
                      <p className="text-sm text-gray-700">Driver: {amb.driver?.firstName}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          ))}

          {/* Emergency Markers */}
          {emergencies.map(emg => (
            emg.location?.coordinates && (
              <Marker
                key={emg._id}
                position={[emg.location.coordinates[1], emg.location.coordinates[0]]}
                icon={L.icon({
                  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRjAwMDAiLz48dGV4dCB4PSIxMiIgeT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIj7vuI88L3RleHQ+PC9zdmc+',
                  iconSize: [32, 32]
                })}
              >
                <Popup>
                  <div className="p-2">
                    <p className="font-bold text-red-700">🚨 {emg.emergencyType?.toUpperCase()}</p>
                    <p className="text-sm text-gray-700">Severity: <span className={`font-semibold ${
                      emg.severity === 'critical' ? 'text-red-600' :
                      emg.severity === 'high' ? 'text-orange-600' :
                      'text-yellow-600'
                    }`}>{emg.severity}</span></p>
                    <p className="text-sm text-gray-700">Status: <span className="font-semibold">{emg.status}</span></p>
                    {emg.assignedAmbulance && (
                      <p className="text-sm text-green-700">↔️ Unit: {emg.assignedAmbulance.ambulanceId}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-4 max-w-xs text-sm">
          <p className="font-bold text-white mb-3">Map Legend</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xl">📍</span>
              <span className="text-gray-300">Ambulance Location</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-400 text-xl">🚨</span>
              <span className="text-gray-300">Emergency Location</span>
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-3">Updates every 5 seconds</p>
        </div>
      </div>
    </div>
  );
};

export default TrackingMap;
