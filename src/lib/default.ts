import { ResumeData, CoverLetterData } from "@/types";
import { generateId } from "./utils";

export function createEmptyResume(): ResumeData {
  return {
    id: generateId(),
    personalInfo: {
      fullName: "", email: "", phone: "",
      location: "", linkedin: "", website: "", jobTitle: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    template: "professional",
    colorTheme: "gold",
    targetJobTitle: "",
    targetCompany: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createEmptyCoverLetter(): CoverLetterData {
  return {
    id: generateId(),
    recipientName: "",
    companyName: "",
    jobTitle: "",
    content: "",
    createdAt: new Date().toISOString(),
  };
}