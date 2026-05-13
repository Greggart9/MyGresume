"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Download, Trash2, Clock,
  Building2, Briefcase, Eye, Mail,
  ChevronRight, Inbox
} from "lucide-react";
import { useAppStore } from "@/store";
import { generateFileName } from "@/lib/utils";
import DefaultTemplate from "@/components/templates/DefaultTemplate";

export default function HistoryPage() {
  const { history, deleteFromHistory, setActiveResume, activeCoverLetter } = useAppStore();
  const [selected, setSelected] = useState<string | null>(history[0]?.id || null);
  const [previewTab, setPreviewTab] = useState<"resume" | "cover-letter">("resume");

  const selectedResume = history.find(r => r.id === selected);

  async function downloadPDF(resume: typeof history[0]) {
    setActiveResume(resume);
    await new Promise(r => setTimeout(r, 100));
    const element = document.getElementById("history-preview-content");
    if (!element) return;
    const name = generateFileName(
      resume.targetJobTitle || resume.personalInfo.jobTitle || "resume",
      resume.targetCompany || "",
      "resume"
    );
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>${name}</title>
      <style>* { margin:0; padding:0; box-sizing:border-box; } body { width:210mm; }
      @page { size:A4; margin:0; }</style></head>
      <body>${element.innerHTML}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  }

  async function downloadDOCX(resume: typeof history[0]) {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");
    const { saveAs } = await import("file-saver");
    const r = resume;

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: r.personalInfo.fullName, heading: HeadingLevel.TITLE }),
          new Paragraph({
            children: [new TextRun({
              text: [r.personalInfo.email, r.personalInfo.phone, r.personalInfo.location].filter(Boolean).join(" | "),
              size: 18,
            })]
          }),
          new Paragraph({ text: "" }),
          ...(r.summary ? [
            new Paragraph({ text: "SUMMARY", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: r.summary }),
            new Paragraph({ text: "" }),
          ] : []),
          ...(r.experience.length > 0 ? [
            new Paragraph({ text: "EXPERIENCE", heading: HeadingLevel.HEADING_2 }),
            ...r.experience.flatMap(exp => [
              new Paragraph({ children: [new TextRun({ text: `${exp.role} — ${exp.company}`, bold: true })] }),
              ...exp.bullets.filter(Boolean).map(b => new Paragraph({ text: `• ${b}`, indent: { left: 360 } })),
              new Paragraph({ text: "" }),
            ]),
          ] : []),
          ...(r.education.length > 0 ? [
            new Paragraph({ text: "EDUCATION", heading: HeadingLevel.HEADING_2 }),
            ...r.education.map(edu => new Paragraph({
              children: [new TextRun({ text: `${edu.degree} ${edu.field} — ${edu.institution}`, bold: true })]
            })),
            new Paragraph({ text: "" }),
          ] : []),
          ...(r.skills.length > 0 ? [
            new Paragraph({ text: "SKILLS", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: r.skills.map(s => s.name).join(", ") }),
          ] : []),
          ...(r.certifications.length > 0 ? [
            new Paragraph({ text: "CERTIFICATIONS", heading: HeadingLevel.HEADING_2 }),
            ...r.certifications.map(c => new Paragraph({
              text: `${c.name}${c.issuer ? " — " + c.issuer : ""}${c.date ? " (" + c.date + ")" : ""}`
            })),
          ] : []),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const name = generateFileName(
      resume.targetJobTitle || resume.personalInfo.jobTitle || "resume",
      resume.targetCompany || "",
      "resume"
    );
    saveAs(blob, `${name}.docx`);
  }

  // Empty state
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)] text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "#0f0f0f", border: "1px solid #1f1f1f" }}>
            <Inbox className="w-10 h-10" style={{ color: "#2a2a2a" }} />
          </div>
          <h2 className="text-xl font-bold mb-2"
            style={{ fontFamily: "Syne, sans-serif", color: "#f0ede8" }}>
            No history yet
          </h2>
          <p className="text-sm max-w-xs mx-auto mb-6" style={{ color: "#6b6b6b" }}>
            Your last 5 tailored resumes will appear here automatically after you tailor your first CV.
          </p>
          <a href="/tailor">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
              style={{
                background: "linear-gradient(135deg, #c9a84c, #e8c96d)",
                color: "#080808",
                fontFamily: "Syne, sans-serif",
              }}
            >
              Tailor Your First Resume
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-56px)]">

      {/* ── Left — Resume List ── */}
      <div className="w-full max-w-95 shrink-0 flex flex-col border-r overflow-hidden"
        style={{ borderColor: "#1f1f1f" }}>

        {/* Header */}
        <div className="px-5 py-4 shrink-0" style={{ borderBottom: "1px solid #1f1f1f" }}>
          <h2 className="text-base font-bold" style={{ fontFamily: "Syne, sans-serif", color: "#f0ede8" }}>
            Resume History
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "#6b6b6b" }}>
            {history.length} of 5 saved
          </p>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-3 space-y-2">
          {history.map((resume, i) => (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setSelected(resume.id)}
              className="rounded-xl p-4 cursor-pointer transition-all"
              style={{
                background: selected === resume.id ? "#0f0d08" : "#0a0a0a",
                border: `1px solid ${selected === resume.id ? "#3a3010" : "#1a1a1a"}`,
              }}
              onMouseEnter={e => {
                if (selected !== resume.id)
                  e.currentTarget.style.border = "1px solid #2a2010";
              }}
              onMouseLeave={e => {
                if (selected !== resume.id)
                  e.currentTarget.style.border = "1px solid #1a1a1a";
              }}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: selected === resume.id ? "#2a2010" : "#141414",
                    border: `1px solid ${selected === resume.id ? "#3a3010" : "#1f1f1f"}`,
                  }}>
                  <FileText className="w-4 h-4" style={{ color: selected === resume.id ? "#c9a84c" : "#4b4b4b" }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate"
                    style={{ color: selected === resume.id ? "#f0ede8" : "#a0a0a0" }}>
                    {resume.personalInfo?.fullName || "Untitled"}
                  </p>
                  {resume.targetJobTitle && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Briefcase className="w-2.5 h-2.5 shrink-0" style={{ color: "#6b6b6b" }} />
                      <p className="text-xs truncate" style={{ color: "#6b6b6b" }}>
                        {resume.targetJobTitle}
                      </p>
                    </div>
                  )}
                  {resume.targetCompany && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Building2 className="w-2.5 h-2.5 shrink-0" style={{ color: "#6b6b6b" }} />
                      <p className="text-xs truncate" style={{ color: "#6b6b6b" }}>
                        {resume.targetCompany}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-2.5 h-2.5" style={{ color: "#3a3a3a" }} />
                    <p className="text-[10px]" style={{ color: "#3a3a3a" }}>
                      {new Date(resume.updatedAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric"
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={e => { e.stopPropagation(); downloadPDF(resume); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                    style={{ background: "#141414", border: "1px solid #1f1f1f" }}
                    title="Download PDF"
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#2a2010"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#1f1f1f"}
                  >
                    <Download className="w-3 h-3" style={{ color: "#6b6b6b" }} />
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      deleteFromHistory(resume.id);
                      if (selected === resume.id) setSelected(history[0]?.id || null);
                    }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                    style={{ background: "#141414", border: "1px solid #1f1f1f" }}
                    title="Delete"
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
                      e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "#1f1f1f";
                      e.currentTarget.style.background = "#141414";
                    }}
                  >
                    <Trash2 className="w-3 h-3" style={{ color: "#6b6b6b" }} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Right — Preview ── */}
      <div className="flex-1 overflow-hidden flex flex-col">

        {/* Preview topbar */}
        <div className="h-12 flex items-center justify-between px-5 shrink-0"
          style={{ borderBottom: "1px solid #1f1f1f" }}>
          <div className="flex items-center gap-1 p-0.5 rounded-lg"
            style={{ background: "#0f0f0f", border: "1px solid #1f1f1f" }}>
            {(["resume", "cover-letter"] as const).map(tab => (
              <button key={tab} onClick={() => setPreviewTab(tab)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all"
                style={{
                  background: previewTab === tab ? "#2a2010" : "transparent",
                  color: previewTab === tab ? "#c9a84c" : "#6b6b6b",
                  fontFamily: "Syne, sans-serif",
                }}>
                {tab === "resume" ? <Eye className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                {tab === "resume" ? "Resume" : "Cover Letter"}
              </button>
            ))}
          </div>

          {selectedResume && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => selectedResume && downloadPDF(selectedResume)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: "linear-gradient(135deg, #c9a84c, #e8c96d)",
                  color: "#080808",
                  fontFamily: "Syne, sans-serif",
                }}
              >
                <Download className="w-3 h-3" />
                PDF
              </button>
              <button
                onClick={() => selectedResume && downloadDOCX(selectedResume)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: "#0f0f0f",
                  border: "1px solid #1f1f1f",
                  color: "#f0ede8",
                  fontFamily: "Syne, sans-serif",
                }}
              >
                <Download className="w-3 h-3" />
                DOCX
              </button>
            </div>
          )}
        </div>

        {/* Preview body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
          <AnimatePresence mode="wait">
            {!selectedResume ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center"
              >
                <p className="text-sm" style={{ color: "#4b4b4b" }}>
                  Select a resume to preview
                </p>
              </motion.div>
            ) : previewTab === "cover-letter" ? (
              <motion.div
                key="cover-letter"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-2xl p-10 max-w-2xl mx-auto"
                style={{ fontFamily: "Times New Roman, serif", fontSize: "11pt", lineHeight: "1.6", color: "#000" }}
              >
                {activeCoverLetter?.content && activeCoverLetter.resumeId === selectedResume.id ? (
                  <>
                    <div style={{ marginBottom: "24px" }}>
                      <p style={{ fontWeight: "700", fontSize: "14pt" }}>{selectedResume.personalInfo.fullName}</p>
                      <p style={{ fontSize: "10pt", color: "#444" }}>
                        {[selectedResume.personalInfo.email, selectedResume.personalInfo.phone].filter(Boolean).join(" • ")}
                      </p>
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <p>Hiring Manager</p>
                      <p style={{ fontWeight: "600" }}>{selectedResume.targetCompany}</p>
                    </div>
                    <div style={{ marginBottom: "16px", color: "#666", fontSize: "10pt" }}>
                      {new Date(selectedResume.createdAt).toLocaleDateString("en-US", {
                        month: "long", day: "numeric", year: "numeric"
                      })}
                    </div>
                    {activeCoverLetter.content.split("\n\n").filter(Boolean).map((para, i) => (
                      <p key={i} style={{ marginBottom: "14px" }}>{para}</p>
                    ))}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Mail className="w-10 h-10 mb-3" style={{ color: "#e0e0e0" }} />
                    <p style={{ color: "#999", fontSize: "13pt" }}>
                      No cover letter saved for this resume.
                    </p>
                    <p style={{ color: "#bbb", fontSize: "10pt", marginTop: "6px" }}>
                      Cover letters are only saved for the most recent session.
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={selectedResume.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-2xl max-w-2xl mx-auto overflow-hidden"
                id="history-preview-content"
              >
                <DefaultTemplate resume={selectedResume} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
