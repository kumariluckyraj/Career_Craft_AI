import { callOllama } from "@/lib/ollama";

import { GoogleGenAI } from "@google/genai";
import { pitchPrompt } from "@/lib/prompts";

export async function POST(req) {
  try {
    const { profile } = await req.json();

    if (!profile) {
      return Response.json({ error: "Profile is required" }, { status: 400 });
    }

    // 🔥 Switch based on environment
    const callAI =
  process.env.NODE_ENV === "production"
    ? async (prompt) => {
        console.log("🔥 Using Gemini API");  // ✅ log to confirm
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const result = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        console.log("Gemini output:", result.text);  // ✅ optional, to see the output
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