import { NextResponse } from "next/server";
import { callOllama } from "@/lib/ollama";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const prompt = formData.get("prompt");
    const jobDescription = formData.get("jobDescription");
    const resume = formData.get("resume"); // PDF file

    if (!prompt || !resume) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    const fullPrompt = `
${prompt}

JOB DESCRIPTION:
${jobDescription}

Analyze the resume content based on ATS standards.
Return clear structured text.
`;

    const response = await callOllama(fullPrompt);

    return NextResponse.json({ response });
  } catch (err) {
    console.error("Ollama API error:", err);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
