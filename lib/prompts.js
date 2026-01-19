export const BASE_PROMPT = `
You are a career mentor for college students.
The user is a student, not a professional.
Avoid exaggeration and fake confidence.
Focus on learning, internships, and growth.
`;

export function analyzeStudentPrompt(profile) {
  return `
${BASE_PROMPT}

Student Profile:
${JSON.stringify(profile, null, 2)}

Analyze the student and return:
- Strengths
- Weaknesses
- What they should highlight
Return JSON only.
`;
}

export function postIdeasPrompt(profile) {
  const themes = [
    "learning in public",
    "project building",
    "internship preparation",
    "mistakes and lessons",
    "college-to-industry journey",
    "tooling and tech stack",
    "personal growth in tech",
  ];

  const tones = [
    "casual and relatable",
    "professional but friendly",
    "storytelling",
    "short and punchy",
    "reflective",
    "slightly Gen-Z (LinkedIn safe)",
  ];

  const angles = [
    "personal experience",
    "step-by-step breakdown",
    "before vs after",
    "myth busting",
    "things I wish I knew earlier",
    "daily habit or routine",
  ];

  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  const randomTone = tones[Math.floor(Math.random() * tones.length)];
  const randomAngle = angles[Math.floor(Math.random() * angles.length)];
  const entropy = Date.now(); // forces uniqueness every request

  return `
${BASE_PROMPT}

Student Profile:
${JSON.stringify(profile, null, 2)}

CREATIVITY CONTROLS (do not mention explicitly):
- Theme focus: ${randomTheme}
- Writing tone: ${randomTone}
- Content angle: ${randomAngle}
- Entropy key: ${entropy}

Task:
Generate EXACTLY 5 UNIQUE LinkedIn post ideas for a student.

For each post idea, include:
- title
- post idea description (2–3 lines)
- why this works for students

Also include:
- recommended posting frequency for this student

STRICT RULES:
- No repeated ideas
- No similar framing
- Each idea must feel clearly different
- Do NOT reuse sentence structures
- Return JSON only

Output format:
{
  "postIdeas": [
    {
      "title": "...",
      "idea": "...",
      "whyItWorks": "..."
    }
  ],
  "postingFrequency": "..."
}

Return ONLY valid JSON.
`;
}


export function postGeneratePrompt(profile, topic) {
  return `
${BASE_PROMPT}

Student Profile:
${JSON.stringify(profile, null, 2)}

Write a LinkedIn post for topic:
"${topic}"

Rules:
- Honest
- Seeks Attention
- 6–8 lines
- Genz style

Return plain text.
`;
}

export function pitchPrompt(profile) {
  return `
${BASE_PROMPT}

Student Profile:
${JSON.stringify(profile, null, 2)}

Task:
Create exactly 3 DIFFERENT networking pitch paragraphs for a college student.

IMPORTANT CONTEXT:
- These pitches are meant for a BROAD AUDIENCE (not one person)
- Think: LinkedIn networking messages, introductions, or outreach text
- Do NOT target a single individual
- Do NOT say "you", "your work", or mention any specific person

Tone & Style:
- Friendly, relatable, slightly Gen-Z (LinkedIn-safe)
- Honest student energy
- No fake confidence or exaggeration
- Light humor is allowed but keep it professional
- Sounds like a real student talking to many people

Each pitch should:
- Be a standalone paragraph
- Be 3–4 lines
- Focus on learning, curiosity, projects, or growth
- Encourage people to connect, reply, or engage

Output format (VERY IMPORTANT):
- Return plain text only
- Do NOT use bullet points, numbering, or JSON
- Separate the 3 pitches using a blank line
- Each pitch must feel clearly different from the others

Return ONLY the 3 pitch paragraphs.
`;
}

export function networkingPrompt(profile) {
  return `
${BASE_PROMPT}

Suggest:
- Who to connect with
- How to comment
- Mistakes to avoid

Return JSON only.
`;
}