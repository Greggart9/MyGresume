"use client";

import { motion } from "framer-motion";
import { Upload, Sparkles, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your CV",
    description: "Upload your existing resume in PDF, DOCX, or TXT format. We extract all your information instantly.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Paste Job Description",
    description: "Add the job title, company name, and paste the job responsibilities. Our AI does the rest.",
  },
  {
    number: "03",
    icon: Download,
    title: "Download & Apply",
    description: "Get your tailored resume and auto-generated cover letter ready to download in seconds.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #1f1f1f, transparent)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#c9a84c" }}>
            How it works
          </p>
          <h2 className="text-4xl font-bold" style={{ fontFamily: "Syne, sans-serif", color: "#f0ede8" }}>
            Three steps to your{" "}
            <span style={{
              background: "linear-gradient(135deg, #c9a84c, #e8c96d)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              dream job
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="absolute top-12 left-1/6 right-1/6 h-px hidden md:block"
            style={{ background: "linear-gradient(90deg, transparent, #2a2010, #c9a84c, #2a2010, transparent)" }} />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              {/* Number circle */}
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
                style={{
                  background: "#0f0f0f",
                  border: "1px solid #2a2010",
                  boxShadow: "0 0 30px rgba(201,168,76,0.1)",
                }}>
                <step.icon className="w-8 h-8" style={{ color: "#c9a84c" }} />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96d)", color: "#080808" }}>
                  {i + 1}
                </span>
              </div>

              <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "Syne, sans-serif", color: "#f0ede8" }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6b6b6b" }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}