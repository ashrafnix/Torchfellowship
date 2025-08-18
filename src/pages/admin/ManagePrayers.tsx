import React, { useState } from 'react';
import { PrayerRequest } from '../../types.ts';
import Spinner from '../../components/ui/Spinner.tsx';
import { ICONS } from '../../constants.tsx';
import Button from '../../components/ui/Button.tsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi.ts';
import { toast } from 'react-toastify';

const ManagePrayers: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'public' | 'private' | 'answered'>('all');
    
    const { apiClient } = useApi();
    const queryClient = useQueryClient();

    const { data: requests = [], isLoading } = useQuery<PrayerRequest[]>({
        queryKey: ['prayerRequests', 'admin'],
        queryFn: () => apiClient('/api/prayer-requests/admin/all', 'GET')
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<PrayerRequest> }) =>
            apiClient(`/api/prayer-requests/admin/${id}`, 'PUT', updates),
        onSuccess: () => {
            toast.success("Request updated.");
            queryClient.invalidateQueries({ queryKey: ['prayerRequests', 'admin'] });
        },
        onError: (error: Error) => {
            toast.error(`Update failed: ${error.message}`);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => apiClient(`/api/prayer-requests/admin/${id}`, 'DELETE'),
        onSuccess: () => {
            toast.success("Request deleted.");
            queryClient.invalidateQueries({ queryKey: ['prayerRequests', 'admin'] });
        },
        onError: (error: Error) => {
            toast.error(`Delete failed: ${error.message}`);
        }
    });
    
    const handleDelete = async (id: string) => {
        if(window.confirm('Are you sure you want to delete this prayer request?')) {
            deleteMutation.mutate(id);
        }
    }

    const filteredRequests = requests.filter(req => {
        if (filter === 'public') return !req.is_private;
        if (filter === 'private') return req.is_private;
        if (filter === 'answered') return req.is_answered;
        return true;
    });

    return (
        <div className="bg-brand-surface p-4 sm:p-6 rounded-lg border border-brand-muted/50">
            <div className="flex justify-start mb-6 space-x-2">
                <Button variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => setFilter('all')}>All</Button>
                <Button variant={filter === 'public' ? 'primary' : 'secondary'} onClick={() => setFilter('public')}>Public</Button>
                <Button variant={filter === 'private' ? 'primary' : 'secondary'} onClick={() => setFilter('private')}>Private</Button>
                 <Button variant={filter === 'answered' ? 'primary' : 'secondary'} onClick={() => setFilter('answered')}>Answered</Button>
            </div>
            {isLoading ? <div className="flex justify-center"><Spinner /></div> : (
                <div className="space-y-4">
                    {filteredRequests.length > 0 ? filteredRequests.map(req => (
                        <div key={req._id} className="bg-brand-dark p-4 rounded-md border border-brand-muted">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-white">{req.request_text}</p>
                                    <p className="text-sm text-brand-text-dark mt-2">- {req.name} ({req.email || 'No email provided'})</p>
                                </div>
                                <div className="flex-shrink-0 flex items-center space-x-2">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${req.is_answered ? 'bg-green-500/20 text-green-400' : (req.is_private ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400')}`}>
                                        {req.is_answered ? 'Answered' : (req.is_private ? 'Private' : 'Public')}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-brand-muted flex justify-end space-x-2">
                                <Button size="sm" variant="secondary" onClick={() => updateMutation.mutate({ id: req._id!, updates: { is_answered: !req.is_answered }})}>
                                    {req.is_answered ? 'Mark as Unanswered' : 'Mark as Answered'}
                                </Button>
                                 <Button size="sm" variant="secondary" onClick={() => updateMutation.mutate({ id: req._id!, updates: { is_private: !req.is_private } })}>
                                    {req.is_private ? 'Make Public' : 'Make Private'}
                                </Button>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(req._id!)}>Delete</Button>
                            </div>
                        </div>
                    )) : <p className="text-center text-brand-text-dark py-8">No prayer requests in this category.</p>}
                </div>
            )}
        </div>
    );
};

export default ManagePrayers;
