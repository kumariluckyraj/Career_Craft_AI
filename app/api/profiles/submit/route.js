import connectDB from "@/db/connectDb";
import Profile from "@/lib/models/Profile";

export async function POST(req) {
  try {
    await connectDB();

    const { linkedinUrl, description } = await req.json();

    if (!linkedinUrl)
      return new Response(JSON.stringify({ error: "linkedinUrl is required" }), {
        status: 400,
      });

    const nameFromUrl = linkedinUrl
      ?.split("/in/")[1]
      ?.replace(/-/g, " ")
      ?.replace(/\d+/g, "")
      ?.trim();

    const profile = await Profile.create({
      profileUrl: linkedinUrl,
      name: nameFromUrl || "LinkedIn Profile",
      description,
      status: "pending",
    });

    return Response.json({
      message: "Profile submitted successfully",
      profile,
    });
  } catch (err) {
    console.error("Submit API error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
