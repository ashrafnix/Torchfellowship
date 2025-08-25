import React, { useRef } from 'react';
import { Event } from '../types';
import Spinner from '../components/ui/Spinner';
import useOnScreen from '../hooks/useOnScreen';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../hooks/useApi';
import { tuesdayFellowship } from '../data/events';

const EventsPage: React.FC = () => {
  const { apiClient } = useApi();
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: () => apiClient('/api/events', 'GET'),
  });

  return (
    <div className="animate-fadeInUp">
      <section className="relative py-32 text-center overflow-hidden bg-brand-dark">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755273117/Events_chapk4.png')` }}
        >
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-extrabold tracking-tight text-brand-gold drop-shadow-lg">
            Upcoming Events
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-white drop-shadow-md">
            Join us for fellowship, worship, and growth. Discover what's happening at Torch Fellowship.
          </p>
        </div>
      </section>

      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="flex justify-center"><Spinner /></div>
            ) : (
              <div className="space-y-12">
                <EventCard event={tuesdayFellowship} />
                {events.map(event => <EventCard key={event._id} event={event} />)}
                {events.length === 0 && (
                  <div className="text-center text-brand-text-dark py-8">
                    <p>No other special events are scheduled at this time. Please check back soon!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref, { threshold: 0.2 });
  
  let day: string, month: string;

  if (event.event_date === 'recurring-tuesday') {
    day = 'EVERY';
    month = 'TUE';
  } else {
    const eventDate = new Date(event.event_date);
    day = eventDate.toLocaleDateString('en-US', { day: '2-digit' });
    month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  }
  
  return (
    <div 
      ref={ref}
      className={`flex flex-col md:flex-row bg-brand-surface rounded-lg shadow-2xl overflow-hidden border border-brand-muted/50 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {event.image_base64 && (
        <img src={event.image_base64} alt={event.title} className="w-full md:w-1/3 h-64 md:h-auto object-cover" />
      )}
      <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
        <div>
          <div className="flex items-start gap-8">
            <div className="text-center flex-shrink-0 w-24">
              <p className="text-3xl font-bold text-brand-gold">{day}</p>
              <p className="text-sm font-semibold text-brand-text-dark">{month}</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold font-serif text-white">{event.title}</h3>
              <p className="text-sm text-brand-text-dark">{event.event_time} at {event.location}</p>
            </div>
          </div>
          <p className="mt-4 text-brand-text-dark">{event.description}</p>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;