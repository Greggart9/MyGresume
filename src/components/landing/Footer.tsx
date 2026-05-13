import Link from "next/link";
import { FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-10 relative"
      style={{ borderTop: "1px solid #1f1f1f" }}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96d)" }}>
            <FileText className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="font-bold text-sm" style={{ fontFamily: "Syne, sans-serif", color: "#f0ede8" }}>
            MyGresume
          </span>
        </div>

        <p className="text-xs" style={{ color: "#6b6b6b" }}>
          © {new Date().getFullYear()} MyGresume. Built to help you land the job.
        </p>

        <div className="flex items-center gap-6">
          {[
              { label: "Tailor CV", href: "/tailor" },
              { label: "Cover Letter", href: "/cover-letter" },
              { label: "Builder", href: "/builder" },
              { label: "History", href: "/history" },
            ].map(item => (
              <Link key={item.label} href={item.href} className="text-xs transition-colors" style={{ color: "#6b6b6b" }}>
                {item.label}
              </Link>
            ))}
        </div>
      </div>
    </footer>
  );
}