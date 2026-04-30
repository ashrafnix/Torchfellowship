'use client'

import React, { useState } from 'react';
import { User, UserRole } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/ui/Spinner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';
import { ICONS } from '@/src/constants';
import Button from '@/components/ui/Button';

/** Confirmation modal for destructive actions */
const ConfirmModal: React.FC<{
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}> = ({ title, message, onConfirm, onCancel, isLoading }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
        <div className="relative bg-[#1a1d24] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-red-500/20">
                    <ICONS.AlertCircle className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            <p className="text-gray-400 mb-6 text-sm">{message}</p>
            <div className="flex gap-3 justify-end">
                <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors">Cancel</button>
                <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                >
                    {isLoading ? 'Deleting…' : 'Yes, delete'}
                </button>
            </div>
        </div>
    </div>
);

const ManageUsers: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const { user: currentUser } = useAuth();
    
    const { apiClient } = useApi();
    const queryClient = useQueryClient();

    const { data: users = [], isLoading } = useQuery<User[]>({
        queryKey: ['users', 'admin'],
        queryFn: () => apiClient('/api/users', 'GET')
    });

    const deleteUserMutation = useMutation({
        mutationFn: (userId: string) => apiClient(`/api/users/${userId}`, 'DELETE'),
        onSuccess: () => {
            toast.success('User deleted successfully.');
            setUserToDelete(null);
            queryClient.invalidateQueries({ queryKey: ['users', 'admin'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete user: ${error.message}`);
        },
    });

    const updateRoleMutation = useMutation({
        mutationFn: ({ userId, role }: { userId: string, role: UserRole }) =>
            apiClient(`/api/users/${userId}/role`, 'PUT', { role }),
        onSuccess: () => {
            toast.success('User role updated successfully.');
            queryClient.invalidateQueries({ queryKey: ['users', 'admin'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to update role: ${error.message}`);
        }
    });
    
    const isSuperAdmin = currentUser?.role === UserRole.SUPER_ADMIN;

    const handleRoleChange = async (userId: string, role: UserRole) => {
        updateRoleMutation.mutate({ userId, role });
    };

    // Which roles can the current user assign?
    const assignableRoles = isSuperAdmin
        ? Object.values(UserRole)
        : Object.values(UserRole).filter(r => r !== UserRole.SUPER_ADMIN);

    const canEditUser = (target: User) => {
        if (target.id === currentUser?.id) return false; // can't edit yourself
        if (target.role === UserRole.SUPER_ADMIN && !isSuperAdmin) return false; // only super-admin can touch another super-admin
        return true;
    };
    
    const getRoleTagStyle = (role: UserRole) => {
        switch (role) {
            case UserRole.SUPER_ADMIN:
                return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30';
            case UserRole.ADMIN:
                return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30';
            default:
                return 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-400 border-gray-500/30';
        }
    };
    
    const filteredUsers = users.filter(user => 
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Delete Confirmation Modal */}
            {userToDelete && (
                <ConfirmModal
                    title="Delete User"
                    message={`Are you sure you want to permanently delete "${userToDelete.fullName || userToDelete.email}"? This action cannot be undone.`}
                    onConfirm={() => deleteUserMutation.mutate(userToDelete.id)}
                    onCancel={() => setUserToDelete(null)}
                    isLoading={deleteUserMutation.isPending}
                />
            )}

            {/* Header with Search and Stats */}
            <div className="admin-search rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="relative flex-1 max-w-md">
                        <ICONS.User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                    </div>
                    {!isLoading && (
                        <p className="text-xs text-gray-500 mt-2 ml-1">
                            {filteredUsers.length} of {users.length} user{users.length !== 1 ? 's' : ''}
                            {searchTerm && ' matching search'}
                        </p>
                    )}
                </div>
            </div>

            {/* Users Table */}
            <div className="admin-glass rounded-2xl p-6">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64"><Spinner /></div>
                ) : (
                    <div className="overflow-x-auto admin-scroll">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-4 px-2 text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                                    <th className="text-left py-4 px-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                                    <th className="text-left py-4 px-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                                    <th className="text-right py-4 px-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="admin-row">
                                        <td className="py-4 px-2">
                                            <div className="flex items-center space-x-4">
                                                <div className="relative">
                                                    <img 
                                                        className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10" 
                                                        src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullName || user.email}&background=2B2F36&color=EAEAEA`} 
                                                        alt="" 
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                                                </div>
                                                <div>
                                                    <div className="text-base font-semibold text-white">{user.fullName || 'N/A'}</div>
                                                    <div className="text-sm text-gray-400">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleTagStyle(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2 text-sm text-gray-300">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                        </td>
                                        <td className="py-4 px-2 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {canEditUser(user) ? (
                                                    <>
                                                        <div className="relative inline-block">
                                                            <select 
                                                                title={`Change role for ${user.fullName || user.email}`}
                                                                value={user.role} 
                                                                onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                                                className="appearance-none bg-white/5 hover:bg-white/10 text-white rounded-lg px-4 py-2 pr-8 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
                                                                disabled={updateRoleMutation.isPending}
                                                            >
                                                                {assignableRoles.map(role => 
                                                                    <option key={role} value={role}>{role}</option>
                                                                )}
                                                            </select>
                                                            <ICONS.ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                                        </div>
                                                        <button
                                                            onClick={() => setUserToDelete(user)}
                                                            title={`Delete ${user.fullName || user.email}`}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                        >
                                                            <ICONS.Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-gray-500 italic px-4">
                                                        {user.id === currentUser?.id ? 'You' : 'Protected'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {filteredUsers.length === 0 && (
                            <div className="text-center py-12">
                                <ICONS.Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-400">No users found matching your search.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
