import React, { useState, useEffect } from 'react';
import { emergencyAPI } from '../api/endpoints';

const EmergencySOS = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [vitals, setVitals] = useState({
    heartRate: '',
    bloodPressure: '',
    temperature: '',
    respirationRate: '',
    oxygenLevel: ''
  });
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            type: 'Point',
            coordinates: [position.coords.longitude, position.coords.latitude]
          });
        },
        () => console.log('Geolocation denied')
      );
    }
  }, []);

  const handleCreateEmergency = async () => {
    try {
      setLoading(true);
      const emergencyData = {
        emergencyType: 'medical',
        symptoms,
        vitals,
        location: location || {
          type: 'Point',
          coordinates: [28.7041, 77.1025]
        },
        description: 'Emergency SOS Request'
      };

      const res = await emergencyAPI.createEmergency(emergencyData);
      setMessage('✅ Emergency alert sent! Ambulance on the way.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Failed to create emergency');
    } finally {
      setLoading(false);
    }
  };

  const toggleSymptom = (symptom) => {
    setSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const allSymptoms = ['Chest Pain', 'Difficulty Breathing', 'Unconscious', 'Bleeding', 'Severe Injury', 'Allergic Reaction'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      {/* Animated background elements - more intense for emergency */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative p-8 max-w-3xl mx-auto">
        {/* Emergency Header */}
        <div className="mb-12">
          <div className="mb-6 p-6 backdrop-blur-xl bg-gradient-to-r from-red-600/40 to-orange-600/40 border-2 border-red-400 rounded-2xl text-center">
            <p className="text-red-200 text-sm font-semibold mb-2">🚨 EMERGENCY MODE</p>
            <h1 className="text-5xl md:text-6xl font-black text-red-100 mb-2 animate-pulse">
              SOS
            </h1>
            <p className="text-red-200">Immediate emergency assistance is being coordinated</p>
          </div>
          {location ? (
            <p className="text-center text-green-300 text-sm">📍 Your location has been detected</p>
          ) : (
            <p className="text-center text-yellow-300 text-sm">⚠️ Location detection in progress...</p>
          )}
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`backdrop-blur-xl border-2 rounded-2xl p-6 mb-8 ${
            message.includes('✅')
              ? 'bg-green-500/20 border-green-400 text-green-300'
              : 'bg-red-500/20 border-red-400 text-red-300'
          } font-semibold text-center`}>
            {message}
          </div>
        )}

        {/* Main Form */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Report Your Emergency</h2>
            <p className="text-white/80 text-sm mt-1">Provide details to help responders assist you better</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Symptoms Section */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                🩺 Select Your Symptoms
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allSymptoms.map(symptom => (
                  <label
                    key={symptom}
                    className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                      symptoms.includes(symptom)
                        ? 'bg-red-500/30 border-2 border-red-400 text-white'
                        : 'bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={symptoms.includes(symptom)}
                      onChange={() => toggleSymptom(symptom)}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <span className="font-medium">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Vital Signs Section */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                ❤️ Vital Signs (if available)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    placeholder="e.g., 80"
                    value={vitals.heartRate}
                    onChange={(e) => setVitals({...vitals, heartRate: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">Blood Pressure (e.g., 120/80)</label>
                  <input
                    type="text"
                    placeholder="Systolic/Diastolic"
                    value={vitals.bloodPressure}
                    onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">Temperature (°C)</label>
                  <input
                    type="number"
                    placeholder="e.g., 37.5"
                    step="0.1"
                    value={vitals.temperature}
                    onChange={(e) => setVitals({...vitals, temperature: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">Oxygen Level (%)</label>
                  <input
                    type="number"
                    placeholder="e.g., 98"
                    max="100"
                    min="0"
                    value={vitals.oxygenLevel}
                    onChange={(e) => setVitals({...vitals, oxygenLevel: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Send Button */}
            <button
              onClick={handleCreateEmergency}
              disabled={loading}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 active:scale-95 ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/50 hover:shadow-xl hover:shadow-red-600/70'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Processing Emergency...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  🆘 SEND EMERGENCY ALERT
                </span>
              )}
            </button>

            {/* Info Footer */}
            <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-lg">
              <p className="text-gray-300 text-sm">
                <span className="font-semibold">ℹ️ Important:</span> Emergency responders will be dispatched to your location. Please stay calm and provide accurate information.
              </p>
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 text-center">
            <span className="text-3xl block mb-2">📍</span>
            <p className="text-gray-300 text-sm">Location</p>
            <p className="text-white font-semibold">{location ? 'Detected' : 'Detecting...'}</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 text-center">
            <span className="text-3xl block mb-2">🚑</span>
            <p className="text-gray-300 text-sm">Response</p>
            <p className="text-white font-semibold">Available</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 text-center">
            <span className="text-3xl block mb-2">📞</span>
            <p className="text-gray-300 text-sm">Support</p>
            <p className="text-white font-semibold">24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencySOS;
