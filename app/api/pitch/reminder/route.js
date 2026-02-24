
import User from "@/models/User";
import { isSameMinute } from "@/lib/date";
//
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ showReminder: true });
  }

  await connectDB();

  const user = await User.findById(userId);

  let showReminder = true;

  if (user && user.lastPitchGeneratedAt) {
    showReminder = !isSameMinute(
      user.lastPitchGeneratedAt,
      new Date()
    );
  }

  return Response.json({ showReminder });
}
