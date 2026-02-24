import { callOllama } from "@/lib/ollama";

import { GoogleGenAI } from "@google/genai";
import { pitchPrompt } from "@/lib/prompts";

export async function POST(req) {
  try {
    const { profile } = await req.json();

    if (!profile) {
      return Response.json({ error: "Profile is required" }, { status: 400 });
    }

   
    const callAI =
  process.env.NODE_ENV === "production"
    ? async (prompt) => {
        console.log("🔥 Using Gemini API");  
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const result = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        console.log("Gemini output:", result.text);  
        return result.text;
      }
    : callOllama;

    const response = await callAI(pitchPrompt(profile));

    return Response.json({ pitch: response });
  } catch (err) {
    console.error("AI pitch error:", err);
    return Response.json(
      { error: "Failed to generate pitch" },
      { status: 500 }
    );
  }
}