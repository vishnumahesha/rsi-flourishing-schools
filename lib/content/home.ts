import {
  BarChart3,
  Compass,
  Sparkles,
  Upload,
  Users,
  GraduationCap,
  ClipboardList,
  Repeat,
  LineChart,
  School,
  UserCog,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export interface ProblemCard {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const problemCards: ProblemCard[] = [
  {
    icon: BarChart3,
    title: "Measure more than academics",
    body: "Test scores capture only part of how students are developing. Schools need a fuller picture of flourishing, character, and community life.",
  },
  {
    icon: Compass,
    title: "Understand strengths and growth areas",
    body: "Flourishing and character skills can be measured. The challenge is turning a report full of findings into a clear set of priorities.",
  },
  {
    icon: Sparkles,
    title: "Turn insight into practice",
    body: "Data becomes useful when educators can translate it into evidence-based, school-specific action — and reflect on what actually works.",
  },
];

export type ProcessIconKey =
  | "upload"
  | "sparkles"
  | "users"
  | "graduation"
  | "clipboard"
  | "repeat";

export interface ProcessStep {
  icon: ProcessIconKey;
  step: string;
  title: string;
  body: string;
}

export const processSteps: ProcessStep[] = [
  {
    icon: "upload",
    step: "01",
    title: "Upload reports and goals",
    body: "Schools add their Flourishing Schools report alongside mission, values, well-being, SEL, and character priorities.",
  },
  {
    icon: "sparkles",
    step: "02",
    title: "Generate AI-supported analysis",
    body: "The platform cross-references goals with report findings to surface strengths, growth areas, and candidate interventions.",
  },
  {
    icon: "users",
    step: "03",
    title: "Review in an RSI hybrid workshop",
    body: "School teams and RSI facilitators review the draft analysis together and select priority areas for growth.",
  },
  {
    icon: "graduation",
    step: "04",
    title: "Join monthly professional development",
    body: "Across the academic year, educators meet in person at their school and virtually with the RSI research team.",
  },
  {
    icon: "clipboard",
    step: "05",
    title: "Implement flourishing initiatives",
    body: "Educators adapt or create evidence-based interventions and put them into practice in their own context.",
  },
  {
    icon: "repeat",
    step: "06",
    title: "Reflect, adapt, and improve",
    body: "Structured reflection captures impact, informs adaptation, and builds toward long-term improvement.",
  },
];

export interface AudiencePath {
  icon: LucideIcon;
  title: string;
  description: string;
  actions: string[];
  cta: { label: string; href: string };
}

export const audiencePaths: AudiencePath[] = [
  {
    icon: School,
    title: "School Leaders",
    description:
      "Apply, build your school profile, upload reports, and steer school-wide priorities and progress.",
    actions: [
      "Upload reports, mission, and goals",
      "Review AI-supported analysis",
      "Invite and manage your team",
      "Track implementation progress",
    ],
    cta: { label: "Enter admin portal", href: "/dashboard/admin" },
  },
  {
    icon: GraduationCap,
    title: "Teachers",
    description:
      "Access monthly sessions, search curated interventions, plan, and reflect on what you implement.",
    actions: [
      "View PD session materials",
      "Search evidence-based resources",
      "Build and adapt intervention plans",
      "Keep a reflection journal",
    ],
    cta: { label: "Enter teacher hub", href: "/dashboard/teacher" },
  },
  {
    icon: Users,
    title: "School Teams",
    description:
      "Collaborate on priority areas, plan initiatives together, and prepare for monthly RSI sessions.",
    actions: [
      "Share goals and priority areas",
      "Plan on a flourishing Kanban board",
      "Capture in-person meeting notes",
      "Summarize reflections as a team",
    ],
    cta: { label: "View team workspace", href: "/dashboard/team" },
  },
  {
    icon: UserCog,
    title: "RSI Facilitators",
    description:
      "Review applications and reports, guide priority selection, run PD, and support schools across the year.",
    actions: [
      "Review applications and analyses",
      "Add facilitator notes",
      "Manage PD sessions and resources",
      "Monitor progress across schools",
    ],
    cta: { label: "Open facilitator dashboard", href: "/dashboard/facilitator" },
  },
  {
    icon: BookOpen,
    title: "Public Resource Users",
    description:
      "Any educator, anywhere, can explore curated, evidence-informed resources on flourishing in schools.",
    actions: [
      "Browse the public library",
      "Filter by grade, domain, and skill",
      "Read practical implementation steps",
      "Learn about the Flourishing Schools Project",
    ],
    cta: { label: "Explore public resources", href: "/resources" },
  },
];

export const impactOutcomes: { title: string; body: string }[] = [
  {
    title: "Clearer understanding of student flourishing",
    body: "Move from anecdote to a shared, evidence-informed picture of how students are really doing.",
  },
  {
    title: "Better alignment with school goals",
    body: "Connect survey findings directly to the mission, values, and priorities a school already holds.",
  },
  {
    title: "Evidence-based intervention planning",
    body: "Translate priorities into concrete, curated practices adapted to each classroom and context.",
  },
  {
    title: "Stronger teacher collaboration",
    body: "Give educators a shared workspace, language, and rhythm for improving flourishing together.",
  },
  {
    title: "Structured reflection",
    body: "Make reflection a routine, not an afterthought, so learning compounds across the year.",
  },
  {
    title: "Long-term improvement",
    body: "Re-measure over time to track growth and sustain a culture of flourishing.",
  },
];

export const trustPoints: string[] = [
  "Grounded in the Flourishing Schools Project",
  "Professional development led by Research Schools International",
  "Evidence-based, human-reviewed practice",
];
