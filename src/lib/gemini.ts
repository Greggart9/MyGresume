export async function parsePDFWithGemini(base64PDF: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              inline_data: {
                mime_type: "application/pdf",
                data: base64PDF,
              },
            },
            {
              text: `Extract ALL information from this resume PDF and return ONLY raw JSON with this structure:
{
  "personalInfo": {
    "fullName": "name only - no address, no email, no phone",
    "email": "email",
    "phone": "phone",
    "location": "city, country",
    "linkedin": "linkedin url or empty",
    "website": "portfolio url or empty",
    "jobTitle": "job title only"
  },
  "summary": "professional summary if exists",
  "experience": [
    {
      "id": "exp1",
      "company": "company name",
      "role": "role title",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or empty if current",
      "current": false,
      "location": "city, country",
      "bullets": ["bullet 1", "bullet 2"]
    }
  ],
  "education": [
    {
      "id": "edu1",
      "institution": "school name",
      "degree": "degree type",
      "field": "field of study",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "gpa": "",
      "honors": ""
    }
  ],
  "skills": [
    { "id": "s1", "name": "skill name", "category": "Technical or Hard Skills or Soft Skills or Tools" }
  ],
  "projects": [],
  "certifications": [
    { "id": "cert1", "name": "cert name", "issuer": "issuer", "date": "year", "link": "" }
  ]
}

Rules:
- Return ONLY raw JSON, no markdown, no backticks
- fullName must be name only
- Extract every job, every bullet, every skill, every certification
- Dates in YYYY-MM format`,
            },
          ],
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 4096,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini error: ${err}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

export async function tailorPDFWithGemini(input: {
  base64PDF: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
}): Promise<string> {
  const { base64PDF, jobTitle, company, jobDescription } = input;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              inline_data: {
                mime_type: "application/pdf",
                data: base64PDF,
              },
            },
            {
              text: `You are tailoring a resume PDF for ATS fit.

STRICT RULES:
1) Return ONLY raw plain text (no markdown, no code fences).
2) Use the job responsibilities as the PRIMARY tailoring signal.
3) Preserve the original resume structure and style:
   - keep section order and headings
   - keep bullet style and line-break pattern
   - keep chronology and all existing entries
4) Do NOT invent or remove jobs, education, certifications, or projects.
5) Keep names, job titles, dates, companies, and contact info unchanged.
6) Keep changes targeted, not drastic:
   - rewrite summary/objective and a few bullets for relevance
   - integrate up to 3 missing relevant skills from the job description
   - integrate up to 2 responsibility-aligned phrases into existing bullets
7) Keep output length close to the source resume length.

Target Job: ${jobTitle} at ${company}
Job Responsibilities / Description:
${jobDescription}

Return the full tailored resume text only.`,
            },
          ],
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8192,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini tailor error: ${err}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}