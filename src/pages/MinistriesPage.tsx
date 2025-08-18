import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { MinistryTeam } from '../types.ts';
import Spinner from '../components/ui/Spinner.tsx';
import Button from '../components/ui/Button.tsx';
import { ICONS } from '../constants.tsx';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../hooks/useApi.ts';

const MinistriesPage: React.FC = () => {
  const { apiClient } = useApi();

  const { data: teams = [], isLoading } = useQuery<MinistryTeam[]>({
    queryKey: ['ministryTeams', 'public'],
    queryFn: () => apiClient('/api/ministry-teams/public', 'GET'),
  });

  return (
    <div className="animate-fadeInUp">
      {/* Hero Section */}
      <section className="relative py-32 text-center overflow-hidden bg-brand-surface">
        <div 
          className="absolute inset-0 opacity-20 animate-aurora"
          style={{ backgroundImage: `
            radial-gradient(at 21% 33%, hsl(38.82, 100%, 20%) 0px, transparent 50%),
            radial-gradient(at 79% 30%, hsl(204.00, 70%, 20%) 0px, transparent 50%)
          `}}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif font-extrabold tracking-tight text-brand-gold">
            Our Ministries
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-brand-text-dark">
            Serving God by serving others. Discover the heart of our fellowship through the various ministries that build up our church and reach our community.
          </p>
        </div>
      </section>

      {/* Ministries Grid Section */}
      <div className="py-24 bg-brand-dark">
        <div className="container mx-auto px-4">
            {isLoading ? (
                <div className="flex justify-center"><Spinner /></div>
            ) : (
                teams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {teams.map((team, index) => (
                        <MinistryCard 
                            key={team._id} 
                            team={team}
                            className={`animate-fadeInUp`}
                            style={{ animationDelay: `${index * 150}ms` }}
                        />
                    ))}
                    </div>
                ) : (
                    <div className="text-center text-brand-text-dark py-16 border-2 border-dashed border-brand-muted rounded-lg">
                        <ICONS.HeartHandshake className="mx-auto h-12 w-12 text-brand-muted" />
                        <h3 className="mt-2 text-lg font-medium text-white">No Ministries Found</h3>
                        <p className="mt-1 text-sm">Ministry teams will be listed here as they become available.</p>
                    </div>
                )
            )}
        </div>
      </div>
    </div>
  );
};

interface MinistryCardProps {
    team: MinistryTeam;
    className?: string;
    style?: React.CSSProperties;
}

const MinistryCard: React.FC<MinistryCardProps> = ({ team, className, style }) => {
    return (
        <div className={`bg-brand-surface rounded-lg shadow-2xl overflow-hidden border border-brand-muted/50 flex flex-col opacity-0 transition-transform duration-300 hover:-translate-y-2 ${className}`} style={style}>
            <div className="relative group">
                <img 
                    src={team.imageUrl || 'https://via.placeholder.com/400x300.png/141417/EAEAEA?text=Torch+Fellowship'} 
                    alt={team.name} 
                    className="w-full h-60 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold font-serif text-white">{team.name}</h3>
                <p className="text-brand-gold font-semibold text-sm">Led by {team.leaderName}</p>
                <p className="text-brand-text-dark text-sm mt-4 flex-grow">{team.description}</p>
                <Button as={Link} to="/serve" variant="secondary" className="mt-6 w-full">
                   <ICONS.HeartHandshake className="w-5 h-5 mr-2" />
                    Learn More & Serve
                </Button>
            </div>
        </div>
    )
}

export default MinistriesPage;