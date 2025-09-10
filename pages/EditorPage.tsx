import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, Reorder } from 'framer-motion';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { DownloadIcon, ImagePlusIcon, Wand2Icon, LayoutTemplateIcon } from '../components/icons/LucideIcons';
import { Preset, ImagePart } from '../types';
import { THUMBNAIL_PRESETS } from '../constants';
import * as geminiService from '../services/geminiService';
import { useHistory } from '../hooks/useHistory';
import { useSettings } from '../hooks/useSettings';

interface Asset {
  id: string;
  file: File;
  preview: string;
}

const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
};

const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addThumbnail, thumbnailHistory } = useHistory();
  const { thumbnailExamples } = useSettings();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [preset, setPreset] = useState<Preset>(THUMBNAIL_PRESETS[0]); // Default to YouTube
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for AI Scene Generator
  const [scenePrompt, setScenePrompt] = useState<string>('');
  const [isGeneratingScene, setIsGeneratingScene] = useState<boolean>(false);
  const [generatedScene, setGeneratedScene] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const item = thumbnailHistory.find(i => i.id === id);
      if (item) {
        setGeneratedThumbnail(item.imageData);
        setAssets([]);
        setPrompt('');
      } else {
        navigate('/editor');
      }
    } else {
      setGeneratedThumbnail(null);
      setAssets([]);
      setPrompt('');
    }
  }, [id, thumbnailHistory, navigate]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    const newAssets: Asset[] = files.map(file => ({
      id: `${file.name}-${Date.now()}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    setAssets(prev => [...prev, ...newAssets]);
  };

  const removeAsset = (assetId: string) => {
    const assetToRemove = assets.find(asset => asset.id === assetId);
    if (assetToRemove) {
      URL.revokeObjectURL(assetToRemove.preview); // Clean up memory
      setAssets(prev => prev.filter(asset => asset.id !== assetId));
    }
  };

  const handlePresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPreset = THUMBNAIL_PRESETS.find(p => p.name === event.target.value);
    if (selectedPreset) {
        setPreset(selectedPreset);
    }
  };

  const handleGenerateScene = async () => {
    if (!scenePrompt.trim()) {
      alert('Please describe the scene you want to generate.');
      return;
    }
    setIsGeneratingScene(true);
    setGeneratedScene(null);
    try {
      const result = await geminiService.generateScene(scenePrompt);
      if (result) {
        const dataUrl = `data:image/jpeg;base64,${result}`;
        setGeneratedScene(dataUrl);
      }
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setIsGeneratingScene(false);
    }
  };

  const handleAddSceneToAssets = async () => {
    if (!generatedScene) return;
    const filename = `ai-scene-${Date.now()}.jpeg`;
    const file = await dataUrlToFile(generatedScene, filename);

    const newAsset: Asset = {
      id: `${file.name}-${Date.now()}`,
      file,
      preview: URL.createObjectURL(file),
    };

    setAssets(prev => [...prev, newAsset]);
    setGeneratedScene(null);
    setScenePrompt('');
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
      const imageParts: ImagePart[] = await Promise.all(assets.map(async asset => {
        const base64Data = await geminiService.fileToBase64(asset.file);
        return {
          base64Data,
          mimeType: asset.file.type
        };
      }));

      const result = await geminiService.generateThumbnail(prompt, imageParts, preset.name, thumbnailExamples);

      if (result) {
        const mimeType = imageParts[0]?.mimeType || 'image/png';
        const dataUrl = `data:${mimeType};base64,${result}`;
        setGeneratedThumbnail(dataUrl);
        addThumbnail(dataUrl, prompt, imageParts);
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
    <div className="container mx-auto max-w-7xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
        <h1 className="text-4xl font-bold font-serif">Thumbnail Builder</h1>
        <p className="text-muted-foreground mt-2">Upload your assets, describe your video, and let AI create stunning thumbnails.</p>
      </motion.div>
      <div className="flex flex-col gap-8">
        {/* Top Controls Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <Card className="h-full">
              <CardHeader><h2 className="text-lg font-bold">1. Upload Assets</h2></CardHeader>
              <CardContent>
                {assets.length > 0 && (
                  <Reorder.Group axis="y" values={assets} onReorder={setAssets} className="space-y-2 mb-4">
                    {assets.map((asset) => (
                      <Reorder.Item key={asset.id} value={asset}
                        className="flex items-center gap-2 p-1 bg-muted rounded-md cursor-grab active:cursor-grabbing"
                      >
                        <img src={asset.preview} alt={`asset ${asset.file.name}`} className="w-12 h-12 object-cover rounded" />
                        <span className="text-sm truncate flex-1">{asset.file.name}</span>
                        <button onClick={() => removeAsset(asset.id)} className="text-destructive/80 hover:text-destructive shrink-0 mr-2">&times;</button>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                )}
                <Button onClick={() => fileInputRef.current?.click()} className="w-full">
                  <ImagePlusIcon className="w-5 h-5 mr-2" /> Upload Images
                </Button>
                <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card className="h-full">
              <CardHeader><h2 className="text-lg font-bold">2. AI Scene Generator (Optional)</h2></CardHeader>
              <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                      Describe a background scene. The AI will generate it for you to use in your thumbnail.
                  </p>
                  <div>
                      <label htmlFor="scene-prompt" className="text-sm font-medium text-muted-foreground">Scene Prompt</label>
                      <textarea id="scene-prompt" value={scenePrompt} onChange={e => setScenePrompt(e.target.value)} placeholder="e.g., 'A mystical forest with glowing mushrooms.'"
                      className="w-full p-2 mt-1 rounded-md border border-input bg-background h-24 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                  </div>
                  <Button onClick={handleGenerateScene} disabled={isGeneratingScene || !scenePrompt.trim()} className="w-full">
                      {isGeneratingScene ? <Spinner size="sm" /> : <Wand2Icon className="w-5 h-5 mr-2" />}
                      {isGeneratingScene ? 'Generating Scene...' : 'Generate Scene'}
                  </Button>
                  {isGeneratingScene && (
                      <div className="flex items-center justify-center p-4 bg-muted rounded-md">
                          <Spinner size="md" />
                      </div>
                  )}
                  {generatedScene && !isGeneratingScene && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-2">
                          <p className="text-sm font-semibold text-center">Generated Scene:</p>
                          <img src={generatedScene} alt="Generated scene" className="rounded-md w-full border" />
                          <Button onClick={handleAddSceneToAssets} variant="secondary" className="w-full">
                              <ImagePlusIcon className="w-5 h-5 mr-2" />
                              Add to Assets
                          </Button>
                      </motion.div>
                  )}
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <Card className="h-full">
              <CardHeader><h2 className="text-lg font-bold">3. Describe Your Thumbnail</h2></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="preset-select" className="text-sm font-medium text-muted-foreground">Size Format</label>
                  <div className="relative mt-1">
                      <select
                          id="preset-select"
                          value={preset.name}
                          onChange={handlePresetChange}
                          className="w-full h-10 pl-3 pr-10 text-sm border border-input bg-background rounded-md appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                      >
                          {THUMBNAIL_PRESETS.map((p) => (
                              <option key={p.name} value={p.name}>
                                  {p.name} ({p.width}x{p.height})
                              </option>
                          ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                      </div>
                  </div>
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
        </div>

        {/* Bottom Preview & Export Section */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader><h2 className="text-lg font-bold">4. Preview & Export</h2></CardHeader>
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

export default EditorPage;