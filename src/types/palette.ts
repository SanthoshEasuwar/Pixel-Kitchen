export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number; // 0 - 360
  s: number; // 0 - 100
  l: number; // 0 - 100
}

export interface ColorItem {
  id: string;
  hex: string;
  rgb: RGB;
  hsl: HSL;
  isLocked?: boolean;
  name?: string;
  population?: number; // relative weight in image
}

export type ColorHarmonyType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'tetradic'
  | 'monochromatic'
  | 'split-complementary';

export interface ContrastResult {
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
}

export interface SavedPalette {
  id: string;
  name: string;
  colors: string[]; // hex codes
  sourceImageName?: string;
  createdAt: number;
  tags?: string[];
}

export interface PresetImage {
  id: string;
  name: string;
  category: string;
  description: string;
  dataUrl: string;
  suggestedPalette: string[];
}
