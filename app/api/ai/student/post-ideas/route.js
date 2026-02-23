import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/db/connectDb";
import User from "@/models/User";
import { callOllama } from "@/lib/ollama";
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

    // 🔥 Call AI (plain text now)
    let responseText = "";

    try {
      responseText = await callOllama(postIdeasPrompt(profile));
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

    // 🔥 Return plain text
    return Response.json({ text: responseText });
  } catch (error) {
    console.error("Post ideas generation error:", error);
    return Response.json(
      { error: "Failed to generate post ideas" },
      { status: 500 }
    );
  }
}