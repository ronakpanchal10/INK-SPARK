import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Wand2, Trash2 } from 'lucide-react';
import { BlogPost } from '../types';
import { getPostById, deletePost } from '../services/storageService';
import SimpleMarkdown from '../components/SimpleMarkdown';
import { summarizePost } from '../services/geminiService';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    if (id) {
      const foundPost = getPostById(id);
      if (foundPost) {
        setPost(foundPost);
      } else {
        navigate('/'); // Redirect if not found
      }
    }
  }, [id, navigate]);

  const handleSummarize = async () => {
    if (!post) return;
    setIsSummarizing(true);
    try {
      const result = await summarizePost(post.content);
      setSummary(result);
    } catch (err) {
      alert("Failed to summarize content.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
        if (post) {
            deletePost(post.id);
            navigate('/');
        }
    }
  }

  if (!post) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="animate-fade-in bg-white pb-20">
        {/* Header Image */}
        <div className="h-[40vh] w-full relative overflow-hidden">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full p-4 sm:p-8">
                <div className="max-w-3xl mx-auto text-white">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                    <div className="flex gap-2 mb-4">
                        {post.tags.map(tag => (
                            <span key={tag} className="bg-primary-500 text-white text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-6">{post.title}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-white/90 font-medium">
                        <div className="flex items-center gap-2">
                            <User size={16} /> {post.author}
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} /> {post.date}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} /> {post.readTime}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Content */}
        <article className="max-w-3xl mx-auto px-4 py-12">
            {/* AI Summary Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <SparklesIcon />
                        AI Summary
                    </h3>
                    {!summary && (
                        <button 
                            onClick={handleSummarize}
                            disabled={isSummarizing}
                            className="text-xs bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 font-medium flex items-center gap-1"
                        >
                            {isSummarizing ? 'Thinking...' : 'Generate Summary'}
                        </button>
                    )}
                </div>
                
                {summary ? (
                    <p className="text-slate-600 italic leading-relaxed animate-fade-in">{summary}</p>
                ) : (
                    <p className="text-slate-400 text-sm">Click generate to get a quick AI-powered overview of this article using Gemini.</p>
                )}
            </div>

            {/* Main Body */}
            <SimpleMarkdown content={post.content} className="text-lg leading-loose" />
            
            {/* Actions */}
            <div className="mt-16 pt-8 border-t border-slate-200 flex justify-end">
                <button 
                    onClick={handleDelete}
                    className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                >
                    <Trash2 size={16} /> Delete Post
                </button>
            </div>
        </article>
    </div>
  );
};

// Helper icon
const SparklesIcon = () => (
    <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.35 9.65L22 12L14.35 14.35L12 22L9.65 14.35L2 12L9.65 9.65L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

export default PostDetail;
