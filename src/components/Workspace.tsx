import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Copy,
  Lock,
  Unlock,
  RefreshCw,
  Pipette,
  Sliders,
  Sparkles,
  ArrowRight,
  Maximize2,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { ColorItem, RGB } from '../types/palette';
import {
  getOptimalTextColor,
  rgbToHex,
  rgbToHsl,
  getColorName,
} from '../utils/colorUtils';

interface WorkspaceProps {
  imageSrc: string | null;
  imageName: string;
  colors: ColorItem[];
  colorCount: number;
  isLoading: boolean;
  onColorCountChange: (count: number) => void;
  onRegenerate: () => void;
  onToggleLock: (id: string) => void;
  onCopyColor: (hex: string) => void;
  onAddEyedropperColor: (color: ColorItem) => void;
  onReorderColors: (fromIdx: number, toIdx: number) => void;
  onSaveCurrentPalette: () => void;
  onSelectColorForPlayground: (hex: string) => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  imageSrc,
  imageName,
  colors,
  colorCount,
  isLoading,
  onColorCountChange,
  onRegenerate,
  onToggleLock,
  onCopyColor,
  onAddEyedropperColor,
  onReorderColors,
  onSaveCurrentPalette,
  onSelectColorForPlayground,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [eyedropperActive, setEyedropperActive] = useState(false);
  const [hoverColor, setHoverColor] = useState<{ hex: string; rgb: RGB; x: number; y: number } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Eyedropper canvas sampling
  const handleMouseMoveOverImage = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!eyedropperActive || !imageRef.current) return;
    const img = imageRef.current;
    const rect = img.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (img.naturalWidth / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (img.naturalHeight / rect.height));

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, x, y, 1, 1, 0, 0, 1, 1);
    const pixel = ctx.getImageData(0, 0, 1, 1).data;
    const rgb = { r: pixel[0], g: pixel[1], b: pixel[2] };
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

    setHoverColor({
      hex,
      rgb,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleImageClick = () => {
    if (eyedropperActive && hoverColor) {
      const hsl = rgbToHsl(hoverColor.rgb.r, hoverColor.rgb.g, hoverColor.rgb.b);
      const newColorItem: ColorItem = {
        id: `eye-${Date.now()}`,
        hex: hoverColor.hex,
        rgb: hoverColor.rgb,
        hsl,
        name: getColorName(hoverColor.hex),
        isLocked: true,
      };
      onAddEyedropperColor(newColorItem);
      onCopyColor(hoverColor.hex);
    }
  };

  const handleCopy = (id: string, hex: string) => {
    onCopyColor(hex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <section id="workspace" className="py-16 max-w-6xl mx-auto px-4 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-1">
            IMAGE-TO-PALETTE ENGINE
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Dominant Color Workspace
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Source:{' '}
            <span className="text-slate-200 font-medium">{imageName || 'Active Canvas'}</span>
            {' · '}Client-side quantization algorithm
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Eyedropper Toggle */}
          <button
            onClick={() => setEyedropperActive(!eyedropperActive)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              eyedropperActive
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                : 'glass-card border-white/10 text-slate-300 hover:text-white hover:border-white/20'
            }`}
          >
            <Pipette className="w-3.5 h-3.5" />
            <span>{eyedropperActive ? 'Sampler Active' : 'Eyedropper'}</span>
          </button>

          {/* Color Count Selector */}
          <div className="glass-card rounded-xl px-3 py-1.5 flex items-center gap-2 border border-white/10 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Colors:</span>
            <div className="flex items-center gap-1">
              {[5, 6, 7, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => onColorCountChange(num)}
                  className={`w-6 h-6 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    colorCount === num
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Regenerate Unlocked */}
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white glass-panel-elevated hover:bg-white/10 border border-white/15 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-violet-400' : ''}`} />
            <span>Regenerate</span>
          </button>

          {/* Save to Palettes */}
          <button
            onClick={onSaveCurrentPalette}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all active:scale-95 cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Preview Card with Eyedropper Loupe */}
        <div className="lg:col-span-5">
          <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-white/10 shadow-2xl relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 ring-1 ring-white/10 group">
              {imageSrc ? (
                <>
                  <img
                    ref={imageRef}
                    src={imageSrc}
                    alt={imageName}
                    referrerPolicy="no-referrer"
                    onMouseMove={handleMouseMoveOverImage}
                    onMouseLeave={() => setHoverColor(null)}
                    onClick={handleImageClick}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      eyedropperActive ? 'cursor-crosshair' : ''
                    }`}
                  />

                  {/* Eyedropper Floating Loupe */}
                  {eyedropperActive && hoverColor && (
                    <div
                      className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
                      style={{ left: hoverColor.x, top: hoverColor.y }}
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-white shadow-2xl overflow-hidden relative ring-2 ring-black/50">
                        <div
                          className="w-full h-full"
                          style={{ backgroundColor: hoverColor.hex }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-1 h-1 bg-white rounded-full ring-1 ring-black" />
                        </div>
                      </div>
                      <span className="mt-1 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white tracking-wider backdrop-blur-md">
                        {hoverColor.hex}
                      </span>
                    </div>
                  )}

                  {/* Eyedropper Hint Pill */}
                  {eyedropperActive && (
                    <div className="absolute bottom-3 inset-x-3 text-center py-1.5 px-3 rounded-xl bg-black/75 backdrop-blur-md text-[11px] text-violet-200 border border-white/10">
                      Hover to sample, click to pick & add color to palette
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                  No image loaded
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="truncate max-w-[220px] font-medium text-slate-300">
                {imageName}
              </span>
              <span>100% Client Quantized</span>
            </div>
          </div>
        </div>

        {/* Right Column: Palette Swatches Deck */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Extracted Palette ({colors.length} Swatches)
              </div>
              <div className="text-xs text-slate-400">
                Click swatch to copy HEX
              </div>
            </div>

            {/* Swatches Stack / Grid */}
            <div className="space-y-3">
              <AnimatePresence>
                {colors.map((color, index) => {
                  const textColor = getOptimalTextColor(color.hex);
                  const isCopied = copiedId === color.id;

                  return (
                    <motion.div
                      key={color.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="group relative rounded-2xl overflow-hidden glass-card p-3 sm:p-4 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      {/* Left: Swatch Color Block */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleCopy(color.id, color.hex)}
                          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-lg ring-1 ring-white/15 transition-transform group-hover:scale-[1.03] active:scale-95 shrink-0 cursor-pointer flex items-center justify-center"
                          style={{ backgroundColor: color.hex }}
                          title="Click to copy HEX"
                        >
                          {/* Inner reflection highlight */}
                          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                          <div
                            className={`transition-opacity duration-200 flex flex-col items-center justify-center ${
                              isCopied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}
                            style={{ color: textColor }}
                          >
                            {isCopied ? (
                              <Check className="w-5 h-5 drop-shadow" />
                            ) : (
                              <Copy className="w-4 h-4 drop-shadow" />
                            )}
                            <span className="text-[10px] font-bold uppercase mt-0.5 drop-shadow">
                              {isCopied ? 'Copied' : 'Copy'}
                            </span>
                          </div>
                        </button>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-base sm:text-lg font-bold font-mono tracking-tight text-white">
                              {color.hex}
                            </span>
                            {color.isLocked && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" />
                                <span>Locked</span>
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-300 font-medium mb-1.5">
                            {color.name}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-400">
                            <span>
                              RGB: {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                            </span>
                            <span className="hidden sm:inline text-slate-600">·</span>
                            <span>
                              HSL: {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        {/* Move Left / Up */}
                        {index > 0 && (
                          <button
                            onClick={() => onReorderColors(index, index - 1)}
                            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            title="Move up"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                        )}

                        {/* Move Right / Down */}
                        {index < colors.length - 1 && (
                          <button
                            onClick={() => onReorderColors(index, index + 1)}
                            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            title="Move down"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}

                        {/* Lock / Unlock */}
                        <button
                          onClick={() => onToggleLock(color.id)}
                          className={`p-2 rounded-xl transition-all cursor-pointer ${
                            color.isLocked
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                          title={color.isLocked ? 'Unlock color' : 'Lock color'}
                        >
                          {color.isLocked ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <Unlock className="w-4 h-4" />
                          )}
                        </button>

                        {/* Explore Harmonies with this anchor */}
                        <button
                          onClick={() => onSelectColorForPlayground(color.hex)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/20 text-violet-300 hover:bg-violet-600/30 border border-violet-500/30 text-xs font-semibold transition-all cursor-pointer"
                          title="Generate harmonies from this color"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Harmonize</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
