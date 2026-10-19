import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { UploadCloud, Image as ImageIcon, Sparkles, Wand2, ArrowDown } from 'lucide-react';
import { PRESET_IMAGES } from '../data/presets';
import { PresetImage } from '../types/palette';

interface HeroProps {
  onImageSelected: (source: string, name: string) => void;
  onPresetSelected: (preset: PresetImage) => void;
  activeImageName?: string;
}

export const Hero: React.FC<HeroProps> = ({
  onImageSelected,
  onPresetSelected,
  activeImageName,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, JPEG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onImageSelected(reader.result, file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Decorative floating swatches for background
  const decorativeSwatches = [
    { color: '#8B5CF6', label: 'Violet Glow', x: '-10%', y: '15%', delay: 0 },
    { color: '#06B6D4', label: 'Cyan Breeze', x: '102%', y: '25%', delay: 1.2 },
    { color: '#EC4899', label: 'Magenta Pulse', x: '-8%', y: '68%', delay: 0.6 },
    { color: '#10B981', label: 'Emerald Ray', x: '98%', y: '72%', delay: 1.8 },
  ];

  return (
    <section id="hero" className="relative pt-12 pb-20 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-violet-600/20 via-fuchsia-600/15 to-cyan-500/20 blur-[130px] rounded-full pointer-events-none -z-10 animate-ambient-1" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none -z-10 animate-ambient-2" />

      {/* Decorative Floating Glass Swatches */}
      <div className="hidden lg:block absolute inset-0 max-w-6xl mx-auto pointer-events-none -z-5">
        {decorativeSwatches.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.7, 1, 0.7],
              y: [0, -12, 0],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay,
            }}
            style={{ left: item.x, top: item.y }}
            className="absolute p-3 rounded-2xl glass-panel-elevated flex items-center gap-2.5 shadow-2xl border border-white/15"
          >
            <span
              className="w-5 h-5 rounded-lg shadow-md ring-1 ring-white/20"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs font-mono text-slate-200">{item.color}</span>
          </motion.div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 text-center">
        {/* Creative Color Studio label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wider text-violet-300 uppercase mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>YOUR CREATIVE COLOR STUDIO</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.12] text-balance max-w-4xl mx-auto"
        >
          Every image has a palette waiting to be{' '}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
            discovered.
          </span>
        </motion.h1>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
        >
          Turn your favorite images into beautiful, ready-to-use color palettes with
          deep liquid glass aesthetics, harmony generators, and live UI preview.
        </motion.p>

        {/* Upload Card / Dropzone */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative rounded-3xl p-8 sm:p-10 cursor-pointer transition-all duration-300 glass-panel border ${
              isDragging
                ? 'border-violet-400 bg-violet-950/25 scale-[1.01] shadow-2xl shadow-violet-500/20'
                : 'border-white/15 hover:border-violet-500/50 hover:bg-white/[0.04]'
            }`}
          >
            {/* Luminous border highlight */}
            <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/15 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-violet-400/40 transition-all shadow-inner">
                <UploadCloud className="w-8 h-8 text-violet-300 group-hover:text-violet-200 transition-colors" />
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">
                Drop your image here, or{' '}
                <span className="text-violet-400 underline decoration-violet-400/40 underline-offset-4 group-hover:text-violet-300">
                  browse files
                </span>
              </h3>
              <p className="text-sm text-slate-400 max-w-sm mb-5">
                Supports PNG, JPG, JPEG, and WebP up to 25MB. Instant client-side color extraction.
              </p>

              <button
                type="button"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white shadow-sm flex items-center gap-2 group-hover:border-violet-400/30 transition-all pointer-events-none"
              >
                <ImageIcon className="w-3.5 h-3.5 text-violet-300" />
                <span>Select from Computer</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Presets Quick Picker */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4 text-xs font-medium text-slate-400">
            <Wand2 className="w-3.5 h-3.5 text-violet-400" />
            <span>Or test with curated instant sample scenes</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESET_IMAGES.map((preset) => {
              const isActive = activeImageName === preset.name;
              return (
                <button
                  key={preset.id}
                  onClick={() => onPresetSelected(preset)}
                  className={`group relative rounded-2xl p-2.5 text-left transition-all duration-200 glass-card border ${
                    isActive
                      ? 'border-violet-400/70 bg-violet-950/30 shadow-lg shadow-violet-500/20'
                      : 'border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="w-full aspect-video rounded-xl overflow-hidden mb-2.5 bg-black/40 ring-1 ring-white/10">
                    <img
                      src={preset.dataUrl}
                      alt={preset.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="px-1">
                    <div className="text-xs font-semibold text-white truncate group-hover:text-violet-300">
                      {preset.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {preset.category}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Down Indicator */}
        <div className="mt-12 flex justify-center">
          <a
            href="#workspace"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors py-2 px-3 rounded-full bg-white/5 border border-white/10"
          >
            <span>Explore Color Workspace</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};
