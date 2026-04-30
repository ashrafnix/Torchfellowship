'use client'

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { Testimony } from '@/lib/types';
import { ICONS } from '@/src/constants';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';

const TestimoniesPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [name, setName] = useState('');
    const [storyText, setStoryText] = useState('');
    
    const { apiClient } = useApi();
    const queryClient = useQueryClient();

    const { data: publicTestimonies = [], isLoading: isLoadingWall } = useQuery<Testimony[]>({
        queryKey: ['testimonies', 'public'],
        queryFn: () => apiClient('/api/testimonies/public', 'GET'),
    });

    const mutation = useMutation({
        mutationFn: (newTestimony: {name: string, title: string, story_text: string}) => 
            apiClient('/api/testimonies', 'POST', newTestimony),
        onSuccess: () => {
            toast.success("Thank you for sharing! Your testimony has been submitted for review.");
            setName('');
            setTitle('');
            setStoryText('');
        },
        onError: (error: Error) => {
            toast.error(`Submission failed: ${error.message}`);
        }
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate({ name, title, story_text: storyText });
    };

    return (
        <div className="py-16 md:py-24 bg-brand-dark">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-gold">Stories of Faith</h1>
                    <p className="mt-4 text-lg text-brand-text-dark">
                        Read about the incredible ways God is moving in the lives of our community. Every story is a testament to His faithfulness.
                    </p>
                </div>
                <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
                    {/* Left Panel: Form */}
                    <div className="lg:col-span-2 bg-brand-surface p-8 rounded-lg border border-brand-muted/50 h-fit">
                        <h2 className="text-3xl font-serif font-bold text-white mb-6">Share Your Story</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input label="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                            <Input label="Testimony Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                             <div>
                                <label htmlFor="story-text" className="block text-sm font-medium text-brand-text-dark mb-1">Your Story</label>
                                <textarea
                                    id="story-text"
                                    name="story_text"
                                    rows={8}
                                    required
                                    value={storyText}
                                    onChange={(e) => setStoryText(e.target.value)}
                                    placeholder="Share what God has done..."
                                    className="peer w-full bg-brand-muted border border-brand-muted rounded-md pt-3 pb-2 px-4 text-brand-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-shadow duration-300"
                                />
                            </div>
                            <Button type="submit" isLoading={mutation.isPending} className="w-full" size="lg">
                                <ICONS.Send className="w-5 h-5 mr-2" />
                                Share My Testimony
                            </Button>
                        </form>
                    </div>

                    {/* Right Panel: Testimonies Wall */}
                     <div className="lg:col-span-3">
                        <h2 className="text-4xl font-serif font-bold text-white mb-6">Community Testimonies</h2>
                        {isLoadingWall ? <div className="flex justify-center h-full items-center"><Spinner /></div> : (
                            <div className="space-y-8">
                                {publicTestimonies.length > 0 ? publicTestimonies.map(testimony => (
                                    <div key={testimony.id} className="bg-brand-surface p-6 rounded-lg border border-brand-muted/50 animate-fadeInUp">
                                        <ICONS.Quote className="w-8 h-8 text-brand-gold mb-4" />
                                        <h3 className="text-2xl font-bold font-serif text-white">{testimony.title}</h3>
                                        <p className="mt-4 text-brand-text leading-relaxed">{testimony.story_text}</p>
                                        <div className="mt-4 pt-4 border-t border-brand-muted flex justify-between items-center">
                                            <p className="font-semibold text-brand-gold">- {testimony.name}</p>
                                            <span className="text-xs text-brand-text-dark">{new Date(testimony.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center text-brand-text-dark py-16 border-2 border-dashed border-brand-muted rounded-lg">
                                        <ICONS.Quote className="mx-auto h-12 w-12 text-brand-muted" />
                                        <h3 className="mt-2 text-lg font-medium text-white">No testimonies yet</h3>
                                        <p className="mt-1 text-sm">Be the first to share your story!</p>
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

export default TestimoniesPage;
