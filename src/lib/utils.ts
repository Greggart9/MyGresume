import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return uuidv4();
}

export function formatDate(dateString: string): string {
  if (!dateString || dateString.trim() === "") return "";
  if (/present/i.test(dateString)) return "Present";
  if (/^\d{4}-\d{2}$/.test(dateString)) {
    const [year, month] = dateString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }
  if (/^\d{4}$/.test(dateString)) return dateString;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function abbreviate(str: string): string {
  return str.split(/[\s_-]+/).filter(Boolean).map(w => w[0].toUpperCase()).join("");
}

export function generateFileName(jobTitle: string, company: string, type: "resume" | "cover-letter"): string {
  const title = abbreviate(jobTitle || "Resume");
  const comp = (company || "").replace(/\s+/g, "").slice(0, 12);
  const suffix = type === "cover-letter" ? "CoverLetter" : "Resume";
  return comp ? `${title}_${comp}_${suffix}` : `${title}_${suffix}`;
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "..." : str;
}