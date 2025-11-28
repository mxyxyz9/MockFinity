import { GoogleGenAI } from "@google/genai";

// Initialize the client
// API Key is strictly from process.env.API_KEY as per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * edits or generates a new image based on a source image and a text prompt.
 * Uses gemini-2.5-flash-image (Nano Banana).
 */
export const generateMarketingImage = async (
  imageBase64: string,
  prompt: string,
  aspectRatio: string = '1:1'
): Promise<string> => {
  try {
    // Clean base64 string if it contains metadata header
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG or JPEG, generic handling usually works with correct mime type in real scenarios, keeping it simple here
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    // Parse response for image data
    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          }
        }
      }
    }

    throw new Error("No image data returned from Gemini.");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};