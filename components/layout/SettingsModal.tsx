import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../../hooks/useSettings';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { ImagePlusIcon } from '../icons/LucideIcons';
import { ImageExample } from '../../types';

const ExampleImageDisplay: React.FC<{ example: ImageExample, onRemove: (id: string) => void }> = ({ example, onRemove }) => (
  <div className="relative group aspect-square">
    <img
      src={`data:${example.mimeType};base64,${example.base64Data}`}
      alt="Example"
      className="w-full h-full object-cover rounded-md border border-border"
    />
    <button
      onClick={() => onRemove(example.id)}
      className="absolute top-1 right-1 bg-destructive/80 text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
      aria-label="Remove example"
    >
      &times;
    </button>
  </div>
);

const ExampleSection: React.FC<{
  title: string;
  description: string;
  examples: ImageExample[];
  onAdd: (file: File) => Promise<void>;
  onRemove: (id: string) => void;
  idPrefix: string;
}> = ({ title, description, examples, onAdd, onRemove, idPrefix }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAdd(file);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold font-serif mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
        {examples.map(ex => <ExampleImageDisplay key={ex.id} example={ex} onRemove={onRemove} />)}
      </div>
      <Button variant="secondary" className="w-full" onClick={() => fileInputRef.current?.click()}>
        <ImagePlusIcon className="w-5 h-5 mr-2" />
        Add Example
      </Button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        id={`${idPrefix}-file-upload`}
      />
    </div>
  );
};


const SettingsModal: React.FC = () => {
  const { 
    isSettingsOpen, 
    toggleSettings,
    thumbnailExamples,
    productPhotoShootExamples,
    addThumbnailExample,
    addProductPhotoShootExample,
    removeThumbnailExample,
    removeProductPhotoShootExample,
  } = useSettings();

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSettings}
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl"
          >
            <Card className="max-h-[80vh] flex flex-col">
              <CardHeader>
                <h2 className="text-2xl font-bold font-serif">AI Settings</h2>
                <p className="text-muted-foreground">Provide examples to guide the AI's style.</p>
              </CardHeader>
              <CardContent className="space-y-8 overflow-y-auto">
                <ExampleSection
                  title="Thumbnail Style Examples"
                  description="Upload 1-3 examples of thumbnails you like. The AI will try to match their style, composition, and color grading."
                  examples={thumbnailExamples}
                  onAdd={addThumbnailExample}
                  onRemove={removeThumbnailExample}
                  idPrefix="thumbnail"
                />
                <ExampleSection
                  title="Product Photoshoot Style Examples"
                  description="Upload 1-3 examples of product photoshoots with the aesthetic you want. The AI will use these as a reference for lighting and mood."
                  examples={productPhotoShootExamples}
                  onAdd={addProductPhotoShootExample}
                  onRemove={removeProductPhotoShootExample}
                  idPrefix="product"
                />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;