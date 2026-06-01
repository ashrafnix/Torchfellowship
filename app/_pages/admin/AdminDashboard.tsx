'use client'

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ICONS } from '@/src/constants';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/ui/Spinner';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';

interface AdminStats {
  totalUsers: number;
  totalTeachings: number;
  totalEvents: number;
  totalPrayerRequests: number;
  totalTestimonies: number;
  totalBlogPosts: number;
  totalMinistryTeams: number;
  totalVolunteers: number;
  totalCampuses: number;
  totalContactMessages: number;
  totalLeaders: number;
  campusApplications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { apiClient } = useApi();
  const router = useRouter();

  const { data: apiResponse, isLoading, error } = useQuery<{ stats: AdminStats; recentUsers: any[] }>({
    queryKey: ['adminStats'],
    queryFn: async () => apiClient('/api/admin/stats', 'GET'),
    refetchInterval: 30000,
    staleTime: 15000,
    retry: 1,
  });

  const stats = apiResponse?.stats;
  const recentUsers = apiResponse?.recentUsers || [];

  // Primary KPI stat items: full real data from API
  const kpiStats = [
    {
      name: 'Members',
      value: stats?.totalUsers ?? 0,
      icon: ICONS.Users,
      color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20',
      iconColor: 'text-blue-400',
      path: '/admin/users',
    },
    {
      name: 'Blog Posts',
      value: stats?.totalBlogPosts ?? 0,
      icon: ICONS.FileText,
      color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20',
      iconColor: 'text-purple-400',
      path: '/admin/blog',
    },
    {
      name: 'Prayer Requests',
      value: stats?.totalPrayerRequests ?? 0,
      icon: ICONS.Heart,
      color: 'from-red-500/20 to-red-600/10 border-red-500/20',
      iconColor: 'text-red-400',
      path: '/admin/prayers',
    },
    {
      name: 'Teachings',
      value: stats?.totalTeachings ?? 0,
      icon: ICONS.BookOpen,
      color: 'from-teal-500/20 to-teal-600/10 border-teal-500/20',
      iconColor: 'text-teal-400',
      path: '/admin/teachings',
    },
    {
      name: 'Events',
      value: stats?.totalEvents ?? 0,
      icon: ICONS.Calendar,
      color: 'from-green-500/20 to-green-600/10 border-green-500/20',
      iconColor: 'text-green-400',
      path: '/admin/events',
    },
    {
      name: 'Testimonies',
      value: stats?.totalTestimonies ?? 0,
      icon: ICONS.Quote,
      color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20',
      iconColor: 'text-yellow-400',
      path: '/admin/testimonies',
    },
    {
      name: 'Ministry Teams',
      value: stats?.totalMinistryTeams ?? 0,
      icon: ICONS.HeartHandshake,
      color: 'from-orange-500/20 to-orange-600/10 border-orange-500/20',
      iconColor: 'text-orange-400',
      path: '/admin/serve',
    },
    {
      name: 'Light Campuses',
      value: stats?.totalCampuses ?? 0,
      icon: ICONS.Home,
      color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/20',
      iconColor: 'text-indigo-400',
      path: '/admin/campuses',
    },
    {
      name: 'Volunteer Apps',
      value: stats?.totalVolunteers ?? 0,
      icon: ICONS.UserPlus,
      color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20',
      iconColor: 'text-cyan-400',
      path: '/admin/serve',
    },
    {
      name: 'Leaders',
      value: stats?.totalLeaders ?? 0,
      icon: ICONS.Shield,
      color: 'from-amber-500/20 to-amber-600/10 border-amber-500/20',
      iconColor: 'text-amber-400',
      path: '/admin/leaders',
    },
    {
      name: 'Contact Messages',
      value: stats?.totalContactMessages ?? 0,
      icon: ICONS.MessageSquare,
      color: 'from-rose-500/20 to-rose-600/10 border-rose-500/20',
      iconColor: 'text-rose-400',
      path: '/admin/content',
    },
    {
      name: 'Campus Applications',
      value: stats?.campusApplications?.total ?? 0,
      icon: ICONS.MapPin,
      color: 'from-violet-500/20 to-violet-600/10 border-violet-500/20',
      iconColor: 'text-violet-400',
      path: '/admin/campuses',
      badge: stats?.campusApplications?.pending
        ? `${stats.campusApplications.pending} pending`
        : null,
    },
  ];

  const managementLinks = [
    { name: 'Users', path: '/admin/users', icon: ICONS.Users, color: 'text-blue-400', bg: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/10' },
    { name: 'Leaders', path: '/admin/leaders', icon: ICONS.Shield, color: 'text-amber-400', bg: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/10' },
    { name: 'Campuses', path: '/admin/campuses', icon: ICONS.Home, color: 'text-indigo-400', bg: 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/10' },
    { name: 'Blog', path: '/admin/blog', icon: ICONS.FileText, color: 'text-purple-400', bg: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/10' },
    { name: 'Teachings', path: '/admin/teachings', icon: ICONS.BookOpen, color: 'text-teal-400', bg: 'bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/10' },
    { name: 'Events', path: '/admin/events', icon: ICONS.Calendar, color: 'text-green-400', bg: 'bg-green-500/10 hover:bg-green-500/20 border-green-500/10' },
    { name: 'Prayers', path: '/admin/prayers', icon: ICONS.Heart, color: 'text-red-400', bg: 'bg-red-500/10 hover:bg-red-500/20 border-red-500/10' },
    { name: 'Testimonies', path: '/admin/testimonies', icon: ICONS.Quote, color: 'text-yellow-400', bg: 'bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/10' },
    { name: 'Ministries', path: '/admin/serve', icon: ICONS.HeartHandshake, color: 'text-orange-400', bg: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/10' },
    { name: 'Torch Kids', path: '/admin/torch-kids', icon: ICONS.Child, color: 'text-pink-400', bg: 'bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/10' },
    { name: 'Content', path: '/admin/content', icon: ICONS.Settings, color: 'text-gray-400', bg: 'bg-gray-500/10 hover:bg-gray-500/20 border-gray-500/10' },
    { name: 'Admin Chat', path: '/chat', icon: ICONS.MessageSquare, color: 'text-cyan-400', bg: 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/10' },
    { name: 'New Converts', path: '/admin/new-converts', icon: ICONS.Smile, color: 'text-lime-400', bg: 'bg-lime-500/10 hover:bg-lime-500/20 border-lime-500/10' },
    { name: 'Tuesday Fellowship', path: '/admin/tuesday-fellowship', icon: ICONS.Flame, color: 'text-orange-400', bg: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/10' },
  ];

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    : null;

  const pendingApplications = stats?.campusApplications?.pending ?? 0;

  return (
    <div className="space-y-8 pb-8">
      {/* ─── TOP STATUS BAR ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-wide">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Welcome back, <span className="text-orange-400 font-semibold">{user?.fullName || user?.email}</span>
            {joinDate && <span className="ml-1 text-gray-500">· Member since {joinDate}</span>}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Real-time indicator */}
          {!error ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live Data
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              Cached
            </div>
          )}

          {/* Pending campus applications alert */}
          {pendingApplications > 0 && (
            <Link
              href="/admin/campuses"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full text-xs font-bold tracking-wider uppercase hover:bg-orange-500/20 transition-colors"
            >
              <ICONS.AlertCircle className="w-3 h-3" />
              {pendingApplications} Pending {pendingApplications === 1 ? 'App' : 'Apps'}
            </Link>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-bold tracking-wider uppercase hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <ICONS.LogOut className="w-3 h-3" />
            Logout
          </button>
        </div>
      </div>

      {/* ─── LOADING STATE ─── */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Spinner />
          <p className="text-gray-400 text-sm font-medium tracking-wide">Fetching live database metrics...</p>
        </div>
      )}

      {!isLoading && (
        <>
          {/* ─── KPI STATS GRID ─── */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-yellow-500 rounded-full" />
              <h2 className="text-lg font-bold text-white tracking-wide">Database Overview</h2>
              <span className="text-xs text-gray-500 font-medium">— live from Firestore</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
              {kpiStats.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.path)}
                    className={`relative group flex flex-col items-start text-left p-4 rounded-2xl bg-gradient-to-br border backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_25px_rgba(0,0,0,0.4)] cursor-pointer ${item.color}`}
                  >
                    {/* Live pulse dot */}
                    {!error && (
                      <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    )}

                    {/* Badge for pending alerts */}
                    {'badge' in item && item.badge && (
                      <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 bg-orange-500 text-white text-[9px] font-black rounded-full tracking-wider uppercase leading-none">
                        {item.badge}
                      </span>
                    )}

                    <div className={`p-2 rounded-xl bg-white/5 mb-3 ${item.iconColor}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className={`text-2xl sm:text-3xl font-black tabular-nums ${item.iconColor}`}>
                      {item.value.toLocaleString()}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5 leading-tight">
                      {item.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ─── CAMPUS APPLICATIONS BREAKDOWN ─── */}
          {(stats?.campusApplications?.total ?? 0) > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                <h2 className="text-lg font-bold text-white tracking-wide">Campus Application Breakdown</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/10 rounded-xl">
                    <ICONS.Clock className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-yellow-400 tabular-nums">{stats?.campusApplications?.pending ?? 0}</p>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Pending Review</p>
                  </div>
                  {(stats?.campusApplications?.pending ?? 0) > 0 && (
                    <Link href="/admin/campuses" className="ml-auto text-xs text-yellow-400 hover:underline font-bold">
                      Review →
                    </Link>
                  )}
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-xl">
                    <ICONS.CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-green-400 tabular-nums">{stats?.campusApplications?.approved ?? 0}</p>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Approved</p>
                  </div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex items-center gap-4">
                  <div className="p-3 bg-red-500/10 rounded-xl">
                    <ICONS.X className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-red-400 tabular-nums">{stats?.campusApplications?.rejected ?? 0}</p>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Rejected</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ─── RECENT MEMBERS ─── */}
          {recentUsers.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full" />
                  <h2 className="text-lg font-bold text-white tracking-wide">Recent Members</h2>
                </div>
                <Link
                  href="/admin/users"
                  className="text-xs text-orange-400 hover:text-orange-300 transition-colors font-bold tracking-wider uppercase"
                >
                  View All →
                </Link>
              </div>
              <div className="bg-brand-surface/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto admin-scroll">
                  <table className="w-full min-w-[480px]">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left py-3 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Member</th>
                        <th className="text-left py-3 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest hidden sm:table-cell">Email</th>
                        <th className="text-left py-3 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Role</th>
                        <th className="text-left py-3 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest hidden md:table-cell">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((u, idx) => {
                        const roleColor =
                          u.role === 'Super-Admin' ? 'bg-purple-500/15 text-purple-400 border-purple-500/25' :
                          u.role === 'Admin' ? 'bg-amber-500/15 text-amber-400 border-amber-500/25' :
                          'bg-teal-500/15 text-teal-400 border-teal-500/25';
                        return (
                          <tr key={u.id || idx} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={u.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName || u.email)}&background=2B2F36&color=EAEAEA&size=64`}
                                  alt={u.fullName || u.email}
                                  className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
                                />
                                <span className="text-sm font-semibold text-white truncate max-w-[120px]">
                                  {u.fullName || '—'}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 hidden sm:table-cell">
                              <span className="text-xs text-gray-400 truncate block max-w-[160px]">{u.email}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 text-[10px] font-black rounded-full border uppercase tracking-wider ${roleColor}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3 px-4 hidden md:table-cell">
                              <span className="text-xs text-gray-500">
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ─── MANAGEMENT CENTER ─── */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-yellow-500 rounded-full" />
              <h2 className="text-lg font-bold text-white tracking-wide">Management Center</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
              {managementLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    className={`group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border backdrop-blur-md transition-all duration-200 hover:scale-[1.05] hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)] cursor-pointer ${link.bg}`}
                  >
                    <div className={`p-2.5 rounded-xl bg-white/5 ${link.color} group-hover:bg-white/10 transition-colors`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-300 font-bold text-center leading-tight uppercase tracking-wide group-hover:text-white transition-colors">
                      {link.name}
                    </span>
                  </Link>
                );
              })}

              {/* Logout tile */}
              <button
                onClick={logout}
                className="group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-red-500/10 bg-red-500/10 hover:bg-red-500/20 backdrop-blur-md transition-all duration-200 hover:scale-[1.05] cursor-pointer"
              >
                <div className="p-2.5 rounded-xl bg-white/5 text-red-400 group-hover:bg-white/10 transition-colors">
                  <ICONS.LogOut className="h-5 w-5" />
                </div>
                <span className="text-[10px] sm:text-xs text-red-400 font-bold text-center leading-tight uppercase tracking-wide group-hover:text-red-300 transition-colors">
                  Logout
                </span>
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
