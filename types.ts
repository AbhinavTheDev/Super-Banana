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

export interface HistoryItem {
  id: string;
  title: string;
  imageData: string;
  createdAt: number;
}

export interface HistoryContextType {
  thumbnailHistory: HistoryItem[];
  productHistory: HistoryItem[];
  addThumbnail: (imageData: string) => void;
  addProductPhoto: (imageData: string) => void;
  deleteThumbnail: (id: string) => void;
  deleteProductPhoto: (id: string) => void;
}
