import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
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
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    
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
        if (!formState.title?.trim()) {
            toast.error('Title is required');
            return;
        }
        if (!formState.content?.trim()) {
            toast.error('Content is required');
            return;
        }
        
        // Generate slug from title
        const slug = formState.title.toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
            
        saveMutation.mutate({ ...formState, slug });
    };
    
    const filteredPosts = posts.filter(post => {
        const matchesFilter = filter === 'all' || post.status === filter;
        const matchesSearch = !searchTerm || 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.authorName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });
    
    const publishedCount = posts.filter(p => p.status === 'published').length;
    const draftCount = posts.filter(p => p.status === 'draft').length;

    return (
        <div className="space-y-6">
            <style>{`
                .blog-container {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0));
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.3);
                }
                
                .blog-card {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0));
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.2s ease-in-out;
                }
                
                .blog-card:hover {
                    transform: translateY(-2px);
                    border-color: rgba(255, 255, 255, 0.2);
                }
            `}</style>
            
            {/* Header with Stats and Actions */}
            <div className="blog-container rounded-2xl p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Blog Management</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>Total: {posts.length}</span>
                            <span>•</span>
                            <span>Published: {publishedCount}</span>
                            <span>•</span>
                            <span>Drafts: {draftCount}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link 
                            to="/blog" 
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all"
                        >
                            <ICONS.FileText className="h-5 w-5" />
                            View Blog
                        </Link>
                        <Button 
                            onClick={() => handleOpenModal()}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-medium"
                        >
                            <ICONS.FileText className="h-5 w-5 mr-2" />
                            New Post
                        </Button>
                    </div>
                </div>
                
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <ICONS.FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search posts by title or author..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        {[
                            { key: 'all', label: 'All Posts', icon: ICONS.FileText },
                            { key: 'published', label: 'Published', icon: ICONS.CheckCircle },
                            { key: 'draft', label: 'Drafts', icon: ICONS.Edit }
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key as any)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                                    filter === key 
                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Blog Posts List */}
            <div className="blog-container rounded-2xl p-6">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64"><Spinner /></div>
                ) : (
                    <div className="space-y-4">
                        {filteredPosts.length > 0 ? filteredPosts.map(post => (
                            <div key={post._id} className="blog-card rounded-xl p-6">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="flex-shrink-0">
                                        <img 
                                            src={post.featureImageUrl || 'https://via.placeholder.com/300x200'} 
                                            alt={post.title} 
                                            className="w-full lg:w-32 h-32 object-cover rounded-lg" 
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                                                <p className="text-sm text-gray-400 mb-2">
                                                    By {post.authorName} • {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long', 
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                                <p className="text-gray-300 text-sm line-clamp-2">
                                                    {post.content.substring(0, 150)}...
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full border flex-shrink-0 ${
                                                post.status === 'published' 
                                                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                            }`}>
                                                {post.status === 'published' ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Button 
                                                size="sm" 
                                                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
                                                onClick={() => handleOpenModal(post)}
                                            >
                                                <ICONS.Edit className="h-4 w-4 mr-1" />
                                                Edit
                                            </Button>
                                            {post.status === 'published' && (
                                                <Link 
                                                    to={`/blog/${post.slug}`}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm font-medium transition-all"
                                                >
                                                    <ICONS.FileText className="h-4 w-4" />
                                                    View
                                                </Link>
                                            )}
                                            <Button 
                                                size="sm" 
                                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400"
                                                onClick={() => handleDelete(post._id!)}
                                            >
                                                <ICONS.Trash2 className="h-4 w-4 mr-1" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-12">
                                <ICONS.FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-400 mb-4">
                                    {searchTerm ? 'No posts found matching your search.' : 'No blog posts found.'}
                                </p>
                                <Button 
                                    onClick={() => handleOpenModal()}
                                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
                                >
                                    <ICONS.FileText className="h-4 w-4 mr-2" />
                                    Create First Post
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
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
                        <textarea 
                            name="content" 
                            rows={12} 
                            value={formState.content || ''} 
                            onChange={handleInputChange} 
                            className="w-full bg-brand-dark border border-brand-muted rounded-md p-3 text-brand-text focus:ring-brand-gold focus:border-brand-gold resize-none" 
                            placeholder="Write your blog post content here. You can use markdown formatting..." 
                            required 
                        />
                        <p className="text-xs text-gray-500 mt-1">Tip: Use **bold**, *italic*, and # headers for formatting</p>
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
