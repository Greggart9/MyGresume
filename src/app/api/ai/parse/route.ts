import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/ai";
import { parsePDFWithGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { resumeText, base64PDF, isPDF } = await req.json();

    let result = "";

    // Use Gemini for PDF — it reads the actual file
    if (isPDF && base64PDF && process.env.GEMINI_API_KEY) {
      console.log("Using Gemini to parse PDF directly...");
      try {
        result = await parsePDFWithGemini(base64PDF);
        console.log("Gemini parsed successfully");
      } catch (e: any) {
        console.error("Gemini failed, falling back to text:", e.message);
        // Fall through to text-based parsing
      }
    }

    // Fallback — use OpenRouter with text for DOCX/TXT or if Gemini failed
    if (!result && resumeText?.trim()) {
      console.log("Using OpenRouter text parsing...");
      const prompt = `Extract ALL information from this resume and return ONLY raw JSON.

Rules:
- fullName must be the person's name ONLY
- Dates in YYYY-MM format
- Extract every job, bullet, skill, certification
- Return raw JSON only, no markdown

JSON structure:
{
  "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "website": "", "jobTitle": "" },
  "summary": "",
  "experience": [{ "id": "exp1", "company": "", "role": "", "startDate": "", "endDate": "", "current": false, "location": "", "bullets": [] }],
  "education": [{ "id": "edu1", "institution": "", "degree": "", "field": "", "startDate": "", "endDate": "", "gpa": "", "honors": "" }],
  "skills": [{ "id": "s1", "name": "", "category": "Technical" }],
  "projects": [],
  "certifications": [{ "id": "cert1", "name": "", "issuer": "", "date": "", "link": "" }]
}

Resume:
${resumeText}`;

      result = await generateContent(prompt);
    }

    if (!result) {
      return NextResponse.json({ error: "Could not parse resume" }, { status: 500 });
    }

    const cleaned = result
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    try {
      const parsed = JSON.parse(cleaned);

      // Safety cleanup on name
      if (parsed.personalInfo?.fullName) {
        parsed.personalInfo.fullName = parsed.personalInfo.fullName
          .replace(/[\w.+-]+@[\w-]+\.[a-z]{2,}/gi, "")
          .replace(/\+?\d[\d\s\-().]{7,}/g, "")
          .replace(/[|•∙·]/g, "")
          .trim();
      }

      console.log("Final parsed:", {
        name: parsed.personalInfo?.fullName,
        jobs: parsed.experience?.length,
        skills: parsed.skills?.length,
        certs: parsed.certifications?.length,
      });
      // Strip day from any YYYY-MM-DD dates — keep only YYYY-MM
function stripDay(dateStr: string): string {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr.slice(0, 7); // "2024-07-01" → "2024-07"
  }
  return dateStr;
}

// Apply to all dates in parsed result
if (parsed.experience) {
  parsed.experience = parsed.experience.map((exp: any) => ({
    ...exp,
    startDate: stripDay(exp.startDate),
    endDate: stripDay(exp.endDate),
  }));
}
if (parsed.education) {
  parsed.education = parsed.education.map((edu: any) => ({
    ...edu,
    startDate: stripDay(edu.startDate),
    endDate: stripDay(edu.endDate),
  }));
}

      return NextResponse.json({ result: JSON.stringify(parsed) });
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON returned. Please try again." },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Parse error:", error?.message);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}