import React, { useState, useEffect } from 'react';
import { campAPI } from '../api/endpoints';

const HealthCamps = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        setLoading(true);
        const params = filter !== 'all' ? { status: filter } : {};
        const res = await campAPI.getAllCamps(params);
        setCamps(res.data.camps || []);
      } catch (error) {
        console.error('Error fetching camps:', error);
        setCamps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCamps();
  }, [filter]);

  const getCampTypeIcon = (type) => {
    switch (type) {
      case 'general': return '🏥';
      case 'vaccination': return '💉';
      case 'dental': return '🦷';
      case 'eye_care': return '👁️';
      case 'maternal': return '👶';
      case 'pediatric': return '🧒';
      case 'cardiac': return '❤️';
      default: return '⛺';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return 'from-green-600 to-green-700 border-green-400/50';
      case 'planned': return 'from-blue-600 to-blue-700 border-blue-400/50';
      case 'completed': return 'from-gray-600 to-gray-700 border-gray-400/50';
      default: return 'from-orange-600 to-orange-700 border-orange-400/50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ongoing': return '🟢';
      case 'planned': return '🔵';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading health camps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            ⛺ Health Camps Network
          </h1>
          <p className="text-gray-400 text-lg">Discover and join community health camps near you</p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8 flex overflow-x-auto gap-2 pb-4">
          {['all', 'planned', 'ongoing', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 font-medium rounded-lg transition-all whitespace-nowrap ${
                filter === status
                  ? 'backdrop-blur-xl bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/30'
                  : 'backdrop-blur-xl bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20 hover:border-white/30'
              }`}
            >
              {getStatusIcon(status)} {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Camps Grid */}
        {camps.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-gray-300 text-xl font-semibold mb-2">No health camps found</p>
            <p className="text-gray-400">Try adjusting your filter to see other camps</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {camps.map(camp => (
              <div
                key={camp._id}
                className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${getStatusColor(camp.status)} px-6 py-4 flex items-start justify-between`}>
                  <div className="flex items-start gap-3">
                    <span className="text-4xl">{getCampTypeIcon(camp.type)}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{camp.name}</h3>
                      <p className="text-white/80 text-sm capitalize">{camp.type.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-white/20 rounded-lg text-white font-bold text-sm border border-white/30">
                    {getStatusIcon(camp.status)} {camp.status.toUpperCase()}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {camp.description && (
                    <p className="text-gray-300">{camp.description}</p>
                  )}

                  {/* Key Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">📅 Start Date</p>
                      <p className="text-white font-semibold">{new Date(camp.startDate).toLocaleDateString()}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">📅 End Date</p>
                      <p className="text-white font-semibold">{new Date(camp.endDate).toLocaleDateString()}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">📍 Location</p>
                      <p className="text-white font-semibold">{camp.address?.city || 'TBD'}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">👥 Capacity</p>
                      <p className="text-white font-semibold">{camp.registeredCount}/{camp.capacity}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-gray-300 text-sm font-medium">Registration Progress</p>
                      <p className="text-green-300 text-sm font-semibold">{Math.round((camp.registeredCount / camp.capacity) * 100)}%</p>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/20">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: `${Math.min((camp.registeredCount / camp.capacity) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Services */}
                  {camp.services && camp.services.length > 0 && (
                    <div>
                      <p className="text-lg font-semibold text-white mb-3">Services Offered</p>
                      <div className="flex flex-wrap gap-2">
                        {camp.services.map((service, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-300 text-sm rounded-full border border-blue-400/50"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Staff Info */}
                  <div className="grid grid-cols-2 gap-4">
                    {camp.doctors && camp.doctors.length > 0 && (
                      <div className="p-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-400/30">
                        <p className="text-gray-300 text-sm">👨‍⚕️ Doctors</p>
                        <p className="text-blue-300 font-semibold">{camp.doctors.length}</p>
                      </div>
                    )}
                    {camp.volunteers && camp.volunteers.length > 0 && (
                      <div className="p-3 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-400/30">
                        <p className="text-gray-300 text-sm">🤝 Volunteers</p>
                        <p className="text-purple-300 font-semibold">{camp.volunteers.length}</p>
                      </div>
                    )}
                  </div>

                  {/* Register Button */}
                  <button
                    disabled={camp.registeredCount >= camp.capacity || camp.status !== 'ongoing'}
                    className={`w-full py-3 font-bold rounded-lg transition-all ${
                      camp.registeredCount >= camp.capacity || camp.status !== 'ongoing'
                        ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg shadow-green-500/30 hover:shadow-xl'
                    }`}
                  >
                    {camp.status !== 'ongoing' ? '⏳ Not Active' : camp.registeredCount >= camp.capacity ? '❌ At Capacity' : '✅ Register Now'}
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

export default HealthCamps;
