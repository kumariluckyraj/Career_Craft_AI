import { callOllama } from "@/lib/ollama";
import { analyzeStudentPrompt } from "@/lib/prompts";

export async function POST(req) {
  const profile = await req.json();
  const prompt = analyzeStudentPrompt(profile);

  const response = await callOllama(prompt);
  return Response.json(JSON.parse(response));
}
