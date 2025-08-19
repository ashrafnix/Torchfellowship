import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import Spinner from '../../components/ui/Spinner';

const ManageNewConverts: React.FC = () => {
    const { apiClient } = useApi();

    const { data: newConverts = [], isLoading } = useQuery<any[]>({
        queryKey: ['newConverts', 'admin'],
        queryFn: () => apiClient('/api/new-converts', 'GET'),
    });

    return (
        <div className="bg-brand-surface p-4 sm:p-6 rounded-lg border border-brand-muted/50">
            {isLoading ? <div className="flex justify-center"><Spinner /></div> : (
                <div className="space-y-4">
                    {newConverts.length > 0 ? newConverts.map(convert => (
                        <div key={convert._id} className="bg-brand-dark p-4 rounded-md border border-brand-muted">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{convert.firstName} {convert.lastName}</h3>
                                    <p className="text-sm text-brand-text-dark">{convert.email}</p>
                                    <p className="text-sm text-brand-text-dark">{convert.areaCode} {convert.phoneNumber}</p>
                                    <p className="text-sm text-brand-text-dark">{convert.country}</p>
                                    <p className="text-sm text-brand-text-dark">Community: {convert.community}</p>
                                    <p className="text-sm text-brand-text-dark">WhatsApp: {convert.whatsApp}</p>
                                    <p className="text-sm text-brand-text-dark">WhatsApp Group: {convert.whatsAppGroup}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-brand-text-dark">{new Date(convert.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    )) : <p className="text-center text-brand-text-dark py-8">No new converts yet.</p>}
                </div>
            )}
        </div>
    );
};

export default ManageNewConverts;