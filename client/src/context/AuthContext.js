import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await authApi.getMe();

      if (data && !data.error) {
        setUser(data);
      } else {
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.error('Auth check failed');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);

    if (data && !data.error && data.access_token) {
      localStorage.setItem('token', data.access_token);
      setUser(data.user);
    }

    return data;
  };

  const register = async (email, password) => {
    const data = await authApi.register(email, password);

    if (data && !data.error && data.access_token) {
      localStorage.setItem('token', data.access_token);
      setUser(data.user);
    }

    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
