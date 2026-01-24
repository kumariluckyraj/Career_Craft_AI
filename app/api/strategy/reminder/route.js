import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/db/connectDb";
import User from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ showReminder: true });
  }

  await connectDB();
  const user = await User.findById(session.user.id);

  if (!user) {
    return Response.json({ showReminder: true });
  }

  let showReminder = true;

  if (user.lastPostIdeaGeneratedAt) {
    const diff =
      Date.now() - new Date(user.lastPostIdeaGeneratedAt).getTime();

    // 1 week in milliseconds
const oneWeek = 7 * 24 * 60 * 60 * 1000;

showReminder = diff > oneWeek;

  }

  return Response.json({ showReminder });
}
