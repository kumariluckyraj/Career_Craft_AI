import { NextResponse } from "next/server";

/* ==================== CONFIG ==================== */
const HF_API_KEY = process.env.HF_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Optional AI model (used only if available)
const HF_MODEL = "meta-llama/Meta-Llama-3-8B-Instruct";

/* ==================== HELPERS ==================== */

// Trim text length
function trim(text, max = 140) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

// Placement-type repo filter (IMPORTANT)
function isValidPlacementRepo(repo) {
  const text = `${repo.name} ${repo.description || ""}`.toLowerCase();

  // ❌ reject junk / politics / community repos
  const banned = [
    "politics",
    "propaganda",
    "dictatorship",
    "china",
    "communist",
    "manifesto",
    "discussion",
    ".github",
    "awesome",
  ];

  if (banned.some((w) => text.includes(w))) return false;

  // ✅ must look like a project
  const required = [
    "project",
    "app",
    "system",
    "management",
    "portal",
    "dashboard",
    "website",
    "application",
  ];

  return required.some((w) => text.includes(w));
}

/* ==================== API HANDLER ==================== */

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tech = searchParams.get("tech");

    if (!tech) {
      return NextResponse.json(
        { error: "Tech stack is required" },
        { status: 400 }
      );
    }

    /* ==================== 1️⃣ GITHUB ==================== */
    const githubRes = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(
        `${tech} project app in:name,description language:JavaScript language:TypeScript language:Java language:Python`
      )}&sort=stars&order=desc&per_page=20`
    );

    if (!githubRes.ok) throw new Error("GitHub API failed");

    const githubData = await githubRes.json();

    const rawRepos = (githubData.items || [])
      .filter(isValidPlacementRepo)
      .slice(0, 5)
      .map((repo) => ({
        name: repo.name,
        url: repo.html_url,
        description: trim(repo.description),
        stars: repo.stargazers_count,
        reason: "Good placement-level real-world project",
      }));

    /* ==================== 2️⃣ YOUTUBE ==================== */
    const ytRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&q=${encodeURIComponent(
        `${tech} project tutorial step by step`
      )}&key=${YOUTUBE_API_KEY}`
    );

    if (!ytRes.ok) throw new Error("YouTube API failed");

    const ytData = await ytRes.json();

    const rawVideos = (ytData.items || []).map((v) => ({
      title: trim(v.snippet.title),
      url: `https://www.youtube.com/watch?v=${v.id.videoId}`,
      description: trim(v.snippet.description),
      reason: "Step-by-step project tutorial",
    }));

    /* ==================== 3️⃣ OPTIONAL AI REFINEMENT ==================== */
    let aiGithub = null;
    let aiYoutube = null;

    if (HF_API_KEY) {
      try {
        const prompt = `
Select ONLY placement-level projects.

Return ONLY valid JSON:
{
  "github": [{ "name": "", "url": "", "reason": "" }],
  "youtube": [{ "title": "", "url": "", "reason": "" }]
}

GitHub:
${JSON.stringify(rawRepos)}

YouTube:
${JSON.stringify(rawVideos)}
`;

        const hfRes = await fetch(
          "https://router.huggingface.co/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${HF_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: HF_MODEL,
              messages: [
                {
                  role: "system",
                  content:
                    "You output ONLY raw JSON. No markdown. No explanations.",
                },
                { role: "user", content: prompt },
              ],
              temperature: 0.2,
              max_tokens: 300,
            }),
          }
        );

        if (hfRes.ok) {
          const data = await hfRes.json();
          const text = data?.choices?.[0]?.message?.content;
          const parsed = JSON.parse(text);
          aiGithub = parsed.github;
          aiYoutube = parsed.youtube;
        }
      } catch (e) {
        console.warn("AI skipped:", e.message);
      }
    }

    /* ==================== 4️⃣ FINAL RESPONSE ==================== */
    return NextResponse.json({
      github: aiGithub?.length ? aiGithub : rawRepos,
      youtube: aiYoutube?.length ? aiYoutube : rawVideos,
    });

  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json(
      { github: [], youtube: [], error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
