

import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Outlet, useLocation } = ReactRouterDOM as any;
import Header from './Header';
import Footer from './Footer';
import AIAssistant from '../ui/AIAssistant';

const Layout: React.FC = () => {
    const location = useLocation();
    const hideFooter = location.pathname === '/chat' || location.pathname.startsWith('/admin');
    
    return (
        <div className="min-h-screen flex flex-col bg-brand-dark">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            {!hideFooter && <Footer />}
            <AIAssistant />
        </div>
    );
};

export default Layout;