'use client'

import React, { useState, useEffect } from 'react';
import type { TorchKidsContent } from '@/lib/types';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';

const ManageTorchKids: React.FC = () => {
    const [content, setContent] = useState<Partial<TorchKidsContent>>({});

    const { apiClient } = useApi();
    const queryClient = useQueryClient();

    const { data: initialContent, isLoading } = useQuery<TorchKidsContent>({
        queryKey: ['torchKidsContent', 'admin'],
        queryFn: () => apiClient('/api/torch-kids/admin', 'GET'),
    });
    
    useEffect(() => {
        if (initialContent) {
            setContent(initialContent);
        }
    }, [initialContent]);

    const mutation = useMutation({
        mutationFn: (newContent: Partial<TorchKidsContent>) => 
            apiClient('/api/torch-kids/admin', 'PUT', newContent),
        onSuccess: () => {
            toast.success("Torch Kids content saved successfully!");
            queryClient.invalidateQueries({ queryKey: ['torchKidsContent', 'admin'] });
            queryClient.invalidateQueries({ queryKey: ['torchKidsContent'] }); // Invalidate public query
        },
        onError: (error: Error) => {
            toast.error(`Error saving content: ${error.message}`);
        }
    });
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContent(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(content);
    };

    const FormTextarea: React.FC<{label: string, name: keyof TorchKidsContent, rows: number}> = ({ label, name, rows }) => (
        <div>
            <label className="block text-sm font-medium text-brand-text-dark mb-1">{label}</label>
            <textarea
                title={label}
                placeholder={`Enter ${label.toLowerCase()}`}
                name={name}
                rows={rows}
                value={content[name] || ''}
                onChange={handleInputChange}
                className="w-full bg-brand-dark border border-brand-muted rounded-md p-3 text-brand-text focus:ring-brand-gold focus:border-brand-gold"
            />
        </div>
    );
    
    const FormInput: React.FC<{label: string, name: keyof TorchKidsContent}> = ({ label, name }) => (
         <div>
            <label className="block text-sm font-medium text-brand-text-dark mb-1">{label}</label>
            <input
                title={label}
                placeholder={`Enter ${label.toLowerCase()}`}
                type="text"
                name={name}
                value={content[name] || ''}
                onChange={handleInputChange}
                className="w-full bg-brand-dark border border-brand-muted rounded-md p-3 text-brand-text focus:ring-brand-gold focus:border-brand-gold"
            />
        </div>
    );

    return (
        <div className="admin-glass p-4 sm:p-6 rounded-2xl">
            {isLoading ? <div className="flex justify-center"><Spinner /></div> : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-white border-b border-brand-muted pb-3">Hero Section</h2>
                    <FormInput label="Hero Title" name="heroTitle" />
                    <FormTextarea label="Hero Subtitle" name="heroSubtitle" rows={2} />

                    <h2 className="text-2xl font-serif font-bold text-white border-b border-brand-muted pb-3 pt-4">Page Content</h2>
                    <FormTextarea label="About Section Text" name="aboutText" rows={5} />
                    <FormTextarea label="Safety Section Text" name="safetyText" rows={4} />
                    <FormTextarea label="Worship Experience Text" name="experienceText" rows={4} />
                    <FormTextarea label="Age Groups Text" name="groupsText" rows={4} />

                     <div className="flex justify-end pt-4">
                        <Button type="submit" isLoading={mutation.isPending}>Save Content</Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ManageTorchKids;
