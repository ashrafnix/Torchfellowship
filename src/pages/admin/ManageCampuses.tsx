import React, { useState } from 'react';
import { LightCampus, LightCampusApplication } from '../../types.ts';
import Button from '../../components/ui/Button.tsx';
import Modal from '../../components/ui/Modal.tsx';
import { ICONS } from '../../constants.tsx';
import Spinner from '../../components/ui/Spinner.tsx';
import Input from '../../components/ui/Input.tsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi.ts';
import { toast } from 'react-toastify';

type ActiveTab = 'applications' | 'campuses';

const ManageCampuses: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('applications');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCampus, setEditingCampus] = useState<LightCampus | null>(null);
    const [formState, setFormState] = useState<Partial<LightCampus>>({});

    const { apiClient } = useApi();
    const queryClient = useQueryClient();

    const { data: campuses = [], isLoading: isLoadingCampuses } = useQuery<LightCampus[]>({
        queryKey: ['lightCampuses', 'admin'],
        queryFn: () => apiClient('/api/light-campuses/admin/all', 'GET')
    });

    const { data: applications = [], isLoading: isLoadingApps } = useQuery<LightCampusApplication[]>({
        queryKey: ['lightCampusApplications', 'admin'],
        queryFn: () => apiClient('/api/light-campuses/applications', 'GET')
    });

    const saveCampusMutation = useMutation({
        mutationFn: (campusData: Partial<LightCampus>) => {
            const method = editingCampus ? 'PUT' : 'POST';
            const url = editingCampus ? `/api/light-campuses/admin/${editingCampus._id}` : '/api/light-campuses/admin';
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
            apiClient(`/api/light-campuses/applications/${id}/${action}`, 'PUT'),
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
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCampus(null);
        setFormState({});
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

    const handleCampusSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveCampusMutation.mutate(formState);
    };
    
    const isLoading = isLoadingCampuses || isLoadingApps;
    const pendingApplications = applications.filter(a => a.status === 'Pending');

    return (
        <div className="bg-brand-surface p-4 sm:p-6 rounded-lg border border-brand-muted/50">
            <div className="flex justify-start mb-6 space-x-2 border-b border-brand-muted pb-4">
                <Button variant={activeTab === 'applications' ? 'primary' : 'secondary'} onClick={() => setActiveTab('applications')}>Applications ({pendingApplications.length})</Button>
                <Button variant={activeTab === 'campuses' ? 'primary' : 'secondary'} onClick={() => setActiveTab('campuses')}>Manage Campuses</Button>
            </div>

            {isLoading ? <div className="flex justify-center items-center h-64"><Spinner /></div> : (
                <>
                    {activeTab === 'applications' && (
                        <div className="space-y-4">
                            {applications.length > 0 ? applications.map(app => (
                                <div key={app._id} className="bg-brand-dark p-4 rounded-md border border-brand-muted">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-brand-text-dark">Applicant: <span className="font-bold text-white">{app.applicantName} ({app.applicantEmail})</span></p>
                                            <h3 className="text-lg font-bold text-brand-gold mt-1">{app.proposedCampusName}</h3>
                                            <p className="text-white mt-4 italic">"{app.missionStatement}"</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ app.status === 'Approved' ? 'bg-green-500/20 text-green-400' : app.status === 'Rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                    {app.status === 'Pending' && (
                                         <div className="mt-4 pt-4 border-t border-brand-muted flex justify-end space-x-2">
                                            <Button size="sm" variant="secondary" onClick={() => appActionMutation.mutate({ id: app._id!, action: 'reject' })}>Reject</Button>
                                            <Button size="sm" variant="primary" onClick={() => appActionMutation.mutate({ id: app._id!, action: 'approve' })}>Approve</Button>
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
                                    <div key={campus._id} className="bg-brand-dark p-4 rounded-md flex items-center justify-between border border-brand-muted">
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{campus.name}</h3>
                                            <p className="text-sm text-brand-text-dark">{campus.leaderName}</p>
                                            <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${campus.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{campus.isActive ? 'Active' : 'Inactive'}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Button size="sm" variant="secondary" onClick={() => handleOpenModal(campus)}>Edit</Button>
                                            <button onClick={() => handleDeleteCampus(campus._id!)} className="text-red-500 hover:text-red-400 p-2 rounded-md hover:bg-red-500/10"><ICONS.Trash2 className="w-5 h-5"/></button>
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
                    <div className="flex items-center">
                        <input id="isActive" name="isActive" type="checkbox" checked={formState.isActive || false} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold bg-brand-muted" />
                        <label htmlFor="isActive" className="ml-3 block text-sm text-brand-text">Show this campus on the public page</label>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button type="submit" isLoading={saveCampusMutation.isPending}>Save Campus</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageCampuses;
