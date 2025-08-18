import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { ICONS } from '../../constants.tsx';
import { useAuth } from '../../hooks/useAuth.ts';
import Spinner from '../../components/ui/Spinner.tsx';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi.ts';

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
  campusApplications: number;
}

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const { apiClient } = useApi();

  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ['adminStats'],
    queryFn: () => apiClient('/api/admin/stats', 'GET'),
    // Default empty stats object
    initialData: { users: 0, teachings: 0, events: 0, prayers: 0, leaders: 0, testimonies: 0, ministryTeams: 0, blogPosts: 0, lightCampuses: 0, campusApplications: 0 }
  });

  const statItems = [
    { name: 'Total Users', value: stats.users, icon: <ICONS.Users className="h-8 w-8 text-brand-gold" /> },
    { name: 'Leaders', value: stats.leaders, icon: <ICONS.Shield className="h-8 w-8 text-brand-gold" /> },
    { name: `Campuses (${stats.campusApplications} pending)`, value: stats.lightCampuses, icon: <ICONS.Home className="h-8 w-8 text-brand-gold" /> },
    { name: 'Blog Posts', value: stats.blogPosts, icon: <ICONS.FileText className="h-8 w-8 text-brand-gold" /> },
    { name: 'Teachings', value: stats.teachings, icon: <ICONS.BookOpen className="h-8 w-8 text-brand-gold" /> },
    { name: 'Events', value: stats.events, icon: <ICONS.Calendar className="h-8 w-8 text-brand-gold" /> },
    { name: 'Prayer Requests', value: stats.prayers, icon: <ICONS.Heart className="h-8 w-8 text-brand-gold" /> },
    { name: 'Testimonies', value: stats.testimonies, icon: <ICONS.Quote className="h-8 w-8 text-brand-gold" /> },
    { name: 'Ministry Teams', value: stats.ministryTeams, icon: <ICONS.HeartHandshake className="h-8 w-8 text-brand-gold" /> },
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
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>
  }

  return (
    <div className="space-y-12">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statItems.map(stat => (
          <div key={stat.name} className="bg-brand-surface rounded-lg p-6 flex items-center space-x-6 border border-brand-muted/50">
            <div className="bg-brand-muted p-4 rounded-full">{stat.icon}</div>
            <div>
              <p className="text-4xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-brand-text-dark">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Management Section */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-white mb-6">Management</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {managementLinks.map(link => (
            <Link key={link.name} to={link.path} className="group bg-brand-surface rounded-lg p-6 text-center hover:bg-brand-muted border border-brand-muted/50 hover:border-brand-gold/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-center space-y-3">
              {link.icon}
              <p className="font-semibold text-white">{link.name}</p>
            </Link>
          ))}
           <button onClick={logout} className="group bg-brand-surface rounded-lg p-6 text-center hover:bg-red-900/20 border border-brand-muted/50 hover:border-red-500/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-center space-y-3">
              <ICONS.LogOut className="h-10 w-10 text-brand-text-dark group-hover:text-red-500 transition-colors" />
              <p className="font-semibold text-white">Logout</p>
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;