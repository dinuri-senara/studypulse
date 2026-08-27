import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Normally we'd fetch /users/me here, but we'll mock or decode token
          const userStr = localStorage.getItem('user');
          if (userStr) setUser(JSON.parse(userStr));
        } catch (e) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    const userData = { id: data.id, fullName: data.fullName, email: data.email, role: data.role };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('token', data.token);
    const userPayload = { id: data.id, fullName: data.fullName, email: data.email, role: data.role };
    localStorage.setItem('user', JSON.stringify(userPayload));
    setUser(userPayload);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
