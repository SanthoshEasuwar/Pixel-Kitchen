import { ColorHarmonyType, ColorItem, ContrastResult, HSL, RGB } from '../types/palette';

/**
 * Converts a HEX color string to RGB object
 */
export function hexToRgb(hex: string): RGB {
  let clean = hex.replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Converts RGB components to HEX string (#rrggbb)
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Converts RGB to HSL (Hue: 0-360, Saturation: 0-100, Lightness: 0-100)
 */
export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Converts HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): RGB {
  h = (h % 360 + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Calculate WCAG 2.1 relative luminance
 */
export function getRelativeLuminance(rgb: RGB): number {
  const transform = (val: number) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * transform(rgb.r) + 0.7152 * transform(rgb.g) + 0.0722 * transform(rgb.b);
}

/**
 * Calculate WCAG contrast ratio between two colors
 */
export function getContrastRatio(hex1: string, hex2: string): ContrastResult {
  const l1 = getRelativeLuminance(hexToRgb(hex1));
  const l2 = getRelativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  const rounded = Math.round(ratio * 100) / 100;

  return {
    ratio: rounded,
    aaNormal: rounded >= 4.5,
    aaLarge: rounded >= 3.0,
    aaaNormal: rounded >= 7.0,
    aaaLarge: rounded >= 4.5,
  };
}

/**
 * Determine if text should be light or dark on this background
 */
export function getOptimalTextColor(bgHex: string): '#08090D' | '#FFFFFF' {
  const rgb = hexToRgb(bgHex);
  const lum = getRelativeLuminance(rgb);
  return lum > 0.35 ? '#08090D' : '#FFFFFF';
}

/**
 * Generate a descriptive name for a color
 */
export function getColorName(hex: string): string {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  if (hsl.s < 10) {
    if (hsl.l > 90) return 'Luminous White';
    if (hsl.l > 75) return 'Silvery Cloud';
    if (hsl.l > 45) return 'Slate Chrome';
    if (hsl.l > 20) return 'Deep Graphite';
    return 'Obsidian Void';
  }

  const hue = hsl.h;
  let family = 'Amber';
  if (hue >= 345 || hue < 15) family = hsl.l < 30 ? 'Crimson' : hsl.l > 70 ? 'Blush Rose' : 'Vibrant Coral';
  else if (hue < 45) family = hsl.l > 65 ? 'Apricot Tint' : 'Sunlit Amber';
  else if (hue < 70) family = hsl.l > 60 ? 'Citron Glow' : 'Golden Ochre';
  else if (hue < 150) family = hsl.l < 35 ? 'Deep Emerald' : hsl.l > 65 ? 'Mint Aurora' : 'Jade Verdant';
  else if (hue < 195) family = hsl.l > 65 ? 'Cyan Breeze' : 'Electric Turquoise';
  else if (hue < 255) family = hsl.l < 30 ? 'Midnight Navy' : hsl.l > 70 ? 'Ice Blue' : 'Cobalt Horizon';
  else if (hue < 290) family = hsl.l < 35 ? 'Deep Velvet' : hsl.l > 65 ? 'Lavender Mist' : 'Electric Violet';
  else if (hue < 345) family = hsl.l > 65 ? 'Orchid Dream' : 'Magenta Pulse';

  return family;
}

/**
 * Color distance (perceptual Euclidean in weighted RGB)
 */
export function colorDistance(c1: RGB, c2: RGB): number {
  const rmean = (c1.r + c2.r) / 2;
  const r = c1.r - c2.r;
  const g = c1.g - c2.g;
  const b = c1.b - c2.b;
  return Math.sqrt((((512 + rmean) * r * r) >> 8) + 4 * g * g + (((767 - rmean) * b * b) >> 8));
}

/**
 * Generate color harmony schemes based on an anchor color
 */
export function generateHarmonies(anchorHex: string, type: ColorHarmonyType, count: number = 6): string[] {
  const rgb = hexToRgb(anchorHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const results: string[] = [anchorHex.toUpperCase()];

  switch (type) {
    case 'complementary': {
      const compRgb = hslToRgb((hsl.h + 180) % 360, hsl.s, hsl.l);
      results.push(rgbToHex(compRgb.r, compRgb.g, compRgb.b));

      // Add variations
      const v1 = hslToRgb((hsl.h + 180) % 360, Math.max(15, hsl.s - 25), Math.min(90, hsl.l + 20));
      const v2 = hslToRgb((hsl.h + 180) % 360, Math.min(95, hsl.s + 15), Math.max(15, hsl.l - 25));
      const v3 = hslToRgb(hsl.h, Math.max(15, hsl.s - 20), Math.min(85, hsl.l + 25));
      const v4 = hslToRgb(hsl.h, Math.min(95, hsl.s + 10), Math.max(15, hsl.l - 20));
      results.push(rgbToHex(v1.r, v1.g, v1.b), rgbToHex(v2.r, v2.g, v2.b), rgbToHex(v3.r, v3.g, v3.b), rgbToHex(v4.r, v4.g, v4.b));
      break;
    }
    case 'analogous': {
      const step = 25;
      for (let i = 1; i < count; i++) {
        const offset = (i % 2 === 0 ? 1 : -1) * Math.ceil(i / 2) * step;
        const newH = (hsl.h + offset + 360) % 360;
        const newRgb = hslToRgb(newH, hsl.s, hsl.l);
        results.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
      }
      break;
    }
    case 'triadic': {
      const t1 = hslToRgb((hsl.h + 120) % 360, hsl.s, hsl.l);
      const t2 = hslToRgb((hsl.h + 240) % 360, hsl.s, hsl.l);
      results.push(rgbToHex(t1.r, t1.g, t1.b), rgbToHex(t2.r, t2.g, t2.b));

      // Lighter/darker accents of the triads
      const t0L = hslToRgb(hsl.h, hsl.s, Math.min(88, hsl.l + 25));
      const t1D = hslToRgb((hsl.h + 120) % 360, hsl.s, Math.max(18, hsl.l - 20));
      const t2L = hslToRgb((hsl.h + 240) % 360, Math.max(20, hsl.s - 20), Math.min(85, hsl.l + 25));
      results.push(rgbToHex(t0L.r, t0L.g, t0L.b), rgbToHex(t1D.r, t1D.g, t1D.b), rgbToHex(t2L.r, t2L.g, t2L.b));
      break;
    }
    case 'tetradic': {
      const angles = [90, 180, 270, 45, 225];
      for (let i = 0; i < Math.min(count - 1, angles.length); i++) {
        const newH = (hsl.h + angles[i]) % 360;
        const newRgb = hslToRgb(newH, hsl.s, hsl.l);
        results.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
      }
      break;
    }
    case 'monochromatic': {
      const lightnessSteps = [20, 35, 50, 65, 80, 92];
      results.length = 0; // replace anchor with balanced ramp
      for (let i = 0; i < count; i++) {
        const targetL = lightnessSteps[i % lightnessSteps.length];
        const newRgb = hslToRgb(hsl.h, Math.max(20, hsl.s - (i > 3 ? 15 : 0)), targetL);
        results.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
      }
      break;
    }
    case 'split-complementary': {
      const s1 = hslToRgb((hsl.h + 150) % 360, hsl.s, hsl.l);
      const s2 = hslToRgb((hsl.h + 210) % 360, hsl.s, hsl.l);
      results.push(rgbToHex(s1.r, s1.g, s1.b), rgbToHex(s2.r, s2.g, s2.b));

      const v1 = hslToRgb((hsl.h + 150) % 360, hsl.s, Math.min(85, hsl.l + 25));
      const v2 = hslToRgb((hsl.h + 210) % 360, hsl.s, Math.max(20, hsl.l - 20));
      const v3 = hslToRgb(hsl.h, hsl.s, Math.min(88, hsl.l + 25));
      results.push(rgbToHex(v1.r, v1.g, v1.b), rgbToHex(v2.r, v2.g, v2.b), rgbToHex(v3.r, v3.g, v3.b));
      break;
    }
  }

  return results.slice(0, count);
}

/**
 * Simulate Color Blindness (Deuteranopia, Protanopia, Tritanopia, Achromatopsia)
 */
export function simulateColorBlindness(hex: string, mode: 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'): string {
  if (mode === 'normal') return hex;
  const { r, g, b } = hexToRgb(hex);

  let simR = r, simG = g, simB = b;

  if (mode === 'protanopia') {
    simR = 0.56667 * r + 0.43333 * g + 0.0 * b;
    simG = 0.55833 * r + 0.44167 * g + 0.0 * b;
    simB = 0.0 * r + 0.24167 * g + 0.75833 * b;
  } else if (mode === 'deuteranopia') {
    simR = 0.625 * r + 0.375 * g + 0.0 * b;
    simG = 0.7 * r + 0.3 * g + 0.0 * b;
    simB = 0.0 * r + 0.3 * g + 0.7 * b;
  } else if (mode === 'tritanopia') {
    simR = 0.95 * r + 0.05 * g + 0.0 * b;
    simG = 0.0 * r + 0.43333 * g + 0.56667 * b;
    simB = 0.0 * r + 0.475 * g + 0.525 * b;
  } else if (mode === 'achromatopsia') {
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    simR = gray;
    simG = gray;
    simB = gray;
  }

  return rgbToHex(simR, simG, simB);
}

/**
 * Client-side Color Quantization & Dominant Color Extraction from Canvas
 */
export async function extractPaletteFromImage(
  imageSource: HTMLImageElement | string,
  colorCount: number = 6
): Promise<ColorItem[]> {
  return new Promise((resolve, reject) => {
    const img = imageSource instanceof HTMLImageElement ? imageSource : new Image();
    if (typeof imageSource === 'string') {
      img.crossOrigin = 'anonymous';
      img.src = imageSource;
    }

    const process = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }

        // Downsample to 160x160 for high accuracy and fast processing
        const maxDim = 160;
        let width = img.naturalWidth || img.width || 300;
        let height = img.naturalHeight || img.height || 300;
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height).data;

        // Collect pixels (skipping transparent or completely black/white outlier pixels)
        const pixels: RGB[] = [];
        const step = 2; // sample every 2nd pixel
        for (let i = 0; i < imgData.length; i += 4 * step) {
          const a = imgData[i + 3];
          if (a < 128) continue; // transparent
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          pixels.push({ r, g, b });
        }

        if (pixels.length === 0) {
          // Fallback palette
          resolve(getDefaultFallbackPalette(colorCount));
          return;
        }

        // Color quantization via modified median cut / diversity clustering
        const clusters = quantizePixels(pixels, colorCount);

        const items: ColorItem[] = clusters.map((cluster, index) => {
          const hex = rgbToHex(cluster.rgb.r, cluster.rgb.g, cluster.rgb.b);
          const hsl = rgbToHsl(cluster.rgb.r, cluster.rgb.g, cluster.rgb.b);
          return {
            id: `extracted-${index}-${Date.now()}`,
            hex,
            rgb: cluster.rgb,
            hsl,
            name: getColorName(hex),
            population: cluster.population,
            isLocked: false,
          };
        });

        resolve(items);
      } catch (err) {
        console.error('Palette extraction error:', err);
        resolve(getDefaultFallbackPalette(colorCount));
      }
    };

    if (img.complete && img.naturalWidth > 0) {
      process();
    } else {
      img.onload = () => process();
      img.onerror = () => {
        resolve(getDefaultFallbackPalette(colorCount));
      };
    }
  });
}

interface PixelCluster {
  rgb: RGB;
  population: number;
}

/**
 * Modified Color Quantization ensuring perceptual distance diversity
 */
function quantizePixels(pixels: RGB[], targetCount: number): PixelCluster[] {
  // Simple bucketing in 5-bit color space (32x32x32)
  const buckets = new Map<number, { r: number; g: number; b: number; count: number }>();
  for (const p of pixels) {
    const key = ((p.r >> 3) << 10) | ((p.g >> 3) << 5) | (p.b >> 3);
    const item = buckets.get(key);
    if (item) {
      item.r += p.r;
      item.g += p.g;
      item.b += p.b;
      item.count++;
    } else {
      buckets.set(key, { r: p.r, g: p.g, b: p.b, count: 1 });
    }
  }

  // Sort buckets by population
  const sorted = Array.from(buckets.values())
    .map(b => ({
      rgb: {
        r: Math.round(b.r / b.count),
        g: Math.round(b.g / b.count),
        b: Math.round(b.b / b.count),
      },
      count: b.count,
    }))
    .sort((a, b) => b.count - a.count);

  const selected: PixelCluster[] = [];
  const minPerceptualDist = 38; // avoid identical looking colors

  for (const candidate of sorted) {
    if (selected.length >= targetCount) break;

    // Check if distinct enough from already selected colors
    const isDistinct = selected.every(
      sel => colorDistance(sel.rgb, candidate.rgb) >= minPerceptualDist
    );

    if (isDistinct || selected.length === 0) {
      selected.push({
        rgb: candidate.rgb,
        population: candidate.count,
      });
    }
  }

  // If we didn't fill enough due to strict distance, relax threshold
  if (selected.length < targetCount) {
    for (const candidate of sorted) {
      if (selected.length >= targetCount) break;
      const alreadyHas = selected.some(
        sel => colorDistance(sel.rgb, candidate.rgb) < 18
      );
      if (!alreadyHas) {
        selected.push({
          rgb: candidate.rgb,
          population: candidate.count,
        });
      }
    }
  }

  // Sort by luminance or hue for aesthetic presentation
  selected.sort((a, b) => {
    const lumA = getRelativeLuminance(a.rgb);
    const lumB = getRelativeLuminance(b.rgb);
    return lumB - lumA; // bright to dark
  });

  return selected.slice(0, targetCount);
}

/**
 * Fallback palette in case of image load failure
 */
export function getDefaultFallbackPalette(count: number = 6): ColorItem[] {
  const defaults = ['#9333EA', '#3B82F6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1'];
  return defaults.slice(0, count).map((hex, i) => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return {
      id: `default-${i}-${Date.now()}`,
      hex,
      rgb,
      hsl,
      name: getColorName(hex),
      isLocked: false,
    };
  });
}

/**
 * Generate CSS variables export string
 */
export function exportToCssVariables(colors: string[], name: string = 'PixelKitchen'): string {
  const lines = [
    `/* ${name} Palette — Generated with PixelKitchen */`,
    `:root {`,
    ...colors.map((c, i) => `  --pk-color-${i + 1}: ${c};`),
    `  --pk-bg: ${colors[colors.length - 1] || '#08090D'};`,
    `  --pk-surface: ${colors[colors.length - 2] || '#13151F'};`,
    `  --pk-primary: ${colors[0] || '#9333EA'};`,
    `  --pk-secondary: ${colors[1] || '#3B82F6'};`,
    `  --pk-accent: ${colors[2] || '#06B6D4'};`,
    `}`,
  ];
  return lines.join('\n');
}

/**
 * Generate Tailwind config snippet
 */
export function exportToTailwindConfig(colors: string[]): string {
  const colorMap = colors.reduce((acc, c, idx) => {
    acc[`palette-${idx + 1}`] = c;
    return acc;
  }, {} as Record<string, string>);

  return `// tailwind.config.js snippet
module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(colorMap, null, 2)}
    }
  }
};`;
}

/**
 * Generate high-res palette PNG image using offscreen Canvas
 */
export function generatePaletteImage(colors: string[], paletteName: string = 'PixelKitchen Palette'): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 680;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 680);
  bgGrad.addColorStop(0, '#0a0c14');
  bgGrad.addColorStop(1, '#111422');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 680);

  // Header
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(paletteName, 80, 85);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('EXTRACTED WITH PIXELKITCHEN · LIQUID GLASS COLOR STUDIO', 80, 118);

  // Swatches Container
  const startX = 80;
  const startY = 160;
  const availableWidth = 1040;
  const gap = 16;
  const swatchWidth = (availableWidth - (colors.length - 1) * gap) / colors.length;
  const swatchHeight = 360;

  colors.forEach((hex, idx) => {
    const x = startX + idx * (swatchWidth + gap);
    const y = startY;
    const radius = 16;

    // Swatch box with rounded corners
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + swatchWidth - radius, y);
    ctx.quadraticCurveTo(x + swatchWidth, y, x + swatchWidth, y + radius);
    ctx.lineTo(x + swatchWidth, y + swatchHeight - radius);
    ctx.quadraticCurveTo(x + swatchWidth, y + swatchHeight, x + swatchWidth - radius, y + swatchHeight);
    ctx.lineTo(x + radius, y + swatchHeight);
    ctx.quadraticCurveTo(x, y + swatchHeight, x, y + swatchHeight - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    ctx.fillStyle = hex;
    ctx.fill();

    // Subtle inner border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Color Details below
    const rgb = hexToRgb(hex);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillText(hex, x + 8, y + swatchHeight + 40);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillText(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, x + 8, y + swatchHeight + 62);
  });

  // Footer branding
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('pixelkitchen.design', 80, 620);

  return canvas.toDataURL('image/png');
}
