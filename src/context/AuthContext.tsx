import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<User>;
  logout: () => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('adhigam_token'));

  useEffect(() => {
    checkMe();
  }, []);

  const checkMe = async () => {
    try {
      const res = await api.get('/api/auth/me');
      setUser(res.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password?: string) => {
    const res = await api.post('/api/auth/login', { email, password });
    if (res.access_token) {
      localStorage.setItem('adhigam_token', res.access_token);
      setToken(res.access_token);
    }
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // ignore
    }
    localStorage.removeItem('adhigam_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
