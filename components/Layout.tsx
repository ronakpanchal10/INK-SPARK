import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PenTool, Home, BookOpen, Github } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-primary-600' : 'text-slate-500 hover:text-slate-900';

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg transform group-hover:rotate-12 transition-transform duration-300">
              <PenTool size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Ink & Spark</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/" className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/')}`}>
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link to="/editor" className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/editor')}`}>
              <BookOpen size={18} />
              <span className="hidden sm:inline">Write</span>
            </Link>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">
              <Github size={20} />
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Ink & Spark. Built with React, Tailwind & Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
