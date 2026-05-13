export type ResumeTemplate = "modern" | "classic" | "minimal" | "executive" | "creative" | "ats" | "professional";

export type ResumeColorTheme = "emerald" | "blue" | "slate" | "rose" | "amber" | "violet";

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  jobTitle: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  category: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface ResumeData {
  id: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  template: ResumeTemplate;
  colorTheme: ResumeColorTheme;
  targetJobTitle?: string;
  targetCompany?: string;
  createdAt: string;
  updatedAt: string;
  atsScore?: number;
}

export interface CoverLetterData {
  id: string;
  resumeId?: string;
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  jobTitle: string;
  content: string;
  template: "professional" | "modern" | "minimal";
  createdAt: string;
  updatedAt: string;
}

export type BuilderStep =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "finalize";

  export interface ResumeData {
  // ... existing fields ...
  rawSections?: Record<string, string>; // stores sections as-is from PDF
}