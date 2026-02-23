import { searchQueriesPrompt } from "@/lib/searchQueries";
import { callOllama } from "@/lib/ollama";

export async function POST(req) {
  try {
    const { profile, personas } = await req.json();

    // ✅ Validation
    if (!profile || !personas) {
      return Response.json(
        { error: "Missing profile or personas" },
        { status: 400 }
      );
    }

    const prompt = searchQueriesPrompt(profile, personas);
    const response = await callOllama(prompt);

    // ✅ Check empty response
    if (!response) {
      throw new Error("Empty AI response");
    }

    let parsed;

    // ✅ Safe JSON parsing
    try {
      parsed = JSON.parse(response.trim());
    } catch (err) {
      console.error("Invalid AI JSON:", response);

      // fallback → prevents frontend crash
      parsed = {
        queries: [
          {
            persona: "Startup Recruiter",
            query: "frontend intern startup recruiter",
          },
        ],
      };
    }

    return Response.json(parsed);
  } catch (err) {
    console.error("Search Queries API error:", err);

    return Response.json(
      { error: err?.message || "Failed to generate search queries" },
      { status: 500 }
    );
  }
}