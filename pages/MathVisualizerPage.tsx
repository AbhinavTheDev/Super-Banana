
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { SigmaIcon, Wand2Icon, DownloadIcon } from '../components/icons/LucideIcons';
import * as geminiService from '../services/geminiService';
import { useHistory } from '../hooks/useHistory';

const MathVisualizerPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addMathVisualization, mathVisualizerHistory } = useHistory();
    const [prompt, setPrompt] = useState<string>('The beauty of the Mandelbrot set');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (id) {
            const item = mathVisualizerHistory.find(i => i.id === id);
            if (item) {
                setGeneratedImage(item.imageData);
                setPrompt(item.prompt || '');
            } else {
                navigate('/visualizer');
            }
        } else {
            setGeneratedImage(null);
            setPrompt('The beauty of the Mandelbrot set');
        }
    }, [id, mathVisualizerHistory, navigate]);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            alert('Please enter a mathematical concept or equation.');
            return;
        }
        setIsLoading(true);
        setGeneratedImage(null);
        try {
            const result = await geminiService.generateMathVisualization(prompt);
            if (result) {
                const dataUrl = `data:image/jpeg;base64,${result}`;
                setGeneratedImage(dataUrl);
                addMathVisualization(dataUrl, prompt);
            }
        } catch (error) {
            console.error(error);
            alert((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = useCallback(() => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.download = `math-visualization-${Date.now()}.jpeg`;
        link.href = generatedImage;
        link.click();
    }, [generatedImage]);

    return (
        <div className="container mx-auto max-w-4xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
                <h1 className="text-4xl font-bold font-serif">Math Visualizer</h1>
                <p className="text-muted-foreground mt-2">Turn equations and concepts into beautiful, abstract art.</p>
            </motion.div>

            <div className="flex flex-col gap-8">
                {/* Top: Results */}
                <Card>
                    <CardHeader><h2 className="text-lg font-bold">AI Generated Art</h2></CardHeader>
                    <CardContent className="flex flex-col items-center justify-center">
                        <div className="w-full h-auto max-h-[60vh] bg-muted rounded-lg flex items-center justify-center aspect-square border-2 border-dashed border-border">
                            {isLoading ? (
                                <div className="text-center">
                                    <Spinner size="lg" />
                                    <p className="mt-4 text-muted-foreground">AI is interpreting the math...</p>
                                </div>
                            ) : generatedImage ? (
                                <img src={generatedImage} alt="Generated math visualization" className="max-h-full max-w-full object-contain rounded-lg" />
                            ) : (
                                <div className="text-center p-4">
                                    <SigmaIcon className="w-16 h-16 text-muted-foreground mx-auto" />
                                    <p className="text-muted-foreground text-center px-4 mt-4">Your visualization will appear here.</p>
                                </div>
                            )}
                        </div>
                         {generatedImage && !isLoading && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 w-full max-w-xs">
                                <Button onClick={handleExport} className="w-full" size="lg" variant="secondary">
                                    <DownloadIcon className="w-5 h-5 mr-2" /> Export Image
                                </Button>
                            </motion.div>
                         )}
                    </CardContent>
                </Card>

                {/* Bottom: Controls */}
                <Card>
                    <CardHeader><h2 className="text-lg font-bold">Describe a Concept</h2></CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <label htmlFor="prompt" className="font-semibold mb-2 block text-muted-foreground">Mathematical Equation or Concept:</label>
                             <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)}
                                placeholder="e.g., 'Fibonacci sequence in nature'"
                                className="w-full p-2 rounded-md border border-input bg-background h-28 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                             />
                        </div>
                        
                        <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full" size="lg">
                            {isLoading ? <Spinner size="sm" /> : <Wand2Icon className="w-5 h-5 mr-2" />}
                            {isLoading ? 'Generating...' : 'Visualize'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MathVisualizerPage;
