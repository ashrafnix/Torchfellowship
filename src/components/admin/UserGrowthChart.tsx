import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Spinner from '../ui/Spinner';
import { ICONS } from '../../constants';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate } = ReactRouterDOM as any;

interface UserGrowthData {
  date: string;
  count: number;
  newUsers: number;
}

interface UserGrowthStats {
  data: UserGrowthData[];
  totalUsers: number;
  growthPercentage: number;
  newUsersToday: number;
}

const UserGrowthChart: React.FC = () => {
  const { apiClient } = useApi();
  const navigate = useNavigate();

  const { data: userGrowthStats, isLoading, error } = useQuery<UserGrowthStats>({
    queryKey: ['userGrowth'],
    queryFn: () => apiClient('/api/admin/user-growth', 'GET'),
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
    staleTime: 15000, // Consider data stale after 15 seconds
    retry: 1,
  });

  // Fallback data when API is not available
  const fallbackStats = {
    data: [
      { date: new Date().toISOString().split('T')[0], count: 0, newUsers: 0 }
    ],
    totalUsers: 0,
    growthPercentage: 0,
    newUsersToday: 0
  };

  const statsToUse = error ? fallbackStats : (userGrowthStats || fallbackStats);

  if (isLoading) {
    return (
      <div className="dashboard-card rounded-2xl p-6">
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </div>
    );
  }

  const { data, totalUsers = 0, growthPercentage = 0, newUsersToday = 0 } = statsToUse;

  const isPositiveGrowth = growthPercentage >= 0;

  return (
    <div 
      className="dashboard-card rounded-2xl p-6 primary-card cursor-pointer group hover:border-blue-500/40 transition-all"
      onClick={() => navigate('/admin/users')}
    >
      {/* Header with stats */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
            User Growth 
            {!error && userGrowthStats && (
              <span className="inline-flex items-center ml-2 px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                Live
              </span>
            )}
            {error && <span className="text-xs text-yellow-400">(Demo Mode)</span>}
            <ICONS.Send className="inline h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <div className="flex items-center space-x-6">
            <div>
              <p className="text-3xl font-bold text-white">{totalUsers.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Total Users</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`p-1 rounded-full ${
                isPositiveGrowth ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {isPositiveGrowth ? (
                  <ICONS.TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <ICONS.TrendingDown className="h-4 w-4 text-red-400" />
                )}
              </div>
              <div>
                <p className={`text-lg font-semibold ${
                  isPositiveGrowth ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isPositiveGrowth ? '+' : ''}{growthPercentage.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-400">vs last 30 days</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-blue-400">+{newUsersToday}</p>
          <p className="text-sm text-gray-400">New Today</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255, 255, 255, 0.7)" 
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis stroke="rgba(255, 255, 255, 0.7)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                borderColor: 'rgba(99, 102, 241, 0.5)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number, name: string) => [
                name === 'count' ? `${value} Total` : `+${value} New`,
                name === 'count' ? 'Total Users' : 'New Users'
              ]}
              labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#6366f1" 
              strokeWidth={3}
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2, fill: '#fff' }}
              fillOpacity={1}
              fill="url(#userGrowthGradient)"
            />
            <Line 
              type="monotone" 
              dataKey="newUsers" 
              stroke="#10b981" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#10b981', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
          <span className="text-sm text-gray-400">Total Users</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 border-2 border-green-500 border-dashed rounded-full"></div>
          <span className="text-sm text-gray-400">Daily New Users</span>
        </div>
      </div>
    </div>
  );
};

export default UserGrowthChart;