import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Users,
  FileText,
  ClipboardList,
  NotebookPen,
  MessageSquare,
  KanbanSquare,
  CalendarDays,
  School,
  StickyNote,
  type LucideIcon,
} from "lucide-react";

export interface DashNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface DashNavSection {
  heading: string;
  items: DashNavItem[];
}

const NAV: Record<string, DashNavSection[]> = {
  applicant: [
    {
      heading: "Application",
      items: [
        { label: "Overview", href: "/dashboard/applicant", icon: LayoutDashboard },
      ],
    },
  ],
  school_admin: [
    {
      heading: "School",
      items: [
        { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
        { label: "AI Analysis", href: "/dashboard/admin/analysis", icon: Sparkles },
        { label: "Growth Plan", href: "/dashboard/admin/plan", icon: ClipboardList },
      ],
    },
    {
      heading: "Resources & People",
      items: [
        { label: "Resources", href: "/dashboard/admin/resources", icon: BookOpen },
        { label: "Team", href: "/dashboard/admin/team", icon: Users },
        { label: "Documents", href: "/dashboard/admin/documents", icon: FileText },
      ],
    },
  ],
  teacher: [
    {
      heading: "Teaching",
      items: [
        { label: "Overview", href: "/dashboard/teacher", icon: LayoutDashboard },
        { label: "Resources", href: "/dashboard/teacher/resources", icon: BookOpen },
        { label: "Reflections", href: "/dashboard/teacher/reflections", icon: NotebookPen },
        { label: "AI Coach", href: "/dashboard/teacher/coach", icon: MessageSquare },
      ],
    },
  ],
  school_team_member: [
    {
      heading: "Team",
      items: [
        { label: "Action Board", href: "/dashboard/team", icon: KanbanSquare },
        { label: "Discussion", href: "/dashboard/team/forum", icon: MessageSquare },
      ],
    },
  ],
  rsi_facilitator: [
    {
      heading: "Facilitation",
      items: [
        { label: "Cohort", href: "/dashboard/facilitator", icon: LayoutDashboard },
        { label: "Schools", href: "/dashboard/facilitator/schools", icon: School },
        { label: "Sessions", href: "/dashboard/facilitator/sessions", icon: CalendarDays },
        { label: "Notes", href: "/dashboard/facilitator/notes", icon: StickyNote },
      ],
    },
  ],
};
NAV.platform_admin = NAV.rsi_facilitator;

export function getDashboardNav(role?: string | null): DashNavSection[] {
  return NAV[role ?? ""] ?? NAV.school_admin;
}

/** Infer the role from a dashboard path (used for demo previews w/o auth). */
export function inferRoleFromPath(pathname: string): string | null {
  if (pathname.startsWith("/dashboard/applicant")) return "applicant";
  if (pathname.startsWith("/dashboard/admin")) return "school_admin";
  if (pathname.startsWith("/dashboard/teacher")) return "teacher";
  if (pathname.startsWith("/dashboard/team")) return "school_team_member";
  if (pathname.startsWith("/dashboard/facilitator")) return "rsi_facilitator";
  return null;
}
