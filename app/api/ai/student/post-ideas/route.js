import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/db/connectDb";
import User from "@/models/User";
import { callOllama } from "@/lib/ollama";
import { GoogleGenAI } from "@google/genai";
import { postIdeasPrompt } from "@/lib/prompts";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;
    const profile = await req.json();

    if (!profile) {
      return Response.json({ error: "Missing profile" }, { status: 400 });
    }

    await connectDB();

    // 🔥 Switch AI based on environment
    const callAI =
      process.env.NODE_ENV === "production"
        ? async (prompt) => {
            console.log("🔥 Using Gemini API for post ideas");
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const result = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt,
            });
            console.log("Gemini output:", result.text);
            return result.text;
          }
        : callOllama;

    // 🔥 Call AI (plain text)
    let responseText = "";
    try {
      responseText = await callAI(postIdeasPrompt(profile));
    } catch (aiErr) {
      console.error("AI call failed:", aiErr);
    }

    // fallback if AI fails
    if (!responseText) {
      responseText =
        "Could not generate post ideas right now. Please try again later.";
    }

    // ✅ Update user timestamp
    try {
      await User.findByIdAndUpdate(userId, {
        lastPostIdeaGeneratedAt: new Date(),
        showPostIdeaReminder: false,
      });
    } catch (dbErr) {
      console.error("DB update failed:", dbErr);
    }

    // 🔥 Return plain text in JSON
    return Response.json({ text: responseText });
  } catch (error) {
    console.error("Post ideas generation error:", error);
    return Response.json(
      { error: "Failed to generate post ideas" },
      { status: 500 }
    );
  }
}