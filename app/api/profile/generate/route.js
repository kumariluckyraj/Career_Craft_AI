import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const { techStack } = await req.json();

    if (!techStack || techStack.length === 0) {
      return Response.json({ headline: "", bio: "" });
    }

    const prompt = `
Generate:
1. A professional LinkedIn headline (max 120 characters)
2. A concise LinkedIn bio (7-8 lines)

Tech stack:
${techStack.join(", ")}

Return ONLY valid JSON:
{
  "headline": "",
  "bio": ""
}
`;

    
    const callAI =
      process.env.NODE_ENV === "production"
        ? async (prompt) => {
            console.log("🔥 Using Gemini API");

            if (!process.env.GEMINI_API_KEY) {
              throw new Error("GEMINI_API_KEY not found in production env!");
            }

            const ai = new GoogleGenAI({
              apiKey: process.env.GEMINI_API_KEY,
            });

            const result = await ai.models.generateContent({
              model: "gemini-2.5-flash", // or another Gemini model
              contents: prompt,
            });

            console.log("Gemini output:", result.text);

            return result.text;
          }
        : async (prompt) => {
            // fallback to your local Ollama API
            const res = await fetch("http://localhost:11434/api/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                model: "phi3",
                prompt,
                stream: false,
                keep_alive: -1,
                options: { num_predict: 700, temperature: 0.3 },
              }),
            });

            const data = await res.json();
            return data.response.trim();
          };

    let text = await callAI(prompt);

    // extract JSON block if extra text exists
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("No JSON found in AI response");
    }

    const parsed = JSON.parse(match[0]);

    return Response.json(parsed);

  } catch (err) {
    console.error("AI profile generation error:", err);

    return Response.json(
      { error: "Failed to generate profile" },
      { status: 500 }
    );
  }
}