import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

const OverallLink = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [serviceStatus, setServiceStatus] = useState({
    frontend: { status: 'online', url: 'http://localhost:3000' },
    backend: { status: 'checking', url: API_URL },
    ai: { status: 'checking', url: 'http://localhost:8000' },
    database: { status: 'checking', url: 'mongodb://localhost:27017' }
  });

  useEffect(() => {
    // Check backend status
    fetch(`${API_URL}/health`)

      .then(() => setServiceStatus(prev => ({ ...prev, backend: { ...prev.backend, status: 'online' } })))
      .catch(() => setServiceStatus(prev => ({ ...prev, backend: { ...prev.backend, status: ' offline' } })));

    // Check AI service status
    fetch('http://localhost:8000/health')
      .then(() => setServiceStatus(prev => ({ ...prev, ai: { ...prev.ai, status: 'online' } })))
      .catch(() => setServiceStatus(prev => ({ ...prev, ai: { ...prev.ai, status: 'offline' } })));
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'checking': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'online': return '● Online';
      case 'offline': return '● Offline';
      case 'checking': return '● Checking...';
      default: return '● Unknown';
    }
  };

  // Navigation links based on role
  const navigationLinks = [
    {
      category: 'Main Navigation',
      links: [
        { to: '/dashboard', label: ' 📊 Dashboard', desc: 'View analytics and statistics', roles: ['admin', 'doctor', 'patient', 'ambulance_driver', 'volunteer'] },
        { to: '/emergency', label: '🆘 Emergency SOS', desc: 'Request emergency assistance', roles: ['admin', 'doctor', 'patient', 'volunteer'] },
        { to: '/tracking', label: '🗺️ Tracking Map', desc: 'Real-time ambulance tracking', roles: ['admin', 'doctor', 'patient', 'ambulance_driver', 'volunteer'] },
        { to: '/camps', label: '⛺ Health Camps', desc: 'Find and register for camps', roles: ['admin', 'doctor', 'patient', 'volunteer'] },
        { to: '/records', label: '📋 Patient Records', desc: 'View medical records', roles: ['admin', 'doctor', 'patient'] },
      ]
    },
    {
      category: 'Patient Services',
      links: [
        { to: '/my-emergencies', label: '🚨 My Emergencies', desc: 'Track your emergency requests', roles: ['patient'] },
        { to: '/chatbot', label: '🤖 Health Assistant', desc: 'AI health chatbot', roles: ['patient'] },
      ]
    },
    {
      category: 'Admin & Control',
      links: [
        { to: '/emergency-control', label: '⚙️ Emergency Control', desc: 'Manage emergency responses', roles: ['admin'] },
      ]
    }
  ];

  // API Endpoints reference
  const apiEndpoints = [
    { method: 'POST', path: '/api/auth/login', desc: 'User authentication' },
    { method: 'POST', path: '/api/auth/register', desc: 'User registration' },
    { method: 'GET', path: '/api/auth/profile', desc: 'Get user profile' },
    { method: 'GET', path: '/api/camps', desc: 'List all health camps' },
    { method: 'POST', path: '/api/camps', desc: 'Create new camp' },
    { method: 'GET', path: '/api/emergencies', desc: 'List emergencies' },
    { method: 'POST', path: '/api/emergencies', desc: 'Create emergency' },
    { method: 'GET', path: '/api/ambulances', desc: 'List ambulances' },
    { method: 'PUT', path: '/api/ambulances/:id/location', desc: 'Update ambulance location' },
    { method: 'GET', path: '/api/records', desc: 'List medical records' },
    { method: 'POST', path: '/api/records', desc: 'Create medical record' },
    { method: 'GET', path: '/api/dashboard/stats', desc: 'Get dashboard statistics' },
    { method: 'POST', path: '/api/ai/predict-disease', desc: 'AI disease prediction' },
    { method: 'POST', path: '/api/ai/predict-severity', desc: 'AI severity prediction' },
    { method: 'POST', path: '/api/ai/chat', desc: 'AI health chatbot' },
  ];

  // Quick actions
  const quickActions = [
    { label: '🚨 New Emergency', action: () => navigate('/emergency'), color: 'from-red-500 to-red-600' },
    { label: '⛺ Find Camps', action: () => navigate('/camps'), color: 'from-blue-500 to-blue-600' },
    { label: '📋 View Records', action: () => navigate('/records'), color: 'from-green-500 to-green-600' },
    { label: '🗺️ Track Ambulance', action: () => navigate('/tracking'), color: 'from-purple-500 to-purple-600' },
  ];

  const filteredNavigation = navigationLinks.map(category => ({
    ...category,
    links: category.links.filter(link => link.roles.includes(user?.role))
  })).filter(category => category.links.length > 0);

  if (!isAuthenticated) {
    return (
      <div className="  h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">Please login to access the navigation hub.</p>
          <Link to="/login" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🔗 Overall Link Hub</h1>
          <p className="text-gray-400">Central navigation and system overview for HEALX Health Platform</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="px-4 py-2 bg-slate-800/50 rounded-lg text-gray-300">
              Role: <span className="text-blue-400 font-semibold capitalize">{user?.role}</span>
            </span>
            <span className="px-4 py-2 bg-slate-800/50 rounded-lg text-gray-300">
              User: <span className="text-blue-400 font-semibold">{user?.firstName} {user?.lastName}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Navigation Links */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">⚡ Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`p-4 bg-gradient-to-r ${action.color} rounded-lg text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 text-center`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Links by Category */}
            {filteredNavigation.map((category, catIndex) => (
              <div key={catIndex} className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">{category.category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.links.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      to={link.to}
                      className="group p-4 bg-slate-700/30 hover:bg-slate-700/50 border border-white/5 hover:border-blue-500/30 rounded-lg transition-all duration-200"
                    >
                      <div className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {link.label}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {link.desc}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* API Endpoints Reference */}
            <div className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">🔌 API Endpoints Reference</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-white/10">
                      <th className="pb-2">Method</th>
                      <th className="px-2">Endpoint</th>
                      <th className="pb-2">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    {apiEndpoints.map((endpoint, index) => (
                      <tr key={index} className="border-b border-white/5 last:border-0">
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                            endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                            endpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {endpoint.method}
                          </span>
                        </td>
                        <td className="py-2 font-mono text-blue-400">{endpoint.path}</td>
                        <td className="py-2 text-gray-400">{endpoint.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Service Status & Info */}
          <div className="space-y-6">
            {/* Service Status */}
            <div className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">🖥️ Service Status</h2>
              <div className="space-y-4">
                {Object.entries(serviceStatus).map(([name, service]) => (
                  <div key={name} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div>
                      <div className="text-white font-semibold capitalize">{name}</div>
                      <div className="text-xs text-gray-400 font-mono">{service.url}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(service.status)}`}>
                      {getStatusText(service.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Info */}
            <div className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">ℹ️ System Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Platform:</span>
                  <span className="text-white">HEALX Health Platform</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Version:</span>
                  <span className="text-white">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Environment:</span>
                  <span className="text-white">Development</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Frontend:</span>
                  <span className="text-white">React.js</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Backend:</span>
                  <span className="text-white">Node.js/Express</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Database:</span>
                  <span className="text-white">MongoDB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">AI Service:</span>
                  <span className="text-white">Python FastAPI</span>
                </div>
              </div>
            </div>

            {/* Documentation Links */}
            <div className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">📚 Documentation</h2>
              <div className="space-y-2">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-gray-300 hover:text-white transition-colors">
                  📖 View README.md
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-gray-300 hover:text-white transition-colors">
                  🚀 Quick Start Guide
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-gray-300 hover:text-white transition-colors">
                  🔧 API Documentation
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-gray-300 hover:text-white transition-colors">
                  🐳 Deployment Guide
                </a>
              </div>
            </div>

            {/* Support */}
            <div className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">🆘 Support</h2>
              <div className="text-sm text-gray-400 space-y-2">
                <p>Need help? Contact the development team:</p>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="text-white font-semibold">HEALX Dev Team</div>
                  <div className="text-xs">dev@healx-health.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>HEALX Health Platform © 2026. Built with ❤️ for healthcare innovation.</p>
        </div>
      </div>
    </div>
  );
};

export default OverallLink;
