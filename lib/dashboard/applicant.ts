/**
 * Live data loader for the applicant dashboard.
 *
 * Queries AS THE SIGNED-IN USER via the anon key + session cookie, so RLS
 * restricts results to rows the submitter owns. Falls back to demoApplication
 * when Supabase is unconfigured, no session exists, or the user has no row.
 *
 * Steps are derived strictly from real status and real timestamps — no dates
 * are fabricated. Unknown or not-yet-reached dates are returned as "".
 */
import { createClient } from "@/lib/supabase/server";
import { demoApplication } from "@/lib/content/demo";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ApplicantStep = {
  label: string;
  done: boolean;
  date: string;
};

export type ApplicantOverview = {
  isDemo: boolean;
  statusLabel: string;
  school: string;
  submittedOn: string;
  steps: ApplicantStep[];
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "interview"
  | "accepted"
  | "declined"
  | "withdrawn";

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  interview: "Interview",
  accepted: "Accepted",
  declined: "Declined",
  withdrawn: "Withdrawn",
};

// Statuses that count as "past draft" (application submitted step is done)
const PAST_DRAFT: ApplicationStatus[] = [
  "submitted",
  "under_review",
  "interview",
  "accepted",
  "declined",
  "withdrawn",
];

// Statuses where initial review is complete
const REVIEW_DONE: ApplicationStatus[] = [
  "under_review",
  "interview",
  "accepted",
  "declined",
];

// Statuses where facilitator interview is done (only after a final decision)
const INTERVIEW_DONE: ApplicationStatus[] = ["accepted", "declined"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isoDate(value: string | null | undefined): string {
  if (!value) return "";
  return value.slice(0, 10);
}

function isStatus(status: string, set: ApplicationStatus[]): boolean {
  return set.includes(status as ApplicationStatus);
}

type ApplicationRow = {
  status: string;
  school_name: string | null;
  created_at: string;
  reviewed_at: string | null;
};

function buildSteps(row: ApplicationRow): ApplicantStep[] {
  const status = row.status as ApplicationStatus;

  return [
    {
      label: "Application submitted",
      done: isStatus(status, PAST_DRAFT),
      date: isStatus(status, PAST_DRAFT) ? isoDate(row.created_at) : "",
    },
    {
      label: "Initial review by RSI",
      done: isStatus(status, REVIEW_DONE),
      date: isStatus(status, REVIEW_DONE) ? isoDate(row.reviewed_at) : "",
    },
    {
      label: "Facilitator interview",
      done: isStatus(status, INTERVIEW_DONE),
      date: "",
    },
    {
      label: "Cohort placement",
      done: status === "accepted",
      date: "",
    },
  ];
}

function demoOverview(): ApplicantOverview {
  return {
    isDemo: true,
    statusLabel: STATUS_LABELS[demoApplication.status as ApplicationStatus] ?? demoApplication.status,
    school: demoApplication.school,
    submittedOn: demoApplication.submittedOn,
    steps: demoApplication.steps,
  };
}

// ---------------------------------------------------------------------------
// Loader
// ---------------------------------------------------------------------------

export async function getApplicantOverview(): Promise<ApplicantOverview> {
  const supabase = await createClient();
  if (!supabase) return demoOverview();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return demoOverview();

  const { data: appData } = await supabase
    .from("applications")
    .select("status, school_name, created_at, reviewed_at")
    .eq("submitted_by", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const row = appData as ApplicationRow | null;
  if (!row) return demoOverview();

  const status = row.status as ApplicationStatus;

  return {
    isDemo: false,
    statusLabel: STATUS_LABELS[status] ?? row.status,
    school: row.school_name ?? "—",
    submittedOn: isoDate(row.created_at),
    steps: buildSteps(row),
  };
}
