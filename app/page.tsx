import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Torch Fellowship — Home',
  description: 'Welcome to Torch Fellowship — a community of faith, love, and purpose.',
};

// Import the existing React component (copied from src/pages/HomePage.tsx)
import HomePageClient from '@/app/_pages/HomePage';
export default HomePageClient;
