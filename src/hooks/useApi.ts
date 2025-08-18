import { useAuth } from './useAuth';
import { useCallback } from 'react';

export const useApi = () => {
    const { token, logout } = useAuth();

    const apiClient = useCallback(async <T>(
        endpoint: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        body?: any
    ): Promise<T> => {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            method,
            headers,
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(endpoint, config);

        if (response.status === 401) {
            // Unauthorized, token might be expired
            logout();
            throw new Error('Your session has expired. Please log in again.');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
            throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }

        if (response.status === 204) { // No Content
            return null as T;
        }

        return response.json() as Promise<T>;
    }, [token, logout]);

    return { apiClient };
};
