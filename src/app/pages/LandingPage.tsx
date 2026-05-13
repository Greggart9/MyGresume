"use client";

import { useState, useEffect, use } from "react";

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const phrases = [
    "Software Engineer at Google",
    "Product Manager at Meta",
    "UX Designer at Apple",
    "Data Scientist at Netflix",
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      const current = phrases[phraseIndex];
      if (!deleting) {
        setTypedText(current.slice(0, charIndex + 1));
        if (charIndex + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1800);
        } else {
          setCharIndex((c) => c + 1);
        }
      } else {
        setTypedText(current.slice(0, charIndex - 1));
        if (charIndex - 1 === 0) {
          setDeleting(false);
          setPhraseIndex((i) => (i + 1) % phrases.length);
          setCharIndex(0);
        } else {
          setCharIndex((c) => c - 1);
        }
      }
    }, deleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, phraseIndex]);

  const features = [
    { icon: "✦", title: "AI Resume Builder", desc: "Generate a polished, tailored resume from a few prompts. Our AI writes, formats, and optimizes every line." },
    { icon: "◈", title: "Job-Tailored CVs", desc: "Paste any job description and watch your resume reshape itself to match — keywords, tone, and all." },
    { icon: "⬡", title: "ATS Optimizer", desc: "Beat applicant tracking systems. We scan and rewrite your resume to pass filters at top companies." },
    { icon: "⟁", title: "Cover Letter Builder", desc: "Generate compelling, personalized cover letters in seconds — matched to any role and company." },
    { icon: "◫", title: "Resume History", desc: "Every version saved. Track your evolution, compare drafts, and restore any past resume instantly." },
    { icon: "⬢", title: "Smart Templates", desc: "Premium, recruiter-approved templates across industries. Edit inline, switch styles instantly." },
  ];

  const stats = [
    { value: "2.4M+", label: "Resumes Created" },
    { value: "94%", label: "Interview Rate" },
    { value: "180+", label: "Templates" },
    { value: "50+", label: "Job Categories" },
  ];

  const steps = [
    { n: "01", t: "Input or Upload", d: "Start fresh with prompts, or upload an existing CV to improve. Our AI reads everything instantly." },
    { n: "02", t: "Paste the Job Description", d: "Drop in the job listing and let AI tailor your resume — keywords, skills, and tone aligned perfectly." },
    { n: "03", t: "Export & Apply", d: "Download as PDF, DOCX, and more. File auto-named with job title and company. Apply with confidence." },
  ];

  return (
    <div className="bg-[#050508] text-white overflow-x-hidden font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050508; }
        ::-webkit-scrollbar-thumb { background: #6c63ff; border-radius: 2px; }
        @keyframes float { 0%,100%{transform:translateY(0px) scale(1)} 50%{transform:translateY(-20px) scale(1.02)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes blink-cursor { 0%,100%{opacity:1} 50%{opacity:0} }
        .float-1 { animation: float 6s ease-in-out infinite; }
        .float-2 { animation: float 6s ease-in-out infinite 3s; }
        .float-3 { animation: float 6s ease-in-out infinite 1.5s; }
        .shimmer-text {
          background: linear-gradient(90deg, #6c63ff, #a855f7, #ec4899, #6c63ff);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .badge-dot { animation: blink 1.5s ease-in-out infinite; }
        .cursor-blink { animation: blink-cursor 1s step-end infinite; }
        .grid-bg {
          background-image: linear-gradient(rgba(108,99,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108,99,255,0.05) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .glow-btn-hover:hover {
          box-shadow: 0 0 30px rgba(108,99,255,0.6), 0 0 60px rgba(108,99,255,0.2);
        }
      `}</style>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-17.5 flex items-center justify-between px-10 backdrop-blur-xl bg-[#050508]/80 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#6c63ff] to-[#a855f7] flex items-center justify-center text-base font-black">MG</div>
          <span className="text-lg font-black tracking-tight">MyGresume</span>
        </div>
        <div className="hidden md:flex gap-9 items-center">
          {["Features", "Templates", "Pricing", "Examples"].map((l) => (
            <a key={l} className="text-white/60 text-sm font-medium hover:text-white transition-colors cursor-pointer">{l}</a>
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <button className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-[#6c63ff]/50 text-violet-400 hover:border-[#6c63ff] hover:bg-[#6c63ff]/10 hover:text-white transition-all">
            Sign In
          </button>
          <button className="px-5 py-2.5 text-sm font-bold rounded-xl bg-linear-to-r from-[#6c63ff] to-[#a855f7] hover:-translate-y-0.5 glow-btn-hover transition-all">
            Get Started Free
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="grid-bg min-h-screen flex items-center justify-center text-center px-10 pt-30 pb-20 relative overflow-hidden">
        {/* Orbs */}
        <div className="float-1 absolute w-125 h-125 rounded-full pointer-events-none top-[10%] left-[10%]" style={{ background: "radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)" }} />
        <div className="float-2 absolute w-100 h-100 rounded-full pointer-events-none bottom-[15%] right-[10%]" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)" }} />
        <div className="float-3 absolute w-75 h-75 rounded-full pointer-events-none top-1/2 right-[20%]" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)" }} />

        <div className="max-w-3xl relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#6c63ff]/12 border border-[#6c63ff]/25 rounded-full px-4 py-2 text-xs font-medium text-violet-400 mb-6">
            <span className="badge-dot w-1.5 h-1.5 rounded-full bg-[#6c63ff] shadow-[0_0_8px_#6c63ff]" />
            AI-Powered Resume Builder — Trusted by 2.4M+ professionals
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-[-2px] mb-6">
            Land your dream job as
            <br />
            <span className="shimmer-text">{typedText}</span>
            <span className="cursor-blink inline-block w-0.5 h-[0.9em] bg-[#6c63ff] ml-0.5 align-bottom" />
          </h1>

          <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-xl mx-auto mb-12 font-normal">
            Create, tailor, and optimize your resume with AI. Beat ATS systems, impress recruiters, and get hired — faster than ever.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <button className="px-10 py-4 text-base font-bold rounded-xl bg-linear-to-r from-[#6c63ff] to-[#a855f7] hover:-translate-y-0.5 glow-btn-hover transition-all">
              Build My Resume Free →
            </button>
            <button className="px-10 py-4 text-base font-semibold rounded-xl border border-[#6c63ff]/50 text-violet-400 hover:border-[#6c63ff] hover:bg-[#6c63ff]/10 hover:text-white transition-all">
              See Templates
            </button>
          </div>
          <p className="mt-6 text-xs text-white/25">No credit card required · 180+ templates · Export in PDF, DOCX & more</p>
        </div>
      </section>

      {/* STATS */}
      <section className="py-14 px-10 border-t border-b border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((s) => (
            <div key={s.label} className="text-center py-8 px-6 bg-white/2 border border-white/5 rounded-2xl hover:bg-[#6c63ff]/6 hover:border-[#6c63ff]/20 hover:-translate-y-1 transition-all">
              <div className="text-4xl font-black bg-linear-to-br from-[#6c63ff] to-[#a855f7] bg-clip-text text-transparent mb-2">{s.value}</div>
              <div className="text-sm text-white/45 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-28 px-10 max-w-275 mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#6c63ff]/12 border border-[#6c63ff]/25 rounded-full px-4 py-2 text-xs font-medium text-violet-400 mb-5">
            <span className="badge-dot w-1.5 h-1.5 rounded-full bg-[#6c63ff] shadow-[0_0_8px_#6c63ff]" />
            Everything you need
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-1.5px] leading-[1.1]">
            One platform.{" "}
            <span className="shimmer-text">Infinite possibilities.</span>
          </h2>
          <p className="mt-5 text-white/40 text-lg max-w-md mx-auto">Everything you need to craft a resume that gets you hired.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              onClick={() => setActiveFeature(i)}
              className={`relative p-8 rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden
                ${activeFeature === i
                  ? "bg-[#6c63ff]/8 border-[#6c63ff]/30 -translate-y-1 shadow-[0_20px_60px_rgba(108,99,255,0.1)]"
                  : "bg-white/3 border-white/6 hover:bg-[#6c63ff]/8 hover:border-[#6c63ff]/30 hover:-translate-y-1"
                }`}
            >
              {(activeFeature === i) && (
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#6c63ff]/50 to-transparent" />
              )}
              <div className="text-3xl mb-4 bg-linear-to-br from-[#6c63ff] to-[#a855f7] bg-clip-text text-transparent font-black">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2.5 tracking-tight">{f.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-10 bg-white/1 border-t border-white/4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#6c63ff]/12 border border-[#6c63ff]/25 rounded-full px-4 py-2 text-xs font-medium text-violet-400 mb-5">
            <span className="badge-dot w-1.5 h-1.5 rounded-full bg-[#6c63ff] shadow-[0_0_8px_#6c63ff]" />
            Simple 3-step process
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-1px] mb-16">
            From blank page to <span className="shimmer-text">hired</span> in minutes
          </h2>

          {steps.map((step, i) => (
            <div key={step.n}>
              <div className="flex gap-6 text-left items-start">
                <div className="min-w-13 h-13 rounded-2xl bg-linear-to-br from-[#6c63ff] to-[#a855f7] flex items-center justify-center text-xs font-black shrink-0">
                  {step.n}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold mb-2">{step.t}</h3>
                  <p className="text-white/45 leading-relaxed">{step.d}</p>
                </div>
              </div>
              {i < 2 && (
                <div className="w-px h-14 bg-linear-to-b from-[#6c63ff]/50 to-transparent ml-6.25 my-6" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-10 text-center relative overflow-hidden">
        <div className="float-1 absolute w-150 h-150 rounded-full pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black tracking-[-1.5px] leading-[1.1] mb-6">
            Your dream job is{" "}
            <br />
            <span className="shimmer-text">one resume away.</span>
          </h2>
          <p className="text-white/40 text-lg mb-10">Start free. No credit card. No fluff. Just results.</p>
          <button className="px-14 py-5 text-lg font-bold rounded-xl bg-linear-to-r from-[#6c63ff] to-[#a855f7] hover:-translate-y-0.5 glow-btn-hover transition-all">
            Create My Resume Now →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 px-10 py-12 flex flex-wrap justify-between items-center gap-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-linear-to-br from-[#6c63ff] to-[#a855f7] flex items-center justify-center text-sm font-black">M</div>
          <span className="font-black text-sm">MyGresume</span>
        </div>
        <div className="flex gap-7">
          {["Privacy", "Terms", "Contact", "Blog"].map((l) => (
            <a key={l} className="text-white/60 text-xs font-medium hover:text-white transition-colors cursor-pointer">{l}</a>
          ))}
        </div>
        <p className="text-xs text-white/20">© 2026 MyGresume. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;