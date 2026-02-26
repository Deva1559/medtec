import { createContext, useState, useCallback, useEffect } from 'react';
import { authAPI } from '../api/endpoints';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check for stored token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        console.log('User restored from localStorage:', userData);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Login attempt:', email);
      const res = await authAPI.login({ email, password });
      console.log('Login response:', res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Login failed';
      console.error('Login error:', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await authAPI.register(data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Registration failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const value = {
    user,
    setUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
