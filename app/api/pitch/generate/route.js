
import User from "@/models/User";
import { callOllama } from "@/lib/ollama";
import { pitchPrompt } from "@/lib/prompts";

export async function POST(req) {
  try {
    const { userId, profile } = await req.json();

    await connectDB();

    const pitch = await callOllama(pitchPrompt(profile));

    await User.findByIdAndUpdate(userId, {
      lastPitchGeneratedAt: new Date(),
      showPitchReminder: false,
    });

    return Response.json({ pitch });
  } catch (error) {
    console.error("Pitch generation error:", error);
    return Response.json(
      { error: "Failed to generate pitch" },
      { status: 500 }
    );
  }
}
