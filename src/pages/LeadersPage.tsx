import React, { useState } from 'react';
import { Leader } from '../types';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { ICONS } from '../constants';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../hooks/useApi';

const LeadersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  
  const { apiClient } = useApi();
  const { data: leaders = [], isLoading } = useQuery<Leader[]>({
    queryKey: ['leaders'],
    queryFn: () => apiClient('/api/leaders', 'GET'),
  });

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'youtu.be') {
        videoId = urlObj.pathname.slice(1);
      } else {
        videoId = urlObj.searchParams.get('v');
      }
    } catch(e) {
      // Fallback for non-standard URLs
      const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?(.+)/);
      videoId = match ? match[1].split(/[^0-9a-z_\-]/i)[0] : null;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  const handleOpenVideoModal = (youtubeUrl: string) => {
    const embedUrl = getYouTubeEmbedUrl(youtubeUrl);
    if (embedUrl) {
      setSelectedVideoUrl(embedUrl);
      setIsModalOpen(true);
    } else {
      alert("Invalid YouTube URL provided for this leader.");
    }
  };

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-gold">Our Leaders</h1>
          <p className="mt-4 text-lg text-brand-text-dark">
            Meet the dedicated team guiding our fellowship. A group of individuals committed to serving God and our community with passion and integrity.
          </p>
        </div>

        <div className="mt-20">
          {isLoading ? (
            <div className="flex justify-center"><Spinner /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {leaders.map((leader, index) => (
                <LeaderCard 
                  key={leader._id} 
                  leader={leader}
                  onWatchVideo={() => handleOpenVideoModal(leader.youtubeUrl)}
                  className={`animate-fadeInUp`}
                  style={{ animationDelay: `${index * 150}ms` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Leader Introduction">
        <div className="aspect-video bg-black rounded-lg">
          <iframe
            width="100%"
            height="100%"
            src={selectedVideoUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </Modal>

    </div>
  );
};

interface LeaderCardProps {
    leader: Leader;
    onWatchVideo: () => void;
    className?: string;
    style?: React.CSSProperties;
}

const LeaderCard: React.FC<LeaderCardProps> = ({ leader, onWatchVideo, className, style }) => {
    return (
        <div className={`bg-brand-surface rounded-lg shadow-2xl overflow-hidden border border-brand-muted/50 flex flex-col opacity-0 ${className}`} style={style}>
            <div className="relative group">
                <img 
                    src={leader.photoUrl || 'https://via.placeholder.com/400x400.png/141417/EAEAEA?text=No+Photo'} 
                    alt={leader.name} 
                    className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10"></div>
                <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-bold font-serif text-white">{leader.name}</h3>
                    <p className="text-brand-gold font-semibold">{leader.title}</p>
                </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <p className="text-brand-text-dark text-sm flex-grow">{leader.bio}</p>
                <Button onClick={onWatchVideo} variant="secondary" className="mt-6 w-full">
                   <ICONS.PlayCircle className="w-5 h-5 mr-2" />
                    View Intro Video
                </Button>
            </div>
        </div>
    )
}

export default LeadersPage;
