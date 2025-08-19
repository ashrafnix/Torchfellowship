
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, UserRole } from '../types';
import Spinner from '../components/ui/Spinner';
import { getApiUrl } from '../config/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  reloadUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadUserFromToken = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      try {
        // Fetch user data from the dedicated profile endpoint
        const res = await fetch(getApiUrl('/api/profile/me'), {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });
        if (res.ok) {
          const userData: User = await res.json();
          setUser(userData);
          setIsAdmin(userData.role === UserRole.ADMIN || userData.role === UserRole.SUPER_ADMIN);
        } else {
          // Token is invalid or expired
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Failed to fetch user from token", error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAdmin(false);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  const login = async (email: string, password: string) => {
    const res = await fetch(getApiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const { token: newToken, user: userData } = await res.json();
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    setIsAdmin(userData.role === UserRole.ADMIN || userData.role === UserRole.SUPER_ADMIN);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAdmin(false);
    // Optionally navigate to home or login page after logout
    window.location.hash = '/';
  };
  
  const reloadUser = useCallback(async () => {
    setLoading(true);
    await loadUserFromToken();
  }, [loadUserFromToken]);

  const value = {
    token,
    user,
    loading,
    isAdmin,
    login,
    logout,
    reloadUser,
  };

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center bg-brand-dark"><Spinner /></div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
