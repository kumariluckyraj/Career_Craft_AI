import { callOllama } from "@/lib/ollama";
import { callHuggingFace } from "@/lib/hf";
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
        ? callHuggingFace
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