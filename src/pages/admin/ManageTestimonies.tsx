import React, { useState } from 'react';
import { Testimony } from '../../types';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { toast } from 'react-toastify';

const ManageTestimonies: React.FC = () => {
    const [filter, setFilter] = useState<'pending' | 'approved'>('pending');
    
    const { apiClient } = useApi();
    const queryClient = useQueryClient();

    const { data: testimonies = [], isLoading } = useQuery<Testimony[]>({
        queryKey: ['testimonies', 'admin'],
        queryFn: () => apiClient('/api/testimonies/admin/all', 'GET')
    });

    const approveMutation = useMutation({
        mutationFn: (id: string) => apiClient(`/api/testimonies/admin/${id}`, 'PUT', { is_approved: true }),
        onSuccess: () => {
            toast.success("Testimony approved.");
            queryClient.invalidateQueries({ queryKey: ['testimonies', 'admin'] });
        },
        onError: (error: Error) => toast.error(`Approval failed: ${error.message}`)
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => apiClient(`/api/testimonies/admin/${id}`, 'DELETE'),
        onSuccess: () => {
            toast.success("Testimony deleted.");
            queryClient.invalidateQueries({ queryKey: ['testimonies', 'admin'] });
        },
        onError: (error: Error) => toast.error(`Deletion failed: ${error.message}`)
    });
    
    const handleDelete = async (id: string) => {
        if(window.confirm('Are you sure you want to delete this testimony? This action is permanent.')) {
            deleteMutation.mutate(id);
        }
    }

    const filteredTestimonies = testimonies.filter(t => {
        if (filter === 'pending') return !t.is_approved;
        if (filter === 'approved') return t.is_approved;
        return true;
    });

    return (
        <div className="bg-brand-surface p-4 sm:p-6 rounded-lg border border-brand-muted/50">
            <div className="flex justify-start mb-6 space-x-2">
                <Button variant={filter === 'pending' ? 'primary' : 'secondary'} onClick={() => setFilter('pending')}>Pending Approval</Button>
                <Button variant={filter === 'approved' ? 'primary' : 'secondary'} onClick={() => setFilter('approved')}>Approved</Button>
            </div>
            {isLoading ? <div className="flex justify-center"><Spinner /></div> : (
                <div className="space-y-4">
                    {filteredTestimonies.length > 0 ? filteredTestimonies.map(t => (
                        <div key={t._id} className="bg-brand-dark p-4 rounded-md border border-brand-muted">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{t.title}</h3>
                                    <p className="text-sm text-brand-text-dark mt-1">- {t.name}</p>
                                    <p className="text-white mt-4">{t.story_text}</p>
                                </div>
                                <div className="flex-shrink-0">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${t.is_approved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {t.is_approved ? 'Approved' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-brand-muted flex justify-end space-x-2">
                                {!t.is_approved && (
                                    <Button size="sm" variant="primary" onClick={() => approveMutation.mutate(t._id!)} isLoading={approveMutation.isPending}>
                                        Approve
                                    </Button>
                                )}
                                <Button size="sm" variant="danger" onClick={() => handleDelete(t._id!)} isLoading={deleteMutation.isPending}>Delete</Button>
                            </div>
                        </div>
                    )) : <p className="text-center text-brand-text-dark py-8">No testimonies in this category.</p>}
                </div>
            )}
        </div>
    );
};

export default ManageTestimonies;
