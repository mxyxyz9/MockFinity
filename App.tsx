
import React, { useState, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { PromptControls } from './components/PromptControls';
import { ResultCard } from './components/ResultCard';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageEditor } from './components/ImageEditor';
import { generateMarketingImage } from './services/geminiService';
import { GeneratedImage, AspectRatio } from './types';
import { X, Grid2X2, Sparkles, Pencil, ChevronDown } from 'lucide-react';

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [expandedImage, setExpandedImage] = useState<GeneratedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleGenerate = async (prompt: string, category: 'mockup' | 'edit') => {
    if (!sourceImage) return;

    const newId = generateId();
    const tempResult: GeneratedImage = {
      id: newId,
      originalImage: sourceImage,
      generatedImage: '',
      prompt,
      timestamp: Date.now(),
      status: 'loading',
      category,
      aspectRatio
    };

    setResults(prev => [tempResult, ...prev]);
    setIsProcessing(true);

    try {
      let fullPrompt = prompt;
      if (category === 'mockup') {
        fullPrompt = `${prompt} IMPORTANT: Maintain the exact visual appearance, logo, colors, and identity of the product in the input image. Ensure high fidelity product consistency.`;
      }

      const generatedBase64 = await generateMarketingImage(sourceImage, fullPrompt, aspectRatio);

      setResults(prev => prev.map(item => 
        item.id === newId 
          ? { ...item, generatedImage: generatedBase64, status: 'success' }
          : item
      ));
    } catch (error) {
      console.error(error);
      setResults(prev => prev.map(item => 
        item.id === newId 
          ? { ...item, status: 'error', error: 'Failed to generate image.' }
          : item
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearSource = () => {
    setSourceImage(null);
  };

  const handleOpenEditor = (image: string) => {
    setImageToEdit(image);
    setIsEditorOpen(true);
  };

  const handleSaveEdit = (newImage: string) => {
    setSourceImage(newImage);
    setIsEditorOpen(false);
    setImageToEdit(null);
  };

  return (
    <div className="min-h-screen flex flex-col text-neutral-900 dark:text-neutral-100 selection:bg-indigo-500/30 transition-colors duration-300">
      {/* Ambient Background */}
      <div className="fixed inset-0 bg-slate-50 dark:bg-[#050505] -z-20 transition-colors duration-300"></div>
      
      {/* Blobs - adjusted for visibility in both modes */}
      <div className="fixed top-[-10%] right-[-5%] w-[800px] h-[800px] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      {/* Noise Overlay */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 dark:opacity-20 pointer-events-none -z-10 mix-blend-overlay"></div>

      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 pt-32 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Panel: Studio Controls */}
          <div className="lg:col-span-4 sticky top-28 space-y-8 animate-fade-in-up">
            <div className="glass-panel p-6 rounded-3xl shadow-xl shadow-black/5 dark:shadow-none transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">1. Source Asset</h2>
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-pulse"></div>
              </div>
              <ImageUploader 
                onImageSelect={setSourceImage} 
                selectedImage={sourceImage}
                onClear={handleClearSource}
                onEdit={() => sourceImage && handleOpenEditor(sourceImage)}
              />
            </div>

            <div className={`transition-all duration-500 ${!sourceImage ? 'opacity-50 blur-sm pointer-events-none grayscale' : 'opacity-100'}`}>
               <div className="glass-panel p-6 rounded-3xl shadow-xl shadow-black/5 dark:shadow-none transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">2. Generation Control</h2>
                    <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <PromptControls 
                    onGenerate={handleGenerate} 
                    disabled={!sourceImage || isProcessing}
                    aspectRatio={aspectRatio}
                    onAspectRatioChange={setAspectRatio}
                  />
               </div>
            </div>
          </div>

          {/* Right Panel: Gallery */}
          <div className="lg:col-span-8 space-y-8 min-h-[50vh] animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/5 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-white/5">
                  <Grid2X2 className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                </div>
                <h2 className="text-xl font-medium text-neutral-900 dark:text-white">Output Gallery</h2>
              </div>
              {results.length > 0 && (
                <button 
                  onClick={() => setResults([])}
                  className="px-4 py-2 text-xs font-medium text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 rounded-full"
                >
                  Clear Session
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <div className="h-[400px] rounded-3xl border border-dashed border-neutral-300 dark:border-white/10 flex flex-col items-center justify-center p-8 text-center bg-neutral-50/50 dark:bg-transparent animate-fade-in">
                <div className="w-20 h-20 bg-white dark:bg-white/[0.03] rounded-full flex items-center justify-center mb-6 ring-1 ring-neutral-200 dark:ring-white/10 shadow-sm dark:shadow-none animate-bounce" style={{ animationDuration: '3s' }}>
                  <Sparkles className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
                </div>
                <h3 className="text-neutral-800 dark:text-neutral-200 font-medium mb-2 text-lg">Awaiting Input</h3>
                <p className="text-neutral-500 text-sm max-w-md leading-relaxed">
                  Upload a product image on the left and select a scenario to begin generating high-fidelity marketing assets.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {results.map(item => (
                  <ResultCard key={item.id} item={item} onExpand={setExpandedImage} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Editor Modal */}
      {isEditorOpen && imageToEdit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-zoom-in">
           <div className="absolute inset-0 bg-white/90 dark:bg-black/90 backdrop-blur-xl" onClick={() => setIsEditorOpen(false)} />
           <div className="relative w-full max-w-4xl h-[85vh] glass-panel rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              <ImageEditor 
                image={imageToEdit}
                aspectRatio={aspectRatio}
                onSave={handleSaveEdit}
                onCancel={() => setIsEditorOpen(false)}
              />
           </div>
        </div>
      )}

      {/* Result Modal */}
      {expandedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-zoom-in">
          <div className="absolute inset-0 bg-white/80 dark:bg-black/90 backdrop-blur-xl transition-colors duration-300" onClick={() => setExpandedImage(null)} />
          
          <button 
            onClick={() => setExpandedImage(null)}
            className="absolute top-6 right-6 p-3 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-full text-neutral-800 dark:text-white transition-all z-50 hover:rotate-90 duration-300 hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative w-full max-w-7xl h-[85vh] flex flex-col md:flex-row gap-6 pointer-events-none">
             {/* Left: Original (Smaller) */}
             <div className="pointer-events-auto md:w-1/3 h-1/3 md:h-full glass-panel rounded-3xl p-2 flex flex-col shadow-2xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="flex-1 relative rounded-2xl overflow-hidden bg-neutral-100 dark:bg-black/50 group/source">
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/80 dark:bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider z-10 border border-neutral-200 dark:border-white/10">
                      Source
                   </div>
                   <img 
                      src={expandedImage.originalImage} 
                      alt="Original" 
                      className="w-full h-full object-contain"
                   />
                   
                   {/* Integrate Editor Access Here Too */}
                   <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/source:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                        <button 
                            onClick={() => {
                                setExpandedImage(null);
                                handleOpenEditor(expandedImage.originalImage);
                            }}
                            className="bg-white text-black px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 hover:scale-105 transition-transform"
                        >
                            <Pencil className="w-4 h-4" />
                            <span>Edit Source & Retry</span>
                        </button>
                   </div>
                </div>
                
                {/* Collapsed Prompt Details */}
                <div className="mt-4 px-4 pb-4">
                  <details className="group/details">
                    <summary className="list-none cursor-pointer flex items-center justify-between text-[10px] font-bold text-neutral-400 hover:text-indigo-500 dark:text-neutral-600 dark:hover:text-indigo-400 uppercase tracking-widest transition-colors select-none py-2">
                      <span>View Generation Details</span>
                      <ChevronDown className="w-3 h-3 transition-transform duration-300 group-open/details:rotate-180" />
                    </summary>
                    <div className="mt-2 animate-fade-in">
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-mono p-3 bg-neutral-50 dark:bg-white/5 rounded-xl border border-neutral-100 dark:border-white/5 max-h-32 overflow-y-auto custom-scrollbar">
                        {expandedImage.prompt}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-[10px] text-neutral-400 px-1">
                        <span className="font-semibold">Ratio:</span> {expandedImage.aspectRatio}
                      </div>
                    </div>
                  </details>
                </div>
             </div>

             {/* Right: Generated (Larger) */}
             <div className="pointer-events-auto md:w-2/3 h-2/3 md:h-full glass-panel rounded-3xl p-2 flex flex-col shadow-2xl animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="flex-1 relative rounded-2xl overflow-hidden bg-neutral-100 dark:bg-black/50">
                   <div className="absolute top-4 left-4 px-3 py-1 bg-indigo-500/90 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-wider z-10 shadow-lg shadow-indigo-500/20">
                      Generated Asset
                   </div>
                   <img 
                      src={expandedImage.generatedImage} 
                      alt="Generated" 
                      className="w-full h-full object-contain"
                   />
                </div>
                <div className="h-16 flex items-center justify-end px-4 gap-4">
                   <button className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                      Copy Prompt
                   </button>
                   <div className="h-4 w-px bg-neutral-200 dark:bg-white/10"></div>
                   <a 
                      href={expandedImage.generatedImage} 
                      download={`mockfinity-${expandedImage.id}.png`}
                      className="px-6 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors hover:shadow-lg active:scale-95"
                   >
                      Download High-Res
                   </a>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
