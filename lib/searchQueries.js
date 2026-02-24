import { BASE_PROMPT } from "./basePrompt";

export function searchQueriesPrompt(profile, personas) {
  return `
${BASE_PROMPT}

Student Profile:
${JSON.stringify(profile, null, 2)}

Personas:
${JSON.stringify(personas, null, 2)}

Task:
Generate LinkedIn search queries for each persona.

Rules:
- Queries must work in LinkedIn search bar
- Include role + keywords + filters
- No URLs

Return JSON only:

{
  "queries": [
    {
      "persona": "Frontend Recruiter",
      "query": "Frontend Recruiter AND Intern Hiring"
    }
  ]
}
`;
}
