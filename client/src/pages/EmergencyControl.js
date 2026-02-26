import React, { useState, useEffect } from 'react';
import { emergencyAPI } from '../api/endpoints';

const EmergencyControl = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    critical: 0
  });

  useEffect(() => {
    fetchEmergencies();
    const interval = setInterval(fetchEmergencies, 5000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchEmergencies = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await emergencyAPI.getEmergencies(params);
      const emergList = res.data.emergencies || [];
      setEmergencies(emergList);
      
      // Calculate stats
      const allEmergencies = res.data.emergencies || [];
      setStats({
        pending: allEmergencies.filter(e => e.status === 'pending').length,
        accepted: allEmergencies.filter(e => e.status === 'accepted').length,
        critical: allEmergencies.filter(e => e.severity === 'critical').length
      });
    } catch (error) {
      console.error('Error fetching emergencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'from-red-600 to-red-700 border-red-400/50';
      case 'high': return 'from-orange-600 to-orange-700 border-orange-400/50';
      case 'medium': return 'from-yellow-600 to-yellow-700 border-yellow-400/50';
      case 'low': return 'from-green-600 to-green-700 border-green-400/50';
      default: return 'from-gray-600 to-gray-700 border-gray-400/50';
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'from-yellow-500/30 to-yellow-600/30 border-yellow-400/50 text-yellow-300',
      accepted: 'from-blue-500/30 to-blue-600/30 border-blue-400/50 text-blue-300',
      arrived: 'from-green-500/30 to-green-600/30 border-green-400/50 text-green-300',
      in_transit: 'from-purple-500/30 to-purple-600/30 border-purple-400/50 text-purple-300',
      at_hospital: 'from-cyan-500/30 to-cyan-600/30 border-cyan-400/50 text-cyan-300',
      completed: 'from-gray-500/30 to-gray-600/30 border-gray-400/50 text-gray-300',
      cancelled: 'from-red-500/30 to-red-600/30 border-red-400/50 text-red-300'
    };
    return badges[status] || 'from-gray-500/30 to-gray-600/30 border-gray-400/50 text-gray-300';
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

  if (loading && emergencies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-400/30 border-t-red-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading emergency data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
            🎛️ Emergency Control Center
          </h1>
          <p className="text-gray-400 text-lg">Real-time monitoring and management of all emergencies</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl p-6">
            <p className="text-gray-300 text-sm font-medium mb-2">⏳ Pending</p>
            <p className="text-4xl font-bold text-yellow-300">{stats.pending}</p>
            <p className="text-gray-400 text-xs mt-2">Awaiting response</p>
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-2xl p-6">
            <p className="text-gray-300 text-sm font-medium mb-2">✅ Accepted</p>
            <p className="text-4xl font-bold text-blue-300">{stats.accepted}</p>
            <p className="text-gray-400 text-xs mt-2">In progress</p>
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-400/30 rounded-2xl p-6">
            <p className="text-gray-300 text-sm font-medium mb-2">🔴 Critical</p>
            <p className="text-4xl font-bold text-red-300">{stats.critical}</p>
            <p className="text-gray-400 text-xs mt-2">Highest priority</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8 flex overflow-x-auto gap-2 pb-4">
          {['all', 'pending', 'accepted', 'arrived', 'in_transit', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 font-medium rounded-lg transition-all whitespace-nowrap ${
                filter === status
                  ? 'backdrop-blur-xl bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30'
                  : 'backdrop-blur-xl bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20 hover:border-white/30'
              }`}
            >
              {getStatusIcon(status)} {status.replace(/_/g, ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Emergencies List */}
        {emergencies.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
            <span className="text-6xl block mb-4">✨</span>
            <p className="text-gray-300 text-xl font-semibold mb-2">No emergencies in {filter} status</p>
            <p className="text-gray-400">All emergencies are being handled or there are currently no active emergencies</p>
          </div>
        ) : (
          <div className="space-y-6">
            {emergencies.map((emergency, index) => (
              <div
                key={emergency._id}
                className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${getSeverityColor(emergency.severity)} px-6 py-4 flex items-start justify-between`}>
                  <div className="flex items-start gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        {getSeverityIcon(emergency.severity)} {emergency.emergencyId || `Emergency #${index + 1}`}
                      </h3>
                      <p className="text-white/80 text-sm mt-1">
                        📞 {emergency.caller?.firstName} {emergency.caller?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-4 py-2 bg-white/20 rounded-lg text-white font-bold text-sm border border-white/30">
                      {emergency.severity.toUpperCase()}
                    </span>
                    <span className={`px-4 py-2 rounded-lg font-bold text-sm border bg-gradient-to-r ${getStatusBadge(emergency.status)}`}>
                      {getStatusIcon(emergency.status)} {emergency.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">📍 Type</p>
                      <p className="text-white font-semibold capitalize">{emergency.emergencyType}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">🩺 Symptoms</p>
                      <p className="text-white font-semibold">{emergency.symptoms?.length || 0}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">🚑 Ambulance</p>
                      <p className="text-white font-semibold">{emergency.assignedAmbulance?.ambulanceId || 'Not Assigned'}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">🕐 Created</p>
                      <p className="text-white font-semibold">{new Date(emergency.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  {/* Address */}
                  {emergency.address && (
                    <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-400/30">
                      <p className="text-gray-300 text-sm">📍 Location</p>
                      <p className="text-white font-semibold">{emergency.address}</p>
                    </div>
                  )}

                  {/* Symptoms List */}
                  {emergency.symptoms && emergency.symptoms.length > 0 && (
                    <div>
                      <p className="text-white font-semibold mb-2">Reported Symptoms</p>
                      <div className="flex flex-wrap gap-2">
                        {emergency.symptoms.map((symptom, idx) => (
                          <span
                            key={idx}
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
                      <p className="text-white font-semibold mb-3">❤️ Current Vital Signs</p>
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

                  {/* Action Button */}
                  <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all shadow-lg shadow-red-500/30 hover:shadow-xl">
                    🎛️ Manage Emergency
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyControl;
