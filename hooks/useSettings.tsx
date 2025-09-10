import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { SettingsContextType, ImageExample } from '../types';
import { fileToBase64 } from '../services/geminiService';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [thumbnailExamples, setThumbnailExamples] = useState<ImageExample[]>([]);
  const [productPhotoShootExamples, setProductPhotoShootExamples] = useState<ImageExample[]>([]);
  
  const toggleSettings = useCallback(() => {
    setIsSettingsOpen(prev => !prev);
  }, []);

  const addThumbnailExample = useCallback(async (file: File) => {
    try {
      const base64Data = await fileToBase64(file);
      const newExample: ImageExample = {
        id: `${Date.now()}-${file.name}`,
        base64Data,
        mimeType: file.type,
      };
      setThumbnailExamples(prev => [...prev, newExample]);
    } catch (error) {
      console.error("Failed to add example:", error);
      alert("Could not add example image. Please try again.");
    }
  }, []);
  
  const addProductPhotoShootExample = useCallback(async (file: File) => {
    try {
      const base64Data = await fileToBase64(file);
      const newExample: ImageExample = {
        id: `${Date.now()}-${file.name}`,
        base64Data,
        mimeType: file.type,
      };
      setProductPhotoShootExamples(prev => [...prev, newExample]);
    } catch (error) {
      console.error("Failed to add example:", error);
      alert("Could not add example image. Please try again.");
    }
  }, []);

  const removeThumbnailExample = useCallback((id: string) => {
    setThumbnailExamples(prev => prev.filter(ex => ex.id !== id));
  }, []);

  const removeProductPhotoShootExample = useCallback((id: string) => {
    setProductPhotoShootExamples(prev => prev.filter(ex => ex.id !== id));
  }, []);

  const value = useMemo(() => ({
    isSettingsOpen,
    toggleSettings,
    thumbnailExamples,
    productPhotoShootExamples,
    addThumbnailExample,
    addProductPhotoShootExample,
    removeThumbnailExample,
    removeProductPhotoShootExample,
  }), [isSettingsOpen, toggleSettings, thumbnailExamples, productPhotoShootExamples, addThumbnailExample, addProductPhotoShootExample, removeThumbnailExample, removeProductPhotoShootExample]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};