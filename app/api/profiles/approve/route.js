import connectDB from "@/db/connectDb";
import Profile from "@/lib/models/Profile";

export async function POST(req) {
  const { id } = await req.json();
  await connectDB();

  await Profile.findByIdAndUpdate(id, { status: "approved" });

  return Response.json({ success: true });
}
