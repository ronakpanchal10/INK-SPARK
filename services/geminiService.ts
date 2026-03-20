import { GoogleGenAI } from "@google/genai";

// Initialize the client
// NOTE: In a real production app, you should proxy these requests through a backend
// to hide the API key. For this internship project/demo, environment variable is acceptable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

export const generateDraft = async (title: string, context?: string): Promise<string> => {
  try {
    const prompt = `You are a professional blog writer. Write a comprehensive, engaging blog post styled in Markdown based on the title: "${title}". 
    ${context ? `Additional context: ${context}` : ''}
    
    Structure the post with:
    - An engaging introduction
    - Clear H2 headings
    - Bullet points where appropriate
    - A conclusion
    
    Do not include the title at the top, just start with the introduction.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Could not generate draft. Please check your API key.");
  }
};

export const summarizePost = async (content: string): Promise<string> => {
  try {
    const prompt = `Summarize the following blog post in 2-3 concise sentences. Capture the main essence.
    
    Blog Post Content:
    ${content.substring(0, 5000)}...`; // Limit context window if content is huge

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Failed to summarize.";
  } catch (error) {
    console.error("AI Summarization Error:", error);
    throw new Error("Could not summarize post.");
  }
};

export const improveWriting = async (text: string): Promise<string> => {
  try {
    const prompt = `Act as an expert editor. Improve the grammar, flow, and clarity of the following text while maintaining the original tone. Return ONLY the improved text in Markdown format.
    
    Text:
    ${text}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || text;
  } catch (error) {
    console.error("AI Improvement Error:", error);
    return text; // Return original on failure
  }
};

export const generateIdeas = async (topic: string): Promise<string[]> => {
  try {
    const prompt = `Give me 5 creative and catchy blog post titles about "${topic}". Return them as a simple JSON array of strings. Example: ["Title 1", "Title 2"]`;
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const jsonStr = response.text;
    if (!jsonStr) return [];
    
    return JSON.parse(jsonStr) as string[];
  } catch (error) {
    console.error("AI Idea Gen Error:", error);
    return [];
  }
};
