import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';

import { PrayerRequest } from '../types';
import { ICONS } from '../constants';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../hooks/useApi';
import { toast } from 'react-toastify';

const PrayerPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [requestText, setRequestText] = useState('');
    const [sharePublicly, setSharePublicly] = useState(true);
    
    const { apiClient } = useApi();
    const queryClient = useQueryClient();

    const { data: publicRequests = [], isLoading: isLoadingWall, error: wallError } = useQuery<PrayerRequest[]>({
        queryKey: ['prayerRequests', 'public'],
        queryFn: async (): Promise<PrayerRequest[]> => {
            console.log('🔍 Fetching public prayer requests...');
            try {
                const result = await apiClient('/api/prayer-requests/public', 'GET');
                console.log('✅ Prayer requests fetched successfully:', result);
                return result as PrayerRequest[];
            } catch (error) {
                console.error('❌ Error fetching prayer requests:', error);
                throw error;
            }
        },
        refetchInterval: 30000, // Refresh every 30 seconds to show newly public requests
        staleTime: 15000, // Consider data stale after 15 seconds
        refetchOnWindowFocus: true,
        retry: 2, // Retry failed requests
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
            share_publicly: sharePublicly,  // ✅ Send share_publicly to match backend expectation
        };
        console.log('📤 Submitting prayer request:', newRequest);
        console.log('🔍 share_publicly value:', sharePublicly, 'should result in is_private:', !sharePublicly);
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
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <input
                                            id="share-publicly"
                                            name="share_publicly"
                                            type="checkbox"
                                            checked={sharePublicly}
                                            onChange={(e) => setSharePublicly(e.target.checked)}
                                            className="h-5 w-5 mt-0.5 rounded border-gray-300 text-brand-gold focus:ring-brand-gold bg-brand-muted"
                                        />
                                        <div className="flex-1">
                                            <label htmlFor="share-publicly" className="block text-sm font-medium text-brand-text cursor-pointer">
                                                Share publicly on the prayer wall
                                            </label>
                                            <p className="text-xs text-brand-text-dark mt-1">
                                                {sharePublicly 
                                                    ? "Your request will be visible to all visitors and they can pray for you." 
                                                    : "Only our prayer team will see your request. It won't appear on the public prayer wall."
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Privacy Preview */}
                                    <div className={`p-3 rounded-md border ${
                                        sharePublicly 
                                            ? 'bg-blue-500/10 border-blue-500/30' 
                                            : 'bg-yellow-500/10 border-yellow-500/30'
                                    }`}>
                                        <div className="flex items-center gap-2 text-sm">
                                            {sharePublicly ? (
                                                <>
                                                    <ICONS.Users className="h-4 w-4 text-blue-400" />
                                                    <span className="text-blue-400 font-medium">Public Request</span>
                                                    <span className="text-brand-text-dark">- Will appear on prayer wall</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ICONS.Shield className="h-4 w-4 text-yellow-400" />
                                                    <span className="text-yellow-400 font-medium">Private Request</span>
                                                    <span className="text-brand-text-dark">- Admin and prayer team only</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Button type="submit" isLoading={mutation.isPending} className="w-full" size="lg">
                                    <ICONS.Send className="w-5 h-5 mr-2" />
                                    Submit Request
                                </Button>
                            </form>
                        </div>

                        {/* Right Panel: Prayer Wall */}
                        <div className="bg-brand-surface p-8 rounded-lg border border-brand-muted/50">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-3xl font-serif font-bold text-white">Prayer Wall</h2>
                                    <p className="text-sm text-brand-text-dark mt-1">
                                        {wallError ? (
                                            <span className="text-red-400">
                                                Error loading requests: {wallError.message}
                                            </span>
                                        ) : (
                                            `${(publicRequests as PrayerRequest[]).length} active prayer ${(publicRequests as PrayerRequest[]).length === 1 ? 'request' : 'requests'}`
                                        )}
                                    </p>
                                </div>
                                <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                                    Live Updates
                                </span>
                            </div>
                            {isLoadingWall ? <div className="flex justify-center h-full items-center"><Spinner /></div> : (
                                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 prayer-wall-scroll">
                                    {(publicRequests as PrayerRequest[]).length > 0 ? (publicRequests as PrayerRequest[]).map((req: PrayerRequest) => {
                                        const timeAgo = () => {
                                            const now = new Date();
                                            const posted = new Date(req.created_at);
                                            const diffMs = now.getTime() - posted.getTime();
                                            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                                            const diffDays = Math.floor(diffHours / 24);
                                            
                                            if (diffDays > 0) return `${diffDays}d ago`;
                                            if (diffHours > 0) return `${diffHours}h ago`;
                                            return 'Just now';
                                        };
                                        
                                        return (
                                            <div key={req._id} className="bg-brand-dark p-5 rounded-lg border border-brand-muted/50 hover:border-brand-gold/30 transition-all group">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center space-x-3">
                                                        {/* User Avatar or Initial */}
                                                        {req.avatar_url ? (
                                                            <img 
                                                                src={req.avatar_url} 
                                                                alt={`${req.name}'s avatar`}
                                                                className="w-10 h-10 rounded-full object-cover border-2 border-brand-gold/30"
                                                                onError={(e) => {
                                                                    // Fallback to initials if image fails to load
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.style.display = 'none';
                                                                    const fallback = target.nextElementSibling as HTMLElement;
                                                                    if (fallback) fallback.style.display = 'flex';
                                                                }}
                                                            />
                                                        ) : null}
                                                        {/* Fallback initials (always rendered, hidden if avatar exists) */}
                                                        <div 
                                                            className={`w-10 h-10 bg-gradient-to-br from-brand-gold to-yellow-500 rounded-full flex items-center justify-center ${
                                                                req.avatar_url ? 'hidden' : 'flex'
                                                            }`}
                                                        >
                                                            <span className="text-brand-dark font-bold text-sm">
                                                                {req.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="font-bold text-brand-gold">{req.name}</h3>
                                                                {req.user_id && (
                                                                    <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                                                                        <ICONS.Users className="h-2.5 w-2.5 mr-1" />
                                                                        Member
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-xs text-brand-text-dark flex items-center">
                                                                <ICONS.Clock className="h-3 w-3 mr-1" />
                                                                {timeAgo()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full">
                                                            <ICONS.Users className="h-3 w-3 mr-1" />
                                                            Public
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-brand-text leading-relaxed mb-4">{req.request_text}</p>
                                                <div className="flex items-center justify-between pt-3 border-t border-brand-muted/30">
                                                    <span className="text-xs text-brand-text-dark flex items-center">
                                                        <ICONS.Heart className="h-3 w-3 mr-1 text-pink-400" />
                                                        Praying for this request
                                                    </span>
                                                    <div className="text-xs text-brand-text-dark opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {new Date(req.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short', 
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <ICONS.Heart className="h-8 w-8 text-brand-gold" />
                                            </div>
                                            <p className="text-brand-text-dark text-lg mb-2">The prayer wall awaits</p>
                                            <p className="text-brand-text-dark/70 text-sm">Be the first to share a request and invite others to pray with you.</p>
                                        </div>
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