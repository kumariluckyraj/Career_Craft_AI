import { callOllama } from "@/lib/ollama";
import { resumeEnhancePrompt } from "@/lib/resumePrompt";

function extractJSON(text) {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) return null;
  return cleaned.slice(start, end + 1);
}

export async function POST(req) {
  try {
    const body = await req.json();

    const prompt = resumeEnhancePrompt(body);
    const aiText = await callOllama(prompt);

    const jsonText = extractJSON(aiText);
    if (!jsonText) {
      return Response.json(
        { success: false, error: "AI output not in JSON", raw: aiText },
        { status: 500 }
      );
    }

    const enhancedResume = JSON.parse(jsonText);

    return Response.json({
      success: true,
      enhanced: enhancedResume,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
