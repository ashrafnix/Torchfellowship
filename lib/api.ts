// API URL helper — in Next.js, all API routes are relative paths
// This replaces src/config/api.ts — no separate server URL needed

export const getApiUrl = (endpoint: string): string => {
  // In Next.js, API routes are served from the same origin
  const cleanedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return cleanedEndpoint;
};
