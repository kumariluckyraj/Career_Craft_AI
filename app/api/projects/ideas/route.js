import { NextResponse } from 'next/server';
import fetchReddit from '@/utils/fetchReddit';
import fetchHN from '@/utils/fetchHN';
import callLLM from '@/utils/callLLM';

export async function POST(req) {
  try {
    const { techStack } = await req.json();

    if (!techStack || techStack.length === 0) {
      return NextResponse.json(
        { error: 'Tech stack required' },
        { status: 400 }
      );
    }

    const results = {};

    for (const tech of techStack) {
      // 1️⃣ Fetch from Reddit + HN in parallel
      const [redditPosts, hnPosts] = await Promise.all([
        fetchReddit(tech),
        fetchHN(tech),
      ]);

      console.log(
        `[IDEA API] ${tech} → Reddit: ${redditPosts.length}, HN: ${hnPosts.length}`
      );

      const allPosts = [...redditPosts, ...hnPosts];

      if (allPosts.length === 0) {
        results[tech] = [];
        continue;
      }

      // 2️⃣ Deduplicate by text
      const uniquePosts = Array.from(
        new Map(allPosts.map(p => [p.text, p])).values()
      );

      const projects = [];

      // 3️⃣ LLM + fallback logic
     const redditLimited = redditPosts.slice(0, 3);
const hnLimited = hnPosts.slice(0, 2);

const selectedPosts = [...redditLimited, ...hnLimited];

for (const post of selectedPosts) {

       const prompt = `
You are a senior software engineer.

Project idea source text:
"${post.text}"

Primary technology of interest:
"${tech}"

Instructions:
- Generate a **step-by-step technical flow** for implementing this project.
- Include frontend frameworks, backend, APIs, LLM usage, storage, database, integrations, etc.
- Show it as a sequence separated by arrows (→), like:
  Frontend (React / Next.js) → API Layer (Express / FastAPI) → Backend Logic → LLM Integration → Fine-tuning / Prompt Engineering → External APIs / Microservices → Database (PostgreSQL / MongoDB) → Caching / Queue (Redis / RabbitMQ) → Authentication → Routes / Endpoints → Logging / Monitoring → Deployment / Hosting
- Make it realistic and practical for a developer to build.


Return ONLY valid JSON in this format:
{
  "title": "",
  "description": "",
  "techFlow": "step1 → step2 → step3 → ..."
}
`;



        let idea = null;

        try {
          idea = await callLLM(prompt);
        } catch (e) {
          console.warn('LLM failed, using fallback');
        }

        // 🛡️ Fallback if LLM output is weak (COMMON for HN)
        if (
          !idea ||
          typeof idea !== 'object' ||
          !idea.title
        ) {
          projects.push({
            title: post.text.slice(0, 80),
            description:
              post.source === 'Hacker News'
                ? 'Project inspired from Hacker News discussion'
                : 'Project inspired from community post',
            techFlow: {
              frontend: tech,
              backend: 'N/A',
              database: 'N/A',
            },
            source: post.source,
            link: post.link,
          });
          continue;
        }

        // ✅ Valid LLM output
        projects.push({
          ...idea,
          source: post.source,
          link: post.link,
        });
      }

      results[tech] = projects;
    }

    return NextResponse.json(results);

  } catch (err) {
    console.error('IDEA API ERROR:', err);
    return NextResponse.json(
      { error: 'Failed to fetch project ideas' },
      { status: 500 }
    );
  }
}
