import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Sliders,
  Check,
  Eye,
  AlertTriangle,
  Layers,
  ArrowRight,
  Palette,
  Shuffle,
  ChevronDown
} from 'lucide-react';
import { ColorHarmonyType, ColorItem } from '../types/palette';
import {
  generateHarmonies,
  getContrastRatio,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  getColorName,
  simulateColorBlindness,
} from '../utils/colorUtils';

interface PlaygroundProps {
  activeColors: ColorItem[];
  selectedAnchorHex: string;
  onApplyPaletteToWorkspace: (newColors: ColorItem[]) => void;
  onUpdateSingleColor: (id: string, newHex: string) => void;
  onCopyColor: (hex: string) => void;
}

export const Playground: React.FC<PlaygroundProps> = ({
  activeColors,
  selectedAnchorHex,
  onApplyPaletteToWorkspace,
  onUpdateSingleColor,
  onCopyColor,
}) => {
  const [anchorHex, setAnchorHex] = useState(selectedAnchorHex || activeColors[0]?.hex || '#8B5CF6');
  const [harmonyType, setHarmonyType] = useState<ColorHarmonyType>('complementary');
  const [colorBlindMode, setColorBlindMode] = useState<'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'>('normal');

  // Manual Color Inspector state
  const [editingColorId, setEditingColorId] = useState<string | null>(activeColors[0]?.id || null);
  const currentEditingColor = activeColors.find(c => c.id === editingColorId) || activeColors[0];

  const generatedHarmonyColors = generateHarmonies(anchorHex, harmonyType, activeColors.length);

  const handleApplyHarmony = () => {
    const updated: ColorItem[] = generatedHarmonyColors.map((hex, i) => {
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return {
        id: `harmony-${i}-${Date.now()}`,
        hex,
        rgb,
        hsl,
        name: getColorName(hex),
        isLocked: false,
      };
    });
    onApplyPaletteToWorkspace(updated);
  };

  const handleManualHexChange = (newHex: string) => {
    if (!editingColorId) return;
    if (/^#[0-9A-Fa-f]{6}$/.test(newHex)) {
      onUpdateSingleColor(editingColorId, newHex.toUpperCase());
    }
  };

  const harmonyOptions: { type: ColorHarmonyType; label: string; desc: string }[] = [
    { type: 'complementary', label: 'Complementary', desc: 'Opposite on the color wheel (180°)' },
    { type: 'analogous', label: 'Analogous', desc: 'Adjacent hues (±30°) for peaceful harmony' },
    { type: 'triadic', label: 'Triadic', desc: 'Equidistant triangle (120°) vibrant balance' },
    { type: 'tetradic', label: 'Tetradic', desc: 'Rectangular 4-hue geometric harmony' },
    { type: 'split-complementary', label: 'Split-Complementary', desc: 'Base hue plus two adjacent to complement' },
    { type: 'monochromatic', label: 'Monochromatic', desc: 'Variations in lightness and saturation' },
  ];

  return (
    <section id="playground" className="py-16 max-w-6xl mx-auto px-4 scroll-mt-20">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-1">
          CREATIVE PALETTE PLAYGROUND
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Harmonies & Accessibility Inspector
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Derive mathematically balanced color schemes, adjust individual tones, and test WCAG contrast.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Harmonies Generator & Color Inspector */}
        <div className="lg:col-span-7 space-y-8">
          {/* Card 1: Harmony Generator */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span>Color Harmony Engine</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Anchor Color:{' '}
                  <span className="font-mono font-medium text-slate-200">{anchorHex}</span>
                </p>
              </div>

              {/* Anchor Picker from Palette */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[11px] text-slate-400 px-2">Anchor:</span>
                {activeColors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setAnchorHex(c.hex)}
                    className={`w-6 h-6 rounded-lg transition-transform cursor-pointer relative ${
                      anchorHex.toUpperCase() === c.hex.toUpperCase()
                        ? 'scale-110 ring-2 ring-violet-400'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.hex}
                  />
                ))}
              </div>
            </div>

            {/* Harmony Mode Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {harmonyOptions.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => setHarmonyType(opt.type)}
                  className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                    harmonyType === opt.type
                      ? 'bg-violet-600/25 border-violet-400/60 shadow-lg shadow-violet-600/15'
                      : 'glass-card border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="text-xs font-semibold text-white mb-0.5">{opt.label}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{opt.desc}</div>
                </button>
              ))}
            </div>

            {/* Generated Harmony Swatches Preview */}
            <div className="mb-6">
              <div className="text-xs font-medium text-slate-300 mb-2.5">
                Generated Scheme ({harmonyType})
              </div>
              <div className="grid grid-cols-6 gap-2">
                {generatedHarmonyColors.map((hex, i) => (
                  <div
                    key={i}
                    onClick={() => onCopyColor(hex)}
                    className="group relative h-20 rounded-xl overflow-hidden cursor-pointer shadow-md ring-1 ring-white/10 flex flex-col justify-end p-2 transition-transform hover:scale-105 active:scale-95"
                    style={{ backgroundColor: hex }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                    <span className="text-[10px] font-mono font-bold px-1 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm self-center">
                      {hex}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleApplyHarmony}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
            >
              <Palette className="w-4 h-4" />
              <span>Apply Scheme to Active Workspace</span>
            </button>
          </div>

          {/* Card 2: Color Inspector & Direct Fine-Tuning */}
          {currentEditingColor && (
            <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-violet-400" />
                  <h3 className="text-base font-semibold text-white">Swatch Fine-Tuning</h3>
                </div>

                {/* Swatch Selector */}
                <div className="flex items-center gap-1.5">
                  {activeColors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setEditingColorId(c.id)}
                      className={`w-7 h-7 rounded-lg transition-transform cursor-pointer relative ${
                        editingColorId === c.id
                          ? 'ring-2 ring-white scale-110 shadow-lg'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {/* Live Swatch Preview & Color Input */}
                <div className="sm:col-span-5 flex flex-col items-center">
                  <div
                    className="w-full aspect-square max-w-[180px] rounded-2xl shadow-xl ring-1 ring-white/15 relative overflow-hidden flex items-center justify-center mb-3"
                    style={{ backgroundColor: currentEditingColor.hex }}
                  >
                    <input
                      type="color"
                      value={currentEditingColor.hex}
                      onChange={(e) => handleManualHexChange(e.target.value)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      title="Open Color Wheel"
                    />
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-black/60 text-white backdrop-blur-md pointer-events-none">
                      Click to Pick
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {currentEditingColor.hex}
                  </span>
                </div>

                {/* Numeric Controls */}
                <div className="sm:col-span-7 space-y-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">HEX Code</label>
                    <input
                      type="text"
                      value={currentEditingColor.hex}
                      onChange={(e) => handleManualHexChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input font-mono text-sm tracking-wider uppercase"
                    />
                  </div>

                  {/* HSL Sliders */}
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Hue: {currentEditingColor.hsl.h}°</span>
                        <span>0° - 360°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={currentEditingColor.hsl.h}
                        onChange={(e) => {
                          const newRgb = hslToRgb(
                            parseInt(e.target.value),
                            currentEditingColor.hsl.s,
                            currentEditingColor.hsl.l
                          );
                          handleManualHexChange(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
                        }}
                        className="w-full accent-violet-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Saturation: {currentEditingColor.hsl.s}%</span>
                        <span>0% - 100%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={currentEditingColor.hsl.s}
                        onChange={(e) => {
                          const newRgb = hslToRgb(
                            currentEditingColor.hsl.h,
                            parseInt(e.target.value),
                            currentEditingColor.hsl.l
                          );
                          handleManualHexChange(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
                        }}
                        className="w-full accent-violet-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Lightness: {currentEditingColor.hsl.l}%</span>
                        <span>0% - 100%</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="95"
                        value={currentEditingColor.hsl.l}
                        onChange={(e) => {
                          const newRgb = hslToRgb(
                            currentEditingColor.hsl.h,
                            currentEditingColor.hsl.s,
                            parseInt(e.target.value)
                          );
                          handleManualHexChange(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
                        }}
                        className="w-full accent-violet-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Contrast Matrix & Color Blindness Simulator */}
        <div className="lg:col-span-5 space-y-8">
          {/* Card 3: WCAG Accessibility Contrast Checker */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-semibold text-white">WCAG Contrast Matrix</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Accessibility rating of current palette colors against dark (#08090D) and light (#FFFFFF) surfaces.
            </p>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {activeColors.map((c) => {
                const darkContrast = getContrastRatio(c.hex, '#08090D');
                const lightContrast = getContrastRatio(c.hex, '#FFFFFF');

                return (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl glass-card border border-white/5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-6 h-6 rounded-lg ring-1 ring-white/20 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div>
                        <div className="font-mono font-semibold text-slate-200">{c.hex}</div>
                        <div className="text-[10px] text-slate-400">{c.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Dark BG contrast */}
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">vs Dark</div>
                        <div className="flex items-center gap-1 font-mono">
                          <span className="font-semibold text-slate-200">
                            {darkContrast.ratio}:1
                          </span>
                          <span
                            className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                              darkContrast.aaNormal
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {darkContrast.aaNormal ? 'AA' : 'FAIL'}
                          </span>
                        </div>
                      </div>

                      {/* Light BG contrast */}
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">vs Light</div>
                        <div className="flex items-center gap-1 font-mono">
                          <span className="font-semibold text-slate-200">
                            {lightContrast.ratio}:1
                          </span>
                          <span
                            className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                              lightContrast.aaNormal
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {lightContrast.aaNormal ? 'AA' : 'FAIL'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 4: Color Vision Deficiency Simulator */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-400" />
                <span>Color Vision Simulation</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Preview how this palette is perceived by people with color vision deficiencies.
            </p>

            <div className="flex flex-wrap gap-1.5 mb-5 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
              {(
                [
                  { id: 'normal', label: 'Standard' },
                  { id: 'deuteranopia', label: 'Deuteranopia' },
                  { id: 'protanopia', label: 'Protanopia' },
                  { id: 'tritanopia', label: 'Tritanopia' },
                  { id: 'achromatopsia', label: 'Monochrome' },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setColorBlindMode(mode.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    colorBlindMode === mode.id
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Simulated Palette Strip */}
            <div className="grid grid-cols-6 gap-2">
              {activeColors.map((c) => {
                const simulatedHex = simulateColorBlindness(c.hex, colorBlindMode);
                return (
                  <div key={c.id} className="text-center">
                    <div
                      className="h-14 rounded-xl shadow-md ring-1 ring-white/10 mb-1.5"
                      style={{ backgroundColor: simulatedHex }}
                    />
                    <div className="font-mono text-[9px] text-slate-400 truncate">
                      {simulatedHex}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
