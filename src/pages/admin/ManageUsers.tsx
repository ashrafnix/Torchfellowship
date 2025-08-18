import React, { useState } from 'react';
import { User, UserRole } from '../../types.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import Spinner from '../../components/ui/Spinner.tsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi.ts';
import { toast } from 'react-toastify';

const ManageUsers: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { user: currentUser } = useAuth();
    
    const { apiClient } = useApi();
    const queryClient = useQueryClient();

    const { data: users = [], isLoading } = useQuery<User[]>({
        queryKey: ['users', 'admin'],
        queryFn: () => apiClient('/api/users', 'GET')
    });

    const updateRoleMutation = useMutation({
        mutationFn: ({ userId, role }: { userId: string, role: UserRole }) =>
            apiClient(`/api/users/${userId}/role`, 'PUT', { role }),
        onSuccess: () => {
            toast.success("User role updated successfully.");
            queryClient.invalidateQueries({ queryKey: ['users', 'admin'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to update role: ${error.message}`);
        }
    });
    
    const handleRoleChange = async (userId: string, role: UserRole) => {
        updateRoleMutation.mutate({ userId, role });
    };
    
    const filteredUsers = users.filter(user => 
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-brand-surface p-4 sm:p-6 rounded-lg border border-brand-muted/50">
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-sm bg-brand-dark border border-brand-muted rounded-md py-2 px-4 text-brand-text placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-64"><Spinner /></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-brand-muted">
                        <thead className="bg-brand-dark/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-text-dark uppercase tracking-wider">User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-text-dark uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-text-dark uppercase tracking-wider">Joined</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-brand-surface divide-y divide-brand-muted">
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full object-cover" src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullName || user.email}&background=2B2F36&color=EAEAEA`} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-white">{user.fullName || 'N/A'}</div>
                                                <div className="text-sm text-brand-text-dark">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text-dark">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                       <select 
                                            value={user.role} 
                                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                            className="bg-brand-muted text-white rounded-md p-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                            disabled={user.id === currentUser?.id || user.role === UserRole.SUPER_ADMIN || updateRoleMutation.isPending}
                                        >
                                           {Object.values(UserRole).map(role => <option key={role} value={role} disabled={role === UserRole.SUPER_ADMIN}>{role}</option>)}
                                       </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
