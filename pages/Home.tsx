import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import { BlogPost } from '../types';
import { getPosts } from '../services/storageService';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/1920/1080?grayscale')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-400/30 text-primary-300 text-sm font-medium mb-6">
            <Sparkles size={14} />
            <span>AI-Powered Publishing</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl">
            Where ideas ignite and <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-400">stories come alive.</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
            A modern blogging platform designed for clarity. Write with AI assistance, read with focus, and share your spark with the world.
          </p>
          <Link to="/editor" className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3.5 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-primary-900/20">
            Start Writing
          </Link>
        </div>
      </div>

      {/* Post Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Recent Stories</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} to={`/post/${post.id}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md text-slate-800 shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 font-medium uppercase tracking-wider">
                   <span>{post.date}</span>
                   <span>•</span>
                   <span className="flex items-center gap-1"><Clock size={12}/> {post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                   <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        {post.author.charAt(0)}
                     </div>
                     <span className="text-sm font-medium text-slate-700">{post.author}</span>
                   </div>
                   <span className="text-primary-600 group-hover:translate-x-1 transition-transform">
                     <ArrowRight size={18} />
                   </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
            <h3 className="text-xl font-medium text-slate-900 mb-2">No posts yet</h3>
            <p className="text-slate-500 mb-6">Be the first to ignite the spark.</p>
            <Link to="/editor" className="text-primary-600 font-semibold hover:underline">Write a post</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
