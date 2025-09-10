import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { HistoryItem, HistoryContextType, ImagePart } from '../types';

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [thumbnailHistory, setThumbnailHistory] = useState<HistoryItem[]>([]);
  const [productPhotoShootHistory, setProductPhotoShootHistory] = useState<HistoryItem[]>([]);
  
  const addThumbnail = (imageData: string, prompt: string, assets: ImagePart[]) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      title: `Thumbnail #${thumbnailHistory.length + 1}`,
      imageData,
      createdAt: Date.now(),
      prompt,
      assets,
    };
    setThumbnailHistory(prev => [...prev, newItem]);
  };

  const addProductPhotoShoot = (imageData: string, prompt: string, asset: ImagePart) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      title: `Photoshoot #${productPhotoShootHistory.length + 1}`,
      imageData,
      createdAt: Date.now(),
      prompt,
      assets: [asset],
    };
    setProductPhotoShootHistory(prev => [...prev, newItem]);
  };

  const deleteThumbnail = (id: string) => {
    setThumbnailHistory(prev => prev.filter(item => item.id !== id));
  };
  
  const deleteProductPhotoShoot = (id: string) => {
    setProductPhotoShootHistory(prev => prev.filter(item => item.id !== id));
  };

  const value = useMemo(() => ({
    thumbnailHistory,
    productPhotoShootHistory,
    addThumbnail,
    addProductPhotoShoot,
    deleteThumbnail,
    deleteProductPhotoShoot
  }), [thumbnailHistory, productPhotoShootHistory]);

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};