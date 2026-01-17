import { BASE_PROMPT } from "./basePrompt";

export function personasPrompt(profile) {
  return `
${BASE_PROMPT}

Student Profile:
${JSON.stringify(profile, null, 2)}

Task:
Generate IDEAL LinkedIn personas this student should connect with.

Rules:
- Do NOT give names
- Only roles, titles, and companies
- Focus on recruiters, HR, founders, startup engineers

Return JSON only:

{
  "personas": [
    {
      "title": "Frontend Recruiter",
      "companyType": "Startup / SaaS",
      "why": "Hires interns and junior engineers"
    }
  ]
}
`;
}
