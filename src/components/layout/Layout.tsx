

import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Outlet } = ReactRouterDOM as any;
import Header from './Header';
import Footer from './Footer';
import AIAssistant from '../ui/AIAssistant';

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-brand-dark">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <AIAssistant />
        </div>
    );
};

export default Layout;