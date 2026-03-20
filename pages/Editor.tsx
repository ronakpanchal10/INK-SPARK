import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Save, Image as ImageIcon, Loader2, Lightbulb } from 'lucide-react';
import { generateDraft, improveWriting, generateIdeas } from '../services/geminiService';
import { savePost } from '../services/storageService';
import { BlogPost } from '../types';

const Editor: React.FC = () => {
  const navigate = useNavigate();
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('https://picsum.photos/seed/new/800/400');
  const [tags, setTags] = useState('');
  
  // AI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  const [showIdeas, setShowIdeas] = useState(false);

  const handleSave = () => {
    if (!title || !content) {
        alert("Title and content are required!");
        return;
    }

    const newPost: BlogPost = {
        id: Date.now().toString(),
        title,
        content,
        excerpt: content.slice(0, 150).replace(/#/g, '') + '...',
        author: 'Guest Author', // Hardcoded for demo
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: `${Math.max(1, Math.ceil(content.split(' ').length / 200))} min read`,
        coverImage,
        tags: tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
    };

    savePost(newPost);
    navigate('/');
  };

  const handleAIDraft = async () => {
    if (!title) {
        alert("Please enter a title first so the AI knows what to write about.");
        return;
    }
    setIsGenerating(true);
    try {
        const draft = await generateDraft(title);
        setContent(prev => prev ? prev + '\n\n' + draft : draft);
    } catch (e) {
        alert("Failed to generate draft");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleAIImprove = async () => {
    if (!content) return;
    setIsGenerating(true);
    try {
        const improved = await improveWriting(content);
        setContent(improved);
    } catch (e) {
        alert("Failed to improve writing");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleAIIdeas = async () => {
     if (!tags && !title) {
         alert("Enter a topic in the title or tags field to get ideas.");
         return;
     }
     setIsGenerating(true);
     try {
         const topic = title || tags;
         const ideas = await generateIdeas(topic);
         setGeneratedIdeas(ideas);
         setShowIdeas(true);
     } catch(e) {
         alert("Failed to generate ideas");
     } finally {
         setIsGenerating(false);
     }
  }

  const selectIdea = (idea: string) => {
      setTitle(idea);
      setShowIdeas(false);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Main Editor Area */}
        <div className="flex-grow space-y-6">
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Post Title</label>
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter an engaging title..."
                    className="w-full text-3xl font-bold border-b-2 border-slate-200 focus:border-primary-500 outline-none py-2 bg-transparent placeholder-slate-300 transition-colors"
                />
            </div>

            {showIdeas && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
                        <Lightbulb size={16}/> Suggested Titles
                    </h4>
                    <ul className="space-y-2">
                        {generatedIdeas.map((idea, i) => (
                            <li key={i}>
                                <button 
                                    onClick={() => selectIdea(idea)}
                                    className="text-amber-900 hover:text-amber-700 text-sm hover:underline text-left"
                                >
                                    {idea}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setShowIdeas(false)} className="text-xs text-amber-600 mt-3 font-medium">Close</button>
                </div>
            )}

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Content (Markdown)</label>
                <div className="relative">
                    <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Start writing your story here... (Markdown is supported)"
                        className="w-full h-[60vh] p-6 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none font-serif text-lg leading-relaxed text-slate-700 shadow-sm"
                    />
                    {isGenerating && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
                            <div className="bg-white p-4 rounded-lg shadow-xl flex items-center gap-3">
                                <Loader2 className="animate-spin text-primary-600" />
                                <span className="font-medium text-slate-700">Gemini is writing...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Sidebar Tools */}
        <div className="w-full md:w-80 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Wand2 size={18} className="text-purple-600"/> 
                    AI Assistant
                </h3>
                
                <div className="space-y-3">
                    <button 
                        onClick={handleAIDraft}
                        disabled={isGenerating}
                        className="w-full flex items-center justify-between px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm border border-purple-100 disabled:opacity-50"
                    >
                        <span>Write Draft for Me</span>
                        <Wand2 size={16} />
                    </button>
                    
                    <button 
                        onClick={handleAIImprove}
                        disabled={isGenerating || !content}
                        className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm border border-blue-100 disabled:opacity-50"
                    >
                        <span>Improve Grammar</span>
                        <SparklesIcon />
                    </button>

                    <button 
                        onClick={handleAIIdeas}
                        disabled={isGenerating}
                        className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors font-medium text-sm border border-amber-100 disabled:opacity-50"
                    >
                        <span>Generate Ideas</span>
                        <Lightbulb size={16} />
                    </button>
                </div>

                <hr className="my-6 border-slate-100" />

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Cover Image URL</label>
                        <div className="flex gap-2">
                             <div className="relative flex-grow">
                                <ImageIcon className="absolute left-3 top-2.5 text-slate-400" size={16}/>
                                <input 
                                   aria-label="Title"
                                    type="text" 
                                    value={coverImage}
                                    onChange={(e) => setCoverImage(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                />
                             </div>
                        </div>
                        <img src={coverImage} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg border border-slate-200 bg-slate-100" />
                    </div>

                    <div>
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Tags (comma separated)</label>
                         <input 
                            type="text" 
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="Tech, Life, AI..."
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                        />
                    </div>

                    <button 
                        onClick={handleSave}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 mt-4"
                    >
                        <Save size={18} />
                        Publish Post
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const SparklesIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.35 9.65L22 12L14.35 14.35L12 22L9.65 14.35L2 12L9.65 9.65L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

export default Editor;
