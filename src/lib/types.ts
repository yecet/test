// ---- Profile ----
export interface Education {
  degree: string;
  field: string;
  university: string;
  year: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface Social {
  googleScholar: string;
  researchGate: string;
  linkedin: string;
  github: string;
  orcid: string;
}

export interface Stats {
  publications: number;
  courses: number;
  students: number;
  yearsExperience: number;
}

export interface Profile {
  name: string;
  title: string;
  department: string;
  university: string;
  email: string;
  office: string;
  officeHours: string;
  phone: string;
  shortBio: string;
  bio: string;
  education: Education[];
  skills: string[];
  languages: Language[];
  social: Social;
  stats: Stats;
}

// ---- Course ----
export interface WeeklyPlanItem {
  week: number;
  topic: string;
}

export interface Course {
  slug: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  semester: string;
  level: "Lisans" | "Yüksek Lisans";
  prerequisites: string[];
  objectives: string[];
  weeklyPlan: WeeklyPlanItem[];
  active: boolean;
}

// ---- Material ----
export type MaterialType =
  | "ders-notu"
  | "slayt"
  | "odev"
  | "lab"
  | "sinav"
  | "kaynak";

export interface Material {
  id: string;
  courseSlug: string;
  title: string;
  description: string;
  week: number | null;
  type: MaterialType;
  fileUrl: string;
  fileSize: string;
  uploadedAt: string;
}

// ---- Announcement ----
export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  relatedCourse: string | null;
  important: boolean;
}

// ---- Publication ----
export type PublicationType =
  | "journal"
  | "conference"
  | "book-chapter"
  | "thesis"
  | "preprint";

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: PublicationType;
  doi?: string;
  url?: string;
  keywords: string[];
  abstract?: string;
}

// ---- Research ----
export interface ResearchArea {
  id: string;
  title: string;
  description: string;
  icon: string;
  topics: string[];
  relatedPublications: string[];
}

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "planned";
  startYear: number;
  endYear?: number;
  funding?: string;
  collaborators?: string[];
  areaId: string;
}

export interface ResearchData {
  areas: ResearchArea[];
  projects: ResearchProject[];
}
