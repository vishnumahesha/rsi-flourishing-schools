import { z } from "zod";

export const applicationSchema = z.object({
  // Step 1 — School / network
  orgName: z.string().min(2, "Please enter your school or network name"),
  website: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
  country: z.string().min(2, "Country is required"),
  cityRegion: z.string().optional(),
  schoolType: z.string().min(1, "Select a school type"),
  studentCount: z.coerce.number().int().nonnegative().optional(),
  gradeLevels: z.array(z.string()).min(1, "Select at least one grade level"),
  contactName: z.string().min(2, "Contact name is required"),
  contactRole: z.string().min(2, "Contact role is required"),
  contactEmail: z.string().email("Enter a valid email"),
  contactPhone: z.string().optional(),

  // Step 2 — Background
  participatedInProject: z.enum(["yes", "no", "unsure"]),
  completedSurvey: z.enum(["yes", "no", "unsure"]),
  hasReport: z.enum(["yes", "no", "unsure"]),
  applicationType: z.enum(["single", "network"]),
  numberOfSchools: z.coerce.number().int().positive().optional(),

  // Step 3 — Goals
  schoolGoals: z.string().min(10, "Tell us a little about your goals"),
  existingPrograms: z.string().optional(),
  challenges: z.string().optional(),
  priorityOutcomes: z.array(z.string()).min(1, "Select at least one outcome"),

  // Step 4 — Team & commitment
  teamDescription: z.string().min(5, "Briefly describe who would participate"),
  estimatedEducators: z.coerce.number().int().positive().optional(),
  monthlyCommitment: z.boolean().refine((v) => v === true, {
    message: "Monthly participation is required for the program",
  }),
  inPersonConfirmed: z.boolean().optional(),
  schoolLeadName: z.string().min(2, "School lead name is required"),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export const stepFields: (keyof ApplicationInput)[][] = [
  [
    "orgName",
    "website",
    "country",
    "cityRegion",
    "schoolType",
    "studentCount",
    "gradeLevels",
    "contactName",
    "contactRole",
    "contactEmail",
    "contactPhone",
  ],
  ["participatedInProject", "completedSurvey", "hasReport", "applicationType", "numberOfSchools"],
  ["schoolGoals", "existingPrograms", "challenges", "priorityOutcomes"],
  ["teamDescription", "estimatedEducators", "monthlyCommitment", "inPersonConfirmed", "schoolLeadName"],
];

export const schoolTypes = [
  "Public",
  "Independent / Private",
  "Charter",
  "Faith-based",
  "International",
  "Network / Multi-school",
  "Other",
];

export const documentCategories = [
  { key: "flourishing_report", label: "Flourishing Schools report" },
  { key: "mission_statement", label: "School mission statement" },
  { key: "values", label: "School values" },
  { key: "wellbeing_program", label: "Well-being program description" },
  { key: "sel_program", label: "SEL program description" },
  { key: "character_education", label: "Character education materials" },
  { key: "strategic_plan", label: "Strategic plan" },
  { key: "school_improvement_plan", label: "School improvement plan" },
  { key: "other", label: "Other documents" },
];
