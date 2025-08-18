


import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Outlet, useNavigate, useLocation } = ReactRouterDOM as any;
import Footer from './Footer';

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine the title based on the path
    const getTitle = () => {
        const path = location.pathname.split('/').pop() || 'dashboard';
        if (path === 'admin') return 'Admin Dashboard';
        if (path === 'serve') return 'Manage Ministries';
        // Simple pluralization for display
        const title = path.charAt(0).toUpperCase() + path.slice(1);
        return `Manage ${title.endsWith('s') ? title : title + 's'}`;
    };

    const isDashboard = location.pathname === '/admin';
    
    return (
        <div className="min-h-screen flex flex-col bg-brand-dark">
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    { !isDashboard &&
                      <button onClick={() => navigate(-1)} className="text-sm text-brand-text-dark hover:text-white mb-4 transition-colors">
                        &larr; Back to Dashboard
                      </button>
                    }
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">{getTitle()}</h1>
                    {isDashboard && <p className="text-brand-text-dark mt-2">Welcome back, Admin. Let's make things happen.</p>}
                </div>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default AdminLayout;