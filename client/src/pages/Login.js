import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { authAPI } from '../api/endpoints';

const Login = () => {
  const [formData, setFormData] = useState({ email: 'admin@healx.com', password: 'admin@123' });
  const [signupData, setSignupData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    phone: '',
    role: 'patient'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { login, register, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      setLoading(true);

      // Validation
      if (!signupData.firstName || !signupData.lastName || !signupData.email || !signupData.password) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      if (signupData.password !== signupData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (signupData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      // Register
      await register({
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        password: signupData.password,
        phone: signupData.phone,
        role: signupData.role
      });

      setSuccess('Account created successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Registration failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      const response = await authAPI.demoLogin({ email, password });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'admin@healx.com', password: 'admin@123', label: 'Admin', icon: '👨‍💼', color: 'from-blue-600 to-blue-700' },
    { email: 'doctor1@healx.com', password: 'doctor1@123', label: 'Doctor', icon: '👨‍⚕️', color: 'from-green-600 to-green-700' },
    { email: 'abishek@healx.com', password: 'patient1@123', label: 'Patient 1 - ABISHEK', icon: '👨‍🦱', color: 'from-orange-600 to-orange-700' },
    { email: 'devaranjan@healx.com', password: 'patient1@123', label: 'Patient 2 - DEVARANJAN', icon: '👨‍🦳', color: 'from-pink-600 to-pink-700' },
    { email: 'harini@healx.com', password: 'patient1@123', label: 'Patient 3 - HARINI', icon: '👩', color: 'from-cyan-600 to-cyan-700' },
    { email: 'birudha@healx.com', password: 'patient1@123', label: 'Patient 4 - BIRUDHA', icon: '👩‍🦰', color: 'from-rose-600 to-rose-700' },
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-red-600 rounded-2xl mb-4">
            <span className="text-2xl">🏥</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">HEALX</h1>
          <p className="text-blue-200">Emergency Health Platform</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg text-sm flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-200 rounded-lg text-sm flex items-start gap-3">
              <span className="text-xl">✅</span>
              <div>
                <p className="font-semibold">Success</p>
                <p className="text-sm mt-1">{success}</p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-white/10 rounded-lg">
            <button
              onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 px-4 rounded-md transition font-medium text-sm ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-blue-600 to-red-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 px-4 rounded-md transition font-medium text-sm ${
                activeTab === 'signup'
                  ? 'bg-gradient-to-r from-blue-600 to-red-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => { setActiveTab('demo'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 px-4 rounded-md transition font-medium text-sm ${
                activeTab === 'demo'
                  ? 'bg-gradient-to-r from-blue-600 to-red-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Quick Demo
            </button>
          </div>

          {/* Login Form Tab */}
          {activeTab === 'login' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400">✉️</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none text-white placeholder-gray-400 transition"
                    placeholder="admin@healx.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400">🔐</span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none text-white placeholder-gray-400 transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold disabled:from-gray-600 disabled:to-gray-700 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span> Signing in...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span>→</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                Default credentials are pre-filled for testing
              </p>
            </form>
          )}

          {/* Sign Up Form Tab */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-200 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={signupData.firstName}
                    onChange={handleSignupChange}
                    required
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none text-white placeholder-gray-400 transition text-sm"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-200 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={signupData.lastName}
                    onChange={handleSignupChange}
                    required
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none text-white placeholder-gray-400 transition text-sm"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-200 mb-1">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">✉️</span>
                  <input
                    type="email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    required
                    className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none text-white placeholder-gray-400 transition text-sm"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-200 mb-1">Phone (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">📱</span>
                  <input
                    type="tel"
                    name="phone"
                    value={signupData.phone}
                    onChange={handleSignupChange}
                    className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none text-white placeholder-gray-400 transition text-sm"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-200 mb-1">Role</label>
                <select
                  name="role"
                  value={signupData.role}
                  onChange={handleSignupChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none text-white transition text-sm"
                >
                  <option value="patient" className="bg-slate-900">Patient</option>
                  <option value="doctor" className="bg-slate-900">Doctor</option>
                  <option value="volunteer" className="bg-slate-900">Volunteer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-200 mb-1">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">🔐</span>
                  <input
                    type="password"
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    required
                    className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none text-white placeholder-gray-400 transition text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-200 mb-1">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">🔐</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    required
                    className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none text-white placeholder-gray-400 transition text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition font-semibold disabled:from-gray-600 disabled:to-gray-700 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span> Creating account...
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <span>→</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3">
                By signing up, you agree to our Terms of Service
              </p>
            </form>
          )}

          {/* Demo Accounts Tab */}
          {activeTab === 'demo' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-300 mb-4">Choose a demo account to explore:</p>
              
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => handleDemoLogin(account.email, account.password)}
                  disabled={loading}
                  className={`w-full group relative overflow-hidden rounded-lg p-4 bg-gradient-to-r ${account.color} text-white transition hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50`}
                >
                  <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition"></div>
                  <div className="relative flex items-center gap-3">
                    <span className="text-2xl">{account.icon}</span>
                    <div className="text-left">
                      <p className="font-semibold">{account.label}</p>
                      <p className="text-sm opacity-90">{account.email}</p>
                    </div>
                    <span className="ml-auto">→</span>
                  </div>
                </button>
              ))}


              <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                <p className="text-xs text-yellow-200">
                  <span className="font-semibold">💡 Note:</span> Demo accounts have temporary data that resets on logout
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-6">
          © 2026 HEALX Health Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
