import { BASE_PROMPT } from "./basePrompt";

export function recommendationsPrompt(profile, personas) {
  return `
${BASE_PROMPT}

Student Profile:
${JSON.stringify(profile, null, 2)}

Personas:
${JSON.stringify(personas, null, 2)}

Task:
Give actionable networking advice.

Return JSON only:

{
  "recommendations": [
    {
      "persona": "Startup Founder",
      "action": "Send short intro + mention curiosity",
      "mistakeToAvoid": "Asking for job directly"
    }
  ]
}
`;
}
