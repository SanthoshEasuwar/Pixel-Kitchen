import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Monitor,
  Smartphone,
  Sun,
  Moon,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Layout,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { ColorItem } from '../types/palette';

interface LiveWebsitePreviewProps {
  colors: ColorItem[];
}

export const LiveWebsitePreview: React.FC<LiveWebsitePreviewProps> = ({ colors }) => {
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');

  // Assign semantic roles to palette colors
  // colors[0]: primary brand
  // colors[1]: secondary brand
  // colors[2]: accent / highlight
  // colors[3]: surface or muted
  // colors[colors.length - 1]: background / dark
  const primaryColor = colors[0]?.hex || '#8B5CF6';
  const secondaryColor = colors[1]?.hex || '#06B6D4';
  const accentColor = colors[2]?.hex || '#EC4899';
  const surfaceColor = previewTheme === 'dark' ? '#111422' : '#F8FAFC';
  const bgColor = previewTheme === 'dark' ? '#070913' : '#FFFFFF';
  const textColor = previewTheme === 'dark' ? '#F8FAFC' : '#0F172A';
  const textMuted = previewTheme === 'dark' ? '#94A3B8' : '#64748B';
  const borderCol = previewTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';

  return (
    <section id="preview" className="py-16 max-w-6xl mx-auto px-4 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-1">
            DYNAMIC INTERFACE SIMULATOR
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Live Website Preview
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            See your active palette applied in real time to a production design system.
          </p>
        </div>

        {/* Viewport and Theme Switchers */}
        <div className="flex items-center gap-3">
          {/* Light / Dark Mode Toggle */}
          <div className="glass-card rounded-xl p-1 flex items-center border border-white/10 text-xs">
            <button
              onClick={() => setPreviewTheme('dark')}
              className={`p-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                previewTheme === 'dark'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
            <button
              onClick={() => setPreviewTheme('light')}
              className={`p-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                previewTheme === 'light'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
          </div>

          {/* Desktop / Mobile Toggle */}
          <div className="glass-card rounded-xl p-1 flex items-center border border-white/10 text-xs">
            <button
              onClick={() => setDeviceView('desktop')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                deviceView === 'desktop'
                  ? 'bg-white/15 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop Viewport"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceView('mobile')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                deviceView === 'mobile'
                  ? 'bg-white/15 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile Viewport"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mockup Frame */}
      <div className="glass-panel rounded-3xl p-3 sm:p-5 border border-white/10 shadow-2xl overflow-hidden">
        {/* Browser Top Bar */}
        <div className="flex items-center justify-between pb-3 px-2 border-b border-white/10 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            <span className="ml-3 font-mono text-[11px] text-slate-400">
              preview.app.pixelkitchen
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="font-mono">Palette Mapped</span>
          </div>
        </div>

        {/* Scaled Preview Canvas */}
        <div className="pt-4 flex justify-center">
          <div
            className={`transition-all duration-300 rounded-2xl overflow-hidden border shadow-2xl relative ${
              deviceView === 'desktop' ? 'w-full' : 'w-[375px]'
            }`}
            style={{
              backgroundColor: bgColor,
              color: textColor,
              borderColor: borderCol,
            }}
          >
            {/* Mock Navigation */}
            <header
              className="px-6 py-4 flex items-center justify-between border-b"
              style={{
                borderColor: borderCol,
                backgroundColor: surfaceColor,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs"
                  style={{
                    backgroundColor: primaryColor,
                    color: '#ffffff',
                  }}
                >
                  ▲
                </div>
                <span className="text-sm font-bold tracking-tight">Vortex Cloud</span>
              </div>

              {deviceView === 'desktop' && (
                <div
                  className="flex items-center gap-6 text-xs font-medium"
                  style={{ color: textMuted }}
                >
                  <span className="hover:underline cursor-pointer">Platform</span>
                  <span className="hover:underline cursor-pointer">Solutions</span>
                  <span className="hover:underline cursor-pointer">Enterprise</span>
                  <span className="hover:underline cursor-pointer">Pricing</span>
                </div>
              )}

              <button
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-transform active:scale-95"
                style={{
                  backgroundColor: primaryColor,
                  color: '#ffffff',
                }}
              >
                Launch Console
              </button>
            </header>

            {/* Mock Hero Section */}
            <div className="px-6 py-12 md:py-16 text-center relative overflow-hidden">
              {/* Subtle dynamic radial glow */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[250px] blur-[90px] rounded-full pointer-events-none opacity-25"
                style={{ backgroundColor: primaryColor }}
              />

              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-5 ring-1"
                style={{
                  backgroundColor: `${secondaryColor}15`,
                  color: secondaryColor,
                  borderColor: `${secondaryColor}30`,
                }}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Next-Gen Cloud Architecture</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 max-w-xl mx-auto leading-tight">
                Scalable infrastructure powered by{' '}
                <span style={{ color: primaryColor }}>intelligent routing</span>
              </h3>

              <p
                className="text-xs sm:text-sm max-w-md mx-auto mb-8 leading-relaxed font-normal"
                style={{ color: textMuted }}
              >
                Deploy latency-sensitive clusters anywhere in milliseconds with automatic failover
                and cryptographic workload isolation.
              </p>

              {/* CTAs */}
              <div className="flex items-center justify-center gap-3">
                <button
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer"
                  style={{
                    backgroundColor: primaryColor,
                    color: '#ffffff',
                  }}
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer"
                  style={{
                    borderColor: borderCol,
                    backgroundColor: surfaceColor,
                    color: textColor,
                  }}
                >
                  Documentation
                </button>
              </div>
            </div>

            {/* Mock Features / Bento Cards */}
            <div className="px-6 pb-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Feature 1 */}
                <div
                  className="p-5 rounded-2xl border transition-all"
                  style={{
                    backgroundColor: surfaceColor,
                    borderColor: borderCol,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-bold mb-1">Zero-Trust Vault</div>
                  <p className="text-xs leading-relaxed" style={{ color: textMuted }}>
                    Hardware-enforced encryption keys rotated seamlessly every 48 hours.
                  </p>
                  <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs font-mono" style={{ borderColor: borderCol }}>
                    <span style={{ color: textMuted }}>Throughput</span>
                    <span className="font-bold tabular-nums" style={{ color: primaryColor }}>4.8 GB/s</span>
                  </div>
                </div>

                {/* Feature 2 */}
                <div
                  className="p-5 rounded-2xl border transition-all"
                  style={{
                    backgroundColor: surfaceColor,
                    borderColor: borderCol,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 text-white"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-bold mb-1">Global Anycast</div>
                  <p className="text-xs leading-relaxed" style={{ color: textMuted }}>
                    Single IP ingress terminating SSL at 240+ global POP edge nodes.
                  </p>
                  <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs font-mono" style={{ borderColor: borderCol }}>
                    <span style={{ color: textMuted }}>Latency</span>
                    <span className="font-bold tabular-nums" style={{ color: secondaryColor }}>12ms median</span>
                  </div>
                </div>

                {/* Feature 3 */}
                <div
                  className="p-5 rounded-2xl border transition-all"
                  style={{
                    backgroundColor: surfaceColor,
                    borderColor: borderCol,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Layout className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-bold mb-1">Declarative Mesh</div>
                  <p className="text-xs leading-relaxed" style={{ color: textMuted }}>
                    Define multi-region mesh topologies purely with declarative code specs.
                  </p>
                  <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs font-mono" style={{ borderColor: borderCol }}>
                    <span style={{ color: textMuted }}>Uptime SLA</span>
                    <span className="font-bold tabular-nums" style={{ color: accentColor }}>99.99%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
