'use client';

import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '@/contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          style={
            {
              '--toastify-color-progress-dark': '#E0B841',
              '--toastify-color-dark': '#141417',
              '--toastify-text-color-dark': '#EAEAEA',
              '--toastify-icon-color-success': '#4ade80',
              '--toastify-icon-color-error': '#f87171',
            } as React.CSSProperties
          }
        />
      </QueryClientProvider>
    </AuthProvider>
  );
}
