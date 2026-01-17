import { searchQueriesPrompt } from "@/lib/searchQueries";
import { callOllama } from "@/lib/ollama";

export async function POST(req) {
  const { profile, personas } = await req.json();
  const prompt = searchQueriesPrompt(profile, personas);
  const response = await callOllama(prompt);

  return Response.json(JSON.parse(response));
}
