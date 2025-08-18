import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import type { BlogPost } from '../types.ts';
import Spinner from '../components/ui/Spinner.tsx';
import { ICONS } from '../constants.tsx';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../hooks/useApi.ts';

const BlogListPage: React.FC = () => {
  const { apiClient } = useApi();
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['blogPosts', 'public'],
    queryFn: () => apiClient('/api/blog', 'GET')
  });

  return (
    <div className="py-16 md:py-24 animate-fadeInUp">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-gold">Fellowship Blog</h1>
          <p className="mt-4 text-lg text-brand-text-dark">
            Insights, stories, and updates from the heart of our community.
          </p>
        </div>

        <div className="mt-16">
          {isLoading ? (
            <div className="flex justify-center"><Spinner /></div>
          ) : (
            posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <BlogPostCard key={post._id} post={post} index={index} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-brand-text-dark py-16 border-2 border-dashed border-brand-muted rounded-lg">
                    <ICONS.FileText className="mx-auto h-12 w-12 text-brand-muted" />
                    <h3 className="mt-2 text-lg font-medium text-white">No posts yet</h3>
                    <p className="mt-1 text-sm">Check back soon for articles and updates!</p>
                </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

const BlogPostCard: React.FC<{ post: BlogPost; index: number }> = ({ post, index }) => {
    const excerpt = post.content.substring(0, 100) + (post.content.length > 100 ? '...' : '');

    return (
        <Link 
            to={`/blog/${post.slug}`} 
            className="group bg-brand-surface rounded-lg shadow-2xl overflow-hidden flex flex-col border border-brand-muted/50 transition-all duration-300 hover:border-brand-gold/30 hover:-translate-y-2 opacity-0 animate-fadeInUp"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="relative overflow-hidden">
                <img 
                    src={post.featureImageUrl || 'https://via.placeholder.com/400x300.png/141417/EAEAEA?text=Torch+Fellowship'} 
                    alt={post.title} 
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold font-serif text-white group-hover:text-brand-gold transition-colors">{post.title}</h2>
                <p className="text-xs text-brand-text-dark mt-2">
                    By {post.authorName} on {new Date(post.publishedAt!).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="mt-4 text-sm text-brand-text-dark flex-grow">{excerpt}</p>
                <span className="mt-4 font-semibold text-brand-gold self-start">
                    Read More &rarr;
                </span>
            </div>
        </Link>
    );
};

export default BlogListPage;