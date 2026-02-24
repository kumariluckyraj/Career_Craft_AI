import { searchQueriesPrompt } from "@/lib/searchQueries";
import { callOllama } from "@/lib/ollama";
import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const { profile, personas } = await req.json();

   
    if (!profile || !personas) {
      return Response.json(
        { error: "Missing profile or personas" },
        { status: 400 }
      );
    }

    const prompt = searchQueriesPrompt(profile, personas);

 
    const callAI =
      process.env.NODE_ENV === "production"
        ? async (prompt) => {
            console.log("🔥 Using Gemini API for search queries");
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
      console.error("Invalid AI JSON:", response);

  
      parsed = {
        queries: [
          {
            persona: "Startup Recruiter",
            query: "startup recruiter frontend intern",
          },
        ],
      };
    }

    return Response.json(parsed);
  } catch (err) {
    console.error("Search queries API error:", err);

    return Response.json(
      { error: err?.message || "Failed to generate search queries" },
      { status: 500 }
    );
  }
}