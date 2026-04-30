import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Torch Fellowship',
  description: 'A community of faith, love, and purpose — Torch Fellowship Church',
  keywords: ['church', 'fellowship', 'faith', 'torch fellowship', 'Christianity'],
  openGraph: {
    title: 'Torch Fellowship',
    description: 'A community of faith, love, and purpose',
    type: 'website',
  },
};

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-brand-dark text-brand-text font-sans antialiased min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
