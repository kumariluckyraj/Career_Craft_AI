import { callOllama } from "@/lib/ollama";
import { pitchPrompt } from "@/lib/prompts";

export async function POST(req) {
  const profile = await req.json();
  const response = await callOllama(pitchPrompt(profile));
  return Response.json({ pitch: response });
}
