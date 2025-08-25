import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import type { BlogPost } from '../types.ts';
import Spinner from '../components/ui/Spinner';
import { ICONS } from '../constants';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../hooks/useApi';

const BlogListPage: React.FC = () => {
  const { apiClient } = useApi();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['blogPosts', 'public'],
    queryFn: () => apiClient('/api/blog', 'GET')
  });
  
  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchTerm || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  
  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="animate-fadeInUp">
      <style>{`
        .blog-hero {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .blog-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .blog-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.3);
        }
      `}</style>
      
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-serif font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Fellowship Blog
            </h1>
            <p className="mt-6 text-xl text-gray-300 leading-relaxed">
              Insights, stories, and updates from the heart of our community. Discover faith, fellowship, and inspiration.
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 max-w-md mx-auto relative">
              <ICONS.FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center"><Spinner /></div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-white mb-8 text-center">Featured Article</h2>
                  <FeaturedPostCard post={featuredPost} />
                </div>
              )}
              
              {/* Regular Posts */}
              {regularPosts.length > 0 ? (
                <>
                  <h2 className="text-3xl font-bold text-white mb-8 text-center">Latest Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.slice(featuredPost ? 1 : 0).map((post, index) => (
                      <BlogPostCard key={post._id} post={post} index={index} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="blog-hero rounded-2xl p-12 text-center">
                  <ICONS.FileText className="mx-auto h-16 w-16 text-gray-400 mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">No Articles Yet</h3>
                  <p className="text-gray-400 text-lg">Check back soon for inspiring articles and community updates!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const FeaturedPostCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const excerpt = post.content.substring(0, 200) + (post.content.length > 200 ? '...' : '');
  
  return (
    <Link to={`/blog/${post.slug}`} className="blog-card group rounded-2xl overflow-hidden block">
      <div className="grid lg:grid-cols-2 gap-0">
        <div className="relative overflow-hidden">
          <img 
            src={post.featureImageUrl || 'https://via.placeholder.com/600x400'} 
            alt={post.title} 
            className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-full mb-4 w-fit">
            Featured Article
          </span>
          <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-400 mb-4 leading-relaxed">{excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              By {post.authorName} • {new Date(post.publishedAt!).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <span className="text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
              Read More →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const BlogPostCard: React.FC<{ post: BlogPost; index: number }> = ({ post, index }) => {
    const excerpt = post.content.substring(0, 120) + (post.content.length > 120 ? '...' : '');

    return (
        <Link 
            to={`/blog/${post.slug}`} 
            className="blog-card group rounded-2xl overflow-hidden flex flex-col transition-all duration-300 opacity-0 animate-fadeInUp"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="relative overflow-hidden">
                <img 
                    src={post.featureImageUrl || 'https://via.placeholder.com/400x300'} 
                    alt={post.title} 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                    By {post.authorName} • {new Date(post.publishedAt!).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                    })}
                </p>
                <p className="text-gray-300 text-sm flex-grow leading-relaxed mb-4">{excerpt}</p>
                <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        Read Article →
                    </span>
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                        <ICONS.FileText className="h-4 w-4 text-blue-400" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BlogListPage;