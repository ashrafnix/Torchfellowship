import React, { useState } from 'react';
import { MinistryTeam, VolunteerApplication } from '../../types.ts';
import Button from '../../components/ui/Button.tsx';
import Modal from '../../components/ui/Modal.tsx';
import { ICONS } from '../../constants.tsx';
import Spinner from '../../components/ui/Spinner.tsx';
import Input from '../../components/ui/Input.tsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi.ts';
import { uploadImage } from '../../services/uploadService.ts';
import { toast } from 'react-toastify';

type ActiveTab = 'teams' | 'applications';

const ManageServe: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('teams');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<MinistryTeam | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [formState, setFormState] = useState<Partial<MinistryTeam>>({});

    const { apiClient } = useApi();
    const queryClient = useQueryClient();

    const { data: teams = [], isLoading: isLoadingTeams } = useQuery<MinistryTeam[]>({
        queryKey: ['ministryTeams', 'admin'],
        queryFn: () => apiClient('/api/ministry-teams/admin', 'GET'),
    });
    
    const { data: applications = [], isLoading: isLoadingApps } = useQuery<VolunteerApplication[]>({
        queryKey: ['volunteerApplications', 'admin'],
        queryFn: () => apiClient('/api/volunteer/applications', 'GET'),
    });

    const deleteTeamMutation = useMutation({
        mutationFn: (id: string) => apiClient(`/api/ministry-teams/${id}`, 'DELETE'),
        onSuccess: () => {
            toast.success("Team deleted.");
            queryClient.invalidateQueries({ queryKey: ['ministryTeams', 'admin'] });
        },
        onError: (e: Error) => toast.error(`Deletion failed: ${e.message}`)
    });

    const saveTeamMutation = useMutation({
        mutationFn: async (teamData: Partial<MinistryTeam>) => {
            let finalImageUrl = editingTeam?.imageUrl || teamData.imageUrl || null;
            if (photoFile) finalImageUrl = await uploadImage(photoFile, 'ministry-teams');
            if (!finalImageUrl) throw new Error("An image is required.");
            
            const payload = { ...teamData, imageUrl: finalImageUrl };
            const method = editingTeam ? 'PUT' : 'POST';
            const url = editingTeam ? `/api/ministry-teams/${editingTeam._id}` : '/api/ministry-teams';
            return apiClient(url, method, payload);
        },
        onSuccess: () => {
            toast.success("Team saved successfully.");
            queryClient.invalidateQueries({ queryKey: ['ministryTeams', 'admin'] });
            handleCloseModal();
        },
        onError: (e: Error) => toast.error(`Save failed: ${e.message}`)
    });

    const updateAppStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: 'Approved' | 'Rejected' }) =>
            apiClient(`/api/volunteer/applications/${id}`, 'PUT', { status }),
        onSuccess: (_, { status }) => {
            toast.success(`Application ${status.toLowerCase()}.`);
            queryClient.invalidateQueries({ queryKey: ['volunteerApplications', 'admin'] });
        },
        onError: (e: Error) => toast.error(`Update failed: ${e.message}`)
    });

    const handleOpenModal = (team: MinistryTeam | null = null) => {
        setEditingTeam(team);
        setFormState(team ? { ...team, isActive: team.isActive !== false } : { isActive: true });
        setPhotoPreview(team?.imageUrl || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTeam(null);
        setPhotoPreview(null);
        setPhotoFile(null);
        setFormState({});
    };

    const handleDeleteTeam = (id: string) => {
        if(window.confirm('Are you sure you want to delete this team? This is permanent.')) {
            deleteTeamMutation.mutate(id);
        }
    };
    
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
              toast.error('Image file is too large (max 2MB).');
              return;
            }
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormState(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleTeamSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveTeamMutation.mutate(formState);
    };

    const isLoading = isLoadingTeams || isLoadingApps;
    const pendingApplicationsCount = applications.filter(a => a.status === 'Pending').length;

    return (
        <div className="bg-brand-surface p-4 sm:p-6 rounded-lg border border-brand-muted/50">
            <div className="flex justify-start mb-6 space-x-2 border-b border-brand-muted pb-4">
                <Button variant={activeTab === 'teams' ? 'primary' : 'secondary'} onClick={() => setActiveTab('teams')}>Manage Teams</Button>
                <Button variant={activeTab === 'applications' ? 'primary' : 'secondary'} onClick={() => setActiveTab('applications')}>Applications ({pendingApplicationsCount})</Button>
            </div>

            {isLoading ? <div className="flex justify-center items-center h-64"><Spinner /></div> : (
                <>
                    {activeTab === 'teams' && (
                        <div>
                            <div className="flex justify-end mb-6">
                                <Button onClick={() => handleOpenModal()}>+ Add New Team</Button>
                            </div>
                            <div className="space-y-4">
                                {teams.length > 0 ? teams.map(team => (
                                    <div key={team._id} className="bg-brand-dark p-4 rounded-md flex items-center justify-between border border-brand-muted">
                                        <div className="flex items-center space-x-4">
                                            <img src={team.imageUrl || ''} alt={team.name} className="w-20 h-20 object-cover rounded-md" />
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{team.name}</h3>
                                                <p className="text-sm text-brand-text-dark">{team.leaderName}</p>
                                                 <span className={`px-2 py-1 text-xs font-semibold rounded-full ${team.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                    {team.isActive ? 'Active' : 'Inactive'}
                                                 </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Button size="sm" variant="secondary" onClick={() => handleOpenModal(team)}>Edit</Button>
                                            <button onClick={() => handleDeleteTeam(team._id!)} className="text-red-500 hover:text-red-400 p-2 rounded-md hover:bg-red-500/10"><ICONS.Trash2 className="w-5 h-5"/></button>
                                        </div>
                                    </div>
                                )) : <p className="text-center py-10 text-brand-text-dark">No teams created yet.</p>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'applications' && (
                         <div className="space-y-4">
                            {applications.length > 0 ? applications.map(app => (
                                <div key={app._id} className="bg-brand-dark p-4 rounded-md border border-brand-muted">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-brand-text-dark">Applying for: <span className="font-bold text-brand-gold">{app.teamName}</span></p>
                                            <h3 className="text-lg font-bold text-white">{app.userName}</h3>
                                            <p className="text-sm text-brand-text-dark">{app.userEmail}</p>
                                            <p className="text-white mt-4 italic">"{app.message}"</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                app.status === 'Approved' ? 'bg-green-500/20 text-green-400' : 
                                                app.status === 'Rejected' ? 'bg-red-500/20 text-red-400' : 
                                                'bg-yellow-500/20 text-yellow-400'}`}>
                                                {app.status}
                                            </span>
                                            <p className="text-xs text-brand-text-dark mt-1">{new Date(app.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    {app.status === 'Pending' && (
                                         <div className="mt-4 pt-4 border-t border-brand-muted flex justify-end space-x-2">
                                            <Button size="sm" variant="secondary" onClick={() => updateAppStatusMutation.mutate({ id: app._id!, status: 'Rejected' })}>Reject</Button>
                                            <Button size="sm" variant="primary" onClick={() => updateAppStatusMutation.mutate({ id: app._id!, status: 'Approved' })}>Approve</Button>
                                         </div>
                                    )}
                                </div>
                            )) : <p className="text-center py-10 text-brand-text-dark">No applications yet.</p>}
                         </div>
                    )}
                </>
            )}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTeam ? 'Edit Team' : 'Add New Team'}>
                <form onSubmit={handleTeamSubmit} className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <img src={photoPreview || 'https://via.placeholder.com/100x100.png/2B2F36/EAEAEA?text=Photo'} alt="Preview" className="w-24 h-24 rounded-md object-cover"/>
                            <label htmlFor="photo-upload" className="absolute -bottom-1 -right-1 bg-brand-gold text-brand-dark p-1.5 rounded-full cursor-pointer hover:bg-brand-gold-dark">
                                <ICONS.Edit className="w-4 h-4" /><input id="photo-upload" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
                            </label>
                        </div>
                        <div className="flex-grow"><Input label="Team Name" name="name" value={formState.name || ''} onChange={handleInputChange} required /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Leader Name" name="leaderName" value={formState.leaderName || ''} onChange={handleInputChange} required />
                        <Input label="Contact Email" name="contactEmail" type="email" value={formState.contactEmail || ''} onChange={handleInputChange} required />
                    </div>
                    <textarea name="description" rows={4} value={formState.description || ''} onChange={handleInputChange} placeholder="Team Description" className="w-full bg-brand-dark border border-brand-muted rounded-md p-3 text-brand-text focus:ring-brand-gold" required />
                    <div className="flex items-center">
                        <input id="isActive" name="isActive" type="checkbox" checked={formState.isActive || false} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold bg-brand-muted" />
                        <label htmlFor="isActive" className="ml-3 block text-sm text-brand-text">Show this team on the public "Serve" page</label>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button type="submit" isLoading={saveTeamMutation.isPending}>Save Team</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageServe;
