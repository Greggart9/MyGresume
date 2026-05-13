import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/ai";
import { tailorPDFWithGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { resumeText, base64PDF, isPDF, jobDescription, jobTitle, company } = await req.json();

    if (!resumeText || typeof resumeText !== "string") {
      return NextResponse.json({ error: "resumeText is required" }, { status: 400 });
    }

    // Preferred path: send actual uploaded PDF to Gemini
    if (isPDF && base64PDF && process.env.GEMINI_API_KEY) {
      try {
        const pdfTailored = await tailorPDFWithGemini({
          base64PDF,
          jobTitle,
          company,
          jobDescription,
        });

        if (pdfTailored && pdfTailored.length >= resumeText.trim().length * 0.85) {
          return NextResponse.json({ result: pdfTailored });
        }
      } catch (e: any) {
        console.error("Gemini PDF tailor failed, falling back to text:", e?.message);
      }
    }

    const prompt = `You are an expert ATS resume optimizer. Tailor this resume for the job below.

STRICT RULES:
1. Return ONLY raw plain text — no markdown code fences, no explanations.
2. Use the job responsibilities as the PRIMARY tailoring signal.
3. Preserve the exact resume structure and formatting as much as possible:
   - same section order
   - same heading names
   - same line breaks
   - same bullet style
   - same approximate length and spacing
4. Do NOT invent new jobs, schools, dates, companies, or certifications.
5. Keep changes targeted (not drastic):
   - rewrite summary/objective and a few experience bullets for relevance
   - integrate up to 3 missing relevant skills from the job responsibilities
   - integrate up to 2 responsibility-aligned phrases into existing bullets
6. Keep names, contact info, job titles, dates, and chronology unchanged.
7. Use keywords from the job responsibilities naturally without keyword stuffing.
8. DO NOT omit, delete, summarize, or merge any section or line from the original resume.
9. Keep output length close to the original resume length.

Target Job: ${jobTitle} at ${company}
Job Responsibilities / Description: ${jobDescription}

Original Resume Text:
${resumeText}

Return the full tailored resume text only.`;

    const result = await generateContent(prompt, { maxTokens: 6000 });
    const cleaned = result.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

    const originalLen = resumeText.trim().length;
    const tailoredLen = cleaned.length;
    const likelyTruncated = !cleaned || tailoredLen < originalLen * 0.85;

    if (!likelyTruncated) {
      return NextResponse.json({ result: cleaned });
    }

    const repairPrompt = `You are repairing a tailored resume output that became too short.

RULES:
1. Return ONLY raw plain text.
2. Use the job responsibilities as the primary tailoring signal.
3. Keep the original resume structure, sections, and all key details.
4. Keep all jobs, education items, certifications, projects, and most existing skills from the original.
5. You may add up to 3 missing relevant skills from the responsibilities if they fit the candidate profile.
6. Keep names, dates, titles, and chronology unchanged.
7. Improve wording only where needed for ATS alignment; do not rewrite everything.
8. Ensure the repaired output is similar in length to the original resume.

Target Job: ${jobTitle} at ${company}
Job Responsibilities / Description: ${jobDescription}

Original Resume:
${resumeText}

Too-short tailored draft:
${cleaned}

Return repaired full tailored resume text only.`;

    const repaired = await generateContent(repairPrompt, { maxTokens: 6000 });
    const repairedCleaned = repaired
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const finalResult = repairedCleaned.length >= originalLen * 0.85 ? repairedCleaned : resumeText;
    return NextResponse.json({ result: finalResult });

  } catch (error: any) {
    console.error("Tailor error:", error?.message);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}