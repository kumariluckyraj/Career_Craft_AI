import { callOllama as callAI } from "@/lib/ollama";
import { pitchPrompt } from "@/lib/prompts";

export async function POST(req) {
  try {
    const { profile } = await req.json(); // destructure profile from request
    if (!profile) {
      return Response.json({ error: "Profile is required" }, { status: 400 });
    }

    // Generate AI pitch
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