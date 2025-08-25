import React, { useState } from 'react';
import { Leader } from '../../types';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { ICONS } from '../../constants';
import Spinner from '../../components/ui/Spinner';
import Input from '../../components/ui/Input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { uploadImage } from '../../services/uploadService';
import { toast } from 'react-toastify';

const ManageLeaders: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [formState, setFormState] = useState<Partial<Leader>>({});
    
    const { apiClient } = useApi();
    const queryClient = useQueryClient();

    const { data: leaders = [], isLoading } = useQuery<Leader[]>({
        queryKey: ['leaders', 'admin'],
        queryFn: () => apiClient('/api/leaders', 'GET')
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => apiClient(`/api/leaders/${id}`, 'DELETE'),
        onSuccess: () => {
            toast.success("Leader profile deleted.");
            queryClient.invalidateQueries({ queryKey: ['leaders', 'admin'] });
        },
        onError: (error: Error) => toast.error(`Deletion failed: ${error.message}`)
    });

    const saveMutation = useMutation({
        mutationFn: async (leaderData: Partial<Leader>) => {
            let finalPhotoUrl = editingLeader?.photoUrl || leaderData.photoUrl || null;
            if (photoFile) {
                finalPhotoUrl = await uploadImage(photoFile, 'leaders');
            }
            if (!finalPhotoUrl) throw new Error("A photo is required.");

            const payload = { ...leaderData, photoUrl: finalPhotoUrl };
            const method = editingLeader ? 'PUT' : 'POST';
            const url = editingLeader ? `/api/leaders/${editingLeader._id}` : '/api/leaders';
            return apiClient(url, method, payload);
        },
        onSuccess: () => {
            toast.success("Leader profile saved successfully!");
            queryClient.invalidateQueries({ queryKey: ['leaders', 'admin'] });
            handleCloseModal();
        },
        onError: (error: Error) => toast.error(`Save failed: ${error.message}`)
    });

    const handleOpenModal = (leader: Leader | null = null) => {
        setEditingLeader(leader);
        setFormState(leader || {});
        setPhotoPreview(leader?.photoUrl || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingLeader(null);
        setPhotoPreview(null);
        setPhotoFile(null);
        setFormState({});
    };
    
    const handleDelete = async (id: string) => {
        if(window.confirm('Are you sure you want to permanently delete this leader profile?')) {
            deleteMutation.mutate(id);
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
              toast.error('Image file is too large. Please use a file under 2MB.');
              return;
            }
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        saveMutation.mutate(formState);
    };

    return (
        <div className="bg-brand-surface p-4 sm:p-6 rounded-lg border border-brand-muted/50">
            <div className="flex justify-end mb-6">
                <Button onClick={() => handleOpenModal()}>+ Add New Leader</Button>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-64"><Spinner /></div>
            ) : (
                <div className="space-y-4">
                    {leaders.length > 0 ? leaders.map(leader => (
                        <div key={leader._id} className="bg-brand-dark p-4 rounded-md flex items-center justify-between border border-brand-muted hover:border-brand-gold/30 transition-colors">
                            <div className="flex items-center space-x-4">
                                <img src={leader.photoUrl || ''} alt={leader.name} className="w-16 h-16 object-cover rounded-full" />
                                <div>
                                    <h3 className="text-lg font-bold text-white">{leader.name}</h3>
                                    <p className="text-sm text-brand-text-dark">{leader.title}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Button size="sm" variant="secondary" onClick={() => handleOpenModal(leader)}>Edit</Button>
                                <Button 
                                    size="sm" 
                                    variant="danger" 
                                    onClick={() => handleDelete(leader._id!)}
                                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                >
                                    <ICONS.Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center text-brand-text-dark py-16 border-2 border-dashed border-brand-muted rounded-lg">
                            <ICONS.Shield className="mx-auto h-12 w-12 text-brand-muted" />
                            <h3 className="mt-2 text-lg font-medium text-white">No leaders found</h3>
                            <p className="mt-1 text-sm">Add a new leader profile to get started.</p>
                         </div>
                    )}
                </div>
            )}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingLeader ? 'Edit Leader' : 'Add New Leader'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                           <img src={photoPreview || 'https://via.placeholder.com/100x100.png/2B2F36/EAEAEA?text=Photo'} alt="Preview" className="w-24 h-24 rounded-full object-cover"/>
                           <label htmlFor="photo-upload" className="absolute -bottom-1 -right-1 bg-brand-gold text-brand-dark p-1.5 rounded-full cursor-pointer hover:bg-brand-gold-dark transition-colors">
                                <ICONS.Edit className="w-4 h-4" />
                                <input 
                                    id="photo-upload" 
                                    type="file" 
                                    className="sr-only" 
                                    accept="image/png, image/jpeg" 
                                    onChange={handlePhotoChange}
                                    aria-label="Upload leader photo"
                                />
                            </label>
                        </div>
                        <div className="flex-grow space-y-4">
                            <Input label="Name" name="name" value={formState.name || ''} onChange={handleInputChange} required />
                            <Input label="Title" name="title" value={formState.title || ''} onChange={handleInputChange} required />
                        </div>
                    </div>

                    <Input label="YouTube Introduction URL" name="youtubeUrl" type="url" value={formState.youtubeUrl || ''} onChange={handleInputChange} required />
                    
                    <div>
                        <label className="block text-sm font-medium text-brand-text-dark mb-1">Bio</label>
                        <textarea
                            name="bio"
                            rows={5}
                            value={formState.bio || ''}
                            onChange={handleInputChange}
                            className="w-full bg-brand-dark border border-brand-muted rounded-md p-3 text-brand-text focus:ring-brand-gold focus:border-brand-gold"
                            placeholder="A short biography about the leader..."
                            required
                        />
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

export default ManageLeaders;
