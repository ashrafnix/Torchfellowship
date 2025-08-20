import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import Spinner from '../ui/Spinner';
import { ICONS } from '../../constants';

interface Event {
  _id: string;
  name: string;
  date: string;
}

const UpcomingEvents: React.FC = () => {
  const { apiClient } = useApi();

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ['upcomingEvents'],
    queryFn: () => apiClient('/api/events?limit=3', 'GET'),
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-48"><Spinner /></div>;
  }

  return (
    <div className="dashboard-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Upcoming Events</h3>
      <ul className="space-y-4">
        {events?.map(event => (
          <li key={event._id} className="flex items-center space-x-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <ICONS.Calendar className="h-5 w-5 text-brand-gold" />
            </div>
            <div>
              <p className="font-semibold text-white">{event.name}</p>
              <p className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingEvents;