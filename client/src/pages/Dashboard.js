import React, { useState, useEffect, useContext } from 'react';
import { dashboardAPI, emergencyAPI } from '../api/endpoints';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // For patients, show user-specific metrics
        if (user?.role === 'patient') {
          const metricsRes = await dashboardAPI.getUserMetrics();
          setStats(metricsRes.data);
          setTrends([]);
        } else {
          // For admin/doctors, show system-wide stats
          const [statsRes, trendsRes] = await Promise.all([
            dashboardAPI.getStats({ timeRange: '30days' }),
            dashboardAPI.getTrends()
          ]);
          setStats(statsRes.data);
          setTrends(trendsRes.data);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-red-500/20 backdrop-blur-xl border border-red-400/50 rounded-2xl p-6 max-w-md text-center">
          <p className="text-red-300 text-lg">⚠️ {error}</p>
        </div>
      </div>
    );
  }

  const isPatient = user?.role === 'patient';

  // Patient-specific dashboard
  if (isPatient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-400 text-lg">Your personal health dashboard</p>
          </div>

          {/* Patient Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Emergencies Card */}
            <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2">Your Emergencies</p>
                  <p className="text-4xl font-bold text-blue-300">{stats?.emergencies || 0}</p>
                </div>
                <span className="text-4xl opacity-70 group-hover:scale-110 transition-transform">🚨</span>
              </div>
              <p className="text-xs text-gray-400 mt-4">SOS calls received</p>
            </div>

            {/* Medical Records Card */}
            <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2">Medical Records</p>
                  <p className="text-4xl font-bold text-green-300">{stats?.medicalRecords || 0}</p>
                </div>
                <span className="text-4xl opacity-70 group-hover:scale-110 transition-transform">📋</span>
              </div>
              <p className="text-xs text-gray-400 mt-4">On file with doctors</p>
            </div>

            {/* Camps Attended Card */}
            <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2">Camps Attended</p>
                  <p className="text-4xl font-bold text-purple-300">{stats?.campsAttended || 0}</p>
                </div>
                <span className="text-4xl opacity-70 group-hover:scale-110 transition-transform">⛺</span>
              </div>
              <p className="text-xs text-gray-400 mt-4">Health camps visited</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-white/20 rounded-2xl p-8 text-center">
            <p className="text-gray-300 mb-6">Quick access to your health information</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/records" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/30">
                📋 View Records
              </a>
              <a href="/my-emergencies" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/30">
                🚨 SOS History
              </a>
              <a href="/camps" className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-green-500/30">
                ⛺ Health Camps
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin/Doctor dashboard
  const trendsData = {
    labels: trends?.map(t => t._id) || [],
    datasets: [
      {
        label: 'Total Emergencies',
        data: trends?.map(t => t.count) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'rgba(59, 130, 246, 0.5)',
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Critical Cases',
        data: trends?.map(t => t.critical) || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: 'rgba(239, 68, 68, 0.5)',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const severityData = {
    labels: stats?.emergenciesBySeverity?.map(s => s._id) || [],
    datasets: [{
      data: stats?.emergenciesBySeverity?.map(s => s.count) || [],
      backgroundColor: [
        'rgba(249, 115, 22, 0.8)',    // orange (low)
        'rgba(251, 146, 60, 0.8)',    // orange-light (medium)
        'rgba(239, 68, 68, 0.8)',     // red (high)
        'rgba(127, 29, 29, 0.8)'      // red-dark (critical)
      ],
      borderColor: [
        'rgba(249, 115, 22, 1)',
        'rgba(251, 146, 60, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(127, 29, 29, 1)'
      ],
      borderWidth: 2
    }]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            HEALX System Dashboard 📊
          </h1>
          <p className="text-gray-400 text-lg">Real-time emergency and health monitoring</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Emergencies */}
          <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-2">Total Emergencies</p>
                <p className="text-4xl font-bold text-blue-300">{stats?.totalEmergencies || 0}</p>
              </div>
              <span className="text-4xl opacity-70 group-hover:scale-110 transition-transform">🚨</span>
            </div>
            <p className="text-xs text-gray-400 mt-4">Last 30 days</p>
          </div>

          {/* Critical Cases */}
          <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-2">Critical Cases</p>
                <p className="text-4xl font-bold text-red-300">{stats?.criticalEmergencies || 0}</p>
              </div>
              <span className="text-4xl opacity-70 group-hover:scale-110 transition-transform">💔</span>
            </div>
            <p className="text-xs text-gray-400 mt-4">Urgent attention</p>
          </div>

          {/* Ambulances Available */}
          <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-2">Ambulances Available</p>
                <p className="text-4xl font-bold text-green-300">{stats?.availableAmbulances}/{stats?.totalAmbulances || 0}</p>
              </div>
              <span className="text-4xl opacity-70 group-hover:scale-110 transition-transform">🚑</span>
            </div>
            <p className="text-xs text-gray-400 mt-4">Ready to respond</p>
          </div>

          {/* Active Health Camps */}
          <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-2">Active Health Camps</p>
                <p className="text-4xl font-bold text-purple-300">{stats?.activeCamps || 0}</p>
              </div>
              <span className="text-4xl opacity-70 group-hover:scale-110 transition-transform">⛺</span>
            </div>
            <p className="text-xs text-gray-400 mt-4">Running now</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Emergency Trends Chart */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              📈 Emergency Trends (30 Days)
            </h3>
            <div className="p-4 bg-white/5 rounded-xl">
              <Line 
                data={trendsData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      labels: { color: 'rgb(209, 213, 219)', font: { size: 12 } }
                    }
                  },
                  scales: {
                    y: { ticks: { color: 'rgb(209, 213, 219)' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                    x: { ticks: { color: 'rgb(209, 213, 219)' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
                  }
                }}
              />
            </div>
          </div>

          {/* Severity Distribution Chart */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              📊 Severity Distribution
            </h3>
            <div className="p-4 bg-white/5 rounded-xl">
              <Doughnut 
                data={severityData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      labels: { color: 'rgb(209, 213, 219)', font: { size: 12 } }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Staff Metrics */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              👥 Staff Overview
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-300">👨‍⚕️ Doctors</span>
                <span className="text-2xl font-bold text-blue-300">{stats?.doctors || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-300">🤝 Volunteers</span>
                <span className="text-2xl font-bold text-green-300">{stats?.volunteers || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-300">👤 Total Users</span>
                <span className="text-2xl font-bold text-purple-300">{stats?.totalUsers || 0}</span>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              ⏱️ Response Metrics
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-400/30">
                <p className="text-gray-400 text-sm mb-1">Avg Response Time</p>
                <p className="text-3xl font-bold text-blue-300">
                  {Math.round(stats?.averageResponseTime / 60000) || 0} <span className="text-base">min</span>
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-gray-400 text-sm">Quick response times ensure better patient outcomes</p>
              </div>
            </div>
          </div>

          {/* Health Camps Summary */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              ⛺ Health Camps
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-400/30">
                <span className="text-gray-300">🟢 Active</span>
                <span className="text-2xl font-bold text-green-300">{stats?.activeCamps || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-300">📋 Total</span>
                <span className="text-2xl font-bold text-purple-300">{stats?.totalCamps || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
