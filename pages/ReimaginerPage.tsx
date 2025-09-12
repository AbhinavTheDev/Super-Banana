import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { SparklesIcon, DownloadIcon, SaveIcon, CheckIcon, ImagePlusIcon, TrashIcon } from '../components/icons/LucideIcons';
import * as geminiService from '../services/geminiService';
import { useHistory } from '../hooks/useHistory';
import { ImagePart } from '../types';

interface ImageFile {
    file: File;
    preview: string;
}

const suggestionPrompts: { label: string; prompt: string }[] = [
    { label: 'Cinematic Style', prompt: 'Transform the image to have a cinematic look, with dramatic lighting, deep shadows, and a teal and orange color grade.' },
    { label: 'Watercolor Art', prompt: 'Transform the photo into a soft, vibrant watercolor painting with visible brush strokes and paper texture.' },
    { label: 'Sticker Art', prompt: 'Convert the subject of the image into a die-cut vinyl sticker, with a thick white border and a glossy finish.' },
    { label: 'Fantasy Painting', prompt: 'Reimagine the scene as an epic fantasy oil painting, in the style of Frank Frazetta, with mythical creatures and a dramatic sky.' },
    { label: 'Create 3D Figures', prompt: "Create a 1/7 scale commercialized figurine of the characters in the picture, in a realistic style, in a real environment. The figurine is placed on a computer desk. The figurine has a round transparent acrylic base, with no text on the base. The content on the computer screen is a 3D modeling process of this figurine. Next to the computer screen is a toy packaging box, designed in a style reminiscent of high-quality collectible figures, printed with original artwork. The packaging features two-dimensional flat illustrations." },
];


const ReimaginerPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addReimaginerItem, reimaginerHistory } = useHistory();
    
    const [prompt, setPrompt] = useState<string>('');
    const [imageFile, setImageFile] = useState<ImageFile | null>(null);
    const [showImageUpload, setShowImageUpload] = useState<boolean>(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState(false);
    const [generationAsset, setGenerationAsset] = useState<ImagePart | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (id) {
            const item = reimaginerHistory.find(i => i.id === id);
            if (item) {
                setGeneratedImage(item.imageData);
                setPrompt(item.prompt || '');
                setIsSaved(true);
                setImageFile(null);
                setShowImageUpload(item.assets && item.assets.length > 0);
            } else {
                navigate('/reimaginer');
            }
        } else {
            setGeneratedImage(null);
            setPrompt('');
            setImageFile(null);
            setShowImageUpload(false);
            setIsSaved(false);
        }
    }, [id, reimaginerHistory, navigate]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile({ file, preview: URL.createObjectURL(file) });
            setGeneratedImage(null);
            // Reset file input to allow re-uploading the same file
            if (event.target) {
              event.target.value = "";
            }
        }
    };
    
    const removeImage = () => {
        if(imageFile) {
            URL.revokeObjectURL(imageFile.preview);
        }
        setImageFile(null);
    }

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            alert('Please enter a prompt to guide the AI.');
            return;
        }
        if (showImageUpload && !imageFile) {
            alert('Please upload an image to transform, or toggle off the image input.');
            return;
        }

        setIsLoading(true);
        setGeneratedImage(null);
        setIsSaved(false);
        setGenerationAsset(null);

        try {
            let imagePart: ImagePart | undefined = undefined;
            if (showImageUpload && imageFile) {
                const base64 = await geminiService.fileToBase64(imageFile.file);
                const mimeType = imageFile.file.type;
                imagePart = { base64Data: base64, mimeType };
                setGenerationAsset(imagePart);
            }
            
            const result = await geminiService.reimagineImage(prompt, imagePart);

            if (result) {
                const mimeType = imagePart ? imagePart.mimeType : 'image/jpeg';
                const dataUrl = `data:${mimeType};base64,${result}`;
                setGeneratedImage(dataUrl);
            }
        } catch (error) {
            console.error(error);
            alert((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        if (generatedImage && !isSaved) {
            addReimaginerItem(generatedImage, prompt, generationAsset || undefined);
            setIsSaved(true);
        }
    };

    const handleExport = useCallback(() => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.download = `reimagined-${Date.now()}.jpeg`;
        link.href = generatedImage;
        link.click();
    }, [generatedImage]);

    return (
        <div className="container mx-auto max-w-7xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
                <h1 className="text-4xl font-bold font-serif">Reimaginer</h1>
                <p className="text-muted-foreground mt-2">Transform your images or create new ones from pure imagination.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Controls */}
                <Card>
                    <CardHeader><h2 className="text-lg font-bold">1. Describe Your Vision</h2></CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <label htmlFor="prompt" className="font-semibold mb-2 block text-muted-foreground">Prompt</label>
                            <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)}
                                placeholder="e.g., A futuristic city at sunset, neon lights, flying cars..."
                                className="w-full p-2 rounded-md border border-input bg-background h-36 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>
                        <div>
                           <p className="font-semibold mb-2 text-muted-foreground text-sm">Suggestions</p>
                           <div className="flex flex-wrap gap-2">
                               {suggestionPrompts.map((p, i) => (
                                   <Button key={i} variant="secondary" size="sm" onClick={() => setPrompt(p.prompt)}>
                                       {p.label}
                                   </Button>
                               ))}
                           </div>
                        </div>

                        <div className="border-t border-border pt-6 space-y-4">
                             <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-muted-foreground">Transform an Image (Optional)</h3>
                                <label htmlFor="toggle-image-upload" className="flex items-center cursor-pointer border-2 border-border rounded-full">
                                    <div className="relative">
                                        <input type="checkbox" id="toggle-image-upload" className="sr-only" checked={showImageUpload} onChange={() => setShowImageUpload(!showImageUpload)} />
                                        <div className="block bg-muted w-14 h-8 rounded-full"></div>
                                        <div className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition-transform ${showImageUpload ? 'translate-x-6 bg-primary' : 'bg-black'}`}></div>
                                    </div>
                                </label>
                            </div>
                            
                            <AnimatePresence>
                            {showImageUpload && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                {imageFile ? (
                                    <div className="relative w-full h-48 group">
                                         <img src={imageFile.preview} alt="Your upload" className="w-full h-full object-contain rounded-lg border border-border" />
                                         <Button variant="destructive" size="sm" onClick={removeImage} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                                            <TrashIcon className="w-4 h-4" />
                                         </Button>
                                    </div>
                                ) : (
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-48 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                                    >
                                        <ImagePlusIcon className="w-10 h-10 text-muted-foreground" />
                                        <p className="text-muted-foreground mt-2">Click to upload image</p>
                                    </div>
                                )}
                                </motion.div>
                            )}
                            </AnimatePresence>
                             <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        </div>
                        
                        <Button onClick={handleGenerate} disabled={isLoading} className="w-full" size="lg">
                            {isLoading ? <Spinner size="sm" /> : <SparklesIcon className="w-5 h-5 mr-2" />}
                            {isLoading ? 'Reimagining...' : 'Reimagine'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Right: Output */}
                <Card>
                    <CardHeader><h2 className="text-lg font-bold">2. Your Creation</h2></CardHeader>
                    <CardContent className="flex flex-col items-center justify-center p-4">
                        <div className="w-full h-[50vh] lg:h-[90vh] bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                            {isLoading ? (
                                <div className="text-center">
                                    <Spinner size="lg" />
                                    <p className="mt-4 text-muted-foreground">AI is creating your vision...</p>
                                    <p className="mt-2 text-xs text-muted-foreground">(This can take a moment)</p>
                                </div>
                            ) : generatedImage ? (
                                <img src={generatedImage} alt="Generated creation" className="max-h-full max-w-full object-contain rounded-lg shadow-md" />
                            ) : (
                                <div className="text-center p-4">
                                    <SparklesIcon className="w-16 h-16 text-muted-foreground mx-auto" />
                                    <p className="text-muted-foreground text-center px-4 mt-4">Your creation will appear here.</p>
                                </div>
                            )}
                        </div>
                         {generatedImage && !isLoading && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 w-full max-w-sm flex flex-col sm:flex-row gap-4">
                                <Button onClick={handleSave} className="w-full" size="lg" disabled={isSaved}>
                                    {isSaved ? <CheckIcon className="w-5 h-5 mr-2" /> : <SaveIcon className="w-5 h-5 mr-2" />}
                                    {isSaved ? 'Saved' : 'Save Creation'}
                                </Button>
                                <Button onClick={handleExport} className="w-full" size="lg" variant="secondary">
                                    <DownloadIcon className="w-5 h-5 mr-2" /> Export
                                </Button>
                            </motion.div>
                         )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ReimaginerPage;