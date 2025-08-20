import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Spinner from '../ui/Spinner';

interface UserGrowthData {
  date: string;
  count: number;
}

const UserGrowthChart: React.FC = () => {
  const { apiClient } = useApi();

  const { data: userGrowthData, isLoading } = useQuery<UserGrowthData[]>({
    queryKey: ['userGrowth'],
    queryFn: () => apiClient('/api/admin/user-growth', 'GET'),
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  return (
    <div className="dashboard-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">User Growth (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={userGrowthData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.7)" />
          <YAxis stroke="rgba(255, 255, 255, 0.7)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
            }}
          />
          <Legend wrapperStyle={{ color: '#fff' }} />
          <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserGrowthChart;