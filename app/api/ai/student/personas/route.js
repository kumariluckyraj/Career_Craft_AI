import { personasPrompt } from "@/lib/personas";
import { callOllama } from "@/lib/ollama";

export async function POST(req) {
  const { profile } = await req.json();
  const prompt = personasPrompt(profile);
  const response = await callOllama(prompt);

  return Response.json(JSON.parse(response));
}
