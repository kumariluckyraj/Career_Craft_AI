export function resumeEnhancePrompt(userData) {
  return `
You are an expert ATS resume writer.

TASK:
Enhance the resume data professionally.

You MUST improve:
1) summary (ATS friendly, strong, 2-3 lines)
2) projects[].description (clear, impactful, 1-2 lines)
3) experience[].description (bullet-like, strong action words)
4) technicalSkills (clean list)

RULES:
- Return ONLY valid JSON
- No markdown
- No explanation
- Keep the same JSON format

FORMAT:
{
  "name": "",
  "links": {
    "github": "",
    "linkedin": "",
    "portfolio": "",
    "email": "",
    "phone": ""
  },
  "summary": "",
  "technicalSkills": [],
  "projects": [
    {
      "name": "",
      "description": "",
      "techStack": [],
      "duration": ""
    }
  ],
  "experience": [
    {
      "role": "",
      "company": "",
      "duration": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institute": "",
      "duration": "",
      "cgpa": ""
    }
  ]
}

INPUT:
${JSON.stringify(userData, null, 2)}
`;
}
