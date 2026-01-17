import { callOllama } from "@/lib/ollama";
import { networkingPrompt } from "@/lib/prompts";

export async function POST(req) {
  const profile = await req.json();
  const response = await callOllama(networkingPrompt(profile));
  return Response.json(JSON.parse(response));
}
