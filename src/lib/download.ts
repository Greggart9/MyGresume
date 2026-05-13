import { ResumeData } from "@/types";
import { generateFileName } from "./utils";

export async function downloadAsPDF(resume: ResumeData) {
  const fileName = generateFileName(
    resume.targetJobTitle || resume.personalInfo.jobTitle || "resume",
    resume.targetCompany || "",
    "resume"
  );

  // Get the resume preview element and use browser print
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const element = document.getElementById("resume-preview-content");
  if (!element) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${fileName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { width: 210mm; }
          @page { size: A4; margin: 0; }
          @media print { body { width: 210mm; } }
        </style>
      </head>
      <body>${element.innerHTML}</body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
}

export async function downloadAsDOCX(resume: ResumeData) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import("docx");
  const { saveAs } = await import("file-saver");

  const { personalInfo, summary, experience, education, skills } = resume;

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Name
        new Paragraph({
          text: personalInfo.fullName || "Your Name",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
        }),
        // Job title
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: personalInfo.jobTitle || "", color: "10b981", size: 24 })],
        }),
        // Contact
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({
            text: [personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join("  |  "),
            size: 18, color: "666666",
          })],
        }),
        new Paragraph({ text: "" }),

        // Summary
        ...(summary ? [
          new Paragraph({ text: "SUMMARY", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: summary }),
          new Paragraph({ text: "" }),
        ] : []),

        // Experience
        ...(experience.length > 0 ? [
          new Paragraph({ text: "WORK EXPERIENCE", heading: HeadingLevel.HEADING_2 }),
          ...experience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.role, bold: true }),
                new TextRun({ text: ` — ${exp.company}`, color: "666666" }),
              ]
            }),
            ...(exp.bullets || []).filter(Boolean).map(b => new Paragraph({ text: `• ${b}`, indent: { left: 360 } })),
            new Paragraph({ text: "" }),
          ]),
        ] : []),

        // Education
        ...(education.length > 0 ? [
          new Paragraph({ text: "EDUCATION", heading: HeadingLevel.HEADING_2 }),
          ...education.map(edu => new Paragraph({
            children: [
              new TextRun({ text: `${edu.degree} in ${edu.field}`, bold: true }),
              new TextRun({ text: ` — ${edu.institution}`, color: "666666" }),
            ]
          })),
          new Paragraph({ text: "" }),
        ] : []),

        // Skills
        ...(skills.length > 0 ? [
          new Paragraph({ text: "SKILLS", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: skills.map(s => s.name).join(", ") }),
        ] : []),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = generateFileName(
    resume.targetJobTitle || resume.personalInfo.jobTitle || "resume",
    resume.targetCompany || "",
    "resume"
  );
  saveAs(blob, `${fileName}.docx`);
}