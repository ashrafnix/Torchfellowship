export const API_BASE_URL = (import.meta.env as any).VITE_API_BASE_URL || 'http://localhost:8080';

export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};