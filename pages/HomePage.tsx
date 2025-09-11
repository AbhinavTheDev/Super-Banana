import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import { LayoutTemplateIcon, ImagePlusIcon, SigmaIcon, BananaIcon } from '../components/icons/LucideIcons';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; to: string; }> = ({ icon, title, description, to }) => (
    <motion.div whileHover={{ y: -5 }} className="w-full">
        <Link to={to}>
            <Card className="h-full text-center transition-shadow duration-300 hover:shadow-lg">
                <CardHeader>
                    <div className="mx-auto bg-secondary rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        <span className="text-primary">{icon}</span>
                    </div>
                    <h3 className="text-xl font-bold font-serif">{title}</h3>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{description}</p>
                </CardContent>
            </Card>
        </Link>
    </motion.div>
);

const HomePage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
            >
                <div className="flex gap-4 items-center justify-center">
                    <BananaIcon className={`w-12 h-12`} />
                    <h1 className="text-5xl md:text-6xl font-extrabold font-serif mb-4 text-primary">
                        Super Banana
                    </h1>
                </div>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                    Your AI-powered toolkit for creating stunning thumbnails and professional product photos in seconds.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link to="/editor">
                        <Button size="lg" variant="primary">Get Started</Button>
                    </Link>
                </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard
                    icon={<LayoutTemplateIcon className="w-8 h-8" />}
                    title="Thumbnail Builder"
                    description="Craft click-worthy thumbnails with our intuitive drag-and-drop editor and AI-powered design suggestions."
                    to="/editor"
                />
                <FeatureCard
                    icon={<ImagePlusIcon className="w-8 h-8" />}
                    title="Product Photoshoot"
                    description="Transform simple product shots into lifestyle scenes, catalog-ready images, and more with a single prompt."
                    to="/product"
                />
                <FeatureCard
                    icon={<SigmaIcon className="w-8 h-8" />}
                    title="Math Visualizer"
                    description="Turn mathematical equations and concepts into stunning, abstract art with the power of AI."
                    to="/visualizer"
                />
            </div>
        </div>
    );
};

export default HomePage;
