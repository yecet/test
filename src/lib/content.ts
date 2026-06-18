import { readFileSync } from "fs";
import { join } from "path";
import type {
  Profile,
  Course,
  Material,
  Announcement,
  Publication,
  ResearchData,
} from "./types";

const contentDir = join(process.cwd(), "content");

function readJSON<T>(filename: string): T {
  const filePath = join(contentDir, filename);
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function getProfile(): Profile {
  return readJSON<Profile>("profile.json");
}

export function getCourses(): Course[] {
  return readJSON<Course[]>("courses.json");
}

export function getMaterials(): Material[] {
  return readJSON<Material[]>("materials.json");
}

export function getAnnouncements(): Announcement[] {
  return readJSON<Announcement[]>("announcements.json");
}

export function getPublications(): Publication[] {
  return readJSON<Publication[]>("publications.json");
}

export function getResearch(): ResearchData {
  return readJSON<ResearchData>("research.json");
}
