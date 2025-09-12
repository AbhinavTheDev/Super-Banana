export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export interface Preset {
    name: string;
    width: number;
    height: number;
}

export interface ImagePart {
    base64Data: string;
    mimeType: string;
}

export interface ImageExample extends ImagePart {
  id: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  imageData: string;
  createdAt: number;
  prompt?: string;
  assets?: ImagePart[];
}

export interface HistoryContextType {
  thumbnailHistory: HistoryItem[];
  productPhotoShootHistory: HistoryItem[];
  reimaginerHistory: HistoryItem[];
  // Fix: Add mathVisualizerHistory to the context type.
  mathVisualizerHistory: HistoryItem[];
  addThumbnail: (imageData: string, prompt: string, assets: ImagePart[]) => void;
  addProductPhotoShoot: (imageData: string, prompt: string, asset: ImagePart) => void;
  addReimaginerItem: (imageData: string, prompt: string, asset?: ImagePart) => void;
  // Fix: Add addMathVisualization to the context type.
  addMathVisualization: (imageData: string, prompt: string) => void;
  deleteThumbnail: (id: string) => void;
  deleteProductPhotoShoot: (id: string) => void;
  deleteReimaginerItem: (id: string) => void;
  // Fix: Add deleteMathVisualization for consistency.
  deleteMathVisualization: (id: string) => void;
}

export interface SettingsContextType {
  isSettingsOpen: boolean;
  toggleSettings: () => void;
  thumbnailExamples: ImageExample[];
  productPhotoShootExamples: ImageExample[];
  addThumbnailExample: (file: File) => Promise<void>;
  addProductPhotoShootExample: (file: File) => Promise<void>;
  removeThumbnailExample: (id: string) => void;
  removeProductPhotoShootExample: (id: string) => void;
}
