
import React from 'react';
import { GeneratedImage } from '../types';
import { Download, Maximize2, Loader2, AlertCircle, Wand2 } from 'lucide-react';

interface ResultCardProps {
  item: GeneratedImage;
  onExpand: (item: GeneratedImage) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ item, onExpand }) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = item.generatedImage;
    link.download = `mockfinity-${item.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (item.status === 'loading') {
    return (
      <div className="aspect-square rounded-3xl bg-neutral-100/50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5 flex flex-col items-center justify-center p-6 relative overflow-hidden shadow-sm dark:shadow-none animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/[0.03] to-transparent shimmer-effect" />
        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-4 relative z-10" />
        <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold text-center relative z-10">
          Rendering
        </p>
      </div>
    );
  }

  if (item.status === 'error') {
    return (
      <div className="aspect-square rounded-3xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 flex flex-col items-center justify-center p-6 animate-fade-in">
        <AlertCircle className="w-6 h-6 text-red-500 dark:text-red-400 mb-3" />
        <p className="text-xs text-red-600 dark:text-red-400/80 text-center font-medium">Generation Failed</p>
      </div>
    );
  }

  return (
    <div 
      className="group relative aspect-square rounded-3xl overflow-hidden bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-white/10 cursor-pointer shadow-md hover:shadow-xl dark:shadow-none hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/20 transition-all duration-500 hover:border-indigo-300 dark:hover:border-white/20 animate-fade-in"
      onClick={() => onExpand(item)}
    >
      <img
        src={item.generatedImage}
        alt="Generated Result"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Floating Actions */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 z-10">
        <button
          onClick={handleDownload}
          className="p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110"
          title="Download"
        >
          <Download className="w-5 h-5" />
        </button>
        <button
          onClick={() => onExpand(item)}
          className="p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110"
          title="View Fullscreen"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Badge */}
      <div className="absolute top-4 left-4 transform transition-transform duration-300 group-hover:translate-y-1 z-10">
        <div className={`
          px-3 py-1 rounded-full backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-sm
          ${item.category === 'edit' ? 'bg-indigo-500/80 text-white' : 'bg-emerald-500/80 text-white'}
        `}>
          <Wand2 className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {item.category === 'edit' ? 'Edit' : 'Mockup'}
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-75 bg-gradient-to-t from-black/90 to-transparent">
        <p className="text-[10px] text-neutral-300/80 line-clamp-2 font-light leading-relaxed">
          {item.prompt}
        </p>
      </div>
    </div>
  );
};
