'use client'

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ICONS } from '@/src/constants';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import Spinner from '../ui/Spinner';

interface CampusApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface CampusProgressProps {
  pending: number;
  total: number;
}

const CampusProgress: React.FC<CampusProgressProps> = ({ pending: fallbackPending, total: fallbackTotal }) => {
  const { apiClient } = useApi();
  
  // Real-time stats query with auto-refresh
  const { data: realTimeStats, isLoading, error } = useQuery<{ campusApplications: CampusApplicationStats }>({
    queryKey: ['campusApplicationsStats'],
    queryFn: () => apiClient('/api/admin/stats', 'GET'),
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
    retry: 1,
    select: (data) => ({ campusApplications: data.campusApplications }) // Only select what we need
  });
  
  // Use real-time data if available, otherwise fall back to props
  const stats = realTimeStats?.campusApplications || {
    total: fallbackTotal,
    pending: fallbackPending,
    approved: fallbackTotal - fallbackPending,
    rejected: 0
  };
  
  const { total, pending, approved, rejected } = stats;
  const approvalRate = total > 0 ? (approved / total) * 100 : 0;
  const rejectionRate = total > 0 ? (rejected / total) * 100 : 0;

  const data = [
    { name: 'Approved', value: approved, color: '#10b981' },
    { name: 'Pending', value: pending, color: '#f59e0b' },
    { name: 'Rejected', value: rejected, color: '#ef4444' },
  ].filter(item => item.value > 0); // Only show non-zero values

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent === 0) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Loading state for real-time updates
  if (isLoading && !realTimeStats) {
    return (
      <div className="dashboard-card rounded-2xl p-6">
        <div className="flex items-center justify-center h-48">
          <Spinner size="md" />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-white">Campus Applications</h3>
          {!error && realTimeStats && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></div>
              Live
            </span>
          )}
          {error && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full">
              Cached
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1 text-brand-gold">
          <ICONS.Home className="h-4 w-4" />
          <span className="text-sm font-medium">{total} Total</span>
        </div>
      </div>
      
      {total === 0 ? (
        <div className="text-center py-8">
          <ICONS.Home className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No campus applications yet</p>
        </div>
      ) : (
        <>
          {/* Donut Chart */}
          <div className="relative">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={60}
                  innerRadius={35}
                  fill="#8884d8"
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{approved}</span>
              <span className="text-xs text-gray-400">Approved</span>
            </div>
          </div>
          
          {/* Metrics */}
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-white">Approved</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-green-400">{approved}</span>
                <p className="text-xs text-gray-400">{approvalRate.toFixed(1)}% rate</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-white">Pending Review</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-yellow-400">{pending}</span>
                <p className="text-xs text-gray-400">Awaiting action</p>
              </div>
            </div>
            
            {rejected > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-white">Rejected</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-red-400">{rejected}</span>
                  <p className="text-xs text-gray-400">{rejectionRate.toFixed(1)}% rate</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Approval Progress</span>
              <span>{approvalRate.toFixed(1)}% approved</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-green-500 to-green-400 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${approvalRate}%` }}
              ></div>
            </div>
            
            {/* Additional Stats */}
            <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
              <div className="text-center p-2 bg-white/5 rounded">
                <div className="font-bold text-white">{pending + approved}</div>
                <div className="text-gray-400">Processed</div>
              </div>
              <div className="text-center p-2 bg-white/5 rounded">
                <div className="font-bold text-white">{total > 0 ? Math.round((pending / total) * 100) : 0}%</div>
                <div className="text-gray-400">Pending</div>
              </div>
              <div className="text-center p-2 bg-white/5 rounded">
                <div className="font-bold text-white">{total - pending}</div>
                <div className="text-gray-400">Decided</div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Action Button */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <button className="w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
          {pending > 0 ? `Review ${pending} Pending Applications` : 'Manage Campuses'} →
        </button>
      </div>
    </div>
  );
};

export default CampusProgress;