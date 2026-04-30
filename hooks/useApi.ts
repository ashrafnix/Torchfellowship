'use client';

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const API_TIMEOUT_MS = 12_000;

export const useApi = () => {
  const { token, logout } = useAuth();

  const apiClient = useCallback(
    async <T>(
      endpoint: string,
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
      body?: unknown
    ): Promise<T> => {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };

      // On page refresh, state token might be null for a split second before
      // AuthContext populates it. Fallback to localStorage to prevent premature
      // 401s that nuke the session.
      const activeToken =
        token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
      if (activeToken) headers['Authorization'] = `Bearer ${activeToken}`;

      const config: RequestInit = { method, headers };
      if (body) config.body = JSON.stringify(body);

      // Race request against a timeout so the app never hangs indefinitely
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
      config.signal = controller.signal;

      try {
        const response = await fetch(endpoint, config);
        clearTimeout(timeoutId);

        if (response.status === 401) {
          logout();
          throw new Error('Your session has expired. Please log in again.');
        }

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: 'An unknown error occurred' }));
          throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }

        if (response.status === 204) return null as T;

        return response.json() as Promise<T>;
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          throw new Error('Request timed out. Please check your connection and try again.');
        }
        throw err;
      }
    },
    [token, logout]
  );

  return { apiClient };
};
