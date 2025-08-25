import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Spinner from '../ui/Spinner';
import { ICONS } from '../../constants';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate } = ReactRouterDOM as any;

interface MinistryTeamData {
  name: string;
  volunteers: number;
  pending: number;
  active: boolean;
}

interface MinistryStats {
  teams: MinistryTeamData[];
  totalTeams: number;
  totalVolunteers: number;
  pendingApplications: number;
}

const MinistryTeamsOverview: React.FC = () => {
  const { apiClient } = useApi();
  const navigate = useNavigate();

  const { data: ministryStats, isLoading, error } = useQuery<MinistryStats>({
    queryKey: ['ministryStats'],
    queryFn: () => apiClient('/api/admin/ministry-stats', 'GET'),
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
    staleTime: 15000, // Consider data stale after 15 seconds
    retry: 1,
  });

  // Fallback data when API is not available
  const fallbackStats = {
    teams: [
      { name: 'Worship', volunteers: 12, pending: 2, active: true },
      { name: 'Youth', volunteers: 8, pending: 1, active: true },
      { name: 'Children', volunteers: 6, pending: 0, active: true },
      { name: 'Outreach', volunteers: 10, pending: 3, active: true }
    ],
    totalTeams: 4,
    totalVolunteers: 36,
    pendingApplications: 6
  };

  const statsToUse = error ? fallbackStats : (ministryStats || fallbackStats);

  if (isLoading) {
    return (
      <div className="dashboard-card rounded-2xl p-6">
        <div className="flex justify-center items-center h-48">
          <Spinner />
        </div>
      </div>
    );
  }

  const { teams = [], totalTeams = 0, totalVolunteers = 0, pendingApplications = 0 } = statsToUse;

  return (
    <div 
      className="dashboard-card rounded-2xl p-6 cursor-pointer group hover:border-blue-500/40 transition-all"
      onClick={() => navigate('/admin/serve')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
            Ministry Teams
          </h3>
          {!error && ministryStats && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></div>
              Live
            </span>
          )}
          {error && <span className="text-xs text-yellow-400">(Demo Mode)</span>}
          <ICONS.Send className="inline h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex items-center space-x-1 text-brand-gold group-hover:text-blue-400 transition-colors">
          <ICONS.HeartHandshake className="h-4 w-4" />
          <span className="text-sm font-medium">{totalTeams} Teams</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <p className="text-2xl font-bold text-blue-400">{totalVolunteers}</p>
          <p className="text-xs text-gray-400">Volunteers</p>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <p className="text-2xl font-bold text-green-400">{totalTeams}</p>
          <p className="text-xs text-gray-400">Active Teams</p>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <p className="text-2xl font-bold text-yellow-400">{pendingApplications}</p>
          <p className="text-xs text-gray-400">Pending</p>
        </div>
      </div>

      {/* Chart */}
      {teams.length > 0 ? (
        <div className="h-32 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teams} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255, 255, 255, 0.7)" 
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={40}
              />
              <YAxis stroke="rgba(255, 255, 255, 0.7)" fontSize={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 41, 59, 0.95)',
                  borderColor: 'rgba(99, 102, 241, 0.5)',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => [
                  value,
                  name === 'volunteers' ? 'Volunteers' : 'Pending'
                ]}
              />
              <Bar dataKey="volunteers" fill="#6366f1" radius={[2, 2, 0, 0]} />
              <Bar dataKey="pending" fill="#f59e0b" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-8">
          <ICONS.HeartHandshake className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No ministry teams found</p>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>
          <span className="text-sm text-gray-400">Volunteers</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
          <span className="text-sm text-gray-400">Pending</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-white/10">
        <div className="w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
          {pendingApplications > 0 ? `Review ${pendingApplications} Applications` : 'Manage Teams'} →
        </div>
      </div>
    </div>
  );
};

export default MinistryTeamsOverview;