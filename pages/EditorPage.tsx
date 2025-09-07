
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { DownloadIcon, ImagePlusIcon, Wand2Icon } from '../components/icons/LucideIcons';
import { Preset } from '../types';
import { THUMBNAIL_PRESETS } from '../constants';
import * as geminiService from '../services/geminiService';
import { useHistory } from '../hooks/useHistory';

interface Asset {
  file: File;
  preview: string;
}

const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addThumbnail, thumbnailHistory } = useHistory();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [preset] = useState<Preset>(THUMBNAIL_PRESETS[0]); // Default to YouTube
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      const item = thumbnailHistory.find(i => i.id === id);
      if (item) {
        setGeneratedThumbnail(item.imageData);
        setAssets([]);
        setPrompt('');
      } else {
        // If ID is invalid, redirect to the base editor page
        navigate('/editor');
      }
    } else {
      // Clear state when on the base /editor route
      setGeneratedThumbnail(null);
      setAssets([]);
      setPrompt('');
    }
  }, [id, thumbnailHistory, navigate]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    const newAssets: Asset[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setAssets(prev => [...prev, ...newAssets]);
  };

  const removeAsset = (index: number) => {
    const assetToRemove = assets[index];
    URL.revokeObjectURL(assetToRemove.preview); // Clean up memory
    setAssets(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerateThumbnail = async () => {
    if (assets.length === 0) {
      alert('Please upload at least one image asset.');
      return;
    }
    if (!prompt.trim()) {
      alert('Please provide a prompt to guide the AI.');
      return;
    }

    setIsLoading(true);
    setGeneratedThumbnail(null);
    try {
      const imageParts: geminiService.ImagePart[] = await Promise.all(assets.map(async asset => {
        const base64Data = await geminiService.fileToBase64(asset.file);
        return {
          base64Data,
          mimeType: asset.file.type
        };
      }));

      const result = await geminiService.generateThumbnail(prompt, imageParts, preset.name);

      if (result) {
        const mimeType = imageParts[0]?.mimeType || 'image/png';
        const dataUrl = `data:${mimeType};base64,${result}`;
        setGeneratedThumbnail(dataUrl);
        addThumbnail(dataUrl);
      }

    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };


  const handleExport = useCallback(() => {
    if (!generatedThumbnail) return;
    const link = document.createElement('a');
    link.download = 'thumbnail.png';
    link.href = generatedThumbnail;
    link.click();
  }, [generatedThumbnail]);

  return (
    <div className="container mx-auto max-w-5xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
        <h1 className="text-4xl font-bold font-serif">Thumbnail Builder</h1>
        <p className="text-muted-foreground mt-2">Upload your assets, describe your video, and let AI create stunning thumbnails.</p>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: Controls */}
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-1 flex flex-col gap-8">
          <Card>
            <CardHeader><h2 className="text-lg font-bold">1. Upload Assets</h2></CardHeader>
            <CardContent>
              {assets.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                  {assets.map((asset, index) => (
                    <div key={index} className="relative group">
                      <img src={asset.preview} alt={`asset ${index + 1}`} className="w-full h-full object-cover rounded-md aspect-square" />
                      <button onClick={() => removeAsset(index)} className="absolute top-0 right-0 m-1 bg-destructive/80 text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                    </div>
                  ))}
                </div>
              )}
              <Button onClick={() => fileInputRef.current?.click()} className="w-full">
                <ImagePlusIcon className="w-5 h-5 mr-2" /> Upload Images
              </Button>
              <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><h2 className="text-lg font-bold">2. Describe Your Thumbnail</h2></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Size Format</label>
                <div className="p-2 mt-1 rounded-md border border-input bg-muted">YouTube ({preset.width}x{preset.height})</div>
              </div>
              <div>
                <label htmlFor="prompt" className="text-sm font-medium text-muted-foreground">Prompt</label>
                <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g., 'A shocking reveal! Bright, epic thumbnail for a new gaming laptop review.'"
                  className="w-full p-2 mt-1 rounded-md border border-input bg-background h-32 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <Button onClick={handleGenerateThumbnail} disabled={isLoading || assets.length === 0} className="w-full text-sm" size="lg">
                {isLoading ? <Spinner size="sm" /> : <Wand2Icon className="w-5 h-5 mr-2" />}
                {isLoading ? 'Generating...' : 'Generate Thumbnail'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Panel: Preview & Export */}
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-2">
          <Card className="top-24 h-full">
            <CardHeader><h2 className="text-lg font-bold">3. Preview & Export</h2></CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-4">
              <div
                className="w-full bg-muted rounded-lg shadow-inner border-2 border-dashed border-border flex items-center justify-center"
                style={{ aspectRatio: `${preset.width}/${preset.height}` }}
              >
                {isLoading && (
                  <div className="text-center p-4">
                    <Spinner size="lg" />
                    <p className="text-sm font-semibold mt-4 text-muted-foreground">AI is creating your thumbnail...</p>
                  </div>
                )}
                {!isLoading && generatedThumbnail && (
                  <img src={generatedThumbnail} alt="Generated thumbnail" className="w-full h-full object-contain rounded-md" />
                )}
                {!isLoading && !generatedThumbnail && (
                  <div className="text-center p-4">
                    <LayoutTemplateIcon className="w-12 h-12 text-muted-foreground mx-auto" />
                    <p className="mt-2 text-muted-foreground">Your generated thumbnail will appear here</p>
                  </div>
                )}
              </div>
              {generatedThumbnail && !isLoading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 w-full max-w-xs">
                  <Button onClick={handleExport} className="w-full" size="lg">
                    <DownloadIcon className="w-5 h-5 mr-2" /> Export Image
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

// Add LayoutTemplateIcon for placeholder
const LayoutTemplateIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg strokeWidth="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="7" x="3" y="3" rx="1" /><rect width="9" height="7" x="3" y="14" rx="1" /><rect width="5" height="7" x="16" y="14" rx="1" /></svg>
);


export default EditorPage;
