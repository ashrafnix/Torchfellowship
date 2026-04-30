'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { PrayerRequest } from '@/lib/types';
import Spinner from '@/components/ui/Spinner';
import { ICONS } from '@/src/constants';
import Button from '@/components/ui/Button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
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
        onSuccess: (data, variables) => {
            toast.success("Request updated.");
            queryClient.invalidateQueries({ queryKey: ['prayerRequests', 'admin'] });
            
            // If privacy setting was changed, also invalidate public prayer wall cache
            if (variables.updates.is_private !== undefined) {
                queryClient.invalidateQueries({ queryKey: ['prayerRequests', 'public'] });
            }
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

    const handlePrivacyChange = async (req: PrayerRequest) => {
        const action = req.is_private ? 'make public' : 'make private';
        const message = req.is_private 
            ? 'This will make the prayer request visible on the public prayer wall. Continue?' 
            : 'This will remove the prayer request from the public prayer wall. Continue?';
        
        if(window.confirm(`Are you sure you want to ${action}? ${message}`)) {
            // Store the action for success message
            const successMessage = req.is_private 
                ? 'Prayer request is now public and visible on the prayer wall.' 
                : 'Prayer request is now private and removed from the prayer wall.';
            
            updateMutation.mutate(
                { id: req.id!, updates: { is_private: !req.is_private }}, 
                {
                    onSuccess: () => {
                        toast.success(successMessage);
                    }
                }
            );
        }
    }

    const handleAnsweredChange = async (req: PrayerRequest) => {
        const action = req.is_answered ? 'mark as unanswered' : 'mark as answered';
        
        if(window.confirm(`Are you sure you want to ${action}?`)) {
            updateMutation.mutate({ id: req.id!, updates: { is_answered: !req.is_answered }});
        }
    }

    const filteredRequests = requests.filter(req => {
        if (filter === 'public') return !req.is_private;
        if (filter === 'private') return req.is_private;
        if (filter === 'answered') return req.is_answered;
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Header with Stats and Actions */}
            <div className="admin-glass rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Prayer Requests Management</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>Total: {requests.length}</span>
                            <span>•</span>
                            <span>Answered: {requests.filter(r => r.is_answered).length}</span>
                            <span>•</span>
                            <span>Private: {requests.filter(r => r.is_private).length}</span>
                        </div>
                    </div>
                    <Link 
                        href="/prayer" 
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all"
                    >
                        <ICONS.Heart className="h-5 w-5" />
                        View Prayer Wall
                    </Link>
                </div>
                
                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                    {[
                        { key: 'all', label: 'All Requests', icon: ICONS.Heart },
                        { key: 'public', label: 'Public', icon: ICONS.Users },
                        { key: 'private', label: 'Private', icon: ICONS.Shield },
                        { key: 'answered', label: 'Answered', icon: ICONS.CheckCircle }
                    ].map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                                filter === key 
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Prayer Requests List */}
            <div className="admin-glass rounded-2xl p-6">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64"><Spinner /></div>
                ) : (
                    <div className="space-y-4">
                        {filteredRequests.length > 0 ? filteredRequests.map(req => (
                            <div key={req.id} className="admin-card rounded-xl p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            {/* User Avatar or Initial */}
                                            {req.avatar_url ? (
                                                <img 
                                                    src={req.avatar_url} 
                                                    alt={`${req.name}'s avatar`}
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/30"
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
                                                className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center ${
                                                    req.avatar_url ? 'hidden' : 'flex'
                                                }`}
                                            >
                                                <span className="text-white font-semibold text-sm">
                                                    {req.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-white">{req.name}</h3>
                                                    {req.user_id && (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                                                            <ICONS.Users className="h-2.5 w-2.5 mr-1" />
                                                            Member
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-400">{req.email || 'No email provided'}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-200 leading-relaxed mb-3">{req.request_text}</p>
                                        <p className="text-xs text-gray-500">
                                            Submitted on {new Date(req.created_at).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                                            req.is_answered 
                                                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                                : req.is_private 
                                                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' 
                                                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                        }`}>
                                            {req.is_answered ? 'Answered' : (req.is_private ? 'Private' : 'Public')}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                                    <Button 
                                        size="sm" 
                                        className={`${req.is_answered ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400' : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'}`}
                                        onClick={() => handleAnsweredChange(req)}
                                        disabled={updateMutation.isPending}
                                    >
                                        <ICONS.CheckCircle className="h-4 w-4 mr-1" />
                                        {req.is_answered ? 'Mark Unanswered' : 'Mark Answered'}
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
                                        onClick={() => handlePrivacyChange(req)}
                                        disabled={updateMutation.isPending}
                                    >
                                        {req.is_private ? (
                                            <>
                                                <ICONS.Users className="h-4 w-4 mr-1" />
                                                Make Public
                                            </>
                                        ) : (
                                            <>
                                                <ICONS.Shield className="h-4 w-4 mr-1" />
                                                Make Private
                                            </>
                                        )}
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400"
                                        onClick={() => handleDelete(req.id!)}
                                        disabled={deleteMutation.isPending}
                                    >
                                        <ICONS.Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-12">
                                <ICONS.Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-400 mb-4">No prayer requests in this category.</p>
                                <Link 
                                    href="/prayer" 
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl transition-all"
                                >
                                    <ICONS.Heart className="h-4 w-4" />
                                    Visit Prayer Wall
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagePrayers;
