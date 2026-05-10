import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginPageClient from '@/app/_pages/LoginPage';

export const metadata: Metadata = {
  title: 'Sign In â€" Torch Fellowship',
  description: 'Sign in to your Torch Fellowship account.',
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageClient />
    </Suspense>
  );
}
