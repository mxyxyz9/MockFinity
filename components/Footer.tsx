
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-neutral-50 dark:bg-black pt-24 pb-6 overflow-hidden border-t border-neutral-200 dark:border-white/10 relative transition-colors duration-500">
        {/* Decorative Top Highlight */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        
        {/* Ambient Glow */}
        <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-[1600px] mx-auto px-6 relative z-10">
             {/* Bottom Bar - Text Only */}
            <div className="flex justify-center items-center relative z-20">
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-600 font-semibold">
                    © 2025 MockFinity Inc.
                </p>
            </div>
        </div>

        {/* Massive Typographic Anchor */}
        <div className="w-full overflow-hidden leading-none opacity-[0.06] dark:opacity-[0.25] pointer-events-none select-none absolute bottom-0 left-0">
            <h2 className="text-[18vw] font-bold text-center tracking-wide whitespace-nowrap text-neutral-900 dark:text-white transform translate-y-[35%] font-display">
                MOCKFINITY
            </h2>
        </div>
    </footer>
  );
};
