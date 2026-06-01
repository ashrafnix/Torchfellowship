'use client';

import React from 'react';
import { ICONS } from '@/src/constants';
import Spinner from '@/components/ui/Spinner';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';

interface Registration {
  id: string;
  name: string;
  email: string;
  contact: string;
  isFirstTimeVisitor: boolean;
  wishesToVolunteer: boolean;
  placeOfResidence: string;
  createdAt: string;
}

const ManageTuesdayFellowship: React.FC = () => {
    const { apiClient } = useApi();

    const { data, isLoading } = useQuery<{registrations: Registration[]}>({
        queryKey: ['tuesday_fellowship_registrations', 'admin'],
        queryFn: () => apiClient('/api/tuesday-fellowship', 'GET')
    });

    const registrations = data?.registrations || [];

    const stats = {
        total: registrations.length,
        firstTimers: registrations.filter(r => r.isFirstTimeVisitor).length,
        volunteers: registrations.filter(r => r.wishesToVolunteer).length
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="admin-glass p-6 rounded-2xl flex items-center space-x-4 border border-brand-gold/20">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                        <ICONS.Users className="h-8 w-8 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Total Registrations</p>
                        <h3 className="text-3xl font-bold text-white">{stats.total}</h3>
                    </div>
                </div>
                <div className="admin-glass p-6 rounded-2xl flex items-center space-x-4 border border-brand-gold/20">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                        <ICONS.UserPlus className="h-8 w-8 text-green-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">First Time Visitors</p>
                        <h3 className="text-3xl font-bold text-white">{stats.firstTimers}</h3>
                    </div>
                </div>
                <div className="admin-glass p-6 rounded-2xl flex items-center space-x-4 border border-brand-gold/20">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                        <ICONS.HeartHandshake className="h-8 w-8 text-purple-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Potential Volunteers</p>
                        <h3 className="text-3xl font-bold text-white">{stats.volunteers}</h3>
                    </div>
                </div>
            </div>

            <div className="admin-glass p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Recent Registrations</h2>
                </div>
                
                {isLoading ? <div className="flex justify-center py-12"><Spinner /></div> : (
                    <div className="overflow-x-auto">
                        {registrations.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-700/50">
                                        <th className="py-3 px-4 font-semibold text-gray-400">Date</th>
                                        <th className="py-3 px-4 font-semibold text-gray-400">Name</th>
                                        <th className="py-3 px-4 font-semibold text-gray-400">Email</th>
                                        <th className="py-3 px-4 font-semibold text-gray-400">Contact</th>
                                        <th className="py-3 px-4 font-semibold text-gray-400">Location</th>
                                        <th className="py-3 px-4 font-semibold text-gray-400 text-center">First Time</th>
                                        <th className="py-3 px-4 font-semibold text-gray-400 text-center">Volunteer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registrations.map(reg => (
                                        <tr key={reg.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                                            <td className="py-3 px-4 text-sm text-gray-300">
                                                {new Date(reg.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4 font-medium text-white">{reg.name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-300">{reg.email || 'N/A'}</td>
                                            <td className="py-3 px-4 text-sm text-gray-300">{reg.contact}</td>
                                            <td className="py-3 px-4 text-sm text-gray-300">{reg.placeOfResidence}</td>
                                            <td className="py-3 px-4 text-center">
                                                {reg.isFirstTimeVisitor ? (
                                                    <span className="inline-block px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs">Yes</span>
                                                ) : (
                                                    <span className="inline-block px-2 py-1 rounded bg-gray-500/20 text-gray-400 text-xs">No</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {reg.wishesToVolunteer ? (
                                                    <span className="inline-block px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs">Yes</span>
                                                ) : (
                                                    <span className="inline-block px-2 py-1 rounded bg-gray-500/20 text-gray-400 text-xs">No</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-12">
                                <ICONS.Users className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                                <p className="text-gray-400">No registrations found.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageTuesdayFellowship;
