"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Sparkles, Loader2, AlertCircle,
  Download, RefreshCw, CheckCircle,
  User, Briefcase, Building2, ChevronRight,
} from "lucide-react";

type Step = "form" | "processing" | "result";

export default function CoverLetterPage() {
  const [step, setStep] = useState<Step>("form");
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  async function generate() {
    if (!fullName || !jobTitle || !company || !jobDescription) return;
    setStep("processing");
    setError("");

    try {
      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume: {
            personalInfo: { fullName, jobTitle: "", email: "", phone: "", location: "", linkedin: "", website: "" },
            skills: [],
            experience: [],
          },
          jobTitle,
          company,
          jobDescription,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (!data.content) throw new Error("No content returned. Please try again.");

      setContent(data.content);
      setStep("result");
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
      setStep("form");
    }
  }

async function downloadDOCX() {
  const { Document, Packer, Paragraph, TextRun, AlignmentType } = await import("docx");
  const { saveAs } = await import("file-saver");

  const date = new Date().toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
  const bodyParas = content.split("\n\n").filter(Boolean);

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Times New Roman", size: 22 },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: { top: 864, bottom: 864, left: 1008, right: 1008 },
        },
      },
      children: [
        // Sender name
        new Paragraph({
          children: [new TextRun({ text: fullName, bold: true, size: 24, font: "Times New Roman" })],
          spacing: { after: 280 },
        }),

        // Date
        new Paragraph({
          children: [new TextRun({ text: date, font: "Times New Roman", size: 22 })],
          spacing: { after: 280 },
        }),

        // Company
        new Paragraph({
          children: [new TextRun({ text: company, bold: true, font: "Times New Roman", size: 22 })],
          spacing: { after: 280 },
        }),

        // Salutation
        new Paragraph({
          children: [new TextRun({ text: "Dear Hiring Manager,", font: "Times New Roman", size: 22 })],
          spacing: { after: 200 },
        }),

        // Body paragraphs
        ...bodyParas.map(para =>
          new Paragraph({
            children: [new TextRun({ text: para, font: "Times New Roman", size: 22 })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
          })
        ),

        // Sign off
        new Paragraph({
          children: [new TextRun({ text: "Sincerely,", font: "Times New Roman", size: 22 })],
          spacing: { before: 360, after: 80 },
        }),

        // Signature
        new Paragraph({
          children: [new TextRun({ text: fullName, bold: true, font: "Times New Roman", size: 22 })],
          spacing: { after: 0 },
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${fullName.replace(/\s+/g, "_")}_${company}_CoverLetter.docx`);
}



function downloadPDF() {
  const win = window.open("", "_blank");
  if (!win) return;
  const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const bodyParas = content.split("\n\n").filter(Boolean)
    .map(p => `<p style="margin-bottom:14px;text-align:justify;">${p}</p>`).join("");

  win.document.write(`<!DOCTYPE html>
<html>
  <head>
    <title>${fullName}_${company}_CoverLetter</title>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body {
        width: 210mm;
        min-height: 297mm;
        padding: 48px 56px;
        font-family: 'Times New Roman', Times, serif;
        font-size: 11pt;
        line-height: 1.7;
        color: #000;
        background: #fff;
      }
      @page { size: A4; margin: 0; }
      p { margin: 0; }
    </style>
  </head>
  <body>
    <p style="font-weight:700;font-size:12pt;margin-bottom:20px;">${fullName}</p>

    <p style="margin-bottom:20px;">${date}</p>

    <p style="font-weight:600;margin-bottom:20px;">${company}</p>

    <p style="margin-bottom:16px;">Dear Hiring Manager,</p>

    ${bodyParas}

    <div style="margin-top:28px;">
      <p>Sincerely,</p>
      <p style="font-weight:700;margin-top:4px;">${fullName}</p>
    </div>
  </body>
</html>`);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); win.close(); }, 600);
}

  function reset() {
    setStep("form");
    setContent("");
    setError("");
    setFullName("");
    setJobTitle("");
    setCompany("");
    setJobDescription("");
  }

  const inputStyle = {
    width: "100%",
    background: "#0f0f0f",
    border: "1px solid #1f1f1f",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#f0ede8",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    color: "#6b6b6b",
    marginBottom: "6px",
  };

  const canSubmit = fullName && jobTitle && company && jobDescription;

  return (
    <div className="flex h-[calc(100vh-56px)]">

      {/* ── Left Panel ── */}
      <div className="w-full max-w-120 shrink-0 flex flex-col border-r overflow-hidden"
        style={{ borderColor: "#1f1f1f" }}>

        {/* Header */}
        <div className="px-6 py-4 shrink-0 flex items-center gap-3"
          style={{ borderBottom: "1px solid #1f1f1f" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "#2a2010" }}>
            <Mail className="w-4 h-4" style={{ color: "#c9a84c" }} />
          </div>
          <div>
            <h2 className="text-base font-bold" style={{ fontFamily: "Syne, sans-serif", color: "#f0ede8" }}>
              Cover Letter Generator
            </h2>
            <p className="text-xs" style={{ color: "#6b6b6b" }}>
              No resume needed — just fill in the details
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
          <AnimatePresence mode="wait">

            {/* Form */}
            {step === "form" && (
              <motion.div key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-xl"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#ef4444" }} />
                    <p className="text-xs" style={{ color: "#ef4444" }}>{error}</p>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label style={labelStyle}>
                    <span className="flex items-center gap-1.5">
                      <User className="w-3 h-3" />
                      Your Full Name *
                    </span>
                  </label>
                  <input
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    style={inputStyle}
                  />
                </div>

                {/* Job Title */}
                <div>
                  <label style={labelStyle}>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3" />
                      Job Title Applying For *
                    </span>
                  </label>
                  <input
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Developer"
                    style={inputStyle}
                  />
                </div>

                {/* Company */}
                <div>
                  <label style={labelStyle}>
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3 h-3" />
                      Company Name *
                    </span>
                  </label>
                  <input
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Google"
                    style={inputStyle}
                  />
                </div>

                {/* Job Description */}
                <div>
                  <label style={labelStyle}>Job Description / Responsibilities *</label>
                  <textarea
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description or key responsibilities here..."
                    rows={10}
                    style={{ ...inputStyle, resize: "none", lineHeight: "1.6" }}
                  />
                </div>

                {/* Generate button */}
                <button
                  onClick={generate}
                  disabled={!canSubmit}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer"
                  style={{
                    background: canSubmit
                      ? "linear-gradient(135deg, #c9a84c, #e8c96d)"
                      : "#141414",
                    color: canSubmit ? "#080808" : "#4b4b4b",
                    fontFamily: "Syne, sans-serif",
                    border: canSubmit ? "none" : "1px solid #1f1f1f",
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Cover Letter
                </button>
              </motion.div>
            )}

            {/* Processing */}
            {step === "processing" && (
              <motion.div key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 space-y-6 text-center"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{ background: "#2a2010", border: "1px solid #3a3010" }}>
                    <Mail className="w-10 h-10" style={{ color: "#c9a84c" }} />
                  </div>
                  <div className="absolute inset-0 rounded-2xl animate-ping"
                    style={{ border: "2px solid rgba(201,168,76,0.3)" }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2"
                    style={{ fontFamily: "Syne, sans-serif", color: "#f0ede8" }}>
                    Writing Your Cover Letter
                  </h3>
                  <p className="text-sm" style={{ color: "#6b6b6b" }}>
                    Crafting a letter for{" "}
                    <span style={{ color: "#c9a84c" }}>{jobTitle}</span> at{" "}
                    <span style={{ color: "#c9a84c" }}>{company}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: "#4b4b4b" }}>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "#c9a84c" }} />
                  This takes about 10–15 seconds...
                </div>
              </motion.div>
            )}

            {/* Result */}
            {step === "result" && (
              <motion.div key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" style={{ color: "#c9a84c" }} />
                  <h2 className="text-xl font-bold"
                    style={{ fontFamily: "Syne, sans-serif", color: "#f0ede8" }}>
                    Cover Letter Ready!
                  </h2>
                </div>
                <p className="text-sm" style={{ color: "#6b6b6b" }}>
                  Written for{" "}
                  <span style={{ color: "#c9a84c" }}>{jobTitle}</span> at{" "}
                  <span style={{ color: "#c9a84c" }}>{company}</span>
                </p>

                {/* What's included */}
                <div className="rounded-xl p-4 space-y-2"
                  style={{ background: "#0f0d08", border: "1px solid #2a2010" }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: "#c9a84c" }}>
                    What's included
                  </p>
                  {[
                    "Professional opening hook",
                    "Why you fit the role",
                    "Key strengths highlighted",
                    "Strong closing CTA",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 shrink-0" style={{ color: "#c9a84c" }} />
                      <p className="text-xs" style={{ color: "#6b6b6b" }}>{item}</p>
                    </div>
                  ))}
                </div>

                {/* Download buttons */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest cursor-pointer"
                    style={{ color: "#4b4b4b" }}>
                    Download
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={downloadPDF}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                      style={{
                        background: "linear-gradient(135deg, #c9a84c, #e8c96d)",
                        color: "#080808",
                        fontFamily: "Syne, sans-serif",
                      }}
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                    <button
                      onClick={downloadDOCX}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                      style={{
                        background: "#0f0f0f",
                        border: "1px solid #1f1f1f",
                        color: "#f0ede8",
                        fontFamily: "Syne, sans-serif",
                      }}
                    >
                      <Download className="w-4 h-4" />
                      DOCX
                    </button>
                  </div>
                </div>

                <button
                  onClick={reset}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
                  style={{
                    background: "#0f0f0f",
                    border: "1px solid #1f1f1f",
                    color: "#6b6b6b",
                  }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Write Another
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Right Panel — Preview ── */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="h-12 flex items-center justify-between px-5 shrink-0"
          style={{ borderBottom: "1px solid #1f1f1f" }}>
          <p className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#4b4b4b" }}>
            Cover Letter Preview
          </p>
          {content && (
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "#2a2010", color: "#c9a84c" }}>
              Ready
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
          {!content ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "#0f0f0f", border: "1px solid #1f1f1f" }}>
                <Mail className="w-8 h-8" style={{ color: "#2a2a2a" }} />
              </div>
              <p className="text-sm" style={{ color: "#4b4b4b" }}>
                Fill in the form to generate your cover letter
              </p>
            </div>
          ) : (
            <div
              id="cl-preview"
              className="bg-white rounded-xl shadow-2xl p-10 max-w-2xl mx-auto"
              style={{
                fontFamily: "Times New Roman, serif",
                fontSize: "11pt",
                lineHeight: "1.7",
                color: "#000",
              }}
            >
              {/* Sender block */}
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontWeight: "700", fontSize: "12pt" }}>{fullName}</p>
              </div>

              {/* Date */}
              <p style={{ marginBottom: "20px" }}>
                {new Date().toLocaleDateString("en-US", {
                  month: "long", day: "numeric", year: "numeric",
                })}
              </p>

              {/* Recipient block — company only */}
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontWeight: "600" }}>{company}</p>
              </div>

              {/* Salutation */}
              <p style={{ marginBottom: "16px" }}>Dear Hiring Manager,</p>

              {/* Body */}
              {content.split("\n\n").filter(Boolean).map((para, i) => (
                <p key={i} style={{ marginBottom: "14px", textAlign: "justify" }}>{para}</p>
              ))}

              {/* Sign off */}
              <div style={{ marginTop: "28px" }}>
                <p>Sincerely,</p>
                <p style={{ fontWeight: "700", marginTop: "4px" }}>{fullName}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}