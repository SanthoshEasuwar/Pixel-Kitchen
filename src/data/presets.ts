import { PresetImage } from '../types/palette';

// Helper to encode SVG into valid base64 data URL
function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

// 1. Nordic Aurora Fjord
const auroraSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#04060f"/>
      <stop offset="40%" stop-color="#0d1326"/>
      <stop offset="80%" stop-color="#14213d"/>
      <stop offset="100%" stop-color="#070b16"/>
    </linearGradient>
    <radialGradient id="auroraGlow1" cx="45%" cy="30%" r="55%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.8"/>
      <stop offset="40%" stop-color="#06b6d4" stop-opacity="0.6"/>
      <stop offset="75%" stop-color="#8b5cf6" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#04060f" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="auroraGlow2" cx="70%" cy="25%" r="45%">
      <stop offset="0%" stop-color="#a855f7" stop-opacity="0.75"/>
      <stop offset="50%" stop-color="#ec4899" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#04060f" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="waterReflect" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0a1224"/>
      <stop offset="50%" stop-color="#052c38"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="800" fill="url(#skyGrad)"/>

  <!-- Stars -->
  <g fill="#ffffff" opacity="0.7">
    <circle cx="120" cy="80" r="1.5"/><circle cx="280" cy="140" r="1.2"/>
    <circle cx="450" cy="90" r="1.8"/><circle cx="620" cy="110" r="1.5"/>
    <circle cx="780" cy="65" r="2.0"/><circle cx="920" cy="130" r="1.2"/>
    <circle cx="1050" cy="90" r="1.5"/><circle cx="340" cy="40" r="1.0"/>
  </g>

  <!-- Aurora Waves -->
  <path d="M0,220 Q300,90 600,200 T1200,160 L1200,0 L0,0 Z" fill="url(#auroraGlow1)"/>
  <path d="M0,290 Q400,140 800,260 T1200,210 L1200,0 L0,0 Z" fill="url(#auroraGlow2)"/>

  <!-- Dramatic obsidian mountain peaks -->
  <polygon points="0,520 180,310 340,460 520,270 710,480 890,290 1080,450 1200,340 1200,560 0,560" fill="#0f172a"/>
  <polygon points="180,310 240,380 340,460 520,270 600,380 710,480 890,290 980,390 1080,450" fill="#1e293b" opacity="0.65"/>
  <!-- Mountain snow highlights -->
  <polygon points="180,310 195,335 170,335" fill="#e2e8f0" opacity="0.8"/>
  <polygon points="520,270 540,310 505,305" fill="#e2e8f0" opacity="0.8"/>
  <polygon points="890,290 910,325 875,320" fill="#e2e8f0" opacity="0.8"/>

  <!-- Fjord water with emerald/violet reflections -->
  <rect y="540" width="1200" height="260" fill="url(#waterReflect)"/>
  <ellipse cx="600" cy="640" rx="480" ry="60" fill="#10b981" opacity="0.25"/>
  <ellipse cx="780" cy="670" rx="360" ry="40" fill="#8b5cf6" opacity="0.2"/>
  <ellipse cx="380" cy="710" rx="280" ry="30" fill="#06b6d4" opacity="0.3"/>
</svg>`;

// 2. Sunset Glass Pavilion
const architectureSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <linearGradient id="sunsetSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="35%" stop-color="#4c1d95"/>
      <stop offset="65%" stop-color="#c026d3"/>
      <stop offset="85%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#fbbf24"/>
    </linearGradient>
    <linearGradient id="poolGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#0369a1"/>
      <stop offset="100%" stop-color="#082f49"/>
    </linearGradient>
    <linearGradient id="amberGlass" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.85"/>
      <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#d97706" stop-opacity="0.9"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="800" fill="url(#sunsetSky)"/>

  <!-- Distant hill contours -->
  <path d="M0,500 Q300,430 650,470 T1200,440 L1200,560 L0,560 Z" fill="#311042"/>

  <!-- Modern cantilevered pavilion -->
  <rect x="250" y="320" width="700" height="20" fill="#18181b"/>
  <rect x="230" y="340" width="740" height="150" fill="url(#amberGlass)"/>
  <rect x="220" y="490" width="760" height="30" fill="#27272a"/>

  <!-- Glass mullions -->
  <line x1="380" y1="340" x2="380" y2="490" stroke="#09090b" stroke-width="4"/>
  <line x1="530" y1="340" x2="530" y2="490" stroke="#09090b" stroke-width="4"/>
  <line x1="680" y1="340" x2="680" y2="490" stroke="#09090b" stroke-width="4"/>
  <line x1="830" y1="340" x2="830" y2="490" stroke="#09090b" stroke-width="4"/>

  <!-- Travertine terrace -->
  <polygon points="120,520 1080,520 1200,600 0,600" fill="#d4d4d8"/>

  <!-- Infinity Pool reflecting sunset -->
  <rect y="600" width="1200" height="200" fill="url(#poolGrad)"/>
  <ellipse cx="600" cy="650" rx="350" ry="30" fill="#fbbf24" opacity="0.35"/>
  <ellipse cx="600" cy="710" rx="420" ry="25" fill="#f97316" opacity="0.25"/>
</svg>`;

// 3. Moody Studio Orchid & Botanical
const botanicalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <radialGradient id="botanicalBg" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#14532d"/>
      <stop offset="45%" stop-color="#052e16"/>
      <stop offset="85%" stop-color="#02140a"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <linearGradient id="orchidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="45%" stop-color="#c026d3"/>
      <stop offset="100%" stop-color="#701a75"/>
    </linearGradient>
    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#22c55e"/>
      <stop offset="60%" stop-color="#15803d"/>
      <stop offset="100%" stop-color="#064e3b"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="800" fill="url(#botanicalBg)"/>

  <!-- Monstera Leaves -->
  <path d="M150,800 C100,500 250,320 500,260 C520,380 400,520 300,650 Z" fill="url(#leafGrad)" opacity="0.85"/>
  <path d="M1050,800 C1100,480 950,280 700,220 C680,360 820,520 900,680 Z" fill="url(#leafGrad)" opacity="0.8"/>

  <!-- Orchid Blossoms -->
  <g transform="translate(600, 360)">
    <ellipse cx="-80" cy="-40" rx="90" ry="60" fill="url(#orchidGrad)" opacity="0.95" transform="rotate(-25)"/>
    <ellipse cx="80" cy="-40" rx="90" ry="60" fill="url(#orchidGrad)" opacity="0.95" transform="rotate(25)"/>
    <ellipse cx="0" cy="70" rx="75" ry="95" fill="url(#orchidGrad)" opacity="0.9"/>
    <circle cx="0" cy="15" r="28" fill="#facc15"/>
    <circle cx="0" cy="15" r="16" fill="#ef4444"/>
  </g>

  <!-- Secondary Dewdrop Orchid -->
  <g transform="translate(420, 240) scale(0.65)">
    <ellipse cx="-70" cy="-30" rx="80" ry="50" fill="url(#orchidGrad)" opacity="0.9"/>
    <ellipse cx="70" cy="-30" rx="80" ry="50" fill="url(#orchidGrad)" opacity="0.9"/>
    <ellipse cx="0" cy="60" rx="65" ry="85" fill="url(#orchidGrad)" opacity="0.9"/>
    <circle cx="0" cy="10" r="22" fill="#facc15"/>
  </g>
</svg>`;

// 4. Tokyo Neon Rain Twilight
const tokyoNeonSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <linearGradient id="neonSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="asphaltGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#020408"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="800" fill="url(#neonSky)"/>

  <!-- Skyscrapers and building silhouettes -->
  <rect x="60" y="140" width="180" height="420" fill="#090d16"/>
  <rect x="270" y="80" width="220" height="480" fill="#04060a"/>
  <rect x="520" y="180" width="160" height="380" fill="#0f172a"/>
  <rect x="710" y="100" width="240" height="460" fill="#04060a"/>
  <rect x="980" y="160" width="170" height="400" fill="#090d16"/>

  <!-- Glowing Neon Signs -->
  <rect x="90" y="200" width="25" height="180" rx="6" fill="#06b6d4" filter="drop-shadow(0 0 12px #06b6d4)"/>
  <rect x="310" y="140" width="140" height="35" rx="6" fill="#ec4899" filter="drop-shadow(0 0 14px #ec4899)"/>
  <rect x="750" y="170" width="160" height="40" rx="6" fill="#8b5cf6" filter="drop-shadow(0 0 15px #8b5cf6)"/>
  <rect x="1010" y="220" width="30" height="200" rx="6" fill="#f59e0b" filter="drop-shadow(0 0 12px #f59e0b)"/>

  <!-- Wet Asphalt Street with Reflection Waves -->
  <rect y="560" width="1200" height="240" fill="url(#asphaltGrad)"/>

  <!-- Neon Reflections on Wet Pavement -->
  <ellipse cx="102" cy="650" rx="35" ry="70" fill="#06b6d4" opacity="0.35"/>
  <ellipse cx="380" cy="670" rx="90" ry="50" fill="#ec4899" opacity="0.4"/>
  <ellipse cx="830" cy="680" rx="100" ry="55" fill="#8b5cf6" opacity="0.35"/>
  <ellipse cx="1025" cy="660" rx="40" ry="70" fill="#f59e0b" opacity="0.4"/>

  <!-- Rain streaks -->
  <g stroke="rgba(255,255,255,0.18)" stroke-width="1.2">
    <line x1="200" y1="100" x2="160" y2="240"/>
    <line x1="450" y1="80" x2="410" y2="220"/>
    <line x1="720" y1="120" x2="680" y2="260"/>
    <line x1="900" y1="160" x2="860" y2="300"/>
    <line x1="300" y1="350" x2="260" y2="490"/>
    <line x1="600" y1="380" x2="560" y2="520"/>
    <line x1="850" y1="400" x2="810" y2="540"/>
  </g>
</svg>`;

export const PRESET_IMAGES: PresetImage[] = [
  {
    id: 'aurora-fjord',
    name: 'Nordic Aurora',
    category: 'Nature & Landscape',
    description: 'Emerald atmospheric glow, icy obsidian fjord, and violet polar skies.',
    dataUrl: svgToDataUrl(auroraSvg),
    suggestedPalette: ['#10B981', '#06B6D4', '#8B5CF6', '#1E293B', '#0F172A', '#E2E8F0'],
  },
  {
    id: 'sunset-architecture',
    name: 'Sunset Pavilion',
    category: 'Architecture',
    description: 'Honey amber glass reflections, serene cobalt pool, and warm twilight tones.',
    dataUrl: svgToDataUrl(architectureSvg),
    suggestedPalette: ['#FBBF24', '#F97316', '#C026D3', '#0284C7', '#18181B', '#D4D4D8'],
  },
  {
    id: 'dramatic-orchid',
    name: 'Dramatic Orchid',
    category: 'Botanical & Macro',
    description: 'Velvety magenta petals, rich deep emerald foliage, and canary pollen accents.',
    dataUrl: svgToDataUrl(botanicalSvg),
    suggestedPalette: ['#F43F5E', '#C026D3', '#FACC15', '#22C55E', '#064E3B', '#02140A'],
  },
  {
    id: 'tokyo-neon',
    name: 'Tokyo Neon Rain',
    category: 'Urban Twilight',
    description: 'Electric cyan street signs, vivid pink storefront reflections, and wet obsidian asphalt.',
    dataUrl: svgToDataUrl(tokyoNeonSvg),
    suggestedPalette: ['#06B6D4', '#EC4899', '#8B5CF6', '#F59E0B', '#0F172A', '#020617'],
  },
];
