
import React, { useState, useRef } from 'react';
import { AspectRatio } from '../types';
import { RotateCw, ZoomIn, Check, X, RotateCcw, Undo2, Eraser, Loader2, Sparkles, Palette } from 'lucide-react';
import { generateMarketingImage } from '../services/geminiService';

interface ImageEditorProps {
  image: string;
  aspectRatio: AspectRatio;
  onSave: (newImage: string) => void;
  onCancel: () => void;
}

type BgStyle = 'white' | 'gradient' | 'studio' | 'luxury' | 'nature' | 'urban';

const BG_STYLES: { id: BgStyle; label: string; color: string; prompt: string }[] = [
  { 
    id: 'white', 
    label: 'White', 
    color: 'bg-white border border-neutral-200',
    prompt: "Remove the background from this image and isolate the main subject on a pure white background. Ensure clean edges."
  },
  { 
    id: 'gradient', 
    label: 'Gradient', 
    color: 'bg-gradient-to-br from-indigo-100 to-purple-100',
    prompt: "Remove the background from this image and isolate the main subject on a smooth, aesthetic soft gradient background (pastel colors)."
  },
  { 
    id: 'studio', 
    label: 'Studio', 
    color: 'bg-neutral-300',
    prompt: "Remove the background from this image and isolate the main subject on a neutral studio grey background with professional studio lighting effect and soft shadows."
  },
  { 
    id: 'luxury', 
    label: 'Luxury', 
    color: 'bg-neutral-900',
    prompt: "Remove the background from this image and isolate the main subject on a premium dark matte black background."
  },
  { 
    id: 'nature', 
    label: 'Nature', 
    color: 'bg-emerald-500',
    prompt: "Remove the background from this image and isolate the main subject against a soft-focus natural outdoor background with greenery and bokeh."
  },
  { 
    id: 'urban', 
    label: 'Urban', 
    color: 'bg-slate-600',
    prompt: "Remove the background from this image and isolate the main subject against a blurred modern city street background with urban tones."
  }
];

export const ImageEditor: React.FC<ImageEditorProps> = ({ image: initialImage, aspectRatio, onSave, onCancel }) => {
  const [currentImage, setCurrentImage] = useState(initialImage);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [selectedBgStyle, setSelectedBgStyle] = useState<BgStyle>('white');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Calculate aspect ratio value
  const getRatioValue = (ratio: AspectRatio): number => {
    const [w, h] = ratio.split(':').map(Number);
    return w / h;
  };

  const ratioValue = getRatioValue(aspectRatio);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getCanvasData = (): string | null => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx || !imageRef.current) return null;

    const outputSize = 1200;
    
    let canvasWidth, canvasHeight;
    if (ratioValue >= 1) {
      canvasWidth = outputSize;
      canvasHeight = outputSize / ratioValue;
    } else {
      canvasWidth = outputSize * ratioValue;
      canvasHeight = outputSize;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const img = imageRef.current;
    
    // Reset transform to identity
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    // Move to center of canvas
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return null;

    const pixelRatio = canvasWidth / containerRect.width;

    ctx.translate(position.x * pixelRatio, position.y * pixelRatio);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = canvasWidth / canvasHeight;
    
    let drawWidth, drawHeight;
    
    if (imgAspect > canvasAspect) {
        drawHeight = canvasHeight;
        drawWidth = drawHeight * imgAspect;
    } else {
        drawWidth = canvasWidth;
        drawHeight = drawWidth / imgAspect;
    }

    ctx.drawImage(
      img,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );

    return canvas.toDataURL('image/png');
  };

  const handleSave = () => {
    const dataUrl = getCanvasData();
    if (dataUrl) {
      onSave(dataUrl);
    }
  };

  const handleRemoveBackground = async () => {
    const dataUrl = getCanvasData();
    if (!dataUrl) return;

    setIsRemovingBg(true);
    try {
      const selectedStyle = BG_STYLES.find(s => s.id === selectedBgStyle) || BG_STYLES[0];
      
      // Use Gemini to remove/replace background
      const result = await generateMarketingImage(
        dataUrl, 
        selectedStyle.prompt,
        aspectRatio
      );
      
      // Update editor state with new image
      setCurrentImage(result);
      // Reset transforms since the new image is likely already cropped/centered by the AI or we want to start fresh with the new asset
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    } catch (error) {
      console.error("Background removal failed", error);
      // Could add toast notification here
    } finally {
      setIsRemovingBg(false);
    }
  };

  const handleReset = () => {
    setCurrentImage(initialImage);
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Loading Overlay */}
      {isRemovingBg && (
        <div className="absolute inset-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-neutral-600 dark:text-neutral-300 font-medium animate-pulse">Processing Background...</p>
        </div>
      )}

      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-white/10 flex-shrink-0">
        <h3 className="text-lg font-bold text-neutral-800 dark:text-white">Adjust Source</h3>
        <div className="flex gap-2">
            <button 
                onClick={handleReset}
                className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                title="Reset to Original"
            >
                <Undo2 className="w-4 h-4" />
            </button>
        </div>
      </div>

      <div className="flex-1 bg-neutral-100/50 dark:bg-black/50 relative overflow-hidden flex items-center justify-center p-8 select-none">
        {/* Crop Box Container */}
        <div 
            ref={containerRef}
            className={`
                relative overflow-hidden bg-neutral-200 dark:bg-[#1a1a1a] transition-all duration-200
                ${isDragging 
                    ? 'ring-2 ring-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)] cursor-grabbing scale-[1.005]' 
                    : 'ring-1 ring-black/10 dark:ring-white/10 shadow-2xl cursor-grab'
                }
            `}
            style={{
                aspectRatio: aspectRatio.replace(':', '/'),
                width: '100%',
                maxWidth: '500px',
                maxHeight: '60vh'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none z-20 opacity-30">
                 <div className="w-full h-full border border-white/30 flex flex-col">
                    <div className="flex-1 border-b border-white/20 flex">
                        <div className="flex-1 border-r border-white/20"></div>
                        <div className="flex-1 border-r border-white/20"></div>
                        <div className="flex-1"></div>
                    </div>
                    <div className="flex-1 border-b border-white/20 flex">
                        <div className="flex-1 border-r border-white/20"></div>
                        <div className="flex-1 border-r border-white/20"></div>
                        <div className="flex-1"></div>
                    </div>
                    <div className="flex-1 flex">
                        <div className="flex-1 border-r border-white/20"></div>
                        <div className="flex-1 border-r border-white/20"></div>
                        <div className="flex-1"></div>
                    </div>
                 </div>
            </div>

            <img
                ref={imageRef}
                src={currentImage}
                alt="Editing"
                draggable={false}
                className="absolute top-1/2 left-1/2 max-w-none origin-center transition-none"
                style={{
                   // Initial sizing to Cover
                   minWidth: '100%',
                   minHeight: '100%',
                   // Transformations
                   transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) rotate(${rotation}deg) scale(${scale})`
                }}
            />
        </div>
        
        {/* Controls Instructions Overlay */}
        <div className={`
            absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-medium pointer-events-none transition-opacity duration-300
            ${isDragging ? 'opacity-0' : 'opacity-50'}
        `}>
           Drag to pan • Pinch/Scroll to zoom
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-[#050505] border-t border-neutral-200 dark:border-white/10 flex flex-col gap-6 flex-shrink-0 z-10">
        {/* Controls Row */}
        <div className="flex items-center justify-center gap-8">
            {/* Rotation */}
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setRotation(r => r - 90)}
                    className="p-3 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300 transition-colors"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
                <div className="w-16 text-center font-mono text-xs text-neutral-500">
                    {rotation}°
                </div>
                <button 
                    onClick={() => setRotation(r => r + 90)}
                    className="p-3 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300 transition-colors"
                >
                    <RotateCw className="w-5 h-5" />
                </button>
            </div>

            <div className="w-px h-10 bg-neutral-200 dark:bg-white/10"></div>

            {/* Zoom Slider */}
            <div className="flex items-center gap-3 flex-1 max-w-xs">
                <ZoomIn className="w-5 h-5 text-neutral-400" />
                <input 
                    type="range" 
                    min="0.5" 
                    max="3" 
                    step="0.1" 
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-neutral-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500"
                />
                <span className="w-12 text-right font-mono text-xs text-neutral-500">
                    {(scale * 100).toFixed(0)}%
                </span>
            </div>

             <div className="w-px h-10 bg-neutral-200 dark:bg-white/10"></div>

             {/* Magic Tools */}
             <div className="flex items-center gap-2 bg-neutral-100 dark:bg-white/5 p-1 rounded-2xl">
                {BG_STYLES.map(style => (
                    <button
                        key={style.id}
                        onClick={() => setSelectedBgStyle(style.id)}
                        className={`w-6 h-6 rounded-full ${style.color} shadow-sm transition-transform hover:scale-110 ${selectedBgStyle === style.id ? 'ring-2 ring-indigo-500 scale-110' : 'ring-1 ring-black/5'}`}
                        title={style.label}
                    />
                ))}
                <div className="w-px h-4 bg-neutral-300 dark:bg-white/10 mx-1"></div>
                <button
                    onClick={handleRemoveBackground}
                    disabled={isRemovingBg}
                    className="group flex flex-col items-center gap-1 px-2 py-1 rounded-xl hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                    title="Generate New Background"
                >
                   <div className="text-indigo-500 group-hover:scale-110 transition-transform">
                       <Eraser className="w-5 h-5" />
                   </div>
                </button>
             </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
            <button 
                onClick={onCancel}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
                <X className="w-4 h-4" />
                Cancel
            </button>
            <button 
                onClick={handleSave}
                className="flex-1 py-3 px-4 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
                <Check className="w-4 h-4" />
                Apply Adjustments
            </button>
        </div>
      </div>
    </div>
  );
};
