import { callOllama } from "@/lib/ollama";
import { analyzeStudentPrompt } from "@/lib/prompts";

export async function POST(req) {
  try {
    const { profile } = await req.json();
    if (!profile) {
      return Response.json({ error: "Profile is required" }, { status: 400 });
    }

    const prompt = analyzeStudentPrompt(profile);

    // Call Ollama
    const response = await callOllama(prompt);

    // Instead of parsing JSON, return plain text directly
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