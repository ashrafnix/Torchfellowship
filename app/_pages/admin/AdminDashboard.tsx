'use client'

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ICONS } from '@/src/constants';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/ui/Spinner';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import UserGrowthChart from '@/components/admin/UserGrowthChart';
import UpcomingEvents from '@/components/admin/UpcomingEvents';
import CampusProgress from '@/components/admin/CampusProgress';
import MinistryTeamsOverview from '@/components/admin/MinistryTeamsOverview';
import PrayerRequestsOverview from '@/components/admin/PrayerRequestsOverview';

interface AdminStats {
  users: number;
  teachings: number;
  events: number;
  prayers: number;
  leaders: number;
  testimonies: number;
  ministryTeams: number;
  blogPosts: number;
  lightCampuses: number;
  campusApplications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  trends?: {
    leaders: string;
    blogPosts: string;
    teachings: string;
    testimonies: string;
  };
}

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const { apiClient } = useApi();
  const router = useRouter();

  const { data: stats, isLoading, error } = useQuery<AdminStats>({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res: any = await apiClient('/api/admin/stats', 'GET');
      const data = res.stats || {};
      
      return {
        users: data.totalUsers || 0,
        teachings: data.totalTeachings || 0,
        events: data.totalEvents || 0,
        prayers: data.totalPrayerRequests || 0,
        leaders: 0,
        testimonies: data.totalTestimonies || 0,
        ministryTeams: data.totalMinistryTeams || 0,
        blogPosts: data.totalBlogPosts || 0,
        lightCampuses: data.totalCampuses || 0,
        campusApplications: {
          total: data.totalCampuses || 0,
          pending: 0,
          approved: 0,
          rejected: 0
        },
        trends: {
          leaders: 'No data',
          blogPosts: 'No data', 
          teachings: 'No data',
          testimonies: 'No data'
        }
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
    staleTime: 15000, // Consider data stale after 15 seconds
    retry: 1,
    // Default empty stats object
    initialData: { 
      users: 0, 
      teachings: 0, 
      events: 0, 
      prayers: 0, 
      leaders: 0, 
      testimonies: 0, 
      ministryTeams: 0, 
      blogPosts: 0, 
      lightCampuses: 0, 
      campusApplications: {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
      },
      trends: {
        leaders: 'No data',
        blogPosts: 'No data', 
        teachings: 'No data',
        testimonies: 'No data'
      }
    }
  });

  // Simplified stat items for the remaining cards with navigation paths
  const statItems = [
    { 
      name: 'Leaders', 
      value: stats.leaders, 
      icon: <ICONS.Shield className="h-8 w-8 text-brand-gold" />, 
      trend: stats.trends?.leaders || 'No data',
      path: '/admin/leaders'
    },
    { 
      name: 'Blog Posts', 
      value: stats.blogPosts, 
      icon: <ICONS.FileText className="h-8 w-8 text-brand-gold" />, 
      trend: stats.trends?.blogPosts || 'No data',
      path: '/admin/blog'
    },
    { 
      name: 'Teachings', 
      value: stats.teachings, 
      icon: <ICONS.BookOpen className="h-8 w-8 text-brand-gold" />, 
      trend: stats.trends?.teachings || 'No data',
      path: '/admin/teachings'
    },
    { 
      name: 'Testimonies', 
      value: stats.testimonies, 
      icon: <ICONS.Quote className="h-8 w-8 text-brand-gold" />, 
      trend: stats.trends?.testimonies || 'No data',
      path: '/admin/testimonies'
    },
  ];

  const managementLinks = [
    { name: 'Manage Users', path: '/admin/users', icon: <ICONS.Users className="h-10 w-10 text-brand-text-dark group-hover:text-brand-gold transition-colors" /> },
    { name: 'Manage Leaders', path: '/admin/leaders', icon: <ICONS.Shield className="h-10 w-10 text-brand-text-dark group-hover:text-brand-gold transition-colors" /> },
    { name: 'Manage Campuses', path: '/admin/campuses', icon: <ICONS.Home className="h-10 w-10 text-brand-text-dark group-hover:text-brand-gold transition-colors" /> },
    { name: 'Manage Blog', path: '/admin/blog', icon: <ICONS.FileText className="h-10 w-10 text-brand-text-dark group-hover:text-brand-gold transition-colors" /> },
    { name: 'Manage Teachings', path: '/admin/teachings', icon: <ICONS.BookOpen className="h-10 w-10 text-brand-text-dark group-hover:text-brand-gold transition-colors" /> },
    { name: 'Manage Events', path: '/admin/events', icon: <ICONS.Calendar className="h-10 w-10 text-brand-text-dark group-hover:text-brand-gold transition-colors" /> },
    { name: 'Manage Prayers', path: '/admin/prayers', icon: <ICONS.Heart className="h-10 w-10 text-brand-text-dark group-hover:text-brand-gold transition-colors" /> },
    { name: 'Manage Testimonies', path: '/admin/testimonies', icon: <ICONS.Quote className="h-10 w-10 text-brand-text-dark group-hover:text-brand-gold transition-colors" /> },
    { name: 'Manage Ministries', path: '/admin/serve', icon: <ICONS.HeartHandshake className="h-10 w-10 text-brand-text-dark group-hover:text-brand-gold transition-colors" /> },
    { name: 'Manage Torch Kids', path: '/admin/torch-kids', icon: <ICONS.Child className="h-10 w-10 text-brand-text-dark group-hover:text-brand-gold transition-colors" /> },
    { name: 'Manage Content', path: '/admin/content', icon: <ICONS.FileText className="h-10 w-10 text-brand-text-dark group-hover:text-brand-gold transition-colors" /> },
    { name: 'Admin Chat', path: '/chat', icon: <ICONS.MessageSquare className="h-10 w-10 text-brand-text-dark group-hover:text-brand-gold transition-colors" /> },
    { name: 'Manage New Converts', path: '/admin/new-converts', icon: <ICONS.Users className="h-10 w-10 text-brand-text-dark group-hover:text-brand-gold transition-colors" /> },
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>
  }

  const secondaryStats = statItems;

  return (
    <div className="space-y-12">
      {/* Primary Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserGrowthChart />
        </div>
        <div className="space-y-6">
          <UpcomingEvents />
          <CampusProgress pending={stats.campusApplications.pending} total={stats.campusApplications.total} />
        </div>
      </div>

      {/* Live Data Indicator */}
      {!error && stats && (
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Real-time Dashboard - Auto-refreshing every 30s
          </div>
        </div>
      )}
      {error && (
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
            Using cached data - Check connection
          </div>
        </div>
      )}

      {/* Secondary Rich Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MinistryTeamsOverview />
        <PrayerRequestsOverview />
      </div>

      {/* Compact Stat Cards for Supporting Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryStats.map(stat => (
          <div 
            key={stat.name} 
            className="dashboard-card rounded-xl p-4 flex flex-col space-y-3 hover:scale-105 transition-transform cursor-pointer group relative"
            onClick={() => router.push(stat.path)}
          >
            {/* Live indicator */}
            {!error && stats && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-blue-500/20 transition-colors">
                {React.cloneElement(stat.icon, { className: 'h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors' })}
              </div>
              <div className="text-xs text-green-400 font-medium">{stat.trend}</div>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400 group-hover:text-white transition-colors">{stat.name}</p>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1">
              <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-1 rounded-full transition-all group-hover:from-blue-500 group-hover:to-purple-600" style={{ width: '75%' }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Management Section */}
      <div>
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-white">Management Center</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {managementLinks.map(link => (
            <Link key={link.name} href={link.path} className="dashboard-card group rounded-xl p-6 text-center hover:scale-105 flex flex-col items-center justify-center space-y-4">
              <div className="p-3 rounded-xl bg-white/5 group-hover:bg-blue-500/20 transition-colors">
                {React.cloneElement(link.icon, { className: 'h-6 w-6 text-gray-400 group-hover:text-blue-400 transition-colors' })}
              </div>
              <p className="font-medium text-white text-sm">{link.name}</p>
            </Link>
          ))}
           <button onClick={logout} className="dashboard-card group rounded-xl p-6 text-center hover:scale-105 hover:border-red-500/30 flex flex-col items-center justify-center space-y-4">
              <div className="p-3 rounded-xl bg-white/5 group-hover:bg-red-500/20 transition-colors">
                <ICONS.LogOut className="h-6 w-6 text-gray-400 group-hover:text-red-400 transition-colors" />
              </div>
              <p className="font-medium text-white text-sm">Logout</p>
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
