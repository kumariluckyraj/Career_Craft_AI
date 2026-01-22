

import { callAI } from "@/lib";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response("Prompt required", { status: 400 });
    }

    const result = await callAI(prompt);

    return Response.json({ result });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
