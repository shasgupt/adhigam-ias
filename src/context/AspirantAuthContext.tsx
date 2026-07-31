import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { aspirantApi } from '../lib/api';

interface AspirantAuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<User>;
  register: (details: {
    name: string;
    email: string;
    phone?: string;
    targetYear?: string;
    optionalSubject?: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
  token: string | null;
}

const AspirantAuthContext = createContext<AspirantAuthContextType | undefined>(undefined);

export const AspirantAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('adhigam_aspirant_token'));

  useEffect(() => {
    checkMe();
  }, []);

  const checkMe = async () => {
    try {
      const res = await aspirantApi.get('/api/aspirants/me');
      setUser(res.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string) => {
    const res = await aspirantApi.post('/api/aspirants/login', { email });
    if (res.aspirant_access_token) {
      localStorage.setItem('adhigam_aspirant_token', res.aspirant_access_token);
      setToken(res.aspirant_access_token);
    }
    setUser(res.user);
    return res.user;
  };

  const register = async (details: {
    name: string;
    email: string;
    phone?: string;
    targetYear?: string;
    optionalSubject?: string;
  }) => {
    const res = await aspirantApi.post('/api/aspirants/register', details);
    if (res.aspirant_access_token) {
      localStorage.setItem('adhigam_aspirant_token', res.aspirant_access_token);
      setToken(res.aspirant_access_token);
    }
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    try {
      await aspirantApi.post('/api/aspirants/logout');
    } catch {
      // ignore
    }
    localStorage.removeItem('adhigam_aspirant_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AspirantAuthContext.Provider value={{ user, loading, login, register, logout, token }}>
      {children}
    </AspirantAuthContext.Provider>
  );
};

export const useAspirantAuth = () => {
  const context = useContext(AspirantAuthContext);
  if (!context) throw new Error('useAspirantAuth must be used within an AspirantAuthProvider');
  return context;
};
