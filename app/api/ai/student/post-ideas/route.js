import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // your NextAuth config
import  connectDB  from "@/db/connectDb";
import User from "@/models/User";
import { callOllama } from "@/lib/ollama";
import { postIdeasPrompt } from "@/lib/prompts";

export async function POST(req) {
  try {
    // Get user from session
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

    // Call AI
    const responseText = await callOllama(postIdeasPrompt(profile));

    let ideas;
    try {
      ideas = JSON.parse(responseText); // assume AI returns JSON
    } catch (err) {
      console.error("Failed to parse AI output:", responseText, err);
      return Response.json({ error: "Failed to parse AI output" }, { status: 500 });
    }

    // ✅ Update user timestamp for reminder
    await User.findByIdAndUpdate(userId, {
      lastPostIdeaGeneratedAt: new Date(),
      showPostIdeaReminder: false,
    });

    return Response.json(ideas);
  } catch (error) {
    console.error("Post ideas generation error:", error);
    return Response.json({ error: "Failed to generate post ideas" }, { status: 500 });
  }
}
