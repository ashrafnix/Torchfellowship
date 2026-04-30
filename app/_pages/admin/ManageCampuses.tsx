'use client'

import React, { useState, useRef } from 'react';
import { LightCampus, LightCampusApplication, MediaAsset } from '@/lib/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { ICONS } from '@/src/constants';
import Spinner from '@/components/ui/Spinner';
import Input from '@/components/ui/Input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';
import { uploadImage } from '@/services/uploadService';

type ActiveTab = 'applications' | 'campuses';

const ManageCampuses: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('applications');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCampus, setEditingCampus] = useState<LightCampus | null>(null);
    const [formState, setFormState] = useState<Partial<LightCampus>>({});
    const [uploadingImages, setUploadingImages] = useState(false);
    const [selectedImages, setSelectedImages] = useState<MediaAsset[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { apiClient } = useApi();
    const queryClient = useQueryClient();

    const { data: campuses = [], isLoading: isLoadingCampuses } = useQuery<LightCampus[]>({
        queryKey: ['lightCampuses', 'admin'],
        queryFn: () => apiClient('/api/light-campuses/admin/all', 'GET')
    });

    const { data: applications = [], isLoading: isLoadingApps } = useQuery<LightCampusApplication[]>({
        queryKey: ['lightCampusApplications', 'admin'],
        queryFn: () => apiClient('/api/light-campuses/admin/applications', 'GET')
    });

    const saveCampusMutation = useMutation({
        mutationFn: (campusData: Partial<LightCampus>) => {
            const method = editingCampus ? 'PUT' : 'POST';
            const url = editingCampus ? `/api/light-campuses/admin/${editingCampus.id}` : '/api/light-campuses/admin';
            return apiClient(url, method, campusData);
        },
        onSuccess: () => {
            toast.success("Campus saved successfully.");
            queryClient.invalidateQueries({ queryKey: ['lightCampuses', 'admin'] });
            handleCloseModal();
        },
        onError: (e: Error) => toast.error(`Save failed: ${e.message}`)
    });

    const deleteCampusMutation = useMutation({
        mutationFn: (id: string) => apiClient(`/api/light-campuses/admin/${id}`, 'DELETE'),
        onSuccess: () => {
            toast.success("Campus deleted.");
            queryClient.invalidateQueries({ queryKey: ['lightCampuses', 'admin'] });
        },
        onError: (e: Error) => toast.error(`Deletion failed: ${e.message}`)
    });

    const appActionMutation = useMutation({
        mutationFn: ({ id, action }: { id: string; action: 'approve' | 'reject' }) => 
            apiClient(`/api/light-campuses/admin/applications/${id}/${action}`, 'PUT'),
        onSuccess: (_, { action }) => {
            toast.success(`Application ${action}d.`);
            queryClient.invalidateQueries({ queryKey: ['lightCampusApplications', 'admin'] });
            queryClient.invalidateQueries({ queryKey: ['lightCampuses', 'admin'] });
            queryClient.invalidateQueries({ queryKey: ['lightCampuses', 'public'] });
        },
        onError: (e: Error) => toast.error(`Action failed: ${e.message}`)
    });

    const handleOpenModal = (campus: LightCampus | null = null) => {
        setEditingCampus(campus);
        setFormState(campus ? { ...campus, isActive: campus.isActive !== false } : { isActive: true });
        setSelectedImages(campus?.images || []);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCampus(null);
        setFormState({});
        setSelectedImages([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDeleteCampus = (id: string) => {
        if (window.confirm('Are you sure you want to delete this campus? This is permanent.')) {
            deleteCampusMutation.mutate(id);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormState(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        
        // Check file sizes
        const oversizedFiles = fileArray.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            toast.error('Some files are too large. Please use files under 5MB.');
            return;
        }

        setUploadingImages(true);
        try {
            const uploadPromises = fileArray.map(async (file) => {
                const imageUrl = await uploadImage(file, 'campus-images');
                return {
                    url: imageUrl,
                    publicId: imageUrl.split('/').pop()?.split('.')[0] || '',
                    alt: `${formState.name || 'Campus'} image`,
                    uploadedAt: new Date().toISOString(),
                    uploadedBy: 'admin'
                } as MediaAsset;
            });

            const uploadedImages = await Promise.all(uploadPromises);
            setSelectedImages(prev => [...prev, ...uploadedImages]);
            toast.success(`${uploadedImages.length} image(s) uploaded successfully!`);
        } catch (error) {
            toast.error('Failed to upload some images. Please try again.');
        } finally {
            setUploadingImages(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleCampusSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const campusData = {
            ...formState,
            images: selectedImages
        };
        saveCampusMutation.mutate(campusData);
    };
    
    const isLoading = isLoadingCampuses || isLoadingApps;
    const pendingApplications = applications.filter(a => a.status === 'Pending');

    return (
        <div className="admin-glass p-4 sm:p-6 rounded-2xl">
            <div className="flex justify-start mb-6 space-x-2 border-b border-brand-muted pb-4">
                <Button variant={activeTab === 'applications' ? 'primary' : 'secondary'} onClick={() => setActiveTab('applications')}>Applications ({pendingApplications.length})</Button>
                <Button variant={activeTab === 'campuses' ? 'primary' : 'secondary'} onClick={() => setActiveTab('campuses')}>Manage Campuses</Button>
            </div>

            {isLoading ? <div className="flex justify-center items-center h-64"><Spinner /></div> : (
                <>
                    {activeTab === 'applications' && (
                        <div className="space-y-4">
                            {applications.length > 0 ? applications.map(app => (
                                <div key={app.id} className="admin-card p-4 rounded-xl">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center space-x-4">
                                           <img src={app.avatarUrl || `https://ui-avatars.com/api/?name=${app.applicantName}&background=0D8ABC&color=fff`} alt={app.applicantName} className="w-12 h-12 rounded-full" />
                                           <div>
                                               <p className="text-sm text-brand-text-dark">Proposed Leader: <span className="font-bold text-white">{app.proposedLeaderName} ({app.contactInfo})</span></p>
                                               <h3 className="text-lg font-bold text-brand-gold mt-1">{app.name}</h3>
                                               <p className="text-white mt-4 italic">"{app.description}"</p>
                                           </div>
                                       </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ app.status === 'Approved' ? 'bg-green-500/20 text-green-400' : app.status === 'Rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                    {app.status === 'Pending' && (
                                         <div className="mt-4 pt-4 border-t border-brand-muted flex justify-end space-x-2">
                                            <Button size="sm" variant="secondary" onClick={() => appActionMutation.mutate({ id: app.id!, action: 'reject' })}>Reject</Button>
                                            <Button size="sm" variant="primary" onClick={() => appActionMutation.mutate({ id: app.id!, action: 'approve' })}>Approve</Button>
                                         </div>
                                    )}
                                </div>
                            )) : <p className="text-center py-10 text-brand-text-dark">No applications yet.</p>}
                        </div>
                    )}

                    {activeTab === 'campuses' && (
                        <div>
                            <div className="flex justify-end mb-6">
                                <Button onClick={() => handleOpenModal()}>+ Add New Campus</Button>
                            </div>
                            <div className="space-y-4">
                                {campuses.length > 0 ? campuses.map(campus => (
                                    <div key={campus.id} className="admin-card p-4 rounded-xl flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{campus.name}</h3>
                                            <p className="text-sm text-brand-text-dark">{campus.leaderName}</p>
                                            <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${campus.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{campus.isActive ? 'Active' : 'Inactive'}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Button size="sm" variant="secondary" onClick={() => handleOpenModal(campus)}>Edit</Button>
                                            <button title="Delete Campus" onClick={() => handleDeleteCampus(campus.id!)} className="text-red-500 hover:text-red-400 p-2 rounded-md hover:bg-red-500/10"><ICONS.Trash2 className="w-5 h-5"/></button>
                                        </div>
                                    </div>
                                )) : <p className="text-center py-10 text-brand-text-dark">No campuses created yet.</p>}
                            </div>
                        </div>
                    )}
                </>
            )}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCampus ? 'Edit Campus' : 'Add New Campus'}>
                <form onSubmit={handleCampusSubmit} className="space-y-6">
                    <Input label="Campus Name" name="name" value={formState.name || ''} onChange={handleInputChange} required />
                    <Input label="Location" name="location" value={formState.location || ''} onChange={handleInputChange} required />
                    <Input label="Leader Name" name="leaderName" value={formState.leaderName || ''} onChange={handleInputChange} required />
                    <Input label="Contact Info (Email/Phone)" name="contactInfo" value={formState.contactInfo || ''} onChange={handleInputChange} required />
                    <Input label="Meeting Schedule" name="meetingSchedule" value={formState.meetingSchedule || ''} onChange={handleInputChange} required />
                    
                    {/* Image Upload Section */}
                    <div>
                        <label className="block text-sm font-medium text-brand-text-dark mb-2">Campus Images</label>
                        <div className="space-y-4">
                            {/* Upload Button */}
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="campus-images"
                                />
                                <label
                                    htmlFor="campus-images"
                                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-brand-muted border-dashed rounded-md text-sm font-medium text-brand-text-dark hover:text-white hover:border-brand-gold transition-colors"
                                >
                                    <ICONS.UploadCloud className="w-4 h-4 mr-2" />
                                    {uploadingImages ? 'Uploading...' : 'Upload Images'}
                                </label>
                                <p className="text-xs text-brand-text-dark mt-1">Select multiple images (max 5MB each)</p>
                            </div>

                            {/* Loading indicator */}
                            {uploadingImages && (
                                <div className="flex items-center justify-center py-4">
                                    <Spinner />
                                    <span className="ml-2 text-sm text-brand-text-dark">Uploading images...</span>
                                </div>
                            )}

                            {/* Image Preview Grid */}
                            {selectedImages.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {selectedImages.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image.url}
                                                alt={image.alt || `Campus image ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-md border border-brand-muted"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Remove image"
                                            >
                                                <ICONS.X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center">
                        <input id="isActive" name="isActive" type="checkbox" checked={formState.isActive || false} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold bg-brand-muted" />
                        <label htmlFor="isActive" className="ml-3 block text-sm text-brand-text">Show this campus on the public page</label>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button type="submit" isLoading={saveCampusMutation.isPending || uploadingImages} disabled={uploadingImages}>Save Campus</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageCampuses;
