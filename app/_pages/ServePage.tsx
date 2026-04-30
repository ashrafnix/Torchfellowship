'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { MinistryTeam } from '@/lib/types';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { ICONS } from '@/src/constants';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';

const ServePage: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<MinistryTeam | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  
  const { user } = useAuth();
  const router = useRouter();
  const { apiClient } = useApi();

  const { data: teams = [], isLoading } = useQuery<MinistryTeam[]>({
    queryKey: ['ministryTeams', 'public'],
    queryFn: () => apiClient('/api/ministry-teams/public', 'GET'),
  });
  
  const mutation = useMutation({
    mutationFn: (application: { teamId: string, message: string }) => 
        apiClient('/api/volunteer/apply', 'POST', application),
    onSuccess: () => {
        toast.success("Application submitted successfully! The team leader will be in touch.");
        setIsApplyModalOpen(false);
        setApplicationMessage('');
    },
    onError: (error: Error) => {
        toast.error(`Submission failed: ${error.message}`);
    }
  });

  const handleApplyClick = (team: MinistryTeam) => {
    if (!user) {
      router.push('/login');
    } else {
      setSelectedTeam(team);
      setIsApplyModalOpen(true);
    }
  };
  
  const handleApplicationSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedTeam) return;
      mutation.mutate({ teamId: selectedTeam.id!, message: applicationMessage });
  }

  return (
    <div className="animate-fadeInUp">
       <section className="relative py-32 text-center overflow-hidden bg-brand-dark">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755273143/Serve_swpawm.png')` }}
        >
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-extrabold tracking-tight text-brand-gold drop-shadow-lg">
            Find Your Place to Serve
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-white drop-shadow-md">
             God has given each of you a gift from his great variety of spiritual gifts. Use them well to serve one another. (1 Peter 4:10). Discover where you can use your gifts to build His church.
          </p>
        </div>
      </section>

      <div className="py-16 md:py-24 bg-brand-dark">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center"><Spinner /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {teams.map((team, index) => (
                <TeamCard 
                  key={team.id} 
                  team={team}
                  onApply={() => handleApplyClick(team)}
                  className={`animate-fadeInUp`}
                  style={{ animationDelay: `${index * 150}ms` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {selectedTeam && (
        <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} title={`Apply for ${selectedTeam.name}`}>
          <form onSubmit={handleApplicationSubmit}>
            <p className="text-brand-text-dark mb-4">You are applying to join the <span className="font-bold text-white">{selectedTeam.name}</span>. Send a message to the team leader below.</p>
            <textarea
                name="message"
                rows={5}
                value={applicationMessage}
                onChange={(e) => setApplicationMessage(e.target.value)}
                className="w-full bg-brand-dark border border-brand-muted rounded-md p-3 text-brand-text focus:ring-brand-gold focus:border-brand-gold"
                placeholder="Tell us why you're interested in joining this team..."
                required
            />
            <div className="flex justify-end space-x-4 pt-6">
                <Button type="button" variant="secondary" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
                <Button type="submit" isLoading={mutation.isPending}>Submit Application</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

interface TeamCardProps {
    team: MinistryTeam;
    onApply: () => void;
    className?: string;
    style?: React.CSSProperties;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onApply, className, style }) => {
    return (
        <div className={`bg-brand-surface rounded-lg shadow-2xl overflow-hidden border border-brand-muted/50 flex flex-col opacity-0 ${className}`} style={style}>
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
                <Button onClick={onApply} variant="primary" className="mt-6 w-full">
                   <ICONS.HeartHandshake className="w-5 h-5 mr-2" />
                    Apply to Join
                </Button>
            </div>
        </div>
    )
}

export default ServePage;
