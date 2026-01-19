import connectDB from "@/db/connectDb";
import Profile from "@/lib/models/Profile";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const pending = searchParams.get("pending");

  // If admin wants pending profiles
  const filter =
    pending === "true"
      ? { status: "pending" }
      : { status: "approved" };

  const profiles = await Profile.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  return Response.json(profiles);
}
