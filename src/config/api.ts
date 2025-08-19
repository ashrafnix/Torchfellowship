export const API_BASE_URL = (import.meta.env as any).VITE_API_BASE_URL || 'http://localhost:8080';

export const getApiUrl = (endpoint: string): string => {
  const cleanedBase = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const cleanedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${cleanedBase}${cleanedEndpoint}`;
};