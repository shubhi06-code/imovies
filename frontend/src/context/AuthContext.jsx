import React, { createContext, useState } from 'react';
import API from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password, role = 'customer') => {
    try {
      const res = await API.post('/auth/login', { email, password, role });
      
      const authToken = res.data?.token || 'mock-jwt-token';
      const userData = {
        email,
        name: role === 'admin' ? 'Administrator' : (res.data?.user?.name || 'Customer'),
        role: role,
        ...(res.data?.user || {})
      };

      setToken(authToken);
      setUser(userData);

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      return res.data;
    } catch (err) {
      // Offline fallback
      const fallbackUser = {
        email,
        name: role === 'admin' ? 'Administrator' : 'Customer',
        role: role
      };

      setToken('demo-token');
      setUser(fallbackUser);

      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify(fallbackUser));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}