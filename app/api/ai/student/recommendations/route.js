import { recommendationsPrompt } from "@/lib/recommendations";
import { callOllama } from "@/lib/ollama";

export async function POST(req) {
  const { profile, personas } = await req.json();
  const prompt = recommendationsPrompt(profile, personas);
  const response = await callOllama(prompt);

  return Response.json(JSON.parse(response));
}
