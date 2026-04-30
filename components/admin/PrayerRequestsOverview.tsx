'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Spinner from '../ui/Spinner';
import { ICONS } from '@/src/constants';
import Link from 'next/link';

interface PrayerTrendData {
  date: string;
  requests: number;
  answered: number;
}

interface PrayerStats {
  trends: PrayerTrendData[];
  totalRequests: number;
  answeredRequests: number;
  pendingRequests: number;
  todayRequests: number;
}

const PrayerRequestsOverview: React.FC = () => {
  const { apiClient } = useApi();
  const router = useRouter();

  const { data: prayerStats, isLoading, error } = useQuery<PrayerStats>({
    queryKey: ['prayerStats'],
    queryFn: () => apiClient('/api/admin/prayer-stats', 'GET'),
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
    staleTime: 15000, // Consider data stale after 15 seconds
    retry: 1,
  });

  // Fallback data when API is not available
  const fallbackStats = {
    trends: [
      { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], requests: 8, answered: 5 },
      { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], requests: 12, answered: 8 },
      { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], requests: 6, answered: 4 },
      { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], requests: 15, answered: 12 },
      { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], requests: 9, answered: 7 },
      { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], requests: 11, answered: 9 },
      { date: new Date().toISOString().split('T')[0], requests: 7, answered: 3 }
    ],
    totalRequests: 68,
    answeredRequests: 48,
    pendingRequests: 20,
    todayRequests: 7
  };

  const statsToUse = error ? fallbackStats : (prayerStats || fallbackStats);

  if (isLoading) {
    return (
      <div className="dashboard-card rounded-2xl p-6">
        <div className="flex justify-center items-center h-48">
          <Spinner />
        </div>
      </div>
    );
  }

  const { trends = [], totalRequests = 0, answeredRequests = 0, pendingRequests = 0, todayRequests = 0 } = statsToUse;

  const answerRate = totalRequests > 0 ? (answeredRequests / totalRequests) * 100 : 0;

  return (
    <div 
      className="dashboard-card rounded-2xl p-6 cursor-pointer group hover:border-pink-500/40 transition-all"
      onClick={() => router.push('/admin/prayers')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-white group-hover:text-pink-400 transition-colors">
            Prayer Requests
          </h3>
          {!error && prayerStats && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></div>
              Live
            </span>
          )}
          {error && <span className="text-xs text-yellow-400">(Demo Mode)</span>}
          <ICONS.Send className="inline h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex items-center space-x-1 text-brand-gold group-hover:text-pink-400 transition-colors">
          <ICONS.Heart className="h-4 w-4" />
          <span className="text-sm font-medium">{totalRequests} Total</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-lg border border-pink-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <ICONS.Heart className="h-4 w-4 text-pink-400" />
            <span className="text-sm font-medium text-white">Today</span>
          </div>
          <p className="text-2xl font-bold text-pink-400">+{todayRequests}</p>
          <p className="text-xs text-gray-400">New requests</p>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <ICONS.CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-white">Answered</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{answeredRequests}</p>
          <p className="text-xs text-gray-400">{answerRate.toFixed(1)}% rate</p>
        </div>
      </div>

      {/* Trend Chart */}
      {trends.length > 0 ? (
        <div className="h-32 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="prayerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="answeredGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255, 255, 255, 0.7)" 
                fontSize={10}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="rgba(255, 255, 255, 0.7)" fontSize={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 41, 59, 0.95)',
                  borderColor: 'rgba(236, 72, 153, 0.5)',
                  borderRadius: '8px',
                }}
                formatter={(value: any, name: any) => [
                  value,
                  name === 'requests' ? 'New Requests' : 'Answered'
                ]}
                labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              />
              <Area 
                type="monotone" 
                dataKey="requests" 
                stackId="1"
                stroke="#ec4899" 
                fillOpacity={1} 
                fill="url(#prayerGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="answered" 
                stackId="2"
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#answeredGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-8">
          <ICONS.Heart className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No prayer data available</p>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Prayer Impact</span>
          <span>{pendingRequests} pending</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-pink-500 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${answerRate}%` }}
          ></div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-pink-500 rounded-sm"></div>
          <span className="text-sm text-gray-400">Requests</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <span className="text-sm text-gray-400">Answered</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-white/10">
        <div className="w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
          {pendingRequests > 0 ? `Review ${pendingRequests} Pending Prayers` : 'Manage Prayer Wall'} →
        </div>
      </div>
    </div>
  );
};

export default PrayerRequestsOverview;