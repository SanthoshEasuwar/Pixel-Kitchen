import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bookmark,
  Trash2,
  FolderOpen,
  Share2,
  Search,
  Download,
  Copy,
  Plus,
  Tag,
  Check
} from 'lucide-react';
import { SavedPalette, ColorItem } from '../types/palette';
import {
  hexToRgb,
  rgbToHsl,
  getColorName,
  exportToCssVariables,
} from '../utils/colorUtils';

interface SavedPalettesProps {
  palettes: SavedPalette[];
  onLoadPalette: (colors: ColorItem[], name: string) => void;
  onDeletePalette: (id: string) => void;
  onOpenExportForPalette: (colors: string[], name: string) => void;
  onCopyColor: (hex: string) => void;
}

export const SavedPalettes: React.FC<SavedPalettesProps> = ({
  palettes,
  onLoadPalette,
  onDeletePalette,
  onOpenExportForPalette,
  onCopyColor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  // Collect all unique tags
  const allTags = Array.from(
    new Set(palettes.flatMap(p => p.tags || []))
  );

  const filteredPalettes = palettes.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sourceImageName && p.sourceImageName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = selectedTag === 'all' || (p.tags && p.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const handleLoad = (p: SavedPalette) => {
    const colorItems: ColorItem[] = p.colors.map((hex, i) => {
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return {
        id: `loaded-${i}-${Date.now()}`,
        hex,
        rgb,
        hsl,
        name: getColorName(hex),
        isLocked: false,
      };
    });
    onLoadPalette(colorItems, p.name);
  };

  const handleCopyCssSnippet = (palette: SavedPalette) => {
    const snippet = exportToCssVariables(palette.colors, palette.name);
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(palette.id);
    onCopyColor('#8B5CF6');
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  return (
    <section id="saved" className="py-16 max-w-6xl mx-auto px-4 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-1">
            PALETTE LIBRARY
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Saved Palettes
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Persisted locally with cloud-ready storage architecture. Reopen, edit, or export anytime.
          </p>
        </div>

        {/* Search & Tag Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search palettes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl glass-input text-xs w-full sm:w-56"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10 text-xs overflow-x-auto">
              <button
                onClick={() => setSelectedTag('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedTag === 'all'
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    selectedTag === tag
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Palettes Grid */}
      {filteredPalettes.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-white/10">
          <Bookmark className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">No palettes found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or save your active palette using the &quot;Save&quot;
            button in the workspace toolbar above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPalettes.map((palette) => {
              const formattedDate = new Date(palette.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <motion.div
                  key={palette.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group rounded-3xl glass-panel p-5 border border-white/10 hover:border-violet-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    {/* Color Swatches Strip */}
                    <div className="flex h-16 rounded-2xl overflow-hidden shadow-inner ring-1 ring-white/10 mb-4">
                      {palette.colors.map((hex, i) => (
                        <div
                          key={i}
                          className="flex-1 h-full transition-transform hover:scale-105 relative cursor-pointer group/swatch"
                          style={{ backgroundColor: hex }}
                          onClick={() => onCopyColor(hex)}
                          title={`Click to copy ${hex}`}
                        >
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/swatch:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-[9px] font-mono font-bold text-white uppercase">
                              Copy
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Palette Title */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                        {palette.name}
                      </h4>
                    </div>

                    {/* Clean unboxed metadata with dot separators */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                      <span>{formattedDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>{palette.colors.length} colors</span>
                      {palette.sourceImageName && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="truncate max-w-[120px]">{palette.sourceImageName}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    {/* Open in Editor */}
                    <button
                      onClick={() => handleLoad(palette)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/20 text-violet-300 hover:bg-violet-600/30 border border-violet-500/30 font-semibold transition-all cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Reopen</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* Copy CSS Snippet */}
                      <button
                        onClick={() => handleCopyCssSnippet(palette)}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        title="Copy CSS variables snippet"
                      >
                        {copiedSnippetId === palette.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      {/* Export modal trigger */}
                      <button
                        onClick={() => onOpenExportForPalette(palette.colors, palette.name)}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        title="Export formats (PNG, JSON, CSS)"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDeletePalette(palette.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete saved palette"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};
