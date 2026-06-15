export const ROLES = {
  PUBLIC: "public_user",
  APPLICANT: "applicant",
  SCHOOL_ADMIN: "school_admin",
  TEACHER: "teacher",
  TEAM: "school_team_member",
  FACILITATOR: "rsi_facilitator",
  PLATFORM_ADMIN: "platform_admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<string, string> = {
  public_user: "Public",
  applicant: "Applicant",
  school_admin: "School Administrator",
  teacher: "Teacher",
  school_team_member: "School Team Member",
  rsi_facilitator: "RSI Facilitator",
  platform_admin: "Platform Admin",
};

export function dashboardPathForRole(role?: string | null): string {
  switch (role) {
    case "applicant":
      return "/dashboard/applicant";
    case "school_admin":
      return "/dashboard/admin";
    case "teacher":
      return "/dashboard/teacher";
    case "school_team_member":
      return "/dashboard/team";
    case "rsi_facilitator":
    case "platform_admin":
      return "/dashboard/facilitator";
    default:
      return "/dashboard/applicant";
  }
}
