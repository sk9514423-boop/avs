
import { GoogleGenAI } from "@google/genai";

export async function* streamChatResponse(
  prompt: string,
  imageFiles: File[],
  history: { role: string; parts: { text: string }[] }[]
) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const formattedHistory = history.map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: msg.parts
  }));

  const contents = [...formattedHistory, { role: 'user', parts: [{ text: prompt }] }];

  try {
    const responseStream = await ai.models.generateContentStream({
      model,
      contents,
      config: {
          systemInstruction: "You are VAS NEXUS, an elite AI Logistics Specialist. Help sellers optimize dispatch and manage wallets.",
          temperature: 0.8,
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) yield chunk.text;
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    yield "⚠️ System Link Interrupted. Please retry.";
  }
}

export async function generateImage(prompt: string): Promise<string[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash-image';

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: prompt }] }
    });

    const images: string[] = [];
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
           images.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
        }
      }
    }
    return images;
  } catch (error) {
    console.error("Visual Engine Error:", error);
    throw error;
  }
}
