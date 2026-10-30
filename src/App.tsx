/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { exportPalette } from "./exportApi";
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Workspace } from './components/Workspace';
import { Playground } from './components/Playground';
import { LiveWebsitePreview } from './components/LiveWebsitePreview';
import { SavedPalettes } from './components/SavedPalettes';
import { ExportModal } from './components/ExportModal';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { PRESET_IMAGES } from './data/presets';
import { ColorItem, PresetImage, SavedPalette } from './types/palette';
import {
  extractPaletteFromImage,
  getDefaultFallbackPalette,
  hexToRgb,
  rgbToHsl,
  getColorName,
} from './utils/colorUtils';
import { storageService } from './services/storageService';
import { Bookmark, Check, X } from 'lucide-react';

export default function App() {
  // Active Image & Palette States
  const [activeImageSrc, setActiveImageSrc] = useState<string>(PRESET_IMAGES[0].dataUrl);
  const [activeImageName, setActiveImageName] = useState<string>(PRESET_IMAGES[0].name);
  const [colors, setColors] = useState<ColorItem[]>([]);
  const [colorCount, setColorCount] = useState<number>(6);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Playground Anchor
  const [selectedAnchorHex, setSelectedAnchorHex] = useState<string>('#10B981');

  // Saved Palettes
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);

  // Modals & UI States
  const [toast, setToast] = useState<{ message: string; hex?: string; type: 'success' | 'info' | 'copied' } | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportData, setExportData] = useState<{ colors: string[]; name: string }>({
    colors: [],
    name: 'PixelKitchen Palette',
  });
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [newPaletteName, setNewPaletteName] = useState('');
  const [newPaletteTag, setNewPaletteTag] = useState('');

  // Initial Load: Load saved palettes and extract initial preset palette
  useEffect(() => {
    storageService.getPalettes().then((pals) => setSavedPalettes(pals));
    loadAndExtract(PRESET_IMAGES[0].dataUrl, PRESET_IMAGES[0].name, 6);
  }, []);

  const showToast = useCallback((message: string, hex?: string, type: 'success' | 'info' | 'copied' = 'copied') => {
    setToast({ message, hex, type });
  }, []);

  // Color Extraction Handler
  const loadAndExtract = async (src: string, name: string, count: number) => {
    setIsLoading(true);
    try {
      const extracted = await extractPaletteFromImage(src, count);
      setColors(extracted);
      if (extracted[0]) {
        setSelectedAnchorHex(extracted[0].hex);
      }
    } catch (err) {
      console.error('Failed to extract:', err);
      setColors(getDefaultFallbackPalette(count));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelected = (source: string, name: string) => {
    setActiveImageSrc(source);
    setActiveImageName(name);
    loadAndExtract(source, name, colorCount);
    showToast(`Loaded "${name}" & extracted dominant palette`, undefined, 'info');
  };

  const handlePresetSelected = (preset: PresetImage) => {
    setActiveImageSrc(preset.dataUrl);
    setActiveImageName(preset.name);
    loadAndExtract(preset.dataUrl, preset.name, colorCount);
    showToast(`Loaded preset "${preset.name}"`, preset.suggestedPalette[0], 'info');
  };

  const handleColorCountChange = (newCount: number) => {
    setColorCount(newCount);
    loadAndExtract(activeImageSrc, activeImageName, newCount);
  };

  // Regenerate: keep locked swatches, re-extract or shift unlocked
  const handleRegenerate = async () => {
    setIsLoading(true);
    try {
      const freshExtraction = await extractPaletteFromImage(activeImageSrc, colorCount + 2);
      let freshIndex = 0;

      const merged = colors.map((col) => {
        if (col.isLocked) return col;
        // Find next unused color from fresh extraction
        while (freshIndex < freshExtraction.length) {
          const candidate = freshExtraction[freshIndex++];
          if (!colors.some((c) => c.hex.toLowerCase() === candidate.hex.toLowerCase())) {
            return candidate;
          }
        }
        return col;
      });

      setColors(merged);
      showToast('Palette regenerated (locked colors preserved)', undefined, 'info');
    } catch {
      showToast('Regenerated palette', undefined, 'info');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLock = (id: string) => {
    setColors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isLocked: !c.isLocked } : c))
    );
  };

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    showToast(`Copied ${hex} to clipboard`, hex, 'copied');
  };

  const handleAddEyedropperColor = (newColor: ColorItem) => {
    setColors((prev) => {
      // If there is an unlocked swatch, replace the last unlocked one
      const unlockedIndex = [...prev].reverse().findIndex((c) => !c.isLocked);
      if (unlockedIndex !== -1) {
        const targetIdx = prev.length - 1 - unlockedIndex;
        const copy = [...prev];
        copy[targetIdx] = newColor;
        return copy;
      }
      return [...prev.slice(0, prev.length - 1), newColor];
    });
    showToast(`Eyedropper sampled & added ${newColor.hex}`, newColor.hex, 'success');
  };

  const handleReorderColors = (fromIdx: number, toIdx: number) => {
    setColors((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIdx, 1);
      copy.splice(toIdx, 0, moved);
      return copy;
    });
  };

  const handleOpenExportModal = (targetColors?: string[], targetName?: string) => {
    setExportData({
      colors: targetColors || colors.map((c) => c.hex),
      name: targetName || `${activeImageName} Palette`,
    });
    setIsExportModalOpen(true);
  };

  // Cloud export: sends the current palette to API Gateway -> Lambda -> S3 + DynamoDB
  const handleCloudExport = async () => {
    if (!colors.length) return;
    showToast('Exporting to cloud...', undefined, 'info');
    await exportPalette(colors.map((c) => c.hex));
  };

  const handleOpenSaveModal = () => {
    setNewPaletteName(`${activeImageName} Palette`);
    setNewPaletteTag('');
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!newPaletteName.trim()) return;
    const tags = newPaletteTag
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const saved = await storageService.savePalette({
      name: newPaletteName.trim(),
      colors: colors.map((c) => c.hex),
      sourceImageName: activeImageName,
      tags: tags.length ? tags : ['Studio'],
    });

    setSavedPalettes((prev) => [saved, ...prev]);
    setIsSaveModalOpen(false);
    showToast(`Saved "${newPaletteName}" to library`, colors[0]?.hex, 'success');
  };

  const handleDeleteSavedPalette = async (id: string) => {
    await storageService.deletePalette(id);
    setSavedPalettes((prev) => prev.filter((p) => p.id !== id));
    showToast('Palette deleted from library', undefined, 'info');
  };

  const handleLoadSavedPalette = (loadedColors: ColorItem[], name: string) => {
    setColors(loadedColors);
    setActiveImageName(name);
    setColorCount(loadedColors.length);
    if (loadedColors[0]) {
      setSelectedAnchorHex(loadedColors[0].hex);
    }
    showToast(`Loaded "${name}" into studio`, loadedColors[0]?.hex, 'success');
    // Scroll smoothly to workspace
    document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleApplyPaletteToWorkspace = (newColors: ColorItem[]) => {
    setColors(newColors);
    setColorCount(newColors.length);
    showToast('Harmonious scheme applied to workspace', newColors[0]?.hex, 'success');
    document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUpdateSingleColor = (id: string, newHex: string) => {
    setColors((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const rgb = hexToRgb(newHex);
          const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
          return {
            ...c,
            hex: newHex,
            rgb,
            hsl,
            name: getColorName(newHex),
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col selection:bg-violet-500/30 selection:text-white">
      {/* Liquid Glass Navbar */}
      <Navbar
        onOpenExport={() => handleOpenExportModal()}
        savedCount={savedPalettes.length}
      />

      {/* Hero Landing */}
      <main className="flex-1">
        <Hero
          onImageSelected={handleImageSelected}
          onPresetSelected={handlePresetSelected}
          activeImageName={activeImageName}
        />

        {/* Image to Palette Workspace */}
        <Workspace
          imageSrc={activeImageSrc}
          imageName={activeImageName}
          colors={colors}
          colorCount={colorCount}
          isLoading={isLoading}
          onColorCountChange={handleColorCountChange}
          onRegenerate={handleRegenerate}
          onToggleLock={handleToggleLock}
          onCopyColor={handleCopyColor}
          onAddEyedropperColor={handleAddEyedropperColor}
          onReorderColors={handleReorderColors}
          onSaveCurrentPalette={handleOpenSaveModal}
          onSelectColorForPlayground={(hex) => {
            setSelectedAnchorHex(hex);
            document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Cloud Export Button (S3) */}
        <div className="flex justify-center py-6">
          <button
            onClick={handleCloudExport}
            disabled={!colors.length}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-lg shadow-violet-600/25 cursor-pointer disabled:opacity-50"
          >
            Export to cloud (S3)
          </button>
        </div>

        {/* Creative Palette Playground */}
        <Playground
          activeColors={colors}
          selectedAnchorHex={selectedAnchorHex}
          onApplyPaletteToWorkspace={handleApplyPaletteToWorkspace}
          onUpdateSingleColor={handleUpdateSingleColor}
          onCopyColor={handleCopyColor}
        />

        {/* Live Website Preview */}
        <LiveWebsitePreview colors={colors} />

        {/* Saved Palettes Section */}
        <SavedPalettes
          palettes={savedPalettes}
          onLoadPalette={handleLoadSavedPalette}
          onDeletePalette={handleDeleteSavedPalette}
          onOpenExportForPalette={(colorsToExport, name) =>
            handleOpenExportModal(colorsToExport, name)
          }
          onCopyColor={handleCopyColor}
        />
      </main>

      {/* Quiet Footer */}
      <Footer />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        colors={exportData.colors}
        paletteName={exportData.name}
        onToast={showToast}
      />

      {/* Save Palette Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="glass-panel-elevated w-full max-w-md rounded-3xl p-6 border border-white/15 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-5">
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white">Save Current Palette</h3>
              </div>
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Swatch Mini Strip */}
            <div className="flex h-8 rounded-xl overflow-hidden shadow-inner ring-1 ring-white/10 mb-4">
              {colors.map((c) => (
                <div key={c.id} className="flex-1 h-full" style={{ backgroundColor: c.hex }} />
              ))}
            </div>

            <div className="space-y-4 text-xs mb-6">
              <div>
                <label className="text-slate-300 block mb-1.5 font-medium">Palette Name</label>
                <input
                  type="text"
                  value={newPaletteName}
                  onChange={(e) => setNewPaletteName(e.target.value)}
                  placeholder="e.g. Nordic Winter Glow"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1.5 font-medium">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newPaletteTag}
                  onChange={(e) => setNewPaletteTag(e.target.value)}
                  placeholder="e.g. Dark Mode, Emerald, Ambient"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="px-4 py-2 rounded-xl glass-card hover:bg-white/10 text-xs font-semibold text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={!newPaletteName.trim()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-lg shadow-violet-600/25 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save to Library</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Translucent Glass Toast */}
      <Toast
        message={toast?.message || null}
        colorHex={toast?.hex}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
}