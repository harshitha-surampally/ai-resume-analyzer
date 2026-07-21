import { GoogleGenAI } from "@google/genai";
import { AI_MODEL } from "./config";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in the environment.");
}

const ai = new GoogleGenAI({ apiKey });

export async function generateAIResponse(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: AI_MODEL,
    contents: prompt,
  });

  return response.text ?? "";
}