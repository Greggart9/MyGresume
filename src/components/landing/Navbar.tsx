"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { FileText, Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(8,8,8,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid #1f1f1f" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96d)" }}>
            <FileText className="w-4 h-4 text-black" />
          </div>
          <span className="font-bold text-lg" style={{ fontFamily: "Syne, sans-serif", color: "#f0ede8" }}>
            MyGresume
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Features", href: "#features" },
            { label: "How it works", href: "#how-it-works" },
            { label: "History", href: "/history" },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm transition-colors"
              style={{ color: "#6b6b6b" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f0ede8")}
              onMouseLeave={e => (e.currentTarget.style.color = "#6b6b6b")}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/tailor">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #c9a84c, #e8c96d)",
                color: "#080808",
                fontFamily: "Syne, sans-serif",
              }}
            >
              Get Started
            </motion.button>
          </Link>
        </div>

        {/* Mobile menu */}
        <button
          className="md:hidden"
          style={{ color: "#f0ede8" }}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden px-6 pb-6 pt-2 space-y-4"
          style={{ background: "rgba(8,8,8,0.98)" }}
        >
          {["Features", "How it works", "History"].map(item => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="block text-sm"
              style={{ color: "#6b6b6b" }}
              onClick={() => setOpen(false)}
            >
              {item}
            </Link>
          ))}
          <Link href="/tailor">
            <button
              className="w-full py-2.5 rounded-lg text-sm font-semibold mt-2"
              style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96d)", color: "#080808" }}
            >
              Get Started
            </button>
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}