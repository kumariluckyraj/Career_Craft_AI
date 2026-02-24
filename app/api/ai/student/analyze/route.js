import { callOllama } from "@/lib/ollama";
import { GoogleGenAI } from "@google/genai";
import { analyzeStudentPrompt } from "@/lib/prompts";

export async function POST(req) {
  try {
    const { profile } = await req.json();
    if (!profile) {
      return Response.json({ error: "Profile is required" }, { status: 400 });
    }

    const prompt = analyzeStudentPrompt(profile);

    // 🔥 Switch based on environment
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

    const response = await callAI(prompt);

    // Clean any markdown/code formatting
    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return new Response(cleaned, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    console.error("Failed to generate analysis:", err);
    return Response.json(
      { error: "Failed to generate analysis" },
      { status: 500 }
    );
  }
}