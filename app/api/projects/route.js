import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tech = searchParams.get('tech');

  if (!tech) {
    return NextResponse.json({ error: 'Tech stack is required' }, { status: 400 });
  }

  try {
    // GitHub Repos
    const githubRes = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(
        tech
      )}&sort=stars&order=desc&per_page=5`
    );
    const githubData = await githubRes.json();

    // YouTube Tutorials (replace YOUR_API_KEY with your key)
    const youtubeRes = await fetch(
  `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    tech + ' project tutorial'
  )}&type=video&maxResults=5&key=${process.env.YOUTUBE_API_KEY}`
);
const youtubeData = await youtubeRes.json();


    return NextResponse.json({
      github: githubData.items.map((repo) => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description,
      })),
      youtube: youtubeData.items.map((video) => ({
        title: video.snippet.title,
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project data' }, { status: 500 });
  }
}
