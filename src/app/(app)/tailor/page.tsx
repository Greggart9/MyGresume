"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

export default function TailorPage() {
	return (
		<div className="min-h-[calc(100vh-56px)] px-6 py-24" style={{ color: "#f0ede8" }}>
			<div className="max-w-3xl" style={{ fontFamily: "Syne, sans-serif" }}>
				<div style={{ fontSize: "24px", fontWeight: 700 }}>
					Tailoring Page — Coming Soon
				</div>
				<p className="mt-4 max-w-xl" style={{ color: "#6b6b6b", fontFamily: "Inter, sans-serif", fontSize: "15px", lineHeight: 1.7 }}>
					The tailoring experience is still being finalized, so we’re keeping this page hidden for now.
					Use the Cover Letter Builder in the meantime.
				</p>
				<div className="mt-8">
					<Link
						href="/cover-letter"
						className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
						style={{ background: "#c9a84c", color: "#080808", fontFamily: "Syne, sans-serif" }}
					>
						<Mail className="h-4 w-4" />
						Open Cover Letter Builder
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>
			</div>
		</div>
	);
}

// import { useState, useCallback, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Upload, FileText, Briefcase, Building2, Sparkles,
//   Loader2, AlertCircle, RefreshCw, ChevronRight,
//   CheckCircle, Download, Mail, Eye, ExternalLink
// } from "lucide-react";
// import { useAppStore } from "@/store";
// import { createEmptyResume, createEmptyCoverLetter } from "@/lib/default";
// import { generateId } from "@/lib/utils";
// import DefaultTemplate from "@/components/templates/DefaultTemplate";

// type Step = "upload" | "details" | "processing" | "result";
// type ResultTab = "resume" | "cover-letter";

// export default function TailorPage() {
//   const { activeResume, setActiveResume, activeCoverLetter,
//     setActiveCoverLetter, saveToHistory } = useAppStore();

//   const [step, setStep] = useState<Step>("upload");
//   const [resumeText, setResumeText] = useState("");
//   const [tailoredResumeText, setTailoredResumeText] = useState("");
//   const [fileName, setFileName] = useState("");
//   const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState("");
//   const [uploadedMimeType, setUploadedMimeType] = useState("");
//   const [uploadedBase64PDF, setUploadedBase64PDF] = useState("");
//   const [uploadedIsPDF, setUploadedIsPDF] = useState(false);
//   const [jobTitle, setJobTitle] = useState("");
//   const [roleTitle, setRoleTitle] = useState("");
//   const [company, setCompany] = useState("");
//   const [jobDescription, setJobDescription] = useState("");
//   const [error, setError] = useState("");
//   const [dragging, setDragging] = useState(false);
//   const [fileLoading, setFileLoading] = useState(false);
//   const [resultTab, setResultTab] = useState<ResultTab>("resume");
//   const [showDownloadMenu, setShowDownloadMenu] = useState(false);

//   // ── File read ──
//   async function readFile(file: File) {
//   if (uploadedPreviewUrl) {
//     URL.revokeObjectURL(uploadedPreviewUrl);
//   }
//   const nextPreviewUrl = URL.createObjectURL(file);
//   setFileName(file.name);
//   setUploadedPreviewUrl(nextPreviewUrl);
//   setUploadedMimeType(file.type || "");
//   setError("");
//   setFileLoading(true);
//   setTailoredResumeText("");
//   setActiveResume(createEmptyResume());

//   try {
//     const formData = new FormData();
//     formData.append("file", file);
//     const res = await fetch("/api/upload", { method: "POST", body: formData });
//     const data = await res.json();
//     if (data.error) { setError(data.error); return; }

//     setResumeText(data.text);
//     setUploadedBase64PDF(data.base64 || "");
//     setUploadedIsPDF(Boolean(data.isPDF));

//     // Parse with base64 if PDF
//     const parseRes = await fetch("/api/ai/parse", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         resumeText: data.text,
//         base64PDF: data.base64 || "",
//         isPDF: data.isPDF || false,
//       }),
//     });

//     await parseRes.json();

//     setStep("details");
//   } catch {
//     setError("Failed to read file. Try pasting your resume text instead.");
//   } finally {
//     setFileLoading(false);
//   }
// }

//   useEffect(() => {
//     return () => {
//       if (uploadedPreviewUrl) {
//         URL.revokeObjectURL(uploadedPreviewUrl);
//       }
//     };
//   }, [uploadedPreviewUrl]);

//   const onDrop = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setDragging(false);
//     const file = e.dataTransfer.files[0];
//     if (file) readFile(file);
//   }, []);

//   // ── Tailor ──
//   async function tailorResume() {
//     if (!resumeText || !jobDescription || !jobTitle || !company) return;
//     setStep("processing");
//     setError("");

//     try {
//       // Parse
//       const parseRes = await fetch("/api/ai/parse", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           resumeText,
//           base64PDF: uploadedBase64PDF,
//           isPDF: uploadedIsPDF,
//         }),
//       });
//             const parseData = await parseRes.json();
//       if (parseData.error) throw new Error(parseData.error);
//       const parsed = JSON.parse(parseData.result.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim());

//       // Tailor text + Cover letter in parallel
//       const [tailorRes, clRes] = await Promise.all([
//         fetch("/api/ai/tailor", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             resumeText,
//             base64PDF: uploadedBase64PDF,
//             isPDF: uploadedIsPDF,
//             jobDescription,
//             jobTitle,
//             company,
//           }),
//         }),
//         fetch("/api/ai/cover-letter", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ resume: parsed, jobTitle, company, jobDescription }),
//         }),
//       ]);

//       const tailorData = await tailorRes.json();
//       if (tailorData.error) throw new Error(tailorData.error);
//       const tailoredText = (tailorData.result || "").toString().trim() || resumeText;
//       setTailoredResumeText(tailoredText);

//       const clData = await clRes.json();

//       const final = {
//         ...parsed,
//         id: generateId(),
//         template: "professional" as const,
//         colorTheme: "gold" as const,
//         targetJobTitle: jobTitle,
//         targetCompany: company,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       };

//       setActiveResume(final);
//       saveToHistory(final as any);

//       if (clData.content) {
//         setActiveCoverLetter({
//           id: generateId(),
//           resumeId: final.id,
//           recipientName: "Hiring Manager",
//           companyName: company,
//           jobTitle,
//           content: clData.content,
//           createdAt: new Date().toISOString(),
//         });
//       }

//       setStep("result");
//     } catch (e: any) {
//       setError(e.message || "Something went wrong. Please try again.");
//       setStep("details");
//     }
//   }

//   function reset() {
//     setStep("upload");
//     setResumeText("");
//     setTailoredResumeText("");
//     setFileName("");
//     if (uploadedPreviewUrl) {
//       URL.revokeObjectURL(uploadedPreviewUrl);
//     }
//     setUploadedPreviewUrl("");
//     setUploadedMimeType("");
//     setUploadedBase64PDF("");
//     setUploadedIsPDF(false);
//     setJobTitle("");
//     setRoleTitle("");
//     setCompany("");
//     setJobDescription("");
//     setError("");
//     setActiveResume(createEmptyResume());
//   }

//   async function downloadPDF() {
//     const element = document.getElementById("preview-content");
//     if (!element) return;
//     const { generateFileName } = await import("@/lib/utils");
//     const name = generateFileName(jobTitle, company, "resume");
//     const win = window.open("", "_blank");
//     if (!win) return;
//     win.document.write(`<!DOCTYPE html><html><head><title>${name}</title>
//       <style>* { margin:0; padding:0; box-sizing:border-box; } body { width:210mm; }
//       @page { size:A4; margin:0; }</style></head>
//       <body>${element.innerHTML}</body></html>`);
//     win.document.close();
//     win.focus();
//     setTimeout(() => { win.print(); win.close(); }, 500);
//   }

//   async function downloadDOCX() {
//     const { Document, Packer, Paragraph, TextRun } = await import("docx");
//     const { saveAs } = await import("file-saver");
//     const { generateFileName } = await import("@/lib/utils");
//     const source = (tailoredResumeText || resumeText || "").replace(/\r\n/g, "\n");
//     const lines = source.split("\n");

//     const doc = new Document({
//       sections: [{
//         children: lines.map(line => new Paragraph({
//           children: [new TextRun({ text: line || " " })],
//           spacing: { after: 120 },
//         })),
//       }],
//     });

//     const blob = await Packer.toBlob(doc);
//     saveAs(blob, `${generateFileName(jobTitle, company, "resume")}.docx`);
//   }

//   async function downloadCoverLetterDOCX() {
//     const { Document, Packer, Paragraph, TextRun } = await import("docx");
//     const { saveAs } = await import("file-saver");
//     const { generateFileName } = await import("@/lib/utils");

//     const paragraphs = activeCoverLetter.content.split("\n\n").filter(Boolean);
//     const doc = new Document({
//       sections: [{
//         children: [
//           new Paragraph({ children: [new TextRun({ text: activeResume.personalInfo.fullName, bold: true, size: 28 })] }),
//           new Paragraph({ children: [new TextRun({ text: [activeResume.personalInfo.email, activeResume.personalInfo.phone].filter(Boolean).join(" | "), size: 18, color: "666666" })] }),
//           new Paragraph({ text: "" }),
//           ...paragraphs.map(p => new Paragraph({ text: p, spacing: { after: 200 } })),
//         ],
//       }],
//     });

//     const blob = await Packer.toBlob(doc);
//     saveAs(blob, `${generateFileName(jobTitle, company, "cover-letter")}.docx`);
//   }

//   const inputStyle = {
//     width: "100%",
//     background: "#0f0f0f",
//     border: "1px solid #1f1f1f",
//     borderRadius: "10px",
//     padding: "10px 14px",
//     fontSize: "13px",
//     color: "#f0ede8",
//     outline: "none",
//   };

//   const labelStyle = {
//     display: "block",
//     fontSize: "11px",
//     fontWeight: "600" as const,
//     textTransform: "uppercase" as const,
//     letterSpacing: "0.08em",
//     color: "#6b6b6b",
//     marginBottom: "6px",
//   };

//   return (
//     <div className="flex h-[calc(100vh-56px)]">

//       {/* ── Left Panel ── */}
//       <div className="w-full max-w-120 shrink-0 flex flex-col border-r overflow-hidden"
//         style={{ borderColor: "#1f1f1f" }}>

//         {/* Steps indicator */}
//         <div className="flex items-center gap-2 px-6 py-4 shrink-0"
//           style={{ borderBottom: "1px solid #1f1f1f" }}>
//           {(["upload", "details", "result"] as const).map((s, i) => {
//             const done = (s === "upload" && (step === "details" || step === "result" || step === "processing")) ||
//               (s === "details" && step === "result");
//             const active = step === s || (s === "details" && step === "processing");
//             return (
//               <div key={s} className="flex items-center gap-2">
//                 <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all"
//                   style={{
//                     background: active ? "#2a2010" : done ? "#141410" : "#0f0f0f",
//                     color: active ? "#c9a84c" : done ? "#6b5020" : "#4b4b4b",
//                     border: `1px solid ${active ? "#3a3010" : done ? "#2a2010" : "#1f1f1f"}`,
//                     fontFamily: "Syne, sans-serif",
//                   }}>
//                   {done
//                     ? <CheckCircle className="w-3 h-3" />
//                     : <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[10px]">{i + 1}</span>
//                   }
//                   {s === "upload" ? "Upload" : s === "details" ? "Job Details" : "Result"}
//                 </div>
//                 {i < 2 && <ChevronRight className="w-3 h-3" style={{ color: "#2a2a2a" }} />}
//               </div>
//             );
//           })}
//         </div>

//         {/* Step content */}
//         <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
//           <AnimatePresence mode="wait">

//             {/* Upload */}
//             {step === "upload" && (
//               <motion.div key="upload"
//                 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
//                 className="space-y-5">
//                 <div>
//                   <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "Syne, sans-serif", color: "#f0ede8" }}>
//                     Upload Your CV
//                   </h2>
//                   <p className="text-sm" style={{ color: "#6b6b6b" }}>
//                     We'll tailor it to your target job
//                   </p>
//                 </div>

//                 {/* Drop zone */}
//                 <div
//                   onDrop={onDrop}
//                   onDragOver={e => { e.preventDefault(); setDragging(true); }}
//                   onDragLeave={() => setDragging(false)}
//                   className="rounded-2xl p-10 text-center transition-all cursor-pointer"
//                   style={{
//                     border: `2px dashed ${dragging ? "#c9a84c" : "#1f1f1f"}`,
//                     background: dragging ? "#0f0d08" : "#0a0a0a",
//                   }}
//                 >
//                   <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
//                     style={{ background: "#2a2010" }}>
//                     <Upload className="w-6 h-6" style={{ color: "#c9a84c" }} />
//                   </div>
//                   <p className="text-sm font-medium mb-1" style={{ color: "#f0ede8" }}>Drop your resume here</p>
//                   <p className="text-xs mb-4" style={{ color: "#4b4b4b" }}>PDF, DOCX, DOC, TXT supported</p>
//                   <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all"
//                     style={{
//                       background: fileLoading ? "#2a2010" : "linear-gradient(135deg, #c9a84c, #e8c96d)",
//                       color: "#080808",
//                       fontFamily: "Syne, sans-serif",
//                       opacity: fileLoading ? 0.8 : 1,
//                     }}>
//                     {fileLoading
//                       ? <><Loader2 className="w-4 h-4 animate-spin" />Reading...</>
//                       : <><FileText className="w-4 h-4" />Browse File</>
//                     }
//                     <input type="file" accept=".pdf,.doc,.docx,.txt,.rtf" className="hidden"
//                       onChange={e => e.target.files?.[0] && readFile(e.target.files[0])}
//                       disabled={fileLoading} />
//                   </label>
//                 </div>

//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full" style={{ borderTop: "1px solid #1f1f1f" }} />
//                   </div>
//                   <div className="relative flex justify-center">
//                     <span className="px-3 text-xs" style={{ background: "#080808", color: "#4b4b4b" }}>
//                       or paste resume text
//                     </span>
//                   </div>
//                 </div>

//                 <textarea
//                   value={resumeText}
//                   onChange={e => setResumeText(e.target.value)}
//                   placeholder="Paste your resume content here..."
//                   rows={7}
//                   style={{ ...inputStyle, resize: "none", lineHeight: "1.5" }}
//                 />

//                 <button
//                   onClick={() => resumeText.trim() && setStep("details")}
//                   disabled={!resumeText.trim()}
//                   className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
//                   style={{
//                     background: resumeText.trim() ? "linear-gradient(135deg, #c9a84c, #e8c96d)" : "#141414",
//                     color: resumeText.trim() ? "#080808" : "#4b4b4b",
//                     fontFamily: "Syne, sans-serif",
//                     border: resumeText.trim() ? "none" : "1px solid #1f1f1f",
//                   }}
//                 >
//                   Continue →
//                 </button>
//               </motion.div>
//             )}

//             {/* Details */}
//             {step === "details" && (
//               <motion.div key="details"
//                 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
//                 className="space-y-4">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "Syne, sans-serif", color: "#f0ede8" }}>
//                       Job Details
//                     </h2>
//                     <p className="text-sm" style={{ color: "#6b6b6b" }}>Tell us about the role</p>
//                   </div>
//                   {fileName && (
//                     <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
//                       style={{ background: "#2a2010", color: "#c9a84c", border: "1px solid #3a3010" }}>
//                       <FileText className="w-3 h-3" />
//                       <span className="truncate max-w-30">{fileName}</span>
//                     </div>
//                   )}
//                 </div>

//                 {error && (
//                   <div className="flex items-start gap-2 p-3 rounded-xl"
//                     style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
//                     <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#ef4444" }} />
//                     <p className="text-xs" style={{ color: "#ef4444" }}>{error}</p>
//                   </div>
//                 )}

//                 <div>
//                   <label style={labelStyle}>
//                     <span className="flex items-center gap-1.5"><Briefcase className="w-3 h-3" />Job Title *</span>
//                   </label>
//                   <input value={jobTitle} onChange={e => setJobTitle(e.target.value)}
//                     placeholder="e.g. Senior Frontend Developer" style={inputStyle} />
//                 </div>

//                 <div>
//                   <label style={labelStyle}>
//                     <span className="flex items-center gap-1.5"><Building2 className="w-3 h-3" />Company Name *</span>
//                   </label>
//                   <input value={company} onChange={e => setCompany(e.target.value)}
//                     placeholder="e.g. Google" style={inputStyle} />
//                 </div>

//                 <div>
//                   <label style={labelStyle}>Your Current Role Title *</label>
//                   <input value={roleTitle} onChange={e => setRoleTitle(e.target.value)}
//                     placeholder="e.g. Frontend Developer" style={inputStyle} />
//                 </div>

//                 <div>
//                   <label style={labelStyle}>Job Description / Responsibilities *</label>
//                   <textarea
//                     value={jobDescription}
//                     onChange={e => setJobDescription(e.target.value)}
//                     placeholder="Paste the full job description here..."
//                     rows={8}
//                     style={{ ...inputStyle, resize: "none", lineHeight: "1.5" }}
//                   />
//                 </div>

//                 <div className="flex gap-3 pt-1">
//                   <button onClick={() => setStep("upload")}
//                     className="px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
//                     style={{ background: "#0f0f0f", border: "1px solid #1f1f1f", color: "#6b6b6b" }}>
//                     ← Back
//                   </button>
//                   <button
//                     onClick={tailorResume}
//                     disabled={!jobTitle || !company || !jobDescription || !roleTitle}
//                     className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
//                     style={{
//                       background: (jobTitle && company && jobDescription && roleTitle)
//                         ? "linear-gradient(135deg, #c9a84c, #e8c96d)" : "#141414",
//                       color: (jobTitle && company && jobDescription && roleTitle) ? "#080808" : "#4b4b4b",
//                       fontFamily: "Syne, sans-serif",
//                       border: (jobTitle && company && jobDescription && roleTitle) ? "none" : "1px solid #1f1f1f",
//                     }}
//                   >
//                     <Sparkles className="w-4 h-4" />
//                     Tailor My Resume
//                   </button>
//                 </div>
//               </motion.div>
//             )}

//             {/* Processing */}
//             {step === "processing" && (
//               <motion.div key="processing"
//                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//                 className="flex flex-col items-center justify-center h-full py-24 space-y-6 text-center">
//                 <div className="relative">
//                   <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
//                     style={{ background: "#2a2010", border: "1px solid #3a3010" }}>
//                     <Sparkles className="w-10 h-10" style={{ color: "#c9a84c" }} />
//                   </div>
//                   <div className="absolute inset-0 rounded-2xl animate-ping"
//                     style={{ border: "2px solid rgba(201,168,76,0.3)" }} />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "Syne, sans-serif", color: "#f0ede8" }}>
//                     Tailoring Your Resume
//                   </h3>
//                   <p className="text-sm" style={{ color: "#6b6b6b" }}>
//                     AI is crafting your CV for{" "}
//                     <span style={{ color: "#c9a84c" }}>{jobTitle}</span> at{" "}
//                     <span style={{ color: "#c9a84c" }}>{company}</span>
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2 text-xs" style={{ color: "#4b4b4b" }}>
//                   <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "#c9a84c" }} />
//                   Also generating your cover letter...
//                 </div>
//               </motion.div>
//             )}

//             {/* Result */}
//             {step === "result" && (
//               <motion.div key="result"
//                 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
//                 className="space-y-4">
//                 <div className="flex items-center gap-2">
//                   <CheckCircle className="w-5 h-5" style={{ color: "#c9a84c" }} />
//                   <h2 className="text-xl font-bold" style={{ fontFamily: "Syne, sans-serif", color: "#f0ede8" }}>
//                     Done!
//                   </h2>
//                 </div>
//                 <p className="text-sm" style={{ color: "#6b6b6b" }}>
//                   Tailored for <span style={{ color: "#c9a84c" }}>{jobTitle}</span> at <span style={{ color: "#c9a84c" }}>{company}</span>
//                 </p>

//                 {/* What changed */}
//                 <div className="rounded-xl p-4 space-y-2"
//                   style={{ background: "#0f0d08", border: "1px solid #2a2010" }}>
//                   <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#c9a84c" }}>
//                     What was optimized
//                   </p>
//                   {[
//                     "Summary rewritten for the role",
//                     "Experience bullets match job keywords",
//                     "Cover letter auto-generated",
//                   ].map((item, i) => (
//                     <div key={i} className="flex items-center gap-2">
//                       <CheckCircle className="w-3 h-3 shrink-0" style={{ color: "#c9a84c" }} />
//                       <p className="text-xs" style={{ color: "#6b6b6b" }}>{item}</p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Tab switcher for preview */}
//                 <div className="flex gap-2 p-1 rounded-xl"
//                   style={{ background: "#0f0f0f", border: "1px solid #1f1f1f" }}>
//                   {(["resume", "cover-letter"] as ResultTab[]).map(tab => (
//                     <button key={tab} onClick={() => setResultTab(tab)}
//                       className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all"
//                       style={{
//                         background: resultTab === tab ? "#2a2010" : "transparent",
//                         color: resultTab === tab ? "#c9a84c" : "#6b6b6b",
//                         fontFamily: "Syne, sans-serif",
//                       }}>
//                       {tab === "resume" ? <Eye className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
//                       {tab === "resume" ? "Resume" : "Cover Letter"}
//                     </button>
//                   ))}
//                 </div>

//                 {/* Download buttons */}
//                 <div className="space-y-2">
//                   <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#4b4b4b" }}>
//                     Download Resume
//                   </p>
//                   <div className="flex gap-2">
//                     <button onClick={downloadPDF}
//                       className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold"
//                       style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96d)", color: "#080808", fontFamily: "Syne, sans-serif" }}>
//                       <Download className="w-4 h-4" />
//                       PDF
//                     </button>
//                     <button onClick={downloadDOCX}
//                       className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold"
//                       style={{ background: "#0f0f0f", border: "1px solid #1f1f1f", color: "#f0ede8", fontFamily: "Syne, sans-serif" }}>
//                       <Download className="w-4 h-4" />
//                       DOCX
//                     </button>
//                   </div>

//                   {activeCoverLetter.content && (
//                     <>
//                       <p className="text-xs font-bold uppercase tracking-widest mt-3" style={{ color: "#4b4b4b" }}>
//                         Download Cover Letter
//                       </p>
//                       <button onClick={downloadCoverLetterDOCX}
//                         className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold"
//                         style={{ background: "#0f0f0f", border: "1px solid #2a2010", color: "#c9a84c", fontFamily: "Syne, sans-serif" }}>
//                         <Mail className="w-4 h-4" />
//                         Cover Letter (.docx)
//                       </button>
//                     </>
//                   )}
//                 </div>

//                 <button onClick={reset}
//                   className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-colors"
//                   style={{ background: "#0f0f0f", border: "1px solid #1f1f1f", color: "#6b6b6b" }}>
//                   <RefreshCw className="w-4 h-4" />
//                   Tailor Another Resume
//                 </button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>

//       {/* ── Right Panel — Preview ── */}
//       <div className="flex-1 overflow-hidden flex flex-col" style={{ background: "#080808" }}>
//         {/* Preview header */}
//         <div className="h-12 flex items-center justify-between px-5 shrink-0"
//           style={{ borderBottom: "1px solid #1f1f1f" }}>
//           <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#4b4b4b" }}>
//             {step === "result" && resultTab === "cover-letter" ? "Cover Letter Preview" : "Resume Preview"}
//           </p>
//           {activeResume.personalInfo.fullName && (
//             <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#2a2010", color: "#c9a84c" }}>
//               Live Preview
//             </span>
//           )}
//         </div>

//         {/* Preview content */}
//         <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
//           {step !== "result" && uploadedPreviewUrl ? (
//             uploadedMimeType.includes("pdf") ? (
//               <div className="bg-white rounded-xl shadow-2xl max-w-4xl mx-auto overflow-hidden">
//                 <iframe
//                   src={uploadedPreviewUrl}
//                   title="Uploaded resume preview"
//                   style={{ width: "100%", height: "980px", border: "none", display: "block" }}
//                 />
//               </div>
//             ) : (
//               <div
//                 className="bg-white rounded-xl shadow-2xl max-w-3xl mx-auto p-8 text-center"
//                 style={{ color: "#111", fontFamily: "Inter, sans-serif" }}
//               >
//                 <p className="font-semibold mb-2">Original file preview</p>
//                 <p className="text-sm mb-4" style={{ color: "#555" }}>
//                   This file type may not render inline in every browser.
//                 </p>
//                 <a
//                   href={uploadedPreviewUrl}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold"
//                   style={{ background: "#111", color: "#fff" }}
//                 >
//                   Open uploaded file
//                 </a>
//               </div>
//             )
//           ) : !activeResume.personalInfo.fullName && step !== "result" ? (
//             <div className="h-full flex flex-col items-center justify-center text-center">
//               <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
//                 style={{ background: "#0f0f0f", border: "1px solid #1f1f1f" }}>
//                 <FileText className="w-8 h-8" style={{ color: "#2a2a2a" }} />
//               </div>
//               <p className="text-sm" style={{ color: "#4b4b4b" }}>Upload your CV to see a preview</p>
//             </div>
//           ) : step === "result" && resultTab === "cover-letter" && activeCoverLetter.content ? (
//             /* Cover letter preview */
//             <div className="bg-white rounded-xl shadow-2xl p-10 max-w-2xl mx-auto"
//               style={{ fontFamily: "Times New Roman, serif", fontSize: "11pt", lineHeight: "1.6", color: "#000" }}>
//               <div style={{ marginBottom: "24px" }}>
//                 <p style={{ fontWeight: "700", fontSize: "14pt" }}>{activeResume.personalInfo.fullName}</p>
//                 <p style={{ fontSize: "10pt", color: "#444" }}>
//                   {[activeResume.personalInfo.email, activeResume.personalInfo.phone].filter(Boolean).join(" • ")}
//                 </p>
//               </div>
//               <div style={{ marginBottom: "16px" }}>
//                 <p>Hiring Manager</p>
//                 <p style={{ fontWeight: "600" }}>{company}</p>
//               </div>
//               <div style={{ marginBottom: "8px", color: "#666", fontSize: "10pt" }}>
//                 {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
//               </div>
//               {activeCoverLetter.content.split("\n\n").filter(Boolean).map((para, i) => (
//                 <p key={i} style={{ marginBottom: "14px" }}>{para}</p>
//               ))}
//             </div>
//           ) : (
//             /* Resume preview */
//             step === "result" ? (
//               <div className="space-y-3">
//                 <div
//                   className="bg-white rounded-xl shadow-2xl max-w-4xl mx-auto p-10"
//                   id="preview-content"
//                   style={{
//                     fontFamily: "Times New Roman, Times, serif",
//                     color: "#000",
//                     lineHeight: 1.45,
//                     whiteSpace: "pre-wrap",
//                     fontSize: "10.5pt",
//                   }}
//                 >
//                   {tailoredResumeText || resumeText}
//                 </div>
//                 <p className="text-center text-xs" style={{ color: "#6b6b6b" }}>
//                   Showing tailored resume preview.
//                 </p>
//               </div>
//             ) : uploadedPreviewUrl ? (
//               uploadedMimeType.includes("pdf") ? (
//                 <div className="bg-white rounded-xl shadow-2xl max-w-4xl mx-auto overflow-hidden">
//                   <iframe
//                     src={uploadedPreviewUrl}
//                     title="Uploaded resume preview"
//                     style={{ width: "100%", height: "980px", border: "none", display: "block" }}
//                   />
//                 </div>
//               ) : (
//                 <div className="bg-white rounded-xl shadow-2xl max-w-3xl mx-auto p-8 text-center"
//                   style={{ color: "#111", fontFamily: "Inter, sans-serif" }}>
//                   <p className="font-semibold mb-2">Original file preview</p>
//                   <p className="text-sm mb-4" style={{ color: "#555" }}>
//                     Open the uploaded file to view the exact layout.
//                   </p>
//                   <a
//                     href={uploadedPreviewUrl}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
//                     style={{ background: "#111", color: "#fff" }}
//                   >
//                     <ExternalLink className="w-4 h-4" />
//                     Open uploaded file
//                   </a>
//                 </div>
//               )
//             ) : (
//               <div className="bg-white rounded-xl shadow-2xl max-w-3xl mx-auto p-8 text-center"
//                 style={{ color: "#111", fontFamily: "Inter, sans-serif" }}>
//                 <p className="font-semibold mb-2">Resume preview unavailable in-editor</p>
//                 <p className="text-sm mb-4" style={{ color: "#555" }}>
//                   Upload a file to see the original layout preview.
//                 </p>
//               </div>
//             )
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }