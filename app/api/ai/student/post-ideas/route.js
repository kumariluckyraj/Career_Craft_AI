import { callOllama } from "@/lib/ollama";
import { postIdeasPrompt } from "@/lib/prompts";

export async function POST(req) {
  const profile = await req.json();
  const response = await callOllama(postIdeasPrompt(profile));
  return Response.json(JSON.parse(response));
}
