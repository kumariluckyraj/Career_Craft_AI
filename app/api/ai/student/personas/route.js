import { personasPrompt } from "@/lib/personas";
import { callOllama } from "@/lib/ollama";

export async function POST(req) {
  try {
    const { profile } = await req.json();

    if (!profile) {
      return Response.json(
        { error: "Missing profile" },
        { status: 400 }
      );
    }

    const prompt = personasPrompt(profile);
    const response = await callOllama(prompt);

    if (!response) {
      throw new Error("Empty AI response");
    }

    let parsed;

    try {
      parsed = JSON.parse(response.trim());
    } catch (err) {
      console.error("Invalid JSON from AI:", response);

      // fallback → prevents app crash
      parsed = {
        personas: [
          {
            title: "Software Engineer",
            companyType: "Startup",
            why: "Can refer students for internships",
          },
        ],
      };
    }

    return Response.json(parsed);
  } catch (err) {
    console.error("Personas API error:", err);

    return Response.json(
      { error: err?.message || "Failed to generate personas" },
      { status: 500 }
    );
  }
}