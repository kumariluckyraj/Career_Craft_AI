import { callOllama } from "@/lib/ollama";
import { GoogleGenAI } from "@google/genai";
import { resumeEnhancePrompt } from "@/lib/resumePrompt";

function extractJSON(text) {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) return null;
  return cleaned.slice(start, end + 1);
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body) {
      return Response.json({ error: "Request body is required" }, { status: 400 });
    }

    const prompt = resumeEnhancePrompt(body);

    // 🔥 Switch AI provider based on environment
    const callAI =
      process.env.NODE_ENV === "production"
        ? async (prompt) => {
            console.log("🔥 Using Gemini API"); // ✅ log to confirm
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const result = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt,
            });
            console.log("Gemini output:", result.text); // ✅ optional debug
            return result.text;
          }
        : callOllama;

    const aiText = await callAI(prompt);

    const jsonText = extractJSON(aiText);
    if (!jsonText) {
      return Response.json(
        { success: false, error: "AI output not in JSON", raw: aiText },
        { status: 500 }
      );
    }

    const enhancedResume = JSON.parse(jsonText);

    return Response.json({
      success: true,
      enhanced: enhancedResume,
    });
  } catch (err) {
    console.error("AI resume enhancement error:", err);
    return Response.json(
      { success: false, error: "Failed to enhance resume" },
      { status: 500 }
    );
  }
}