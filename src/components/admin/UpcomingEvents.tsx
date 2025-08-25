import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import Spinner from '../ui/Spinner';
import { ICONS } from '../../constants';
import { Event } from '../../types';

const UpcomingEvents: React.FC = () => {
  const { apiClient } = useApi();

  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ['upcomingEvents'],
    queryFn: () => apiClient('/api/events?limit=3&upcoming=true', 'GET'),
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
    staleTime: 15000, // Consider data stale after 15 seconds
    retry: 1,
  });

  // Fallback data when API is not available
  const fallbackEvents: Event[] = [
    {
      _id: 'demo1',
      title: 'Sunday Worship Service',
      location: 'Main Sanctuary',
      event_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
      event_time: '10:00',
      description: 'Weekly worship and fellowship',
      registration_required: false,
      created_at: new Date().toISOString()
    },
    {
      _id: 'demo2',
      title: 'Bible Study Group',
      location: 'Conference Room A',
      event_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 days from now
      event_time: '19:00',
      description: 'Weekly Bible study and discussion',
      registration_required: true,
      created_at: new Date().toISOString()
    },
    {
      _id: 'demo3',
      title: 'Youth Fellowship',
      location: 'Youth Hall',
      event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      event_time: '18:30',
      description: 'Monthly youth gathering',
      registration_required: false,
      created_at: new Date().toISOString()
    }
  ];

  const eventsToShow = error ? fallbackEvents : (events || []);

  const getDaysUntil = (dateString: string): number => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatEventDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="dashboard-card rounded-2xl p-6">
        <div className="flex justify-center items-center h-48">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-white">
            Upcoming Events
          </h3>
          {!error && events && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></div>
              Live
            </span>
          )}
          {error && <span className="text-xs text-yellow-400">(Demo Mode)</span>}
        </div>
        <div className="flex items-center space-x-1 text-brand-gold">
          <ICONS.Calendar className="h-4 w-4" />
          <span className="text-sm font-medium">{eventsToShow?.length || 0} Events</span>
        </div>
      </div>
      
      {!eventsToShow || eventsToShow.length === 0 ? (
        <div className="text-center py-8">
          <ICONS.Calendar className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No upcoming events scheduled</p>
        </div>
      ) : (
        <div className="space-y-4">
          {eventsToShow.map((event, index) => {
            const daysUntil = getDaysUntil(event.event_date);
            const isToday = daysUntil === 0;
            const isTomorrow = daysUntil === 1;
            
            return (
              <div key={event._id} className={`relative p-4 rounded-xl border transition-all hover:scale-[1.02] ${
                index === 0 
                  ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}>
                {/* Priority indicator for next event */}
                {index === 0 && (
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Next
                  </div>
                )}
                
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${
                      isToday ? 'bg-green-500/20' : 
                      isTomorrow ? 'bg-yellow-500/20' : 
                      'bg-blue-500/20'
                    }`}>
                      <ICONS.Calendar className={`h-5 w-5 ${
                        isToday ? 'text-green-400' : 
                        isTomorrow ? 'text-yellow-400' : 
                        'text-blue-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate mb-1">
                        {event.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <ICONS.MapPin className="h-3 w-3" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        {event.event_time && (
                          <div className="flex items-center space-x-1">
                            <ICONS.Clock className="h-3 w-3" />
                            <span>{event.event_time}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatEventDate(event.event_date)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Days until indicator */}
                  <div className="text-right ml-2">
                    {isToday ? (
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Today
                      </div>
                    ) : isTomorrow ? (
                      <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Tomorrow
                      </div>
                    ) : daysUntil > 0 ? (
                      <div className="text-white text-sm font-medium">
                        <span className="text-lg">{daysUntil}</span>
                        <p className="text-xs text-gray-400">days</p>
                      </div>
                    ) : (
                      <div className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full font-medium">
                        Past
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* View all link */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <button className="w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
          View All Events →
        </button>
      </div>
    </div>
  );
};

export default UpcomingEvents;