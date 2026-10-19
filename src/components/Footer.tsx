import React from 'react';
import { Palette, Github, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#06070b]/60 backdrop-blur-xl py-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 p-[1px]">
            <div className="w-full h-full bg-[#0a0c16] rounded-[7px] flex items-center justify-center">
              <Palette className="w-3.5 h-3.5 text-violet-300" />
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight">PixelKitchen</div>
            <div className="text-xs text-slate-400">
              Liquid Glass Color Studio & Quantization Engine
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <a href="#hero" className="hover:text-white transition-colors">
            Top
          </a>
          <a href="#workspace" className="hover:text-white transition-colors">
            Studio
          </a>
          <a href="#playground" className="hover:text-white transition-colors">
            Harmonies
          </a>
          <a href="#preview" className="hover:text-white transition-colors">
            Live Preview
          </a>
          <a href="#saved" className="hover:text-white transition-colors">
            My Palettes
          </a>
        </div>

        <div className="text-xs text-slate-400 text-center md:text-right">
          <span>&copy; {new Date().getFullYear()} PixelKitchen. Built for creative designers.</span>
        </div>
      </div>
    </footer>
  );
};
