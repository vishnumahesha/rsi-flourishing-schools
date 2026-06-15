export interface BlogPost {
  slug: string;
  title: string;
  author: string;
  date: string;
  category: string;
  summary: string;
  featured?: boolean;
}

export const blogCategories = [
  "All",
  "Research updates",
  "Program updates",
  "School stories",
  "Evidence-based practices",
  "Events",
] as const;

export const blogPosts: BlogPost[] = [
  {
    slug: "flourishing-schools-project-launch",
    title: "Introducing the Flourishing Schools Project",
    author: "Christina Hinton",
    date: "2026-05-20",
    category: "Program updates",
    summary:
      "An overview of the Flourishing Schools survey, the reports schools receive, and the optional RSI professional development that follows.",
    featured: true,
  },
  {
    slug: "three-pillar-framework",
    title: "Why flourishing needs more than one metric",
    author: "RSI Research Team",
    date: "2026-05-12",
    category: "Research updates",
    summary:
      "A short introduction to the three-pillar framework for education for flourishing and what it means for assessment.",
  },
  {
    slug: "belonging-in-practice",
    title: "Belonging in practice: small routines, real impact",
    author: "RSI Research Team",
    date: "2026-04-28",
    category: "Evidence-based practices",
    summary:
      "How simple, consistent classroom routines can strengthen students' sense of belonging over time.",
  },
  {
    slug: "from-report-to-action",
    title: "From report to action: what the hybrid workshop looks like",
    author: "RSI Research Team",
    date: "2026-04-15",
    category: "Program updates",
    summary:
      "A look inside the workshop where schools map findings onto their goals and choose priority areas for growth.",
  },
  {
    slug: "spring-webinar-recap",
    title: "Recap: Flourishing Schools launch webinar",
    author: "RSI Research Team",
    date: "2026-05-30",
    category: "Events",
    summary:
      "Highlights and takeaways from the May 2026 launch webinar on measuring and supporting flourishing.",
  },
  {
    slug: "reflection-that-sticks",
    title: "Designing reflection that actually sticks",
    author: "RSI Research Team",
    date: "2026-04-02",
    category: "Evidence-based practices",
    summary:
      "Why structured, routine reflection helps educator learning compound across an academic year.",
  },
];
