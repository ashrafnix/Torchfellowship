import React from 'react';
import { useParams, Link } from 'react-router-dom';
import type { BlogPost } from '../types.ts';
import Spinner from '../components/ui/Spinner.tsx';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../hooks/useApi.ts';

const BlogPostPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { apiClient } = useApi();

    const { data: post, isLoading, isError } = useQuery<BlogPost>({
        queryKey: ['blogPosts', slug],
        queryFn: () => apiClient(`/api/blog/${slug}`, 'GET'),
        enabled: !!slug,
    });


    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    if (isError || !post) {
        return (
            <div className="text-center py-24">
                <h1 className="text-4xl font-bold text-red-500">Post Not Found</h1>
                <p className="text-brand-text-dark mt-4">Sorry, we couldn't find the post you were looking for.</p>
                <Link to="/blog" className="mt-6 inline-block text-brand-gold hover:underline">&larr; Back to Blog</Link>
            </div>
        );
    }

    return (
        <div className="py-16 md:py-24 animate-fadeInUp">
            <div className="container mx-auto px-4">
                <article className="max-w-4xl mx-auto">
                    <header className="text-center mb-12">
                        <Link to="/blog" className="text-sm text-brand-gold hover:underline mb-4 inline-block">&larr; Back to all posts</Link>
                        <h1 className="text-4xl md:text-6xl font-serif font-extrabold text-white">{post.title}</h1>
                        <p className="mt-4 text-brand-text-dark">
                            Posted by <span className="font-semibold text-white">{post.authorName}</span> on {new Date(post.publishedAt!).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </header>

                    <div className="my-8">
                        <img 
                            src={post.featureImageUrl} 
                            alt={post.title} 
                            className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-2xl"
                        />
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none text-brand-text leading-relaxed">
                        <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
                    </div>
                </article>
            </div>
            {/* Basic styling for prose content */}
            <style>{`
              .prose-invert {
                  --tw-prose-body: theme(colors.brand.text.DEFAULT);
                  --tw-prose-headings: theme(colors.white);
                  --tw-prose-lead: theme(colors.brand.text.dark);
                  --tw-prose-links: theme(colors.brand.gold.DEFAULT);
                  --tw-prose-bold: theme(colors.white);
                  --tw-prose-counters: theme(colors.brand.text.dark);
                  --tw-prose-bullets: theme(colors.brand.text.dark);
                  --tw-prose-hr: theme(colors.brand.muted);
                  --tw-prose-quotes: theme(colors.brand.gold.DEFAULT);
                  --tw-prose-quote-borders: theme(colors.brand.muted);
                  --tw-prose-captions: theme(colors.brand.text.dark);
                  --tw-prose-code: theme(colors.white);
                  --tw-prose-pre-code: theme(colors.brand.text.DEFAULT);
                  --tw-prose-pre-bg: theme(colors.brand.surface);
                  --tw-prose-th-borders: theme(colors.brand.muted);
                  --tw-prose-td-borders: theme(colors.brand.muted);
              }
            `}</style>
        </div>
    );
};

export default BlogPostPage;