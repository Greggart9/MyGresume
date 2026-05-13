export type ResumeTemplate = "professional";

export type ColorTheme = "gold";

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
  colorTheme: ColorTheme;
  targetJobTitle?: string;
  targetCompany?: string;
  rawSections?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface CoverLetterData {
  id: string;
  resumeId?: string;
  recipientName: string;
  companyName: string;
  jobTitle: string;
  content: string;
  createdAt: string;
}