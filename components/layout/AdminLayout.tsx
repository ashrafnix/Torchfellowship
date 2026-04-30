'use client'




import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { ICONS } from '@/src/constants';
import Button from '../ui/Button';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const getTitle = () => {
        const path = pathname.split('/').pop() || 'dashboard';
        if (path === 'admin') return 'Admin Dashboard';
        if (path === 'serve') return 'Manage Ministries';
        // Simple pluralization for display
        const title = path.charAt(0).toUpperCase() + path.slice(1);
        return `Manage ${title.endsWith('s') ? title : title + 's'}`;
    };

    const isDashboard = pathname === '/admin';
    
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#101218] via-[#0f1115] to-[#101218] relative">
            <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            { !isDashboard &&
                              <button onClick={() => router.back()} className="text-sm text-brand-text-dark hover:text-white transition-colors">
                                &larr; Back to Dashboard
                              </button>
                            }
                        </div>
                        <Button
                            onClick={() => router.push('/')}
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 text-brand-text-dark hover:text-white"
                        >
                            <ICONS.Home className="h-4 w-4" />
                            Exit Admin
                        </Button>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">{getTitle()}</h1>
                    {isDashboard && <p className="text-brand-text-dark mt-2">Welcome back, Admin. Let's make things happen.</p>}
                </div>
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;