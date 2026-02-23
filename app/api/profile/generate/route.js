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
        model: "phi3",
        prompt,
        stream: false,
        keep_alive: -1,
        options: {
          num_predict: 700,
          temperature: 0.3,
        },
      }),
    });

    const data = await response.json();

    // 🔥 safer parsing
    let text = data.response.trim();

    // extract JSON block if extra text exists
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("No JSON found in AI response");
    }

    const parsed = JSON.parse(match[0]);

    return Response.json(parsed);

  } catch (err) {
    console.error("Ollama error:", err);

    return Response.json(
      { error: "Failed to generate profile (Ollama)" },
      { status: 500 }
    );
  }
}