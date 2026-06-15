export type { Role } from "@/lib/auth/roles";

export type EvidenceStrength = "emerging" | "promising" | "established" | "strong";
export type Difficulty = "low" | "moderate" | "high";

export interface ResourceItem {
  slug: string;
  title: string;
  summary: string;
  domains: string[];
  characterSkills: string[];
  gradeLevels: string[];
  subjectAreas: string[];
  targetAudience: string[];
  interventionType: string;
  timeRequired: string;
  evidenceStrength: EvidenceStrength;
  implementationDifficulty: Difficulty;
  public: boolean;
  sourceCitation: string;
  overview: string;
  practicalSteps: string[];
  relatedResearch: string;
}

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export const FLOURISHING_DOMAINS = [
  { value: "student_wellbeing", label: "Student Well-being" },
  { value: "character_skills", label: "Character Skills" },
  { value: "belonging", label: "Belonging" },
  { value: "purpose", label: "Purpose" },
  { value: "community_wellbeing", label: "Community Well-being" },
  { value: "cognitive_virtues", label: "Cognitive Virtues" },
  { value: "epistemic_virtues", label: "Epistemic Virtues" },
  { value: "sel", label: "Social-Emotional Learning" },
  { value: "school_culture", label: "School Culture" },
  { value: "staff_capacity", label: "Staff Capacity" },
] as const;

export const GRADE_LEVELS = [
  "Early Years",
  "Elementary",
  "Middle School",
  "High School",
  "Whole School",
] as const;

export const SUBJECT_AREAS = [
  "Advisory / Homeroom",
  "Humanities",
  "STEM",
  "Arts",
  "Physical Education",
  "Cross-curricular",
] as const;

export const PRIORITY_OUTCOMES = [
  "Student well-being",
  "Character skills",
  "Social-emotional learning",
  "Belonging",
  "Purpose",
  "Community well-being",
  "Cognitive and epistemic virtues",
  "Staff capacity",
  "School culture",
  "Evidence-based practice",
] as const;
