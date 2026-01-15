import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

import connectDB from '@/db/connectDb';
import User from '@/models/User';

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { techStack } = await req.json();

  await User.findOneAndUpdate(
    { email: session.user.email },
    { techStack },
    { new: true }
  );

  return NextResponse.json({ success: true });
}

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await User.findOne(
    { email: session.user.email },
    { techStack: 1 }
  );

  return NextResponse.json({
    techStack: user?.techStack || [],
  });
}
