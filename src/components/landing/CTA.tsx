"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #1f1f1f, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #c9a84c, transparent 70%)" }} />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-12 relative overflow-hidden"
          style={{
            background: "#0f0f0f",
            border: "1px solid #2a2010",
            boxShadow: "0 0 60px rgba(201,168,76,0.08)",
          }}
        >
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: "linear-gradient(90deg, transparent, #c9a84c, transparent)" }} />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: "#2a2010", color: "#c9a84c", border: "1px solid #3a3010" }}>
            <Sparkles className="w-3 h-3" />
            Free to use
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "Syne, sans-serif", color: "#f0ede8" }}>
            Ready to land your{" "}
            <span style={{
              background: "linear-gradient(135deg, #c9a84c, #e8c96d)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              dream job?
            </span>
          </h2>

          <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: "#6b6b6b" }}>
            Upload your CV now and get a tailored resume and cover letter in under 30 seconds.
          </p>

          <Link href="/tailor">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(201,168,76,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #c9a84c, #e8c96d)",
                color: "#080808",
                fontFamily: "Syne, sans-serif",
              }}
            >
              <Sparkles className="w-5 h-5" />
              Start Tailoring — It's Free
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}