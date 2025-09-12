
import { GoogleGenAI, Modality, GenerateContentResponse, Part } from "@google/genai";
import { ImagePart } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using mock service.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "mock-key" });

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

const mockImageResponse = async (prompt: string): Promise<string> => {
    await new Promise(res => setTimeout(res, 1500));
    console.log(`Mock AI call for: ${prompt}`);
    const color1 = Math.floor(Math.random()*16777215).toString(16);
    const color2 = Math.floor(Math.random()*16777215).toString(16);
    const mockImageUrl = `https://via.placeholder.com/1024x1024/${color1}/${color2}?text=${encodeURIComponent(prompt.slice(0, 50))}`;
    
    // Convert URL to base64 to simulate API response format
    const response = await fetch(mockImageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

export const generateScene = async (prompt: string): Promise<string | null> => {
    if (!process.env.API_KEY) {
        return mockImageResponse(prompt);
    }
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A high-quality, professional background scene for a thumbnail, based on the following description: ${prompt}`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        }
        return null;
    } catch (error) {
        console.error("Error generating scene:", error);
        throw new Error("Failed to generate scene. The prompt may have been rejected. Please try a different description.");
    }
};

export const generateProductPhotoShoot = async (base64ImageData: string, mimeType: string, prompt: string, examples: ImagePart[]): Promise<string | null> => {
    if (!process.env.API_KEY) {
        return mockImageResponse(prompt);
    }
    
    try {
        let systemPrompt: string;
        const contentParts: Part[] = [];

        if (examples.length > 0) {
            systemPrompt = `You are a professional product photographer. Your task is to place the subject from the user's image into a new scene.
**Critically, you must emulate the exact style, lighting, mood, and composition of the example images provided.**
Use the examples as a strict style guide. Then, apply that style to the user's subject and the scene described in their prompt. Ensure the final image is photorealistic and of commercial quality.`;
            
            examples.forEach(ex => {
                contentParts.push({ inlineData: { data: ex.base64Data, mimeType: ex.mimeType } });
            });
        } else {
            // Improved Zero-shot
            systemPrompt = `You are a world-class commercial product photographer. Your task is to take the subject from the provided image and place it into a new, photorealistic scene based on the user's prompt.
**Key requirements:**
1.  **Photorealism:** The integration must be seamless. The lighting, shadows, reflections, and perspective on the subject MUST perfectly match the new environment described in the prompt.
2.  **Focus:** The product should be the clear hero of the image.
3.  **Quality:** The final output must be high-resolution, sharp, and suitable for a professional advertising campaign or e-commerce store.`;
        }
        
        contentParts.push({ inlineData: { data: base64ImageData, mimeType } });
        contentParts.push({ text: `${systemPrompt}\n\n**Scene Prompt:** ${prompt}` });

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: contentParts },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        return null;
    } catch (error) {
        console.error("Error generating product photoshoot:", error);
        throw new Error("Failed to generate product photoshoot. Please try again.");
    }
};

export const generateThumbnail = async (prompt: string, images: ImagePart[], presetName: string, examples: ImagePart[]): Promise<string | null> => {
    if (!process.env.API_KEY) {
        return mockImageResponse(`Thumbnail for: ${prompt}`);
    }

    try {
        let systemPrompt: string;
        const contentParts: Part[] = [];

        if (examples.length > 0) {
            // Few-shot prompt
            systemPrompt = `You are a professional graphic designer tasked with creating a thumbnail.
**Your primary goal is to replicate the artistic style, composition, and visual energy of the example thumbnails provided.**
Analyze the examples for their use of color, text effects, layout, and overall mood.
Then, apply this exact style to the new assets and prompt provided by the user to create a new, cohesive thumbnail for the ${presetName} platform.`

            examples.forEach(ex => {
                contentParts.push({ inlineData: { data: ex.base64Data, mimeType: ex.mimeType } });
            });
        } else {
            // Improved Zero-shot prompt
            systemPrompt = `You are a world-class graphic designer specializing in creating viral, eye-catching thumbnails for platforms like YouTube.
Your task is to generate a single, cohesive, and professional thumbnail image based on the provided assets and user prompt.

**Core Design Principles:**
1.  **High Contrast & Readability:** Use bold, contrasting colors. If text is requested, it must be large, easy to read, and pop from the background (e.g., using strokes, shadows, or contrasting color blocks).
2.  **Focal Point:** There must be a clear, primary subject. If a person is present in the assets, make them the focal point. Use dynamic poses and exaggerated emotions if appropriate for the topic.
3.  **Dynamic Composition:** Arrange elements using principles like the rule of thirds. Create a sense of depth and energy. Avoid flat, centered layouts unless specifically requested.
4.  **Emotional Impact:** The thumbnail should evoke curiosity, excitement, or another strong emotion relevant to the prompt.
5.  **Asset Integration:** You MUST use all the image assets provided. If an asset has a background, it should be expertly removed and the subject seamlessly blended into the new scene.

**Your Task:**
Adhere to these principles and the user's prompt to create a complete thumbnail for the ${presetName} platform.`;
        }
        
        images.forEach(image => {
            contentParts.push({
                inlineData: { data: image.base64Data, mimeType: image.mimeType }
            });
        });

        contentParts.push({ text: `${systemPrompt}\n\nUser Prompt: ${prompt}` });

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: contentParts },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        return null;

    } catch (error) {
        console.error("Error generating thumbnail:", error);
        throw new Error("Failed to generate thumbnail. Please try again.");
    }
};

export const reimagineImage = async (prompt: string, image?: ImagePart): Promise<string | null> => {
    if (!process.env.API_KEY) {
        return mockImageResponse(prompt);
    }

    try {
        // Case 1: Image-to-Image (Editing)
        if (image) {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: {
                    parts: [
                        { inlineData: { data: image.base64Data, mimeType: image.mimeType } },
                        { text: prompt },
                    ],
                },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return part.inlineData.data;
                }
            }
            return null;
        } 
        // Case 2: Text-to-Image
        else {
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                  numberOfImages: 1,
                  outputMimeType: 'image/jpeg',
                  aspectRatio: '1:1',
                },
            });
            if (response.generatedImages && response.generatedImages.length > 0) {
                return response.generatedImages[0].image.imageBytes;
            }
            return null;
        }
    } catch (error) {
        console.error("Error in reimagineImage:", error);
        throw new Error("Failed to generate image. The prompt may have been rejected or the service is unavailable.");
    }
};