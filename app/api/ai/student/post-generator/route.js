import { callOllama } from "@/lib/ollama";
import { postGeneratePrompt } from "@/lib/prompts";

export async function POST(req) {
  const { profile, topic } = await req.json();
  const response = await callOllama(
    postGeneratePrompt(profile, topic)
  );

  return Response.json({ post: response });
}
