import React, { useState, useEffect, useContext } from 'react';
import { emergencyAPI } from '../api/endpoints';
import AuthContext from '../context/AuthContext';

const MyEmergencies = () => {
  const { user } = useContext(AuthContext);
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'patient') {
      fetchMyEmergencies();
    }
  }, [user]);

  const fetchMyEmergencies = async () => {
    try {
      setLoading(true);
      const res = await emergencyAPI.getUserEmergencies();
      setEmergencies(res.data);
    } catch (error) {
      console.error('Error fetching emergencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'critical': return 'from-red-600 to-red-700';
      case 'high': return 'from-orange-600 to-orange-700';
      case 'medium': return 'from-yellow-600 to-yellow-700';
      case 'low': return 'from-green-600 to-green-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'pending': return 'from-yellow-500/30 to-yellow-600/30 border-yellow-400/50 text-yellow-300';
      case 'accepted': return 'from-blue-500/30 to-blue-600/30 border-blue-400/50 text-blue-300';
      case 'arrived': return 'from-blue-500/30 to-blue-600/30 border-blue-400/50 text-blue-300';
      case 'in_transit': return 'from-purple-500/30 to-purple-600/30 border-purple-400/50 text-purple-300';
      case 'at_hospital': return 'from-green-500/30 to-green-600/30 border-green-400/50 text-green-300';
      case 'completed': return 'from-green-500/30 to-green-600/30 border-green-400/50 text-green-300';
      case 'cancelled': return 'from-red-500/30 to-red-600/30 border-red-400/50 text-red-300';
      default: return 'from-gray-500/30 to-gray-600/30 border-gray-400/50 text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'accepted': return '✅';
      case 'arrived': return '🚑';
      case 'in_transit': return '🛣️';
      case 'at_hospital': return '🏥';
      case 'completed': return '✔️';
      case 'cancelled': return '❌';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading your emergency history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
            🚨 Emergency History
          </h1>
          <p className="text-gray-400 text-lg">Track all your emergency SOS calls and their status</p>
        </div>

        {/* Empty State */}
        {emergencies.length === 0 ? (
          <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-white/20 rounded-2xl p-12 text-center">
            <span className="text-6xl block mb-4">📭</span>
            <p className="text-gray-300 text-xl font-semibold mb-2">No emergency records found</p>
            <p className="text-gray-400">Your emergency SOS calls will appear here once you make them.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {emergencies.map((emergency, index) => (
              <div
                key={emergency._id}
                className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                {/* Header with severity and status */}
                <div className={`bg-gradient-to-r ${getSeverityBg(emergency.severity)} px-6 py-4 flex justify-between items-start`}>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {emergency.emergencyType?.toUpperCase() || 'EMERGENCY'}
                    </h3>
                    <p className="text-white/80 text-sm mt-1">📍 {emergency.address || 'Location pending'}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-4 py-2 bg-white/20 rounded-lg text-white font-bold text-sm border border-white/30">
                      {emergency.severity?.toUpperCase() || 'MEDIUM'}
                    </span>
                    <span className={`px-4 py-2 rounded-lg font-bold text-sm border flex items-center gap-2 bg-gradient-to-r ${getStatusBg(emergency.status)}`}>
                      {getStatusIcon(emergency.status)} {emergency.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Timestamp */}
                  <div className="flex items-center gap-2 text-gray-400">
                    <span>🕐</span>
                    <span className="text-sm">{new Date(emergency.createdAt).toLocaleString()}</span>
                  </div>

                  {/* Description */}
                  {emergency.description && (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-gray-300">{emergency.description}</p>
                    </div>
                  )}

                  {/* Symptoms */}
                  {emergency.symptoms && emergency.symptoms.length > 0 && (
                    <div>
                      <p className="text-lg font-semibold text-white mb-3">🩺 Reported Symptoms</p>
                      <div className="flex flex-wrap gap-2">
                        {emergency.symptoms.map(symptom => (
                          <span
                            key={symptom}
                            className="px-3 py-1 bg-gradient-to-r from-red-500/30 to-red-600/30 text-red-300 text-sm rounded-full border border-red-400/50"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vital Signs */}
                  {emergency.vitals && (
                    <div>
                      <p className="text-lg font-semibold text-white mb-3">❤️ Vital Signs</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {emergency.vitals.heartRate && (
                          <div className="p-4 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-xl border border-pink-400/30">
                            <p className="text-gray-400 text-sm mb-1">Heart Rate</p>
                            <p className="text-2xl font-bold text-pink-300">{emergency.vitals.heartRate}</p>
                            <p className="text-gray-500 text-xs">bpm</p>
                          </div>
                        )}
                        {emergency.vitals.bloodPressure && (
                          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-400/30">
                            <p className="text-gray-400 text-sm mb-1">Blood Pressure</p>
                            <p className="text-2xl font-bold text-blue-300">{emergency.vitals.bloodPressure}</p>
                            <p className="text-gray-500 text-xs">mmHg</p>
                          </div>
                        )}
                        {emergency.vitals.temperature && (
                          <div className="p-4 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-xl border border-orange-400/30">
                            <p className="text-gray-400 text-sm mb-1">Temperature</p>
                            <p className="text-2xl font-bold text-orange-300">{emergency.vitals.temperature}</p>
                            <p className="text-gray-500 text-xs">°C</p>
                          </div>
                        )}
                        {emergency.vitals.oxygenLevel && (
                          <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
                            <p className="text-gray-400 text-sm mb-1">Oxygen Level</p>
                            <p className="text-2xl font-bold text-green-300">{emergency.vitals.oxygenLevel}</p>
                            <p className="text-gray-500 text-xs">%</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Assigned Ambulance */}
                  {emergency.assignedAmbulance && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-gray-300">
                        <span className="font-semibold text-white">🚑 Assigned Ambulance: </span>
                        <span className="text-cyan-300">{emergency.assignedAmbulance.ambulanceId}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEmergencies;
