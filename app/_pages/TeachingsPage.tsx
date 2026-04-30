'use client'

import React, { useState, useRef } from 'react';
import { Teaching } from '@/lib/types';
import Spinner from '@/components/ui/Spinner';
import useOnScreen from '@/hooks/useOnScreen';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import Modal from '@/components/ui/Modal';

const getYouTubeVideoId = (url: string): string | null => {
    let videoId: string | null = null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        } else if (urlObj.hostname.includes('youtube.com')) {
            videoId = urlObj.searchParams.get('v');
        }
    } catch (e) {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/);
        videoId = match ? match[1] : null;
    }
    return videoId;
};

const TeachingsPage: React.FC = () => {
  const { apiClient } = useApi();
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: teachings = [], isLoading } = useQuery<Teaching[]>({
    queryKey: ['teachings'],
    queryFn: () => apiClient('/api/teachings', 'GET'),
  });

  const handleOpenVideoModal = (youtubeUrl: string) => {
    const videoId = getYouTubeVideoId(youtubeUrl);
    if (videoId) {
      setSelectedVideoUrl(`https://www.youtube.com/embed/${videoId}`);
      setIsModalOpen(true);
    } else {
      alert("Invalid YouTube URL provided for this teaching.");
    }
  };

  return (
    <div className="animate-fadeInUp">
      <section className="relative py-32 text-center overflow-hidden bg-brand-dark">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755273135/Teachings_kkvbhd.png')` }}
        >
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-extrabold tracking-tight text-brand-gold drop-shadow-lg">
            Our Teachings
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-white drop-shadow-md">
            Immerse yourself in transformative messages that inspire, challenge, and build up your faith.
          </p>
        </div>
      </section>

      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center"><Spinner /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teachings.map(teaching => (
                <TeachingCard key={teaching.id} teaching={teaching} onPlayVideo={() => handleOpenVideoModal(teaching.youtube_url)} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Watch Teaching">
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

const TeachingCard: React.FC<{ teaching: Teaching, onPlayVideo: () => void }> = ({ teaching, onPlayVideo }) => {
    const videoId = getYouTubeVideoId(teaching.youtube_url);
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref as React.RefObject<Element>, { threshold: 0.1 });

    return (
        <div 
            ref={ref} 
            className={`bg-brand-surface rounded-lg shadow-2xl overflow-hidden group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            <div className="relative pb-[56.25%] bg-black overflow-hidden">
                <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt={teaching.title} className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
                <button onClick={onPlayVideo} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" title="Play Video">
                   <div className="w-16 h-16 rounded-full bg-red-600/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
                   </div>
                </button>
            </div>
            <div className="p-6">
                <p className="text-sm text-brand-gold font-semibold">{teaching.category}</p>
                <h3 className="text-xl font-bold font-serif mt-2 text-white">{teaching.title}</h3>
                <p className="text-brand-text-dark mt-1 text-sm">{teaching.speaker} • {new Date(teaching.preached_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-brand-text-dark mt-3 text-sm h-20 overflow-hidden text-ellipsis">{teaching.description}</p>
            </div>
        </div>
    );
};

export default TeachingsPage;
