
import React from 'react';
import { Hexagon, Sun, Moon, Sparkles, Layers } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl h-16 rounded-full border border-neutral-200/60 dark:border-white/10 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-2xl transition-all duration-300 shadow-lg shadow-neutral-200/20 dark:shadow-black/40 flex items-center justify-between px-2 pl-6">
      <div className="flex items-center gap-3 group cursor-pointer select-none">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <div className="relative bg-white dark:bg-black border border-neutral-200 dark:border-white/10 p-1.5 rounded-lg group-hover:border-indigo-500/50 transition-colors duration-500">
            <Layers className="w-4 h-4 text-indigo-500 dark:text-indigo-400 fill-indigo-500/20" strokeWidth={2.5} />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold tracking-tight font-display text-neutral-900 dark:text-white leading-none">
            MockFinity
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 pr-2">
        <button 
          onClick={onToggleTheme}
          className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-all"
          title="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
