import React from 'react';
import { Palette, Download, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenExport: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenExport, savedCount }) => {
  return (
    <header className="sticky top-4 z-40 max-w-6xl mx-auto px-4 w-full">
      <div className="glass-panel-elevated rounded-2xl px-6 py-3 flex items-center justify-between gap-8 border border-white/10 shadow-2xl backdrop-blur-2xl">
        {/* Zone 1: Single Brand element */}
        <a href="#hero" className="flex items-center gap-2.5 text-slate-100 group shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-cyan-400 p-[1px] shadow-lg shadow-violet-500/20">
            <div className="w-full h-full bg-[#0a0c16] rounded-[11px] flex items-center justify-center">
              <Palette className="w-4 h-4 text-violet-300 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
            PixelKitchen
          </span>
        </a>

        {/* Zone 2: 4-5 single-line clean nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a
            href="#workspace"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Studio
          </a>
          <a
            href="#playground"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Harmonies
          </a>
          <a
            href="#preview"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Live Preview
          </a>
          <a
            href="#saved"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>My Palettes</span>
            {savedCount > 0 && (
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-white/10 text-violet-200">
                {savedCount}
              </span>
            )}
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenExport}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-600/25 active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Palette</span>
          </button>
        </div>
      </div>
    </header>
  );
};
