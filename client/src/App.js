import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmergencySOS from './pages/EmergencySOS';
import TrackingMap from './pages/TrackingMap';
import HealthCamps from './pages/HealthCamps';
import PatientRecords from './pages/PatientRecords';
import EmergencyControl from './pages/EmergencyControl';
import MyEmergencies from './pages/MyEmergencies';
import Chatbot from './components/Chatbot';
import OverallLink from './pages/OverallLink';
import './index.css';


const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleColor = () => {
    switch(user?.role) {
      case 'admin': return 'from-purple-500 to-pink-500';
      case 'doctor': return 'from-green-500 to-emerald-500';
      case 'patient': return 'from-blue-500 to-cyan-500';
      case 'ambulance_driver': return 'from-orange-500 to-red-500';
      case 'volunteer': return 'from-indigo-500 to-blue-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  const getRoleIcon = () => {
    switch(user?.role) {
      case 'admin': return '👨‍💼';
      case 'doctor': return '👨‍⚕️';
      case 'patient': return '🏥';
      case 'ambulance_driver': return '🚑';
      case 'volunteer': return '🤝';
      default: return '👤';
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">🏥</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">HEALX</span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-1">
              <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">📊 Dashboard</Link>
              <Link to="/records" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">📋 Records</Link>
              {user?.role === 'patient' && (
                <>
                  <Link to="/chatbot" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">🤖 Health Assistant</Link>
                  <Link to="/my-emergencies" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">🚨 My SOS</Link>
                </>
              )}
              <Link to="/emergency" className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition-all duration-200 shadow-lg shadow-red-500/30">🆘 Emergency</Link>
              <Link to="/tracking" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">🗺️ Track</Link>
              <Link to="/camps" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">⛺ Camps</Link>
              <Link to="/overall" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">🔗 Links</Link>
              {user?.role === 'admin' && (
                <Link to="/emergency-control" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">⚙️ Control</Link>
              )}

            </div>
          ) : null}

          {/* User Profile & Actions */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4">
              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r ${getRoleColor()} hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 text-white font-medium`}
                >
                  <span className="text-lg">{getRoleIcon()}</span>
                  <span className="text-sm">{user?.firstName}</span>
                  <span className="text-sm">{dropdownOpen ? '▲' : '▼'}</span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur border border-white/20 rounded-lg shadow-xl shadow-black/50 space-y-1 py-2">
                    <div className="px-4 py-2 text-xs text-gray-400 border-b border-white/10">
                      Role: <span className="text-white font-semibold capitalize">{user?.role}</span>
                    </div>
                    {user?.email && (
                      <div className="px-4 py-2 text-xs text-gray-400 border-b border-white/10">
                        {user.email}
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg">
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white text-2xl hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800/50 backdrop-blur border-t border-white/10 space-y-1 p-4">
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">📊 Dashboard</Link>
                <Link to="/records" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">📋 Records</Link>
                {user?.role === 'patient' && (
                  <>
                    <Link to="/chatbot" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">🤖 Health Assistant</Link>
                    <Link to="/my-emergencies" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">🚨 My SOS</Link>
                  </>
                )}
                <Link to="/emergency" className="block px-4 py-2 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg">🆘 Emergency</Link>
                <Link to="/tracking" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">🗺️ Track</Link>
                <Link to="/camps" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">⛺ Camps</Link>
                <Link to="/overall" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">🔗 Links</Link>
                {user?.role === 'admin' && (
                  <Link to="/emergency-control" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">⚙️ Control</Link>
                )}

                <div className="border-t border-white/10 mt-4 pt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors text-left"
                  >
                    🚪 Logout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

const AppContent = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/emergency"
          element={
            <PrivateRoute>
              <EmergencySOS />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-emergencies"
          element={
            <PrivateRoute>
              <MyEmergencies />
            </PrivateRoute>
          }
        />
        <Route
          path="/tracking"
          element={
            <PrivateRoute>
              <TrackingMap />
            </PrivateRoute>
          }
        />
        <Route
          path="/camps"
          element={
            <PrivateRoute>
              <HealthCamps />
            </PrivateRoute>
          }
        />
        <Route
          path="/records"
          element={
            <PrivateRoute>
              <PatientRecords />
            </PrivateRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <PrivateRoute requiredRole="patient">
              <Chatbot />
            </PrivateRoute>
          }
        />
        <Route
          path="/emergency-control"
          element={
            <PrivateRoute requiredRole="admin">
              <EmergencyControl />
            </PrivateRoute>
          }
        />
        <Route
          path="/overall"
          element={
            <PrivateRoute>
              <OverallLink />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />

      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
