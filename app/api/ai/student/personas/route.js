import { personasPrompt } from "@/lib/personas";
import { callOllama } from "@/lib/ollama";
import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const { profile } = await req.json();

    if (!profile) {
      return Response.json({ error: "Missing profile" }, { status: 400 });
    }

    const prompt = personasPrompt(profile);

    // 🔥 Switch AI based on environment
    const callAI =
      process.env.NODE_ENV === "production"
        ? async (prompt) => {
            console.log("🔥 Using Gemini API for personas");
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const result = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt,
            });
            console.log("Gemini output:", result.text);
            return result.text;
          }
        : callOllama;

    const response = await callAI(prompt);

    if (!response) {
      throw new Error("Empty AI response");
    }

    let parsed;

    try {
      parsed = JSON.parse(response.trim());
    } catch (err) {
      console.error("Invalid JSON from AI:", response);

      // fallback → prevents app crash
      parsed = {
        personas: [
          {
            title: "Software Engineer",
            companyType: "Startup",
            why: "Can refer students for internships",
          },
        ],
      };
    }

    return Response.json(parsed);
  } catch (err) {
    console.error("Personas API error:", err);
    return Response.json(
      { error: err?.message || "Failed to generate personas" },
      { status: 500 }
    );
  }
}