'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback, useContext } from 'react';
import { User, UserRole } from '@/lib/types';
import { toast } from 'react-toastify';
import { signInWithCustomToken, signOut as firebaseSignOut } from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase/client';

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

/** Decode JWT payload without verifying signature (client-side only). */
function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Returns true if the JWT is expired or will expire within 60 seconds. */
function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  const nowSecs = Math.floor(Date.now() / 1000);
  return payload.exp < nowSecs + 60;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdminState] = useState(false);

  const clearAuth = useCallback(() => {
    if (typeof window !== 'undefined') localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAdminState(false);
  }, []);

  const loadUserFromToken = useCallback(async () => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (storedToken) {
      // Client-side expiry check — avoids a pointless round trip
      if (isTokenExpired(storedToken)) {
        clearAuth();
        setLoading(false);
        return;
      }

      setToken(storedToken);
      try {
        const res = await fetch('/api/profile/me', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (res.ok) {
          const userData: User = await res.json();
          setUser(userData);
          setIsAdminState(userData.role === UserRole.ADMIN || userData.role === UserRole.SUPER_ADMIN);

          // Exchange the JWT for a Firebase custom token so Firestore
          // security rules see request.auth on every page load.
          try {
            const fbRes = await fetch('/api/auth/firebase-token', {
              headers: { Authorization: `Bearer ${storedToken}` },
            });
            if (fbRes.ok) {
              const { firebaseToken } = await fbRes.json();
              if (firebaseToken) {
                await signInWithCustomToken(firebaseAuth, firebaseToken);
              }
            }
          } catch (fbErr) {
            console.warn('Firebase session restore failed:', fbErr);
          }
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      }
    }
    setLoading(false);
  }, [clearAuth]);

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const { token: newToken, firebaseToken, user: userData } = await res.json();
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    setIsAdminState(userData.role === UserRole.ADMIN || userData.role === UserRole.SUPER_ADMIN);

    // Sign into Firebase Auth so Firestore security rules see request.auth
    if (firebaseToken) {
      try {
        await signInWithCustomToken(firebaseAuth, firebaseToken);
      } catch (fbErr) {
        console.warn('Firebase custom sign-in failed:', fbErr);
      }
    }
  };

  const logout = useCallback(() => {
    clearAuth();
    firebaseSignOut(firebaseAuth).catch(() => {});
    toast.info('You have been signed out.');
    window.location.href = '/';
  }, [clearAuth]);

  const reloadUser = useCallback(async () => {
    setLoading(true);
    await loadUserFromToken();
  }, [loadUserFromToken]);

  return (
    <AuthContext.Provider value={{ token, user, loading, isAdmin, login, logout, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
