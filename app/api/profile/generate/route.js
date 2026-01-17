export async function POST(req) {
  try {
    const { techStack } = await req.json();

    if (!techStack || techStack.length === 0) {
      return Response.json({ headline: "", bio: "" });
    }

    const prompt = `
Generate:
1. A professional LinkedIn headline (max 120 characters)
2. A concise LinkedIn bio (7-8 lines)

Tech stack:
${techStack.join(", ")}

Return ONLY valid JSON:
{
  "headline": "",
  "bio": ""
}
`;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt,
        stream: false
      })
    });

    const data = await response.json();

    // Ollama returns plain text → parse JSON from it
    const text = data.response.trim();
    const parsed = JSON.parse(text);

    return Response.json(parsed);
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Failed to generate profile (Ollama)" },
      { status: 500 }
    );
  }
}
