import { callAI } from "@/lib/ai";
import { pitchPrompt } from "@/lib/prompts";

export async function POST(req) {
  try {
    const profile = await req.json();
    const response = await callAI(pitchPrompt(profile));
    return Response.json({ pitch: response });
  } catch (err) {
    console.error("AI pitch error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
