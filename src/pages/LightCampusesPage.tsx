import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate } = ReactRouterDOM as any;
import Button from '../components/ui/Button.tsx';
import Input from '../components/ui/Input.tsx';
import Modal from '../components/ui/Modal.tsx';
import Spinner from '../components/ui/Spinner.tsx';
import { ICONS } from '../constants.tsx';
import { useAuth } from '../hooks/useAuth.ts';
import type { LightCampus } from '../types.ts';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useApi } from '../hooks/useApi.ts';
import { toast } from 'react-toastify';

const LightCampusesPage: React.FC = () => {
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    
    const { user } = useAuth();
    const navigate = useNavigate();
    const { apiClient } = useApi();

    const { data: campuses = [], isLoading } = useQuery<LightCampus[]>({
        queryKey: ['lightCampuses', 'public'],
        queryFn: () => apiClient('/api/light-campuses/public', 'GET')
    });

    const mutation = useMutation({
        mutationFn: (applicationData: object) => apiClient('/api/light-campuses/apply', 'POST', applicationData),
        onSuccess: () => {
            toast.success("Application submitted successfully! We will review it and get back to you soon.");
            setIsApplyModalOpen(false);
        },
        onError: (error: Error) => {
            toast.error('Error submitting application: ' + error.message);
        }
    });

    const handleApplyClick = () => {
        if (!user) {
            navigate('/login', { state: { from: { pathname: '/light-campuses' } } });
        } else {
            setIsApplyModalOpen(true);
        }
    };

    const handleApplicationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        mutation.mutate(data);
    };

    return (
        <div className="animate-fadeInUp">
            {/* Hero Section */}
            <section className="relative py-32 text-center overflow-hidden bg-brand-surface">
                <div className="absolute inset-0 opacity-20 animate-aurora" style={{ backgroundImage: `radial-gradient(at 21% 33%, hsl(204.00, 70%, 20%) 0px, transparent 50%), radial-gradient(at 79% 30%, hsl(38.82, 100%, 20%) 0px, transparent 50%)` }}></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-5xl md:text-7xl font-serif font-extrabold tracking-tight text-brand-gold">
                        Light Campuses
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-brand-text-dark">
                        Find a fellowship near you or take the lead and start one. Let's spread the light together.
                    </p>
                    <Button size="lg" className="mt-8" onClick={handleApplyClick}>
                        <ICONS.Send className="w-5 h-5 mr-2" />
                        Start a Campus
                    </Button>
                </div>
            </section>

            {/* Campuses Grid */}
            <section className="py-24 bg-brand-dark">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-serif font-bold text-white text-center mb-16">Our Campuses</h2>
                    {isLoading ? (
                        <div className="flex justify-center"><Spinner /></div>
                    ) : campuses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {campuses.map(campus => (
                                <div key={campus._id} className="bg-brand-surface p-6 rounded-lg border border-brand-muted/50">
                                    <h3 className="text-2xl font-serif font-bold text-white">{campus.name}</h3>
                                    <p className="text-brand-gold font-semibold mt-1">Led by {campus.leaderName}</p>
                                    <div className="mt-4 space-y-2 text-brand-text-dark">
                                        <p><strong className="font-medium text-brand-text">Location:</strong> {campus.location}</p>
                                        <p><strong className="font-medium text-brand-text">Schedule:</strong> {campus.meetingSchedule}</p>
                                        <p><strong className="font-medium text-brand-text">Contact:</strong> {campus.contactInfo}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-brand-text-dark py-16 border-2 border-dashed border-brand-muted rounded-lg">
                            <ICONS.Home className="mx-auto h-12 w-12 text-brand-muted" />
                            <h3 className="mt-2 text-lg font-medium text-white">No active campuses yet.</h3>
                            <p className="mt-1 text-sm">Be the first to start one in your area!</p>
                        </div>
                    )}
                </div>
            </section>

            <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} title="Propose a New Light Campus">
                <form onSubmit={handleApplicationSubmit} className="space-y-6">
                    <Input label="Proposed Campus Name" name="proposedCampusName" required />
                    <Input label="Proposed Location (e.g., University, Town)" name="proposedLocation" required />
                    <Input label="Your Name (as Leader)" name="proposedLeaderName" defaultValue={user?.fullName || ''} required />
                    <Input label="Your Contact Info (Email/Phone)" name="contactInfo" defaultValue={user?.email || ''} required />
                    <div>
                        <label className="block text-sm font-medium text-brand-text-dark mb-1">Why do you want to start this campus?</label>
                        <textarea
                            name="missionStatement"
                            rows={5}
                            className="w-full bg-brand-dark border border-brand-muted rounded-md p-3 text-brand-text focus:ring-brand-gold focus:border-brand-gold"
                            placeholder="Briefly share your vision and mission for this campus..."
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
                        <Button type="submit" isLoading={mutation.isPending}>Submit Proposal</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default LightCampusesPage;