import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json(
      { error: 'GitHub username is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        // Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, // optional
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
  }
}
