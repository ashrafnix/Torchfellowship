import React, { useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import Button from '../components/ui/Button';
import { ICONS } from '../constants';
import { Teaching, Event } from '../types';
import Spinner from '../components/ui/Spinner';
import useOnScreen from '../hooks/useOnScreen';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../hooks/useApi';
import { tuesdayFellowship } from '../data/events';

const AnimatedSection: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref, { threshold: 0.1 });

    return (
        <div ref={ref} className={`${className} transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {children}
        </div>
    );
}

const HomePage: React.FC = () => {
  const { apiClient } = useApi();

  const { data: latestTeaching, isLoading: isLoadingTeaching } = useQuery<Teaching | null>({
    queryKey: ['teachings', 'latest'],
    queryFn: async () => {
      const teachings = await apiClient<Teaching[]>('/api/teachings?limit=1', 'GET');
      return teachings.length > 0 ? teachings[0] : null;
    }
  });

  const isLoading = isLoadingTeaching;

  return (
    <div className="text-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-center overflow-hidden">
        <div 
          className="absolute inset-0 animate-aurora"
          style={{
            backgroundImage: `
              radial-gradient(at 21% 33%, hsl(204.00, 70%, 20%) 0px, transparent 50%),
              radial-gradient(at 79% 30%, hsl(38.82, 100%, 20%) 0px, transparent 50%),
              radial-gradient(at 22% 85%, hsl(20.00, 70%, 30%) 0px, transparent 50%),
              radial-gradient(at 84% 86%, hsl(210.00, 50%, 15%) 0px, transparent 50%)
            `,
            backgroundColor: 'hsl(210, 40%, 2%)'
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-serif font-extrabold tracking-tight [text-shadow:0_3px_8px_rgba(0,0,0,0.5)]">
              Welcome to <span className="text-brand-gold">Torch Fellowship</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-brand-text-dark">
              A vibrant community dedicated to igniting hearts, transforming lives, and building the future through the uncompromising love of Christ.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button size="lg" variant="primary" as={Link} to="/join-us">Join Our Community</Button>
              <Button size="lg" variant="secondary" as={Link} to="/teachings">Watch Teachings</Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Connect With Us Section */}
      <section className="py-24 bg-brand-surface">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold">Connect With Us</h2>
            <p className="mt-3 text-brand-text-dark max-w-2xl mx-auto">Discover ways to grow in faith, build meaningful connections, and serve with purpose.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ConnectCard 
              icon={<ICONS.BookOpen className="h-8 w-8 text-brand-gold"/>} 
              title="Tuesday Fellowship" 
              description="A vibrant, transformative evening of worship & word, every week from 5-8PM."
              link="/events"
            />
            <ConnectCard 
              icon={<ICONS.Users className="h-8 w-8 text-brand-gold"/>} 
              title="Light Campuses" 
              description="Find a fellowship near you or apply to start one in your area."
              link="/light-campuses"
            />
            <ConnectCard 
              icon={<ICONS.Heart className="h-8 w-8 text-brand-gold"/>} 
              title="Prayer Wall" 
              description="You are not alone. Share your heart with our dedicated prayer community."
              link="/prayer"
            />
            <ConnectCard 
              icon={<ICONS.Gift className="h-8 w-8 text-brand-gold"/>} 
              title="Word Investors" 
              description="Partner with our mission to spread the Word through secure, impactful giving."
              link="/give"
            />
          </div>
        </div>
      </section>
      
      {/* Latest Teaching & Event Section */}
      <section className="py-24 bg-brand-dark">
        <div className="container mx-auto px-4">
          {isLoading ? <div className="flex justify-center"><Spinner /></div> : (
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {latestTeaching && <AnimatedSection><LatestTeachingCard teaching={latestTeaching} /></AnimatedSection>}
              <AnimatedSection><UpcomingEventCard event={tuesdayFellowship} /></AnimatedSection>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const LatestTeachingCard: React.FC<{ teaching: Teaching }> = ({ teaching }) => {
  const videoId = teaching.youtube_url.split('v=')[1]?.split('&')[0] || teaching.youtube_url.split('/').pop();
  return (
    <div>
      <h2 className="text-4xl font-serif font-bold text-center mb-8">Latest Teaching</h2>
      <div className="bg-brand-surface rounded-lg shadow-2xl overflow-hidden">
        <div className="relative pb-[56.25%] bg-black">
           <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
            </iframe>
        </div>
        <div className="p-6">
            <p className="text-sm text-brand-gold font-semibold">{teaching.category}</p>
            <h3 className="text-2xl font-bold font-serif mt-2">{teaching.title}</h3>
            <p className="text-brand-text-dark mt-1">{teaching.speaker} • {new Date(teaching.preached_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <Link to="/teachings" className="text-brand-gold hover:underline mt-4 inline-block font-semibold">View All Teachings &rarr;</Link>
        </div>
      </div>
    </div>
  )
};

const UpcomingEventCard: React.FC<{ event: Event }> = ({ event }) => {
  const dateDisplay = event.event_date === 'recurring-tuesday'
    ? 'Every Tuesday'
    : new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      <h2 className="text-4xl font-serif font-bold text-center mb-8">Weekly Fellowship</h2>
      <div className="bg-brand-surface rounded-lg shadow-2xl overflow-hidden">
        {event.image_base64 && <img src={event.image_base64} alt={event.title} className="w-full h-64 object-cover" />}
        <div className="p-6">
            <h3 className="text-2xl font-bold font-serif">{event.title}</h3>
            <p className="text-brand-text-dark mt-2">{event.description}</p>
            <div className="mt-4 text-sm space-y-2">
              <p><strong className="text-brand-gold">Date:</strong> {dateDisplay}</p>
              <p><strong className="text-brand-gold">Time:</strong> {event.event_time}</p>
              <p><strong className="text-brand-gold">Location:</strong> {event.location}</p>
            </div>
            <Link to="/events" className="text-brand-gold hover:underline mt-4 inline-block font-semibold">View All Events &rarr;</Link>
        </div>
      </div>
    </div>
  )
};

interface ConnectCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    link: string;
}

const ConnectCard: React.FC<ConnectCardProps> = ({ icon, title, description, link }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    const rotateX = (y - 0.5) * -20;
    const rotateY = (x - 0.5) * 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  };

  return (
    <Link to={link} className="group block">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative bg-brand-dark p-8 rounded-lg text-center transition-transform duration-300 ease-out shadow-lg border border-brand-surface"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 to-transparent rounded-lg"></div>
        <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
          <div className="inline-block p-4 bg-brand-surface rounded-full">
            {icon}
          </div>
          <h3 className="mt-4 text-xl font-serif font-bold" style={{ transform: 'translateZ(30px)' }}>{title}</h3>
          <p className="mt-2 text-brand-text-dark text-sm">{description}</p>
          <span className="mt-4 inline-block text-brand-gold group-hover:underline font-semibold">
            Learn More &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
};


export default HomePage;