import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../../components/ui/Spinner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { toast } from 'react-toastify';
import { ICONS } from '../../constants';
import Button from '../../components/ui/Button';

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
            <style>{`
                .users-table-container {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0));
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.3);
                }
                
                .user-row {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.2s ease-in-out;
                }
                
                .user-row:last-child {
                    border-bottom: none;
                }
                
                .user-row:hover {
                    background-color: rgba(255, 255, 255, 0.03);
                    transform: translateY(-1px);
                }
                
                .search-container {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0));
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
            `}</style>
            
            {/* Header with Search and Add Button */}
            <div className="search-container rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-medium">
                    <ICONS.Users className="h-5 w-5 mr-2" />
                    Add User
                </Button>
            </div>

            {/* Users Table */}
            <div className="users-table-container rounded-2xl p-6">
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
                                    <tr key={user.id} className="user-row">
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
                                            <div className="relative inline-block">
                                                <select 
                                                    title={`Change role for ${user.fullName || user.email}`}
                                                    value={user.role} 
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                                    className="appearance-none bg-white/5 hover:bg-white/10 text-white rounded-lg px-4 py-2 pr-8 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
                                                    disabled={user.id === currentUser?.id || user.role === UserRole.SUPER_ADMIN || updateRoleMutation.isPending}
                                                >
                                                    {Object.values(UserRole).map(role => 
                                                        <option key={role} value={role} disabled={role === UserRole.SUPER_ADMIN}>
                                                            {role}
                                                        </option>
                                                    )}
                                                </select>
                                                <ICONS.ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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
