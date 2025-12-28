import { GoogleGenAI, Type } from "@google/genai";
import { Vehicle, DamageAnalysisResult } from "../types";

// Initialize Gemini Client
const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (window as any).process?.env?.GEMINI_API_KEY || 'MockKey';
const ai = new GoogleGenAI({ apiKey });

const checkApiKey = () => {
  if (apiKey === 'MockKey' || apiKey === 'YOUR_API_KEY_HERE') {
    throw new Error("Missing Gemini API Key. Please set GEMINI_API_KEY in .env file.");
  }
};

export const analyzeVehicleImage = async (base64Image: string): Promise<DamageAnalysisResult> => {
  try {
    checkApiKey();
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash-001",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an expert automotive parts specialist and accident assessor. 
              Analyze this image of a vehicle. 
              1. Identify if there is visible damage to the vehicle.
              2. List the specific parts that appear damaged, missing, or need replacement based on the image.
              3. Provide a search query optimized for finding a replacement part in an auto parts marketplace.
              
              Be specific. For example, distinguish between "Front Bumper", "Headlight", "Fender", "Grille".`
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: cleanBase64
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            damageDetected: { type: Type.BOOLEAN },
            overallAssessment: { type: Type.STRING },
            identifiedParts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  partName: { type: Type.STRING },
                  damageDescription: { type: Type.STRING },
                  confidenceLevel: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                  searchQuery: { type: Type.STRING, description: "Short keyword for searching the store, e.g. 'Toyota Axio Bumper'" }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as DamageAnalysisResult;
    }

    throw new Error("No response text from Gemini");

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};

export const suggestCompatibleVehicles = async (
  productTitle: string,
  productCategory: string,
  availableVehicles: Vehicle[]
): Promise<string[]> => {
  try {
    const vehicleContext = availableVehicles.map(v => ({
      id: v.id,
      description: `${v.make} ${v.model} (${v.yearStart}-${v.yearEnd || 'Present'})`
    }));

    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: `
        You are an automotive expert.
        I have a product titled "${productTitle}" in the category "${productCategory}".
        
        Here is a list of vehicles in my database:
        ${JSON.stringify(vehicleContext)}
        
        Identify which of these vehicles are compatible with this product.
        Return ONLY a JSON object with a property "compatibleIds" containing an array of the matching vehicle IDs.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            compatibleIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data.compatibleIds || [];
    }

    return [];
  } catch (error) {
    console.error("Gemini Compatibility Suggestion Failed:", error);
    return [];
  }
};
