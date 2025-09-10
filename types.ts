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
  addThumbnail: (imageData: string, prompt: string, assets: ImagePart[]) => void;
  addProductPhotoShoot: (imageData: string, prompt: string, asset: ImagePart) => void;
  deleteThumbnail: (id: string) => void;
  deleteProductPhotoShoot: (id: string) => void;
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