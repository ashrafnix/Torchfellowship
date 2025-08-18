import React, { useState, useEffect } from 'react';
import { SiteContent } from '../../types.ts';
import Spinner from '../../components/ui/Spinner.tsx';
import Button from '../../components/ui/Button.tsx';
import Input from '../../components/ui/Input.tsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi.ts';
import { toast } from 'react-toastify';

type PageKey = 'home' | 'give' | 'contact';

const pageFields: Record<PageKey, { id: string, label: string, type: 'text' | 'textarea' }[]> = {
    home: [
        { id: 'heroTitle', label: 'Hero Title', type: 'text' },
        { id: 'heroSubtitle', label: 'Hero Subtitle', type: 'textarea' },
        { id: 'connectTitle', label: 'Connect Section Title', type: 'text' },
        { id: 'connectSubtitle', label: 'Connect Section Subtitle', type: 'textarea' },
    ],
    give: [
        { id: 'giveTitle', label: 'Give Page Title', type: 'text' },
        { id: 'giveVerse', label: 'Give Page Verse', type: 'textarea' },
    ],
    contact: [
        { id: 'contactTitle', label: 'Contact Page Title', type: 'text' },
        { id: 'contactSubtitle', label: 'Contact Page Subtitle', type: 'textarea' },
    ],
};

const ManageContent: React.FC = () => {
    const [activePage, setActivePage] = useState<PageKey>('home');
    const [contentElements, setContentElements] = useState<{[key: string]: string}>({});

    const { apiClient } = useApi();
    const queryClient = useQueryClient();

    const { data: content, isLoading } = useQuery<SiteContent>({
        queryKey: ['siteContent', activePage],
        queryFn: () => apiClient(`/api/site-content?page=${activePage}`, 'GET'),
        initialData: { page: activePage, elements: {} }
    });
    
    useEffect(() => {
        if (content) {
            setContentElements(content.elements);
        }
    }, [content]);

    const mutation = useMutation({
        mutationFn: (newContent: { page: PageKey, elements: { [key: string]: string }}) => 
            apiClient('/api/site-content', 'POST', newContent),
        onSuccess: (_, variables) => {
            toast.success("Content saved successfully!");
            queryClient.invalidateQueries({ queryKey: ['siteContent', variables.page] });
        },
        onError: (error: Error) => {
            toast.error(`Error saving content: ${error.message}`);
        }
    });
    
    const handleInputChange = (elementId: string, value: string) => {
        setContentElements(prev => ({ ...prev, [elementId]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ page: activePage, elements: contentElements });
    };

    return (
        <div className="bg-brand-surface p-4 sm:p-6 rounded-lg border border-brand-muted/50">
            <div className="flex justify-start mb-6 space-x-2 border-b border-brand-muted pb-4">
                {(Object.keys(pageFields) as PageKey[]).map(page => (
                    <Button
                        key={page}
                        variant={activePage === page ? 'primary' : 'secondary'}
                        onClick={() => setActivePage(page)}
                    >
                        {page.charAt(0).toUpperCase() + page.slice(1)} Page
                    </Button>
                ))}
            </div>
            {isLoading ? <div className="flex justify-center"><Spinner /></div> : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {pageFields[activePage].map(field => (
                        <div key={field.id}>
                            {field.type === 'textarea' ? (
                                <div>
                                    <label className="block text-sm font-medium text-brand-text-dark mb-1">{field.label}</label>
                                    <textarea
                                        rows={4}
                                        value={contentElements[field.id] || ''}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                        className="w-full bg-brand-dark border border-brand-muted rounded-md p-3 text-brand-text focus:ring-brand-gold focus:border-brand-gold"
                                    />
                                </div>
                            ) : (
                                <Input
                                    label={field.label}
                                    value={contentElements[field.id] || ''}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                     <div className="flex justify-end pt-4">
                        <Button type="submit" isLoading={mutation.isPending}>Save Content</Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ManageContent;
