import { GoogleGenAI, Modality, GenerateContentResponse, Part } from "@google/genai";

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using mock service.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "mock-key" });

export interface ImagePart {
    base64Data: string;
    mimeType: string;
}

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
    const mockImageUrl = `https://via.placeholder.com/1280x720/${color1}/${color2}?text=${encodeURIComponent(prompt.slice(0, 50))}`;
    
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

export const removeBackground = async (base64ImageData: string, mimeType: string): Promise<string | null> => {
    if (!process.env.API_KEY) {
        return mockImageResponse("Background Removed");
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    { inlineData: { data: base64ImageData, mimeType } },
                    { text: 'Remove the background of this image, leaving only the main subject with a transparent background.' },
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

    } catch (error) {
        console.error("Error removing background:", error);
        throw new Error("Failed to remove background. Please try again.");
    }
};

export const generateProductPhoto = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string | null> => {
    if (!process.env.API_KEY) {
        return mockImageResponse(prompt);
    }
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    { inlineData: { data: base64ImageData, mimeType } },
                    { text: `Place the subject of this image in the following scene: ${prompt}. Ensure the lighting and shadows on the subject match the new background realistically.` },
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
    } catch (error) {
        console.error("Error generating product photo:", error);
        throw new Error("Failed to generate product photo. Please try again.");
    }
};

export const generateThumbnail = async (prompt: string, images: ImagePart[], presetName: string): Promise<string | null> => {
    if (!process.env.API_KEY) {
        return mockImageResponse(`Thumbnail for: ${prompt}`);
    }

    try {
        const systemPrompt = `You are a professional graphic designer specializing in creating viral, eye-catching YouTube thumbnails.
Your task is to generate a single, cohesive, and professional thumbnail image based on the provided assets and user prompt.

**Instructions:**
1.  **Analyze and Utilize All Assets:** You MUST use all the image assets provided. Integrate them logically into a final, polished thumbnail.
2.  **Seamless Background Integration:** If an asset has a distinct background, you MUST remove the background and seamlessly blend the main subject into the new thumbnail's scene.
3.  **Handle Text Assets:** If an asset is an image containing text, DO NOT regenerate or replace the text. Instead, use the text as it is. You may apply minimal stylistic edits (like adding a stroke or shadow) to improve its clarity and integration, but the wording must remain identical.
4.  **Feature People Prominently:** If one of the assets features a person, make them a primary focal point. Position and scale them in a dynamic, engaging way, similar to how top YouTubers appear in their thumbnails.
5.  **Follow the Prompt:** Adhere closely to the user's prompt for the overall theme, mood, style, and any specific text or elements to include.
6.  **Final Output:** The final result should be a single, complete thumbnail image ready for upload, designed for the ${presetName} platform.`;
        
        const contentParts: Part[] = [
            { text: `${systemPrompt}\n\nUser Prompt: ${prompt}` }
        ];

        images.forEach(image => {
            contentParts.push({
                inlineData: { data: image.base64Data, mimeType: image.mimeType }
            });
        });

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: contentParts,
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

    } catch (error) {
        console.error("Error generating thumbnail:", error);
        throw new Error("Failed to generate thumbnail. Please try again.");
    }
};
