import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { callOllama } from "@/lib/ollama";

export async function POST(req) {
  try {
    const { pdfBase64, jobDesc, actionPrompt } = await req.json();

    const buffer = Buffer.from(pdfBase64, "base64");
    const pdfData = await pdfParse(buffer);

    const resumeText = pdfData.text
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 4000);

    const jobText = (jobDesc || "").slice(0, 1500);

    const finalPrompt = `
${actionPrompt}

JOB DESCRIPTION:
${jobText}

RESUME:
${resumeText}

Rules:
- Bullet points only
- Max 250 words
- No filler text
`;

    const aiResult = await callOllama(finalPrompt);

    return NextResponse.json({ aiResult });
  } catch (err) {
    console.error("Upload resume error:", err);
    return NextResponse.json(
      { error: "AI processing failed" },
      { status: 500 }
    );
  }
}
