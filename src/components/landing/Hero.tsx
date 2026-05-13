"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Upload, FileCheck } from "lucide-react";

const floatAnimation = {
  y: [0, -12, 0],
  transition: { duration: 4, repeat: Infinity },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-150 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #c9a84c, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #c9a84c, transparent 70%)" }} />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(#c9a84c 1px, transparent 1px), linear-gradient(90deg, #c9a84c 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — Text */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{
                border: "1px solid #2a2010",
                background: "#0f0d08",
                color: "#c9a84c",
              }}
            >
              <Sparkles className="w-3 h-3" />
              AI-Powered Resume Tailoring
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ fontFamily: "Syne, sans-serif", color: "#f0ede8" }}
            >
              Your Resume.{" "}
              <span style={{
                background: "linear-gradient(135deg, #c9a84c, #e8c96d, #c9a84c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Tailored.
              </span>
              {" "}In Seconds.
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-lg leading-relaxed mb-8 max-w-lg"
              style={{ color: "#6b6b6b" }}
            >
              Upload your CV, paste a job description, and let AI rewrite your resume
              and generate a matching cover letter — perfectly tailored for every application.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/tailor">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(201,168,76,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #c9a84c, #e8c96d)",
                    color: "#080808",
                    fontFamily: "Syne, sans-serif",
                  }}
                >
                  Tailor My Resume
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/cover-letter">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm cursor-pointer"
                  style={{
                    border: "1px solid #1f1f1f",
                    background: "#0f0f0f",
                    color: "#f0ede8",
                    fontFamily: "Syne, sans-serif",
                  }}
                >
                  Build Cover Letter
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-8 mt-10 pt-8"
              style={{ borderTop: "1px solid #1f1f1f" }}
            >
              {[
                { value: "2x", label: "More interviews" },
                { value: "30s", label: "To tailor" },
                { value: "100%", label: "ATS friendly" },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold" style={{ fontFamily: "Syne, sans-serif", color: "#c9a84c" }}>
                    {stat.value}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#6b6b6b" }}>{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Floating resume mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hidden lg:block relative"
          >
            <motion.div animate={floatAnimation} className="relative">
              {/* Main card */}
              <div className="rounded-2xl p-6 relative"
                style={{
                  background: "#0f0f0f",
                  border: "1px solid #1f1f1f",
                  boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
                }}>

                {/* Fake resume preview */}
                <div className="bg-white rounded-xl p-5 text-black" style={{ minHeight: "380px" }}>
                  <div className="border-b-2 border-gray-800 pb-3 mb-4">
                    <div className="h-5 bg-gray-900 rounded w-48 mb-1.5" />
                    <div className="h-3 bg-gray-300 rounded w-32 mb-2" />
                    <div className="flex gap-2">
                      <div className="h-2 bg-gray-200 rounded w-24" />
                      <div className="h-2 bg-gray-200 rounded w-20" />
                    </div>
                  </div>
                  {[
                    { w: "w-24", lines: 3 },
                    { w: "w-28", lines: 4 },
                    { w: "w-20", lines: 2 },
                  ].map((section, i) => (
                    <div key={i} className="mb-4">
                      <div className={`h-2.5 bg-gray-800 rounded ${section.w} mb-2`} />
                      <div className="border-t border-gray-200 pt-2 space-y-1.5">
                        {Array.from({ length: section.lines }).map((_, j) => (
                          <div key={j} className={`h-1.5 bg-gray-200 rounded ${j % 3 === 2 ? "w-3/4" : "w-full"}`} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gold accent line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                  style={{ background: "linear-gradient(90deg, transparent, #c9a84c, transparent)" }} />
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-4 -right-4 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
                style={{ background: "#141414", border: "1px solid #2a2010", color: "#c9a84c" }}
              >
                <Sparkles className="w-3 h-3" />
                AI Tailored
              </motion.div>

              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
                style={{ background: "#141414", border: "1px solid #1f1f1f", color: "#f0ede8" }}
              >
                <FileCheck className="w-3 h-3 text-green-400" />
                Cover letter ready
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}