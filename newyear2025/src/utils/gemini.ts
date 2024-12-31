import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateWithGemini(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.9,
      maxOutputTokens: 1024,
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in generateWithGemini:', error);
    throw error;
  }
}

