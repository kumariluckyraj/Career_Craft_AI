import { NextResponse } from "next/server";
import { callOllama } from "@/lib/ollama";

export async function POST(req) {
  try {
    const { prompt, resumeText, jobDescription } = await req.json();

    if (!prompt || !resumeText) {
      return NextResponse.json(
        { error: "Missing prompt or resume text" },
        { status: 400 }
      );
    }

    const fullPrompt = `
${prompt}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription || "Not provided"}

Follow the format strictly.
`;

    const response = await callOllama(fullPrompt);

    return NextResponse.json({ response });
  } catch (err) {
    console.error("Resume AI error:", err);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
