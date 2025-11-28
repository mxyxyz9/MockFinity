import React, { useState } from 'react';
import { MarketingScenario, ScenarioConfig, AspectRatio } from '../types';
import { Wand2, LayoutTemplate, Coffee, Shirt, Monitor, Layers, Send, Sparkles, Square, RectangleHorizontal, RectangleVertical } from 'lucide-react';

interface PromptControlsProps {
  onGenerate: (prompt: string, category: 'mockup' | 'edit') => void;
  disabled: boolean;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
}

const SCENARIOS: ScenarioConfig[] = [
  {
    id: 'mug',
    label: 'Ceramic Mug',
    icon: 'coffee',
    promptTemplate: "Place the product from the input image onto a ceramic coffee mug on a wooden table. Ensure the product logo and branding are clearly visible and wrapped naturally around the mug. Cinematic lighting, photorealistic."
  },
  {
    id: 'tshirt',
    label: 'Cotton Tee',
    icon: 'shirt',
    promptTemplate: "Display the design/product from the input image on a high-quality white cotton t-shirt worn by a model in an urban setting. Realistic fabric texture and lighting."
  },
  {
    id: 'billboard',
    label: 'City Billboard',
    icon: 'billboard',
    promptTemplate: "Show the product from the input image on a large city billboard in Times Square. Night time, neon lights, high contrast, impressive advertising shot."
  },
  {
    id: 'social',
    label: 'Social Media',
    icon: 'layout',
    promptTemplate: "Create a flat-lay Instagram style marketing photo for the product in the input image. Minimalist pastel background, soft shadows, high aesthetic appeal."
  }
];

const ASPECT_RATIOS: { id: AspectRatio; label: string; icon: React.ReactNode }[] = [
  { id: '1:1', label: 'Square', icon: <Square className="w-4 h-4" /> },
  { id: '16:9', label: 'Landscape', icon: <RectangleHorizontal className="w-4 h-4" /> },
  { id: '9:16', label: 'Portrait', icon: <RectangleVertical className="w-4 h-4" /> },
  { id: '4:3', label: 'Classic', icon: <RectangleHorizontal className="w-4 h-3.5" /> }, 
  { id: '3:4', label: 'Social', icon: <RectangleVertical className="w-3.5 h-4" /> },
];

export const PromptControls: React.FC<PromptControlsProps> = ({ onGenerate, disabled, aspectRatio, onAspectRatioChange }) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  const handleScenarioClick = (scenario: ScenarioConfig) => {
    onGenerate(scenario.promptTemplate, 'mockup');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    onGenerate(customPrompt, 'edit');
  };

  return (
    <div className="glass-panel rounded-3xl p-1 h-full flex flex-col overflow-hidden transition-colors duration-300">
      {/* Tab Switcher */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-100 dark:bg-black/20 rounded-2xl mb-2 transition-colors flex-shrink-0">
        <button
          onClick={() => setActiveTab('presets')}
          className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition-all duration-300 active:scale-95 ${
            activeTab === 'presets' 
              ? 'bg-white dark:bg-white/10 text-neutral-900 dark:text-white shadow-sm dark:shadow-lg ring-1 ring-black/5 dark:ring-0' 
              : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span>Presets</span>
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition-all duration-300 active:scale-95 ${
            activeTab === 'custom' 
              ? 'bg-white dark:bg-white/10 text-neutral-900 dark:text-white shadow-sm dark:shadow-lg ring-1 ring-black/5 dark:ring-0' 
              : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Custom</span>
        </button>
      </div>

      {/* Aspect Ratio Selector - Always visible */}
      <div className="px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
           <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Aspect Ratio</span>
        </div>
        <div className="flex bg-neutral-100 dark:bg-black/20 p-1 rounded-xl">
          {ASPECT_RATIOS.slice(0, 3).map((ratio) => (
            <button
              key={ratio.id}
              onClick={() => onAspectRatioChange(ratio.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg transition-all duration-300 active:scale-95 ${
                aspectRatio === ratio.id
                  ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-white/50 dark:hover:bg-white/5'
              }`}
              title={ratio.label}
            >
              {ratio.icon}
              <span className="text-[10px] font-bold">{ratio.id}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-neutral-100 dark:bg-white/5 my-1" />

      <div className="flex-1 p-4 pt-2 overflow-y-auto custom-scrollbar">
        {activeTab === 'presets' ? (
          <div className="space-y-3 animate-fade-in">
             <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Quick Generators</span>
             </div>
            <div className="grid grid-cols-2 gap-3">
              {SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => handleScenarioClick(scenario)}
                  disabled={disabled}
                  className="group relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-white dark:bg-white/[0.03] hover:bg-neutral-50 dark:hover:bg-white/[0.08] border border-neutral-200 dark:border-white/5 hover:border-indigo-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm dark:shadow-none active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:to-indigo-500/5 dark:group-hover:to-indigo-500/10 rounded-2xl transition-all duration-500" />
                  
                  <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-black/40 border border-neutral-200 dark:border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-indigo-500/50 transition-all duration-300 z-10">
                    {scenario.icon === 'coffee' && <Coffee className="w-4 h-4 text-neutral-400 dark:text-neutral-300 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />}
                    {scenario.icon === 'shirt' && <Shirt className="w-4 h-4 text-neutral-400 dark:text-neutral-300 group-hover:text-pink-500 dark:group-hover:text-pink-400" />}
                    {scenario.icon === 'billboard' && <Monitor className="w-4 h-4 text-neutral-400 dark:text-neutral-300 group-hover:text-blue-500 dark:group-hover:text-blue-400" />}
                    {scenario.icon === 'layout' && <Layers className="w-4 h-4 text-neutral-400 dark:text-neutral-300 group-hover:text-amber-500 dark:group-hover:text-amber-400" />}
                  </div>
                  <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors z-10">{scenario.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit} className="flex flex-col gap-4 h-full animate-fade-in">
            <div className="flex-1 relative group">
              <label className="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-3">Prompt Engineering</label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Describe your vision..."
                className="w-full h-40 bg-white dark:bg-black/30 border border-neutral-200 dark:border-white/10 rounded-2xl p-4 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-indigo-500/50 focus:bg-neutral-50 dark:focus:bg-black/50 transition-all resize-none text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-700 leading-relaxed shadow-inner dark:shadow-none"
              />
              <div className="absolute bottom-4 right-4 pointer-events-none transition-transform duration-500 group-focus-within:rotate-12 group-focus-within:scale-110">
                 <Sparkles className="w-4 h-4 text-neutral-300 dark:text-white/10 group-focus-within:text-indigo-500" />
              </div>
            </div>
            <button
              type="submit"
              disabled={disabled || !customPrompt.trim()}
              className="w-full py-4 px-6 bg-neutral-900 dark:bg-white text-white dark:text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-700 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20"
            >
              <span>Execute</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};