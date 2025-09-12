
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { HistoryItem, HistoryContextType, ImagePart } from '../types';

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [thumbnailHistory, setThumbnailHistory] = useState<HistoryItem[]>([]);
  const [productPhotoShootHistory, setProductPhotoShootHistory] = useState<HistoryItem[]>([]);
  const [reimaginerHistory, setReimaginerHistory] = useState<HistoryItem[]>([]);
  // Fix: Add state for math visualizer history.
  const [mathVisualizerHistory, setMathVisualizerHistory] = useState<HistoryItem[]>([]);
  
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

  const addReimaginerItem = (imageData: string, prompt: string, asset?: ImagePart) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      title: `Reimagined #${reimaginerHistory.length + 1}`,
      imageData,
      createdAt: Date.now(),
      prompt,
      assets: asset ? [asset] : [],
    };
    setReimaginerHistory(prev => [...prev, newItem]);
  };

  // Fix: Add function to add math visualization to history.
  const addMathVisualization = (imageData: string, prompt: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      title: `Visualization #${mathVisualizerHistory.length + 1}`,
      imageData,
      createdAt: Date.now(),
      prompt,
      assets: [],
    };
    setMathVisualizerHistory(prev => [...prev, newItem]);
  };

  const deleteThumbnail = (id: string) => {
    setThumbnailHistory(prev => prev.filter(item => item.id !== id));
  };
  
  const deleteProductPhotoShoot = (id: string) => {
    setProductPhotoShootHistory(prev => prev.filter(item => item.id !== id));
  };

  const deleteReimaginerItem = (id: string) => {
    setReimaginerHistory(prev => prev.filter(item => item.id !== id));
  };

  // Fix: Add function to delete math visualization from history.
  const deleteMathVisualization = (id: string) => {
    setMathVisualizerHistory(prev => prev.filter(item => item.id !== id));
  };

  const value = useMemo(() => ({
    thumbnailHistory,
    productPhotoShootHistory,
    reimaginerHistory,
    // Fix: Provide math visualizer history and actions.
    mathVisualizerHistory,
    addThumbnail,
    addProductPhotoShoot,
    addReimaginerItem,
    addMathVisualization,
    deleteThumbnail,
    deleteProductPhotoShoot,
    deleteReimaginerItem,
    deleteMathVisualization
  }), [thumbnailHistory, productPhotoShootHistory, reimaginerHistory, mathVisualizerHistory]);

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
