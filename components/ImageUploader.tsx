
import React, { useRef, useState } from 'react';
import { Upload, X, ImageIcon, ScanLine, Pencil, Maximize2, ArrowDownToLine } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  selectedImage: string | null;
  onClear: () => void;
  onEdit: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, selectedImage, onClear, onEdit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    // Basic validation
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelect(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we are actually leaving the container, not just entering a child
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="w-full group relative">
      {!selectedImage ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative aspect-[4/3] w-full rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
            flex flex-col items-center justify-center gap-4 animate-fade-in
            ${isDragging 
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02] shadow-xl shadow-indigo-500/20' 
              : 'border-neutral-300 dark:border-white/10 bg-neutral-100/50 dark:bg-white/[0.02] hover:bg-neutral-200/50 dark:hover:bg-white/[0.05] hover:border-neutral-400 dark:hover:border-white/20'
            }
          `}
        >
          {/* Drag Overlay Feedback */}
          <div className={`absolute inset-0 z-20 bg-indigo-500/90 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-300 ${isDragging ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
             <div className="p-4 rounded-full bg-white shadow-lg animate-bounce">
                <ArrowDownToLine className="w-8 h-8 text-indigo-600" />
             </div>
             <p className="mt-4 text-white font-bold text-lg tracking-wide">Drop to Upload</p>
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 dark:to-black/20 pointer-events-none" />
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <div className={`
            p-4 rounded-full bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/5 transition-transform duration-500 shadow-sm
            ${isDragging ? 'scale-0 opacity-0' : 'group-hover:scale-110 opacity-100'}
          `}>
            <Upload className="w-6 h-6 text-neutral-400 dark:text-neutral-300" />
          </div>
          
          <div className={`text-center z-10 px-4 transition-all duration-300 group-hover:-translate-y-1 ${isDragging ? 'opacity-0' : 'opacity-100'}`}>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Upload Product</h3>
            <p className="text-xs text-neutral-500">JPG or PNG. Max 5MB.</p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-black group/image shadow-md dark:shadow-none cursor-default animate-fade-in">
          <div className="aspect-[4/3] w-full relative">
            <img
              src={selectedImage}
              alt="Original Product"
              className="w-full h-full object-cover opacity-100 dark:opacity-80 group-hover/image:opacity-100 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-30 dark:opacity-60" />
            
            {/* Overlay Grid Effect */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover/image:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover/image:translate-y-0">
             <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black text-neutral-700 dark:text-white p-2 rounded-xl backdrop-blur-md border border-neutral-200 dark:border-white/10 transition-all duration-200 shadow-sm hover:scale-105"
              title="Edit & Crop"
            >
              <Pencil className="w-4 h-4" />
            </button>
             <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="bg-white/80 dark:bg-black/60 hover:bg-red-500 hover:text-white dark:hover:bg-red-500/80 text-neutral-700 dark:text-white p-2 rounded-xl backdrop-blur-md border border-neutral-200 dark:border-white/10 transition-all duration-200 shadow-sm hover:scale-105"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-md">
              <ScanLine className="w-3.5 h-3.5 text-indigo-200 dark:text-indigo-300" />
            </div>
            <span className="text-xs font-medium text-white shadow-black drop-shadow-md">Source Input</span>
          </div>
        </div>
      )}
    </div>
  );
};
