'use client'

import React, { useState } from 'react';
import { Teaching } from '@/lib/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { ICONS } from '@/src/constants';
import Spinner from '@/components/ui/Spinner';
import Input from '@/components/ui/Input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';

const ManageTeachings: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeaching, setEditingTeaching] = useState<Teaching | null>(null);

    const { apiClient } = useApi();
    const queryClient = useQueryClient();

    const { data: teachings = [], isLoading } = useQuery<Teaching[]>({
        queryKey: ['teachings', 'admin'],
        queryFn: () => apiClient<Teaching[]>('/api/teachings', 'GET')
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => apiClient(`/api/teachings/${id}`, 'DELETE'),
        onSuccess: () => {
            toast.success("Teaching deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ['teachings', 'admin'] });
        },
        onError: (err: Error) => {
            toast.error(`Error deleting teaching: ${err.message}`);
        }
    });

    const saveMutation = useMutation({
        mutationFn: (teaching: Partial<Teaching>) => {
            const method = editingTeaching ? 'PUT' : 'POST';
            const url = editingTeaching ? `/api/teachings/${editingTeaching.id}` : '/api/teachings';
            return apiClient(url, method, teaching);
        },
        onSuccess: () => {
            toast.success("Teaching saved successfully!");
            queryClient.invalidateQueries({ queryKey: ['teachings', 'admin'] });
            handleCloseModal();
        },
        onError: (err: Error) => {
            toast.error(`Error saving teaching: ${err.message}`);
        }
    });

    const handleOpenModal = (teaching: Teaching | null = null) => {
        setEditingTeaching(teaching);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTeaching(null);
    };
    
    const handleDelete = async (id: string) => {
        if(window.confirm('Are you sure you want to permanently delete this teaching?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const formObject: {[key: string]: any} = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        const teachingData: Partial<Teaching> = {
            ...formObject,
            id: editingTeaching?.id,
        };

        if (!editingTeaching) {
            teachingData.created_at = new Date().toISOString();
        }

        saveMutation.mutate(teachingData);
    };

    return (
        <div className="admin-glass p-4 sm:p-6 rounded-2xl">
            <div className="flex justify-end mb-6">
                <Button onClick={() => handleOpenModal()}>+ Add New Teaching</Button>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner />
                </div>
            ) : (
                <div className="space-y-4">
                    {teachings.length > 0 ? teachings.map(teaching => (
                        <div key={teaching.id} className="admin-card p-4 rounded-xl flex items-center justify-between hover:border-brand-gold/30">
                            <div>
                                <h3 className="text-lg font-bold text-white">{teaching.title}</h3>
                                <p className="text-sm text-brand-text-dark">{teaching.speaker} • {new Date(teaching.preached_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Button size="sm" variant="secondary" onClick={() => handleOpenModal(teaching)}>Edit</Button>
                                <button 
                                    onClick={() => handleDelete(teaching.id!)} 
                                    className="text-red-500 hover:text-red-400 p-2 rounded-md hover:bg-red-500/10 transition-colors"
                                    title="Delete teaching"
                                    aria-label="Delete teaching"
                                >
                                    <ICONS.Trash2 className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center text-brand-text-dark py-16 border-2 border-dashed border-brand-muted rounded-lg">
                            <ICONS.BookOpen className="mx-auto h-12 w-12 text-brand-muted" />
                            <h3 className="mt-2 text-lg font-medium text-white">No teachings found</h3>
                            <p className="mt-1 text-sm">Add a new teaching to get started.</p>
                         </div>
                    )}
                </div>
            )}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTeaching ? 'Edit Teaching' : 'Add New Teaching'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input label="Title" name="title" defaultValue={editingTeaching?.title} required />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Speaker" name="speaker" defaultValue={editingTeaching?.speaker} required />
                      <Input label="Date" name="preached_at" type="date" defaultValue={editingTeaching ? new Date(editingTeaching.preached_at).toISOString().split('T')[0] : ''} required />
                    </div>
                    <Input label="Category (e.g., Faith, Prayer)" name="category" defaultValue={editingTeaching?.category} required />
                    <Input label="YouTube URL" name="youtube_url" type="url" defaultValue={editingTeaching?.youtube_url} required />
                    <div className="relative">
                        <textarea
                            name="description"
                            rows={5}
                            defaultValue={editingTeaching?.description}
                            className="peer w-full bg-brand-surface border border-brand-muted rounded-md pt-6 pb-2 px-4 text-brand-text placeholder-transparent focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                            placeholder="Description"
                            required
                        />
                        <label className="absolute left-4 top-2 text-brand-text-dark text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-brand-gold peer-focus:text-xs">
                            Description
                        </label>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button type="submit" isLoading={saveMutation.isPending}>Save Changes</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageTeachings;
