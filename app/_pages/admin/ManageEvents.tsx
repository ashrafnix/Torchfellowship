'use client'

import React, { useState } from 'react';
import { Event } from '@/lib/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { ICONS } from '@/src/constants';
import Spinner from '@/components/ui/Spinner';
import Input from '@/components/ui/Input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';

const ManageEvents: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const { apiClient } = useApi();
    const queryClient = useQueryClient();

    const { data: events = [], isLoading } = useQuery<Event[]>({
        queryKey: ['events', 'admin'],
        queryFn: () => apiClient('/api/events', 'GET')
    });

    const saveMutation = useMutation({
        mutationFn: (event: Partial<Event>) => {
            const method = editingEvent ? 'PUT' : 'POST';
            const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events';
            return apiClient(url, method, event);
        },
        onSuccess: () => {
            toast.success("Event saved successfully!");
            queryClient.invalidateQueries({ queryKey: ['events', 'admin'] });
            handleCloseModal();
        },
        onError: (error: Error) => {
            toast.error(`Error saving event: ${error.message}`);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => apiClient(`/api/events/${id}`, 'DELETE'),
        onSuccess: () => {
            toast.success("Event deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ['events', 'admin'] });
        },
        onError: (error: Error) => {
            toast.error(`Error deleting event: ${error.message}`);
        }
    });

    const handleOpenModal = (event: Event | null = null) => {
        setEditingEvent(event);
        setImagePreview(event?.image_base64 || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEvent(null);
        setImagePreview(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formObject = Object.fromEntries(formData.entries()) as any;
        
        if (imagePreview) {
            formObject.image_base64 = imagePreview;
        }

        saveMutation.mutate(formObject);
    };

    return (
        <div className="admin-glass p-4 sm:p-6 rounded-2xl">
            <div className="flex justify-end mb-6">
                <Button onClick={() => handleOpenModal()}>+ Add New Event</Button>
            </div>
            {isLoading ? <div className="flex justify-center"><Spinner /></div> : (
                <div className="space-y-4">
                    {events.length > 0 ? events.map(event => (
                        <div key={event.id} className="admin-card p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                {event.image_base64 && <img src={event.image_base64} alt={event.title} className="w-24 h-16 object-cover rounded-md" />}
                                <div>
                                    <h3 className="text-lg font-bold text-white">{event.title}</h3>
                                    <p className="text-sm text-brand-text-dark">{new Date(event.event_date).toLocaleDateString()} @ {event.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Button size="sm" variant="secondary" onClick={() => handleOpenModal(event)}>Edit</Button>
                                <button onClick={() => handleDelete(event.id!)} className="text-red-500 hover:text-red-400 p-2 rounded-md hover:bg-red-500/10" aria-label="Delete event"><ICONS.Trash2 className="w-5 h-5"/></button>
                            </div>
                        </div>
                    )) : <p className="text-center text-brand-text-dark py-8">No events found.</p>}
                </div>
            )}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingEvent ? 'Edit Event' : 'Add New Event'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="border-2 border-dashed border-brand-muted rounded-lg p-6 text-center">
                        {imagePreview ? (
                            <div className="relative group">
                                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-md"/>
                                <label htmlFor="image-upload" className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">Change Image</label>
                            </div>
                        ) : (
                             <label htmlFor="image-upload" className="cursor-pointer">
                                <ICONS.UploadCloud className="mx-auto h-12 w-12 text-brand-text-dark" />
                                <p className="mt-2 text-sm text-brand-text-dark">Click to upload an event poster</p>
                            </label>
                        )}
                        <input id="image-upload" name="image" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                    </div>
                    <Input label="Event Title" name="title" defaultValue={editingEvent?.title} required />
                    <Input label="Location" name="location" defaultValue={editingEvent?.location} required />
                    <div className="grid grid-cols-2 gap-6">
                        <Input label="Event Date" name="event_date" type="date" defaultValue={editingEvent ? new Date(editingEvent.event_date).toISOString().split('T')[0] : ''} required />
                        <Input label="Event Time" name="event_time" type="time" defaultValue={editingEvent?.event_time} required />
                    </div>
                    <textarea name="description" placeholder="Description" rows={4} defaultValue={editingEvent?.description} className="w-full bg-brand-muted border-transparent rounded-md p-4 text-brand-text placeholder-gray-500 focus:ring-2 focus:ring-brand-gold" />
                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button type="submit" isLoading={saveMutation.isPending}>Save Event</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageEvents;
