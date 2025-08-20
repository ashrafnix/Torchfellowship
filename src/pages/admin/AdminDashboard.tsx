import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { ICONS } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../../components/ui/Spinner';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import UserGrowthChart from '../../components/admin/UserGrowthChart';
import UpcomingEvents from '../../components/admin/UpcomingEvents';
import CampusProgress from '../../components/admin/CampusProgress';

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
    { name: 'Leaders', value: stats.leaders, icon: <ICONS.Shield className="h-8 w-8 text-brand-gold" /> },
    { name: 'Blog Posts', value: stats.blogPosts, icon: <ICONS.FileText className="h-8 w-8 text-brand-gold" /> },
    { name: 'Teachings', value: stats.teachings, icon: <ICONS.BookOpen className="h-8 w-8 text-brand-gold" /> },
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
    { name: 'Manage New Converts', path: '/admin/new-converts', icon: <ICONS.Users className="h-10 w-10 text-brand-text-dark group-hover:text-brand-gold transition-colors" /> },
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>
  }

  const secondaryStats = statItems;

  return (
    <div className="space-y-12">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
        
        .dashboard-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease-in-out;
        }
        
        .dashboard-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 255, 255, 0.2);
        }
        
        .primary-card {
          background: linear-gradient(135deg, rgba(106, 141, 255, 0.1), rgba(150, 80, 255, 0.05));
          border: 1px solid rgba(106, 141, 255, 0.2);
        }
      `}</style>
      
      {/* Primary Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserGrowthChart />
        </div>
        <div className="space-y-6">
          <UpcomingEvents />
          <CampusProgress pending={stats.campusApplications} total={stats.campusApplications + stats.lightCampuses} />
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {secondaryStats.map(stat => (
          <div key={stat.name} className="dashboard-card rounded-xl p-4 flex flex-col items-center text-center space-y-3">
            <div className="p-2 rounded-lg bg-white/5">
              {React.cloneElement(stat.icon, { className: 'h-5 w-5 text-gray-400' })}
            </div>
            <div>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.name}</p>
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
            <Link key={link.name} to={link.path} className="dashboard-card group rounded-xl p-6 text-center hover:scale-105 flex flex-col items-center justify-center space-y-4">
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