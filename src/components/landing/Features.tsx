"use client";

import { motion } from "framer-motion";
import { FileSearch, Mail, Layers, Clock } from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "AI Resume Tailoring",
    description: "Upload your CV and paste any job description. Our AI rewrites your resume bullets and summary to perfectly match the role — optimized for ATS and human readers.",
    tag: "Core Feature",
  },
  {
    icon: Mail,
    title: "Auto Cover Letter",
    description: "Every time you tailor your resume, a matching cover letter is automatically generated — personalized for the company, role, and job responsibilities.",
    tag: "Automatic",
  },
  {
    icon: Layers,
    title: "Professional Templates",
    description: "Choose from multiple clean, professional resume templates. Switch designs instantly without losing your content.",
    tag: "Design",
  },
  {
    icon: Clock,
    title: "Resume History",
    description: "Your last 5 tailored resumes are saved automatically. Preview, download, or reuse any past version at any time.",
    tag: "Convenience",
  },
  {
  icon: Mail,
  title: "Cover Letter Generator",
  description: "Generate a professional cover letter in seconds — with or without a resume. Just enter your name, the job title, company, and paste the job description.",
  tag: "Automatic",
},
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #1f1f1f, transparent)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#c9a84c" }}>
            What we do
          </p>
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "Syne, sans-serif", color: "#f0ede8" }}>
            Everything you need to{" "}
            <span style={{
              background: "linear-gradient(135deg, #c9a84c, #e8c96d)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              land the job
            </span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "#6b6b6b" }}>
            Stop sending the same resume everywhere. Tailor every application in seconds.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="relative rounded-2xl p-6 group cursor-default"
              style={{
                background: "#0f0f0f",
                border: "1px solid #1f1f1f",
              }}
              onMouseEnter={e => (e.currentTarget.style.border = "1px solid #2a2010")}
              onMouseLeave={e => (e.currentTarget.style.border = "1px solid #1f1f1f")}
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "linear-gradient(90deg, transparent, #c9a84c, transparent)" }} />

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "#2a2010" }}>
                  <f.icon className="w-5 h-5" style={{ color: "#c9a84c" }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-base" style={{ fontFamily: "Syne, sans-serif", color: "#f0ede8" }}>
                      {f.title}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: "#2a2010", color: "#c9a84c" }}>
                      {f.tag}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#6b6b6b" }}>
                    {f.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}