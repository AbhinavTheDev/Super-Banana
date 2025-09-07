
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { HistoryItem, HistoryContextType } from '../types';

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const getInitialState = <T,>(key: string): T[] => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error(`Error reading localStorage key “${key}”:`, error);
    return [];
  }
};

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [thumbnailHistory, setThumbnailHistory] = useState<HistoryItem[]>(() => getInitialState<HistoryItem>('thumbnail_history'));
  const [productHistory, setProductHistory] = useState<HistoryItem[]>(() => getInitialState<HistoryItem>('product_history'));

  useEffect(() => {
    localStorage.setItem('thumbnail_history', JSON.stringify(thumbnailHistory));
  }, [thumbnailHistory]);

  useEffect(() => {
    localStorage.setItem('product_history', JSON.stringify(productHistory));
  }, [productHistory]);
  
  const addThumbnail = (imageData: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      title: `Thumbnail #${thumbnailHistory.length + 1}`,
      imageData,
      createdAt: Date.now(),
    };
    setThumbnailHistory(prev => [...prev, newItem]);
  };

  const addProductPhoto = (imageData: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      title: `Product Img #${productHistory.length + 1}`,
      imageData,
      createdAt: Date.now(),
    };
    setProductHistory(prev => [...prev, newItem]);
  };

  const deleteThumbnail = (id: string) => {
    setThumbnailHistory(prev => prev.filter(item => item.id !== id));
  };
  
  const deleteProductPhoto = (id: string) => {
    setProductHistory(prev => prev.filter(item => item.id !== id));
  };

  const value = useMemo(() => ({
    thumbnailHistory,
    productHistory,
    addThumbnail,
    addProductPhoto,
    deleteThumbnail,
    deleteProductPhoto
  }), [thumbnailHistory, productHistory]);

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
