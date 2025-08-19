import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { HashRouter, Routes, Route } = ReactRouterDOM as any;
import { AuthProvider } from './contexts/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/query-core';
import { ToastContainer } from 'react-toastify';

import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

import HomePage from './pages/HomePage';
import GivePage from './pages/GivePage';
import ContactPage from './pages/ContactPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeachingsPage from './pages/TeachingsPage';
import EventsPage from './pages/EventsPage';
import AboutPage from './pages/AboutPage';
import LightCampusesPage from './pages/LightCampusesPage';
import ProfilePage from './pages/ProfilePage';
import PrayerPage from './pages/PrayerPage';
import LeadershipPage from './pages/LeadershipPage';
import LeadersPage from './pages/LeadersPage';
import TestimoniesPage from './pages/TestimoniesPage';
import MinistriesPage from './pages/MinistriesPage';
import ServePage from './pages/ServePage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import JoinUsPage from './pages/JoinUsPage';
import TorchKidsPage from './pages/TorchKidsPage';
import NewConvertsPage from './pages/NewConvertsPage';


import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageTeachings from './pages/admin/ManageTeachings';
import ManageEvents from './pages/admin/ManageEvents';
import ManagePrayers from './pages/admin/ManagePrayers';
import ManageContent from './pages/admin/ManageContent';
import ManageLeaders from './pages/admin/ManageLeaders';
import ManageTestimonies from './pages/admin/ManageTestimonies';
import ManageServe from './pages/admin/ManageServe';
import ManageBlog from './pages/admin/ManageBlog';
import ManageCampuses from './pages/admin/ManageCampuses';
import ManageTorchKids from './pages/admin/ManageTorchKids';
import ManageNewConverts from './pages/admin/ManageNewConverts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
            <ErrorBoundary>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                <Route element={<Layout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/teachings" element={<TeachingsPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/leadership" element={<LeadershipPage />} />
                  <Route path="/leaders" element={<LeadersPage />} />
                  <Route path="/prayer" element={<PrayerPage />} />
                  <Route path="/testimonies" element={<TestimoniesPage />} />
                  <Route path="/ministries" element={<MinistriesPage />} />
                  <Route path="/torch-kids" element={<TorchKidsPage />} />
                  <Route path="/serve" element={<ServePage />} />
                  <Route path="/give" element={<GivePage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/light-campuses" element={<LightCampusesPage />} />
                  <Route path="/blog" element={<BlogListPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/join-us" element={<JoinUsPage />} />
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                  <Route path="/new-converts" element={<NewConvertsPage />} />
                </Route>

                <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<ManageUsers />} />
                  <Route path="teachings" element={<ManageTeachings />} />
                  <Route path="events" element={<ManageEvents />} />
                  <Route path="leaders" element={<ManageLeaders />} />
                  <Route path="prayers" element={<ManagePrayers />} />
                  <Route path="testimonies" element={<ManageTestimonies />} />
                  <Route path="serve" element={<ManageServe />} />
                  <Route path="content" element={<ManageContent />} />
                  <Route path="blog" element={<ManageBlog />} />
                  <Route path="campuses" element={<ManageCampuses />} />
                  <Route path="torch-kids" element={<ManageTorchKids />} />
                  <Route path="new-converts" element={<ManageNewConverts />} />
                </Route>
                
              </Routes>
            </ErrorBoundary>
        </HashRouter>
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
          style={{
            '--toastify-color-progress-dark': '#E0B841',
            '--toastify-color-dark': '#141417',
            '--toastify-text-color-dark': '#EAEAEA',
            '--toastify-icon-color-success': '#4ade80',
            '--toastify-icon-color-error': '#f87171',
          } as React.CSSProperties}
        />
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;