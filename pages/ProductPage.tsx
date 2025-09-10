import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { ImagePlusIcon, Wand2Icon } from '../components/icons/LucideIcons';
import * as geminiService from '../services/geminiService';
import { useHistory } from '../hooks/useHistory';
import { useSettings } from '../hooks/useSettings';


interface ImageFile {
    file: File;
    preview: string;
}

const ProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addProductPhotoShoot, productPhotoShootHistory } = useHistory();
    const { productPhotoShootExamples } = useSettings();
    const [imageFile, setImageFile] = useState<ImageFile | null>(null);
    const [prompt, setPrompt] = useState<string>('On a white marble countertop with soft, natural morning light.');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (id) {
            const item = productPhotoShootHistory.find(i => i.id === id);
            if (item) {
                setGeneratedImage(item.imageData);
                setImageFile(null); // Clear uploader
                setPrompt('');
            } else {
                navigate('/product');
            }
        } else {
            // Clear state for new creation
            setGeneratedImage(null);
            setImageFile(null);
            setPrompt('On a white marble countertop with soft, natural morning light.');
        }
    }, [id, productPhotoShootHistory, navigate]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile({ file, preview: URL.createObjectURL(file) });
            setGeneratedImage(null);
        }
    };

    const handleGenerate = async () => {
        if (!imageFile) {
            alert('Please upload a product image first.');
            return;
        }
        setIsLoading(true);
        setGeneratedImage(null);
        try {
            const base64 = await geminiService.fileToBase64(imageFile.file);
            const mimeType = imageFile.file.type;
            
            const result = await geminiService.generateProductPhotoShoot(base64, mimeType, prompt, productPhotoShootExamples);

            if (result) {
                const dataUrl = `data:${mimeType};base64,${result}`;
                setGeneratedImage(dataUrl);
                addProductPhotoShoot(dataUrl, prompt, { base64Data: base64, mimeType });
            }
        } catch (error) {
            console.error(error);
            alert((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-5xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
                <h1 className="text-4xl font-bold font-serif">Product Photoshoot</h1>
                <p className="text-muted-foreground mt-2">Upload your product, describe a scene, and let AI create stunning photos.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Panel: Upload & Controls */}
                <Card>
                    <CardHeader><h2 className="text-lg font-bold">1. Upload & Describe</h2></CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-64 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                            >
                                {imageFile ? (
                                    <img src={imageFile.preview} alt="Product preview" className="max-h-full max-w-full object-contain" />
                                ) : (
                                    <>
                                        <ImagePlusIcon className="w-12 h-12 text-muted-foreground" />
                                        <p className="text-muted-foreground mt-2">Click to upload product image</p>
                                    </>
                                )}
                            </div>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        </div>
                        
                        <div>
                            <label htmlFor="prompt" className="font-semibold mb-2 block">Describe the scene:</label>
                             <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)}
                                className="w-full p-2 rounded-md border border-input bg-background h-28 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                             />
                        </div>
                        
                        <Button onClick={handleGenerate} disabled={isLoading || !imageFile} className="w-full" size="lg">
                            {isLoading ? <Spinner size="sm" /> : <Wand2Icon className="w-5 h-5 mr-2" />}
                            {isLoading ? 'Generating...' : 'Start Photoshoot'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Right Panel: Results */}
                <Card>
                    <CardHeader><h2 className="text-lg font-bold">2. Results</h2></CardHeader>
                    <CardContent>
                        <div className="w-full h-[28rem] bg-muted rounded-lg flex items-center justify-center">
                            {isLoading ? (
                                <div className="text-center">
                                    <Spinner size="lg" />
                                    <p className="mt-4 text-muted-foreground">AI is working its magic...</p>
                                </div>
                            ) : generatedImage ? (
                                <img src={generatedImage} alt="Generated product" className="max-h-full max-w-full object-contain rounded-lg shadow-md" />
                            ) : (
                                <p className="text-muted-foreground text-center px-4">Your product photoshoot results will appear here.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProductPage;