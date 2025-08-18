import React, { useState } from 'react';
import Button from '../components/ui/Button.tsx';
import Input from '../components/ui/Input.tsx';
import Spinner from '../components/ui/Spinner.tsx';
import { PrayerRequest } from '../types.ts';
import { ICONS } from '../constants.tsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../hooks/useApi.ts';
import { toast } from 'react-toastify';

const PrayerPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [requestText, setRequestText] = useState('');
    const [sharePublicly, setSharePublicly] = useState(true);
    
    const { apiClient } = useApi();
    const queryClient = useQueryClient();

    const { data: publicRequests = [], isLoading: isLoadingWall } = useQuery<PrayerRequest[]>({
        queryKey: ['prayerRequests', 'public'],
        queryFn: () => apiClient('/api/prayer-requests/public', 'GET'),
    });
    
    const mutation = useMutation({
        mutationFn: (newRequest: Partial<PrayerRequest>) => apiClient('/api/prayer-requests', 'POST', newRequest),
        onSuccess: (data, variables: any) => {
            toast.success("Thank you! Your prayer request has been received.");
            setName('');
            setEmail('');
            setRequestText('');
            setSharePublicly(true);
            if (!variables.is_private) {
                queryClient.invalidateQueries({ queryKey: ['prayerRequests', 'public'] });
            }
        },
        onError: (error: Error) => {
            toast.error(`Submission failed: ${error.message}`);
        }
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newRequest = {
            name,
            email,
            request_text: requestText,
            is_private: !sharePublicly,
        };
        mutation.mutate(newRequest as any);
    };

    return (
        <div className="animate-fadeInUp">
            {/* Hero Section */}
            <section className="relative py-32 text-center overflow-hidden bg-brand-dark">
                 <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755273046/prayer-request_gsjalh.png')` }}
                >
                    <div className="absolute inset-0 bg-brand-dark/70 backdrop-blur-sm"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-5xl md:text-6xl font-serif font-extrabold tracking-tight text-brand-gold">
                        The Power of Prayer
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-brand-text-dark">
                        Join our community in lifting up needs, celebrating answers, and believing together. You are not alone.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <div className="py-16 md:py-24 bg-brand-dark">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Left Panel: Form */}
                        <div className="bg-brand-surface p-8 rounded-lg border border-brand-muted/50">
                            <h2 className="text-3xl font-serif font-bold text-white mb-6">Submit a Prayer Request</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                                <Input label="Email (Optional)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <div>
                                    <label htmlFor="prayer-request" className="block text-sm font-medium text-brand-text-dark mb-1">Your Prayer Request</label>
                                    <textarea
                                        id="prayer-request"
                                        name="request_text"
                                        rows={6}
                                        required
                                        value={requestText}
                                        onChange={(e) => setRequestText(e.target.value)}
                                        placeholder="Your Prayer Request"
                                        className="peer w-full bg-brand-muted border border-brand-muted rounded-md pt-3 pb-2 px-4 text-brand-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-shadow duration-300"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="share-publicly"
                                        name="share_publicly"
                                        type="checkbox"
                                        checked={sharePublicly}
                                        onChange={(e) => setSharePublicly(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold bg-brand-muted"
                                    />
                                    <label htmlFor="share-publicly" className="ml-3 block text-sm text-brand-text">
                                        Share publicly on the prayer wall
                                    </label>
                                </div>
                                <Button type="submit" isLoading={mutation.isPending} className="w-full" size="lg">
                                    <ICONS.Send className="w-5 h-5 mr-2" />
                                    Submit Request
                                </Button>
                            </form>
                        </div>

                        {/* Right Panel: Prayer Wall */}
                        <div className="bg-brand-surface p-8 rounded-lg border border-brand-muted/50">
                            <h2 className="text-3xl font-serif font-bold text-white mb-6">Prayer Wall</h2>
                            {isLoadingWall ? <div className="flex justify-center h-full items-center"><Spinner /></div> : (
                                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                                    {publicRequests.length > 0 ? publicRequests.map(req => (
                                        <div key={req._id} className="bg-brand-dark p-4 rounded-md border border-brand-muted/50">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-brand-gold">{req.name}</h3>
                                                <span className="text-xs text-brand-text-dark">{new Date(req.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="mt-2 text-brand-text">{req.request_text}</p>
                                        </div>
                                    )) : (
                                        <p className="text-brand-text-dark text-center py-10">The prayer wall is empty. Be the first to share a request.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrayerPage;