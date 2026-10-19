import { SavedPalette } from '../types/palette';

export interface PaletteStorageProvider {
  getPalettes(): Promise<SavedPalette[]>;
  savePalette(palette: Omit<SavedPalette, 'id' | 'createdAt'>): Promise<SavedPalette>;
  deletePalette(id: string): Promise<void>;
  updatePalette(palette: SavedPalette): Promise<SavedPalette>;
}

const STORAGE_KEY = 'pixelkitchen_saved_palettes_v1';

/**
 * LocalStorage implementation of the storage provider
 */
class LocalStoragePaletteStorage implements PaletteStorageProvider {
  async getPalettes(): Promise<SavedPalette[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return this.getInitialSamplePalettes();
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load palettes from localStorage', e);
      return this.getInitialSamplePalettes();
    }
  }

  async savePalette(paletteData: Omit<SavedPalette, 'id' | 'createdAt'>): Promise<SavedPalette> {
    const palettes = await this.getPalettes();
    const newPalette: SavedPalette = {
      ...paletteData,
      id: `pk-pal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
    };
    palettes.unshift(newPalette);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));
    return newPalette;
  }

  async deletePalette(id: string): Promise<void> {
    const palettes = await this.getPalettes();
    const filtered = palettes.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  async updatePalette(updated: SavedPalette): Promise<SavedPalette> {
    const palettes = await this.getPalettes();
    const index = palettes.findIndex(p => p.id === updated.id);
    if (index !== -1) {
      palettes[index] = updated;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));
    }
    return updated;
  }

  private getInitialSamplePalettes(): SavedPalette[] {
    return [
      {
        id: 'sample-1',
        name: 'Cyberpunk Tokyo Twilight',
        colors: ['#06B6D4', '#EC4899', '#8B5CF6', '#F59E0B', '#0F172A', '#020617'],
        sourceImageName: 'Tokyo Rain',
        createdAt: Date.now() - 86400000 * 2,
        tags: ['Neon', 'Cyberpunk', 'Urban'],
      },
      {
        id: 'sample-2',
        name: 'Nordic Fjord Aurora',
        colors: ['#10B981', '#06B6D4', '#8B5CF6', '#1E293B', '#0F172A', '#E2E8F0'],
        sourceImageName: 'Aurora Fjord',
        createdAt: Date.now() - 86400000 * 5,
        tags: ['Atmospheric', 'Nature', 'Emerald'],
      },
      {
        id: 'sample-3',
        name: 'Golden Hour Travertine',
        colors: ['#FBBF24', '#F97316', '#C026D3', '#0284C7', '#18181B', '#D4D4D8'],
        sourceImageName: 'Sunset Pavilion',
        createdAt: Date.now() - 86400000 * 8,
        tags: ['Warm', 'Luxury', 'Minimalist'],
      },
    ];
  }
}

/**
 * AWS DynamoDB Cloud Storage Adapter template
 * Ready to connect with AWS SDK / API Gateway
 */
export class DynamoDBPaletteStorage implements PaletteStorageProvider {
  private apiEndpoint: string;

  constructor(apiEndpoint: string = '/api/palettes') {
    this.apiEndpoint = apiEndpoint;
  }

  async getPalettes(): Promise<SavedPalette[]> {
    // When DynamoDB / API Gateway is configured, this sends authenticated GET
    const res = await fetch(this.apiEndpoint);
    if (!res.ok) throw new Error('DynamoDB request failed');
    return res.json();
  }

  async savePalette(palette: Omit<SavedPalette, 'id' | 'createdAt'>): Promise<SavedPalette> {
    const res = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(palette),
    });
    return res.json();
  }

  async deletePalette(id: string): Promise<void> {
    await fetch(`${this.apiEndpoint}/${id}`, { method: 'DELETE' });
  }

  async updatePalette(palette: SavedPalette): Promise<SavedPalette> {
    const res = await fetch(`${this.apiEndpoint}/${palette.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(palette),
    });
    return res.json();
  }
}

// Default export uses LocalStorageProvider
export const storageService = new LocalStoragePaletteStorage();
