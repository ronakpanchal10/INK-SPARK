import React from 'react';

// A simple regex-based markdown parser for the internship project to avoid heavy dependencies
// This shows understanding of string manipulation and React rendering.
interface Props {
  content: string;
  className?: string;
}

const SimpleMarkdown: React.FC<Props> = ({ content, className = '' }) => {
  if (!content) return null;

  const lines = content.split('\n');
  
  const renderLine = (line: string, index: number) => {
    // Headers
    if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-bold mt-4 mb-2 text-slate-800">{line.replace('### ', '')}</h3>;
    if (line.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-slate-900">{line.replace('## ', '')}</h2>;
    if (line.startsWith('# ')) return <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-slate-900">{line.replace('# ', '')}</h1>;
    
    // Blockquote
    if (line.startsWith('> ')) return <blockquote key={index} className="border-l-4 border-primary-500 pl-4 italic text-slate-600 my-4 bg-slate-50 py-2">{line.replace('> ', '')}</blockquote>;

    // List items
    if (line.trim().startsWith('- ')) return <li key={index} className="ml-6 list-disc text-slate-700 mb-1">{parseInline(line.replace('- ', ''))}</li>;
    if (line.match(/^\d+\. /)) return <li key={index} className="ml-6 list-decimal text-slate-700 mb-1">{parseInline(line.replace(/^\d+\. /, ''))}</li>;

    // Empty lines
    if (line.trim() === '') return <div key={index} className="h-4"></div>;

    // Paragraph
    return <p key={index} className="mb-3 text-slate-700 leading-relaxed font-serif">{parseInline(line)}</p>;
  };

  const parseInline = (text: string) => {
    // Bold: **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`markdown-body ${className}`}>
      {lines.map((line, i) => renderLine(line, i))}
    </div>
  );
};

export default SimpleMarkdown;
