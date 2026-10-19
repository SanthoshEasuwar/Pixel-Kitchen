import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Copy,
  Check,
  Download,
  FileCode,
  FileText,
  Image as ImageIcon,
  Share2
} from 'lucide-react';
import {
  exportToCssVariables,
  exportToTailwindConfig,
  generatePaletteImage,
} from '../utils/colorUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors: string[];
  paletteName: string;
  onToast: (msg: string, hex?: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  colors,
  paletteName,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'css' | 'tailwind' | 'json' | 'image'>('css');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const cssContent = exportToCssVariables(colors, paletteName);
  const tailwindContent = exportToTailwindConfig(colors);
  const jsonContent = JSON.stringify(
    {
      palette: paletteName,
      createdWith: 'PixelKitchen',
      colors: colors,
      count: colors.length,
      timestamp: new Date().toISOString(),
    },
    null,
    2
  );

  const getCodeContent = () => {
    switch (activeTab) {
      case 'css':
        return cssContent;
      case 'tailwind':
        return tailwindContent;
      case 'json':
        return jsonContent;
      default:
        return '';
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeContent());
    setCopied(true);
    onToast('Export snippet copied to clipboard', colors[0]);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = () => {
    const dataUrl = generatePaletteImage(colors, paletteName);
    const link = document.createElement('a');
    link.download = `${paletteName.toLowerCase().replace(/\s+/g, '-')}-palette.png`;
    link.href = dataUrl;
    link.click();
    onToast('Palette image downloaded', colors[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel-elevated w-full max-w-2xl rounded-3xl p-6 border border-white/15 shadow-2xl relative overflow-hidden"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Export Palette</h3>
              <p className="text-xs text-slate-400">
                {paletteName} · {colors.length} Colors
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Color preview strip in modal */}
        <div className="flex h-10 rounded-xl overflow-hidden shadow-inner ring-1 ring-white/15 mb-6">
          {colors.map((hex, i) => (
            <div
              key={i}
              className="flex-1 h-full"
              style={{ backgroundColor: hex }}
              title={hex}
            />
          ))}
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-2 mb-4 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('css')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'css'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>CSS Variables</span>
          </button>
          <button
            onClick={() => setActiveTab('tailwind')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'tailwind'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Tailwind CSS</span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'json'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'image'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>PNG Graphic</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'image' ? (
          <div className="p-6 rounded-2xl glass-card border border-white/10 text-center mb-6">
            <ImageIcon className="w-10 h-10 text-violet-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white mb-1">
              Download High-Resolution PNG
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
              Generates a 1200×680 presentation card with liquid glass background, labeled color
              swatches, HEX/RGB values, and PixelKitchen studio typography.
            </p>
            <button
              onClick={handleDownloadPng}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-xl shadow-violet-600/25 flex items-center gap-2 mx-auto transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Image (PNG)</span>
            </button>
          </div>
        ) : (
          <div className="relative mb-6">
            <pre className="p-4 rounded-2xl bg-[#090b14] border border-white/10 text-violet-300 font-mono text-xs overflow-x-auto max-h-60 leading-relaxed">
              <code>{getCodeContent()}</code>
            </pre>
            <button
              onClick={handleCopyCode}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Snippet</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl glass-card hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
