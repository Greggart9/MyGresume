import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { resume, jobTitle, company, jobDescription } = await req.json();

    const name = resume.personalInfo.fullName;
    const currentRole = resume.personalInfo.jobTitle;
    const skills = resume.skills?.slice(0, 6).map((s: any) => s.name).join(", ");
    const recentCompany = resume.experience?.[0]?.company;
    const recentRole = resume.experience?.[0]?.role;
    const recentBullets = resume.experience?.[0]?.bullets?.slice(0, 2).join(". ");

    const prompt = `Write a professional cover letter body for a job application. Return ONLY the 3 paragraphs — no header, no date, no salutation, no sign-off, no labels.

Applicant details:
- Name: ${name}
- Applying for: ${jobTitle} at ${company}
${currentRole ? `- Current role: ${currentRole}` : ""}
${recentRole && recentCompany ? `- Most recent experience: ${recentRole} at ${recentCompany}` : ""}
${recentBullets ? `- Key achievements: ${recentBullets}` : ""}
${skills ? `- Key skills: ${skills}` : ""}

Job Description:
${jobDescription}

Write exactly 3 paragraphs following this structure:

 Opening (3-4 sentences):
- Start with "I am" or "With" — never start with "My name is"
- State the exact job title and company name
- Mention one specific thing about the company or role that excites you based on the job description
- Briefly state why you are a strong fit

Body (4-5 sentences):
- Highlight 1-2 specific experiences or achievements that directly match the job description requirements
- Use concrete numbers, metrics or outcomes where possible
- Connect your background explicitly to what the job description asks for
- Show you understand what the role needs

 Closing (2-3 sentences):
- Express genuine enthusiasm for the role and company
- Include a clear call to action — invite them to review your resume or schedule a conversation
- End professionally — thank them for their time and consideration

RULES:
- Write in first person throughout (I, my, me)
- Do NOT include any labels like "PARAGRAPH 1", "PARAGRAPH 2", "PARAGRAPH 3" — just write the text
- Do NOT use generic filler like "I am writing to express my interest"
- Do NOT start any sentence with the applicant's name
- Be specific to the job description — reference actual requirements mentioned
- Tone: professional, confident, warm — not robotic
- Return plain text only — 3 paragraphs separated by blank lines, nothing else`;

    const result = await generateContent(prompt);
    return NextResponse.json({ content: result.trim() });

  } catch (error: any) {
    console.error("Cover letter error:", error?.message);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}