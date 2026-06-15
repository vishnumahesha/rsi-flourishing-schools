import type { ResourceItem } from "@/types";

/**
 * Curated public resource library (seed/demo content).
 * Citations are intentionally placeholders — do NOT present as real sources.
 * Replace `sourceCitation` with verified references before production.
 */
export const resources: ResourceItem[] = [
  {
    slug: "morning-belonging-circles",
    title: "Morning Belonging Circles",
    summary:
      "A short, structured advisory routine that builds connection and a sense of belonging at the start of each day.",
    domains: ["belonging", "community_wellbeing", "sel"],
    characterSkills: ["empathy", "social awareness"],
    gradeLevels: ["Elementary", "Middle School"],
    subjectAreas: ["Advisory / Homeroom"],
    targetAudience: ["Teachers", "School Teams"],
    interventionType: "Classroom routine",
    timeRequired: "10–15 min daily",
    evidenceStrength: "promising",
    implementationDifficulty: "low",
    public: true,
    sourceCitation: "Placeholder citation",
    overview:
      "Belonging circles give every student a brief, predictable moment to be seen and heard. Teachers open with a connecting prompt, invite voluntary shares, and close with a shared intention for the day. Over time the routine strengthens peer relationships and classroom climate.",
    practicalSteps: [
      "Arrange seating so every student can see one another.",
      "Open with a low-stakes connecting question.",
      "Use a talking piece to structure voluntary sharing.",
      "Close with a one-word check-out or shared intention.",
      "Keep timing tight and consistent each day.",
    ],
    relatedResearch:
      "Aligns with research on belonging and classroom climate as supports for student flourishing. Placeholder citation.",
  },
  {
    slug: "gratitude-journaling-practice",
    title: "Weekly Gratitude Journaling",
    summary:
      "A brief reflective writing practice that supports emotional well-being and a habit of noticing the good.",
    domains: ["student_wellbeing", "character_skills"],
    characterSkills: ["gratitude", "reflection"],
    gradeLevels: ["Middle School", "High School"],
    subjectAreas: ["Advisory / Homeroom", "Humanities"],
    targetAudience: ["Teachers"],
    interventionType: "Reflection exercise",
    timeRequired: "10 min weekly",
    evidenceStrength: "established",
    implementationDifficulty: "low",
    public: true,
    sourceCitation: "Placeholder citation",
    overview:
      "Students set aside a few minutes each week to write about people, moments, or experiences they are grateful for. The practice is most effective when it is specific, voluntary, and free from grading pressure.",
    practicalSteps: [
      "Provide a consistent weekly time and quiet space.",
      "Offer specific prompts rather than generic ones.",
      "Emphasize depth over length — two or three specific entries.",
      "Keep entries private unless students choose to share.",
      "Model the practice as an educator.",
    ],
    relatedResearch:
      "Connected to well-being research on gratitude practices in school settings. Placeholder citation.",
  },
  {
    slug: "purpose-mapping-unit",
    title: "Purpose Mapping Mini-Unit",
    summary:
      "A short interdisciplinary unit helping older students connect learning to a sense of purpose and contribution.",
    domains: ["purpose", "character_skills", "cognitive_virtues"],
    characterSkills: ["purpose", "self-reflection"],
    gradeLevels: ["High School"],
    subjectAreas: ["Humanities", "Cross-curricular"],
    targetAudience: ["Teachers", "School Teams"],
    interventionType: "Unit / project",
    timeRequired: "2–3 weeks",
    evidenceStrength: "promising",
    implementationDifficulty: "moderate",
    public: true,
    sourceCitation: "Placeholder citation",
    overview:
      "Students explore what matters to them, identify problems they care about, and connect their strengths to ways they might contribute. The unit culminates in a personal purpose statement and a small action step.",
    practicalSteps: [
      "Begin with reflection on personal strengths and values.",
      "Introduce real-world problems relevant to students.",
      "Facilitate connections between strengths and contribution.",
      "Support drafting of a personal purpose statement.",
      "Close with a concrete, achievable action step.",
    ],
    relatedResearch:
      "Draws on research linking purpose to motivation and well-being in adolescence. Placeholder citation.",
  },
  {
    slug: "restorative-conversations",
    title: "Restorative Conversation Protocols",
    summary:
      "Simple restorative scripts that help repair relationships and build accountability after conflict.",
    domains: ["community_wellbeing", "sel", "school_culture"],
    characterSkills: ["empathy", "accountability"],
    gradeLevels: ["Middle School", "High School", "Whole School"],
    subjectAreas: ["Advisory / Homeroom", "Cross-curricular"],
    targetAudience: ["Teachers", "School Teams", "School Leaders"],
    interventionType: "Practice / protocol",
    timeRequired: "15–30 min as needed",
    evidenceStrength: "established",
    implementationDifficulty: "moderate",
    public: true,
    sourceCitation: "Placeholder citation",
    overview:
      "Restorative conversations replace purely punitive responses with structured dialogue that repairs harm. Educators use consistent questions to help students understand impact, take responsibility, and agree on repair.",
    practicalSteps: [
      "Establish a calm, private setting.",
      "Use consistent restorative questions for each party.",
      "Focus on impact and needs rather than blame.",
      "Co-create a concrete plan to repair harm.",
      "Follow up to confirm the agreement held.",
    ],
    relatedResearch:
      "Aligned with restorative-practice literature on school climate. Placeholder citation.",
  },
  {
    slug: "character-strengths-spotting",
    title: "Character Strengths Spotting",
    summary:
      "A lightweight classroom habit of naming and affirming character strengths as they appear in real work.",
    domains: ["character_skills", "student_wellbeing"],
    characterSkills: ["perseverance", "kindness", "curiosity"],
    gradeLevels: ["Elementary", "Middle School"],
    subjectAreas: ["Cross-curricular"],
    targetAudience: ["Teachers"],
    interventionType: "Classroom routine",
    timeRequired: "Embedded, ongoing",
    evidenceStrength: "promising",
    implementationDifficulty: "low",
    public: true,
    sourceCitation: "Placeholder citation",
    overview:
      "Teachers notice and name specific character strengths students demonstrate during ordinary classroom moments. Specific, genuine affirmation helps students build a strengths-based identity.",
    practicalSteps: [
      "Introduce a shared vocabulary of character strengths.",
      "Watch for authentic moments strengths appear.",
      "Name the strength specifically and sincerely.",
      "Invite students to spot strengths in peers.",
      "Avoid empty or generic praise.",
    ],
    relatedResearch:
      "Informed by strengths-based approaches to character development. Placeholder citation.",
  },
  {
    slug: "epistemic-curiosity-routines",
    title: "Curiosity & Questioning Routines",
    summary:
      "Thinking routines that strengthen intellectual curiosity and good epistemic habits across subjects.",
    domains: ["cognitive_virtues", "epistemic_virtues"],
    characterSkills: ["curiosity", "open-mindedness", "intellectual humility"],
    gradeLevels: ["Middle School", "High School"],
    subjectAreas: ["STEM", "Humanities", "Cross-curricular"],
    targetAudience: ["Teachers"],
    interventionType: "Thinking routine",
    timeRequired: "5–10 min per lesson",
    evidenceStrength: "promising",
    implementationDifficulty: "low",
    public: true,
    sourceCitation: "Placeholder citation",
    overview:
      "Short, repeatable routines prompt students to ask better questions, weigh evidence, and stay open to revising their views. The habits transfer across content areas.",
    practicalSteps: [
      "Open lessons with a 'what makes you curious?' prompt.",
      "Use a see–think–wonder structure for new material.",
      "Ask students to identify what evidence would change their mind.",
      "Normalize revising views in light of evidence.",
      "Celebrate good questions, not just correct answers.",
    ],
    relatedResearch:
      "Connected to research on intellectual virtues and inquiry. Placeholder citation.",
  },
  {
    slug: "staff-wellbeing-checkins",
    title: "Staff Well-being Check-ins",
    summary:
      "A structured peer check-in format that supports educator well-being and sustainable capacity.",
    domains: ["staff_capacity", "community_wellbeing"],
    characterSkills: ["self-awareness", "collegiality"],
    gradeLevels: ["Whole School"],
    subjectAreas: ["Cross-curricular"],
    targetAudience: ["School Leaders", "School Teams"],
    interventionType: "Staff practice",
    timeRequired: "20 min, biweekly",
    evidenceStrength: "emerging",
    implementationDifficulty: "low",
    public: true,
    sourceCitation: "Placeholder citation",
    overview:
      "Educators meet briefly in pairs or small groups to check in on workload, well-being, and support needs. Leaders use themes (not individual details) to inform decisions that protect staff capacity.",
    practicalSteps: [
      "Pair staff into consistent check-in partners.",
      "Provide a simple, optional prompt set.",
      "Protect time so check-ins actually happen.",
      "Surface themes to leadership respectfully and anonymously.",
      "Act on recurring needs where feasible.",
    ],
    relatedResearch:
      "Informed by research on educator well-being and school capacity. Placeholder citation.",
  },
  {
    slug: "schoolwide-belonging-audit",
    title: "School-wide Belonging Audit",
    summary:
      "A team-based audit that maps where students do and do not feel they belong across the school day.",
    domains: ["belonging", "school_culture", "community_wellbeing"],
    characterSkills: ["social awareness"],
    gradeLevels: ["Whole School"],
    subjectAreas: ["Cross-curricular"],
    targetAudience: ["School Leaders", "School Teams"],
    interventionType: "School-wide initiative",
    timeRequired: "Multi-week project",
    evidenceStrength: "promising",
    implementationDifficulty: "high",
    public: true,
    sourceCitation: "Placeholder citation",
    overview:
      "A school team maps moments and spaces across the day where belonging is strong or fragile, then designs targeted improvements. The audit pairs well with survey findings on belonging.",
    practicalSteps: [
      "Assemble a representative school team.",
      "Map the student day across spaces and transitions.",
      "Gather student voice on where they feel they belong.",
      "Identify two or three high-leverage moments to improve.",
      "Pilot changes and re-check with students.",
    ],
    relatedResearch:
      "Pairs with belonging measures in the Flourishing Schools survey. Placeholder citation.",
  },
];

export function getResource(slug: string) {
  return resources.find((r) => r.slug === slug);
}

export const evidenceLabels: Record<string, string> = {
  emerging: "Emerging evidence",
  promising: "Promising evidence",
  established: "Established evidence",
  strong: "Strong evidence",
};

export const difficultyLabels: Record<string, string> = {
  low: "Low lift",
  moderate: "Moderate lift",
  high: "Higher lift",
};
