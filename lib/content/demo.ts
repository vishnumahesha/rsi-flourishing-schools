/**
 * Demonstration data for dashboard previews.
 * Clearly fictional. Replace with live Supabase queries in production.
 * No real people, schools, or research citations are represented here.
 */

export const demoSchool = {
  name: "Riverbend Community School",
  type: "Public · K–8",
  cohort: "Spring Cohort 2026",
  enrollment: 540,
  educators: 38,
  startedOn: "2026-02-03",
};

export const demoGrowthAreas = [
  {
    domain: "belonging",
    title: "Strengthen belonging in middle grades",
    progress: 62,
    status: "In progress",
  },
  {
    domain: "staff_capacity",
    title: "Build staff capacity for reflection",
    progress: 40,
    status: "In progress",
  },
  {
    domain: "student_wellbeing",
    title: "Embed well-being routines schoolwide",
    progress: 18,
    status: "Planning",
  },
];

export const demoTeam = [
  { name: "Maya Thompson", role: "school_admin", title: "Principal", initials: "MT" },
  { name: "Devin Park", role: "teacher", title: "5th Grade Lead", initials: "DP" },
  { name: "Aisha Bello", role: "teacher", title: "Humanities", initials: "AB" },
  { name: "Carlos Núñez", role: "school_team_member", title: "Counselor", initials: "CN" },
  { name: "Priya Anand", role: "school_team_member", title: "SEL Coordinator", initials: "PA" },
];

export const demoDocuments = [
  { name: "School Mission Statement.pdf", category: "Mission statement", uploaded: "2026-02-04", size: "210 KB" },
  { name: "Wellbeing Program Overview.docx", category: "Well-being program", uploaded: "2026-02-05", size: "88 KB" },
  { name: "2025 Flourishing Report.pdf", category: "Flourishing report", uploaded: "2026-02-06", size: "1.4 MB" },
];

export const demoSessions = [
  { title: "Kickoff: Mapping your flourishing baseline", date: "2026-02-10", facilitator: "RSI Facilitator", status: "Completed" },
  { title: "Workshop: Belonging routines that scale", date: "2026-03-12", facilitator: "RSI Facilitator", status: "Completed" },
  { title: "Coaching: Reflection practices for staff", date: "2026-06-22", facilitator: "RSI Facilitator", status: "Upcoming" },
  { title: "Review: Mid-cycle signals & next steps", date: "2026-07-15", facilitator: "RSI Facilitator", status: "Upcoming" },
];

export type TaskStatus = "backlog" | "in_progress" | "review" | "done";
export const taskColumns: { key: TaskStatus; label: string }[] = [
  { key: "backlog", label: "Backlog" },
  { key: "in_progress", label: "In Progress" },
  { key: "review", label: "Review" },
  { key: "done", label: "Done" },
];

export const demoTasks: {
  id: string;
  title: string;
  owner: string;
  domain: string;
  status: TaskStatus;
}[] = [
  { id: "t1", title: "Pilot morning belonging circles in 5th grade", owner: "DP", domain: "belonging", status: "in_progress" },
  { id: "t2", title: "Draft staff reflection protocol", owner: "PA", domain: "staff_capacity", status: "in_progress" },
  { id: "t3", title: "Schedule well-being routine planning block", owner: "MT", domain: "student_wellbeing", status: "backlog" },
  { id: "t4", title: "Collect baseline reflections from advisory", owner: "AB", domain: "belonging", status: "review" },
  { id: "t5", title: "Share gratitude journaling guide with team", owner: "CN", domain: "student_wellbeing", status: "backlog" },
  { id: "t6", title: "Run kickoff session debrief", owner: "MT", domain: "staff_capacity", status: "done" },
];

export const demoReflections = [
  {
    id: "r1",
    date: "2026-06-09",
    prompt: "What did you notice after this week's belonging circle?",
    body: "Students who usually stay quiet volunteered to share. The talking-piece routine seems to lower the stakes. Next week I want to try a connecting prompt about weekend highs and lows.",
  },
  {
    id: "r2",
    date: "2026-06-02",
    prompt: "Where did you see a small win in student well-being?",
    body: "Two students used the calm corner without prompting. The visual routine on the wall is starting to stick.",
  },
];

export const demoThreads = [
  {
    id: "th1",
    title: "How are you keeping belonging circles short?",
    author: "Devin Park",
    replies: 4,
    lastActivity: "2026-06-11",
    excerpt: "Mine keep running long. Curious how others time the check-out.",
  },
  {
    id: "th2",
    title: "Staff reflection — voluntary or expected?",
    author: "Priya Anand",
    replies: 6,
    lastActivity: "2026-06-10",
    excerpt: "Trying to find the balance so it feels supportive, not like a task.",
  },
  {
    id: "th3",
    title: "Sharing our calm-corner visuals",
    author: "Carlos Núñez",
    replies: 2,
    lastActivity: "2026-06-08",
    excerpt: "Posted the printables we used. Feedback welcome before we roll out wider.",
  },
];

export const demoCohort = [
  { name: "Riverbend Community School", stage: "Implementation", progress: 62, educators: 38, flag: "On track" },
  { name: "Northgate Academy", stage: "Planning", progress: 24, educators: 21, flag: "Needs check-in" },
  { name: "Maple Grove Elementary", stage: "Implementation", progress: 48, educators: 16, flag: "On track" },
  { name: "Harbor View Middle", stage: "Onboarding", progress: 10, educators: 27, flag: "New" },
];

export const demoFacilitatorNotes = [
  { id: "n1", school: "Northgate Academy", date: "2026-06-09", note: "Leadership transition slowing momentum. Suggested a lighter first practice to rebuild trust before scaling." },
  { id: "n2", school: "Riverbend Community School", date: "2026-06-07", note: "Strong teacher buy-in on belonging circles. Ready to add a second domain next cycle." },
];

export const demoApplication = {
  status: "under_review",
  submittedOn: "2026-06-01",
  school: "Riverbend Community School",
  steps: [
    { label: "Application submitted", done: true, date: "2026-06-01" },
    { label: "Initial review by RSI", done: true, date: "2026-06-04" },
    { label: "Facilitator interview", done: false, date: "Scheduled 2026-06-20" },
    { label: "Cohort placement", done: false, date: "Pending" },
  ],
};
