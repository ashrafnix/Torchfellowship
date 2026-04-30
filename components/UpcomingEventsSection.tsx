'use client'

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import Spinner from './ui/Spinner';
import { Event } from '@/lib/types';
import { tuesdayFellowship } from '@/data/events';

interface EventCardProps {
  event: Event;
  priority?: 'featured' | 'standard';
}

const EventCard: React.FC<EventCardProps> = React.memo(({ event, priority = 'standard' }) => {
  const formatEventDate = (dateString: string): string => {
    if (dateString === 'recurring-tuesday') {
      return 'Every Tuesday';
    }
    
    const eventDate = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = eventDate.toDateString() === today.toDateString();
    const isTomorrow = eventDate.toDateString() === tomorrow.toDateString();
    
    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    
    return eventDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatEventTime = (timeString: string): string => {
    if (timeString.includes('-')) {
      return timeString; // Already formatted as range
    }
    
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minutes} ${period}`;
    } catch {
      return timeString; // Return original if parsing fails
    }
  };

  const truncateDescription = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const getDescriptionLength = (): number => {
    // Responsive description lengths
    return priority === 'featured' ? 150 : 120;
  };

  return (
    <div className={`bg-brand-surface rounded-lg shadow-2xl overflow-hidden h-fit transition-all duration-300 hover:scale-105 hover:shadow-3xl focus-within:ring-2 focus-within:ring-brand-gold/50 ${
      priority === 'featured' ? 'ring-2 ring-brand-gold/30' : ''
    }`}
         role="article"
         aria-labelledby={`event-title-${event.id}`}
         tabIndex={0}
    >
      {/* Event Image */}
      {event.image_base64 && (
        <div className="relative overflow-hidden">
          <img 
            src={event.image_base64} 
            alt={event.title}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          {priority === 'featured' && (
            <div className="absolute top-4 left-4 bg-brand-gold text-brand-dark px-3 py-1 rounded-full text-xs font-bold">
              Featured Event
            </div>
          )}
        </div>
      )}
      
      {/* Event Content */}
      <div className="p-6">
        <p className="text-sm text-brand-gold font-semibold">
          {event.registration_required ? 'Registration Required' : 'Upcoming Event'}
        </p>
        <h4 id={`event-title-${event.id}`} className="text-xl font-bold font-serif mt-2 line-clamp-2">{event.title}</h4>
        <p className="text-brand-text-dark mt-2 text-sm line-clamp-3" aria-describedby={`event-details-${event.id}`}>
          {truncateDescription(event.description, getDescriptionLength())}
        </p>
        
        {/* Event Details */}
        <div id={`event-details-${event.id}`} className="mt-4 space-y-2 text-sm" role="group" aria-label="Event details">
          <div className="flex items-center text-brand-text-dark" role="text">
            <span className="font-semibold text-brand-gold mr-2" aria-label="Event date">📅 Date:</span>
            <time dateTime={event.event_date === 'recurring-tuesday' ? undefined : event.event_date}>
              {formatEventDate(event.event_date)}
            </time>
          </div>
          <div className="flex items-center text-brand-text-dark" role="text">
            <span className="font-semibold text-brand-gold mr-2" aria-label="Event time">🕐 Time:</span>
            <time>{formatEventTime(event.event_time)}</time>
          </div>
          <div className="flex items-center text-brand-text-dark" role="text">
            <span className="font-semibold text-brand-gold mr-2" aria-label="Event location">📍 Location:</span>
            <address className="not-italic">{event.location}</address>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-6 flex justify-between items-center">
          <Link 
            href="/events" 
            className="text-brand-gold hover:underline font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold/50 rounded"
            aria-label={`Learn more about ${event.title}`}
          >
            Learn More →
          </Link>
          {event.registration_required && (
            <button 
              className="bg-brand-gold text-brand-dark px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-gold/90 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:ring-offset-2"
              aria-label={`Register for ${event.title}`}
              onClick={() => {
                // In a real implementation, this would open a registration modal or redirect
                window.alert('Registration functionality would be implemented here.');
              }}
            >
              Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

EventCard.displayName = 'EventCard';

const UpcomingEventsSection: React.FC = () => {
  const { apiClient } = useApi();

  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ['homepage-events'],
    queryFn: () => apiClient('/api/events?upcoming=true&limit=3', 'GET'),
    retry: 1,
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Fallback events when API is unavailable
  const getFallbackEvents = (): Event[] => {
    const now = new Date();
    const fallbackEvents: Event[] = [
      tuesdayFellowship, // Always include Tuesday Fellowship
      {
        id: 'demo-worship',
        created_at: new Date().toISOString(),
        title: 'Sunday Worship Service',
        location: 'Main Sanctuary',
        event_date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        event_time: '10:00',
        description: 'Join us for an inspiring morning of worship, prayer, and fellowship as we come together to celebrate and grow in faith.',
        registration_required: false,
        image_base64: 'https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755268391/worship-crowd_yhefqw.png'
      },
      {
        id: 'demo-bible-study',
        created_at: new Date().toISOString(),
        title: 'Bible Study Group',
        location: 'Conference Room A',
        event_date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        event_time: '19:00',
        description: 'Dive deep into Scripture with our weekly Bible study. All are welcome to join this enriching discussion and fellowship.',
        registration_required: true,
      }
    ];
    return fallbackEvents.slice(0, 3);
  };

  const eventsToShow = error ? getFallbackEvents() : (events || getFallbackEvents());
  const isInDemoMode = !!error;

  // Loading State
  if (isLoading) {
    return (
      <section aria-labelledby="upcoming-events-heading" role="region">
        <h3 id="upcoming-events-heading" className="text-2xl font-serif font-bold text-center mb-6 text-brand-gold">
          Upcoming Events
        </h3>
        <div className="flex justify-center items-center h-64" aria-live="polite">
          <Spinner size="lg" aria-label="Loading upcoming events" />
        </div>
      </section>
    );
  }

  // No Events State
  if (!eventsToShow || eventsToShow.length === 0) {
    return (
      <section aria-labelledby="upcoming-events-heading" role="region">
        <h3 id="upcoming-events-heading" className="text-2xl font-serif font-bold text-center mb-6 text-brand-gold">
          Upcoming Events
        </h3>
        <div className="bg-brand-surface rounded-lg shadow-2xl p-8 text-center" role="status" aria-live="polite">
          <div className="text-4xl mb-4" aria-hidden="true">📅</div>
          <h4 className="text-xl font-serif font-bold mb-2">No Events Scheduled</h4>
          <p className="text-brand-text-dark mb-4">
            Check back soon for exciting upcoming events and activities.
          </p>
          <Link 
            href="/events" 
            className="inline-block bg-brand-gold text-brand-dark px-6 py-2 rounded-md font-semibold hover:bg-brand-gold/90 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:ring-offset-2"
            aria-label="View all events page"
          >
            View All Events
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="upcoming-events-heading" role="region">
      <div className="text-center mb-6">
        <h3 id="upcoming-events-heading" className="text-2xl font-serif font-bold text-brand-gold">
          Upcoming Events
          {isInDemoMode && (
            <span className="text-xs text-yellow-400 ml-2" aria-label="Currently in demo mode">(Demo Mode)</span>
          )}
        </h3>
        <p className="text-brand-text-dark mt-2" id="events-description">
          Join us for these exciting upcoming events and activities
        </p>
      </div>
      
      {/* Responsive Events Grid */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        role="list"
        aria-describedby="events-description"
        aria-live="polite"
        aria-label={`${eventsToShow.length} upcoming events`}
      >
        {eventsToShow.map((event, index) => (
          <div key={event.id} role="listitem">
            <EventCard 
              event={event} 
              priority={index === 0 ? 'featured' : 'standard'}
            />
          </div>
        ))}
      </div>
      
      {/* View All Events Link */}
      {eventsToShow.length > 0 && (
        <div className="text-center mt-8">
          <Link 
            href="/events" 
            className="inline-flex items-center text-brand-gold hover:text-brand-gold/80 font-semibold text-lg transition-colors group focus:outline-none focus:ring-2 focus:ring-brand-gold/50 rounded"
            aria-label="View all upcoming events"
          >
            View All Events 
            <span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </section>
  );
};

export default UpcomingEventsSection;