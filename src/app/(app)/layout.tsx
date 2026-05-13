"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, FileSearch, Clock, Layers, Menu, X, ArrowLeft, Mail } from "lucide-react";


const navItems = [
  { label: "Tailor CV", href: "/tailor", icon: FileSearch },
  { label: "Cover Letter", href: "/cover-letter", icon: Mail },
  { label: "CV Builder", href: "/builder", icon: Layers },
  { label: "History", href: "/history", icon: Clock },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#080808" }}>
      {/* Top bar */}
      <header className="h-14 flex items-center justify-between px-6 shrink-0 sticky top-0 z-40"
        style={{ background: "rgba(8,8,8,0.95)", borderBottom: "1px solid #1f1f1f", backdropFilter: "blur(20px)" }}>

        {/* Left — Logo + back */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1.5 group">
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1"
              style={{ color: "#6b6b6b" }} />
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96d)" }}>
              <FileText className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="font-bold text-sm hidden sm:block"
              style={{ fontFamily: "Syne, sans-serif", color: "#f0ede8" }}>
              MyGresume
            </span>
          </Link>
        </div>

        {/* Center — Nav */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl"
          style={{ background: "#0f0f0f", border: "1px solid #1f1f1f" }}>
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: active ? "#2a2010" : "transparent",
                    color: active ? "#c9a84c" : "#6b6b6b",
                    fontFamily: "Syne, sans-serif",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          style={{ color: "#6b6b6b" }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Right — spacer for desktop */}
        <div className="hidden md:block w-32" />
      </header>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden px-4 py-3 space-y-1 sticky top-14 z-30"
          style={{ background: "#0f0f0f", borderBottom: "1px solid #1f1f1f" }}
        >
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                style={{ color: pathname === href ? "#c9a84c" : "#6b6b6b" }}>
                <Icon className="w-4 h-4" />
                {label}
              </div>
            </Link>
          ))}
        </motion.div>
      )}

      {/* Page content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}