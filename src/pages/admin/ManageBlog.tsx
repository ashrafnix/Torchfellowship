import React, { useState } from 'react';
import type { BlogPost } from '../../types.ts';
import Button from '../../components/ui/Button.tsx';
import Modal from '../../components/ui/Modal.tsx';
import { ICONS } from '../../constants.tsx';
import Spinner from '../../components/ui/Spinner.tsx';
import Input from '../../components/ui/Input.tsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi.ts';
import { uploadImage } from '../../services/uploadService.ts';
import { toast } from 'react-toastify';

const ManageBlog: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [formState, setFormState] = useState<Partial<BlogPost>>({});
    
    const { apiClient } = useApi();
    const queryClient = useQueryClient();

    const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
        queryKey: ['blogPosts', 'admin'],
        queryFn: () => apiClient('/api/blog/admin/all', 'GET'),
    });

    const saveMutation = useMutation({
        mutationFn: async (postData: Partial<BlogPost>) => {
            let finalPhotoUrl = editingPost?.featureImageUrl || postData.featureImageUrl || null;
            if (photoFile) {
                finalPhotoUrl = await uploadImage(photoFile, 'blog_features');
            }
            if (!finalPhotoUrl) throw new Error("A feature image is required.");
            
            const payload = { ...postData, featureImageUrl: finalPhotoUrl };
            const method = editingPost ? 'PUT' : 'POST';
            const url = editingPost ? `/api/blog/${editingPost._id}` : '/api/blog';
            return apiClient(url, method, payload);
        },
        onSuccess: () => {
            toast.success("Blog post saved successfully!");
            queryClient.invalidateQueries({ queryKey: ['blogPosts', 'admin'] });
            queryClient.invalidateQueries({ queryKey: ['blogPosts', 'public'] });
            handleCloseModal();
        },
        onError: (error: Error) => toast.error(`Save failed: ${error.message}`)
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => apiClient(`/api/blog/${id}`, 'DELETE'),
        onSuccess: () => {
            toast.success("Blog post deleted.");
            queryClient.invalidateQueries({ queryKey: ['blogPosts', 'admin'] });
            queryClient.invalidateQueries({ queryKey: ['blogPosts', 'public'] });
        },
        onError: (error: Error) => toast.error(`Deletion failed: ${error.message}`)
    });

    const handleOpenModal = (post: BlogPost | null = null) => {
        setEditingPost(post);
        setFormState(post || { status: 'draft' });
        setPhotoPreview(post?.featureImageUrl || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPost(null);
        setPhotoPreview(null);
        setPhotoFile(null);
        setFormState({});
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to permanently delete this blog post?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };
    
    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState(prev => ({ ...prev, status: e.target.checked ? 'published' : 'draft' }));
    }

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast.error('Image file is too large (max 2MB).');
                return;
            }
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        saveMutation.mutate(formState);
    };

    return (
        <div className="bg-brand-surface p-4 sm:p-6 rounded-lg border border-brand-muted/50">
            <div className="flex justify-end mb-6">
                <Button onClick={() => handleOpenModal()}>+ Add New Post</Button>
            </div>
            {isLoading ? <div className="flex justify-center items-center h-64"><Spinner /></div> : (
                <div className="space-y-4">
                    {posts.length > 0 ? posts.map(post => (
                        <div key={post._id} className="bg-brand-dark p-4 rounded-md flex items-center justify-between border border-brand-muted">
                            <div className="flex items-center space-x-4">
                                <img src={post.featureImageUrl || ''} alt={post.title} className="w-24 h-16 object-cover rounded-md" />
                                <div>
                                    <h3 className="text-lg font-bold text-white">{post.title}</h3>
                                    <p className="text-sm text-brand-text-dark">{post.authorName} • {new Date(post.createdAt).toLocaleDateString()}</p>
                                    <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${post.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {post.status}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Button size="sm" variant="secondary" onClick={() => handleOpenModal(post)}>Edit</Button>
                                <button onClick={() => handleDelete(post._id!)} className="text-red-500 hover:text-red-400 p-2 rounded-md hover:bg-red-500/10"><ICONS.Trash2 className="w-5 h-5"/></button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center text-brand-text-dark py-16 border-2 border-dashed border-brand-muted rounded-lg">
                            <ICONS.FileText className="mx-auto h-12 w-12 text-brand-muted" />
                            <h3 className="mt-2 text-lg font-medium text-white">No blog posts found</h3>
                            <p className="mt-1 text-sm">Add a new post to get started.</p>
                        </div>
                    )}
                </div>
            )}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingPost ? 'Edit Post' : 'Add New Post'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="border-2 border-dashed border-brand-muted rounded-lg p-6 text-center">
                        {photoPreview ? (
                            <div className="relative group"><img src={photoPreview} alt="Preview" className="w-full h-48 object-cover rounded-md"/><label htmlFor="photo-upload" className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">Change Image</label></div>
                        ) : (
                            <label htmlFor="photo-upload" className="cursor-pointer"><ICONS.UploadCloud className="mx-auto h-12 w-12 text-brand-text-dark" /><p className="mt-2 text-sm text-brand-text-dark">Click to upload feature image</p></label>
                        )}
                        <input id="photo-upload" name="image" type="file" className="sr-only" onChange={handlePhotoChange} accept="image/*" />
                    </div>
                    <Input label="Post Title" name="title" value={formState.title || ''} onChange={handleInputChange} required />
                    <div>
                        <label className="block text-sm font-medium text-brand-text-dark mb-1">Content</label>
                        <textarea name="content" rows={10} value={formState.content || ''} onChange={handleInputChange} className="w-full bg-brand-dark border border-brand-muted rounded-md p-3 text-brand-text focus:ring-brand-gold focus:border-brand-gold" placeholder="Write your blog post here..." required />
                    </div>
                    <div className="flex items-center">
                        <input id="status" name="status" type="checkbox" checked={formState.status === 'published'} onChange={handleStatusChange} className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold bg-brand-muted" />
                        <label htmlFor="status" className="ml-3 block text-sm text-brand-text">Publish this post</label>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button type="submit" isLoading={saveMutation.isPending}>{editingPost ? 'Save Changes' : 'Create Post'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageBlog;
