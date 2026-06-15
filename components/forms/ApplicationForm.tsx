"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Upload,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldShell, ChipMultiSelect, RadioRow } from "./field-helpers";
import {
  applicationSchema,
  stepFields,
  schoolTypes,
  documentCategories,
  type ApplicationInput,
} from "@/lib/validation/application";
import { GRADE_LEVELS, PRIORITY_OUTCOMES } from "@/types";
import { cn } from "@/lib/utils";

const STEP_TITLES = [
  "School information",
  "Background",
  "Goals",
  "Team & commitment",
  "Documents",
  "Review",
];

const STORAGE_KEY = "rsi-application-draft";
const yesNo = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

export function ApplicationForm() {
  const [step, setStep] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [files, setFiles] = React.useState<Record<string, string>>({});
  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  const form = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    mode: "onTouched",
    defaultValues: {
      orgName: "",
      website: "",
      country: "",
      cityRegion: "",
      schoolType: "",
      gradeLevels: [],
      contactName: "",
      contactRole: "",
      contactEmail: "",
      contactPhone: "",
      participatedInProject: "unsure",
      completedSurvey: "unsure",
      hasReport: "unsure",
      applicationType: "single",
      schoolGoals: "",
      existingPrograms: "",
      challenges: "",
      priorityOutcomes: [],
      teamDescription: "",
      monthlyCommitment: false,
      inPersonConfirmed: false,
      schoolLeadName: "",
    },
  });

  const {
    register,
    control,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = form;

  // Restore draft
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) form.reset({ ...getValues(), ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave
  React.useEffect(() => {
    const sub = watch((values) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        setSavedAt(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
      } catch {
        /* ignore */
      }
    });
    return () => sub.unsubscribe();
  }, [watch]);

  const next = async () => {
    const fields = stepFields[step];
    if (fields) {
      const ok = await trigger(fields);
      if (!ok) return;
    }
    setStep((s) => Math.min(s + 1, STEP_TITLES.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async () => {
    const valid = await trigger();
    if (!valid) return;
    setSubmitting(true);
    try {
      await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...getValues(), documents: Object.keys(files) }),
      }).catch(() => null);
      localStorage.removeItem(STORAGE_KEY);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="mx-auto max-w-xl p-10 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-sage/15">
          <CheckCircle2 className="h-7 w-7 text-sage" />
        </div>
        <h2 className="font-display text-2xl text-navy">Thank you for your interest</h2>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted">
          Thank you for your interest in the RSI Flourishing Schools Professional Development
          Program. Our team will review your submission and follow up with next steps.
        </p>
        <p className="mt-4 text-xs text-muted">
          This is a demo submission — no data was sent to a server.
        </p>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Stepper step={step} />

      <Card className="mt-8 p-6 sm:p-8">
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-crimson">
            Step {step + 1} of {STEP_TITLES.length}
          </div>
          <h2 className="mt-1 font-display text-2xl text-navy">{STEP_TITLES[step]}</h2>
        </div>

        {/* STEP 1 */}
        {step === 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldShell label="School or network name" required error={errors.orgName?.message}>
                <Input {...register("orgName")} placeholder="Maple Grove School" />
              </FieldShell>
            </div>
            <FieldShell label="Website" error={errors.website?.message} hint="Include https://">
              <Input {...register("website")} placeholder="https://school.org" />
            </FieldShell>
            <FieldShell label="Country" required error={errors.country?.message}>
              <Input {...register("country")} placeholder="United States" />
            </FieldShell>
            <FieldShell label="City / region" error={errors.cityRegion?.message}>
              <Input {...register("cityRegion")} placeholder="Austin, TX" />
            </FieldShell>
            <FieldShell label="Type of school" required error={errors.schoolType?.message}>
              <NativeSelect {...register("schoolType")}>
                <option value="">Select…</option>
                {schoolTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </NativeSelect>
            </FieldShell>
            <FieldShell label="Number of students" error={errors.studentCount?.message}>
              <Input type="number" min={0} {...register("studentCount")} placeholder="850" />
            </FieldShell>
            <div className="sm:col-span-2">
              <FieldShell
                label="Grade levels served"
                required
                error={errors.gradeLevels?.message}
              >
                <Controller
                  control={control}
                  name="gradeLevels"
                  render={({ field }) => (
                    <ChipMultiSelect
                      options={GRADE_LEVELS.map((g) => ({ value: g, label: g }))}
                      value={field.value ?? []}
                      onChange={field.onChange}
                    />
                  )}
                />
              </FieldShell>
            </div>
            <FieldShell label="Primary contact name" required error={errors.contactName?.message}>
              <Input {...register("contactName")} placeholder="Jordan Rivera" />
            </FieldShell>
            <FieldShell label="Primary contact role" required error={errors.contactRole?.message}>
              <Input {...register("contactRole")} placeholder="Head of School" />
            </FieldShell>
            <FieldShell label="Email" required error={errors.contactEmail?.message}>
              <Input type="email" {...register("contactEmail")} placeholder="jordan@school.org" />
            </FieldShell>
            <FieldShell label="Phone" error={errors.contactPhone?.message}>
              <Input {...register("contactPhone")} placeholder="+1 555 123 4567" />
            </FieldShell>
          </div>
        )}

        {/* STEP 2 */}
        {step === 1 && (
          <div className="space-y-6">
            <FieldShell
              label="Has your school or network participated in the Flourishing Schools Project?"
              required
              error={errors.participatedInProject?.message}
            >
              <Controller
                control={control}
                name="participatedInProject"
                render={({ field }) => (
                  <RadioRow name={field.name} value={field.value} onChange={field.onChange} options={yesNo} />
                )}
              />
            </FieldShell>
            <FieldShell
              label="Have you completed the Flourishing Schools Survey?"
              required
              error={errors.completedSurvey?.message}
            >
              <Controller
                control={control}
                name="completedSurvey"
                render={({ field }) => (
                  <RadioRow name={field.name} value={field.value} onChange={field.onChange} options={yesNo} />
                )}
              />
            </FieldShell>
            <FieldShell
              label="Do you have a Flourishing Schools report?"
              required
              error={errors.hasReport?.message}
            >
              <Controller
                control={control}
                name="hasReport"
                render={({ field }) => (
                  <RadioRow name={field.name} value={field.value} onChange={field.onChange} options={yesNo} />
                )}
              />
            </FieldShell>
            <FieldShell
              label="Are you applying as an individual school or a network?"
              required
              error={errors.applicationType?.message}
            >
              <Controller
                control={control}
                name="applicationType"
                render={({ field }) => (
                  <RadioRow
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { value: "single", label: "Individual school" },
                      { value: "network", label: "Network of schools" },
                    ]}
                  />
                )}
              />
            </FieldShell>
            {watch("applicationType") === "network" && (
              <FieldShell
                label="How many schools would participate?"
                error={errors.numberOfSchools?.message}
              >
                <Input type="number" min={1} {...register("numberOfSchools")} placeholder="4" />
              </FieldShell>
            )}
          </div>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <div className="space-y-6">
            <FieldShell
              label="Current goals related to flourishing, well-being, character skills, SEL, or community life"
              required
              error={errors.schoolGoals?.message}
            >
              <Textarea rows={4} {...register("schoolGoals")} placeholder="What are you hoping to strengthen?" />
            </FieldShell>
            <FieldShell label="Existing programs or initiatives" error={errors.existingPrograms?.message}>
              <Textarea rows={3} {...register("existingPrograms")} placeholder="Advisory, SEL curriculum, etc." />
            </FieldShell>
            <FieldShell label="Challenges you'd like support with" error={errors.challenges?.message}>
              <Textarea rows={3} {...register("challenges")} placeholder="Where do you feel stuck?" />
            </FieldShell>
            <FieldShell
              label="Most important outcomes"
              required
              error={errors.priorityOutcomes?.message}
            >
              <Controller
                control={control}
                name="priorityOutcomes"
                render={({ field }) => (
                  <ChipMultiSelect
                    options={PRIORITY_OUTCOMES.map((o) => ({ value: o, label: o }))}
                    value={field.value ?? []}
                    onChange={field.onChange}
                  />
                )}
              />
            </FieldShell>
          </div>
        )}

        {/* STEP 4 */}
        {step === 3 && (
          <div className="space-y-6">
            <FieldShell
              label="Who would participate from your school?"
              required
              error={errors.teamDescription?.message}
            >
              <Textarea rows={3} {...register("teamDescription")} placeholder="Roles and teams involved" />
            </FieldShell>
            <FieldShell label="Estimated number of educators" error={errors.estimatedEducators?.message}>
              <Input type="number" min={1} {...register("estimatedEducators")} placeholder="12" />
            </FieldShell>
            <FieldShell label="School lead name" required error={errors.schoolLeadName?.message}>
              <Input {...register("schoolLeadName")} placeholder="Who will lead at your school?" />
            </FieldShell>
            <div className="space-y-3 rounded-xl border border-line bg-paper p-4">
              <Controller
                control={control}
                name="monthlyCommitment"
                render={({ field }) => (
                  <label className="flex items-start gap-3 text-sm text-navy">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                    <span>
                      Our educators can meet monthly during the academic year.
                      <span className="text-crimson"> *</span>
                    </span>
                  </label>
                )}
              />
              <Controller
                control={control}
                name="inPersonConfirmed"
                render={({ field }) => (
                  <label className="flex items-start gap-3 text-sm text-navy">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                    <span>Our team can meet in person while joining RSI virtually.</span>
                  </label>
                )}
              />
            </div>
            {errors.monthlyCommitment?.message && (
              <p className="text-xs font-medium text-crimson">{errors.monthlyCommitment.message}</p>
            )}
          </div>
        )}

        {/* STEP 5 — uploads (demo) */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/8 p-4">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--gold)]" />
              <p className="text-sm leading-relaxed text-slate">
                Please do not upload personally identifiable student information unless your school
                has explicit authorization to do so. Uploaded materials are used to support
                school-specific program analysis and professional development.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {documentCategories.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() =>
                    setFiles((f) =>
                      f[d.key]
                        ? Object.fromEntries(Object.entries(f).filter(([k]) => k !== d.key))
                        : { ...f, [d.key]: `${d.label} (demo).pdf` },
                    )
                  }
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors",
                    files[d.key]
                      ? "border-sage/50 bg-sage/8"
                      : "border-dashed border-line-strong hover:border-navy/30 hover:bg-navy/5",
                  )}
                >
                  <div>
                    <div className="text-sm font-medium text-navy">{d.label}</div>
                    <div className="text-xs text-muted">
                      {files[d.key] ? files[d.key] : "Click to attach (demo)"}
                    </div>
                  </div>
                  {files[d.key] ? (
                    <Check className="h-5 w-5 shrink-0 text-sage" />
                  ) : (
                    <Upload className="h-5 w-5 shrink-0 text-muted" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted">
              File handling is simulated in this demo. In production, files upload to private Supabase
              Storage with type and size validation.
            </p>
          </div>
        )}

        {/* STEP 6 — review */}
        {step === 5 && <ReviewScreen values={getValues()} files={files} onEdit={setStep} />}

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
          <Button type="button" variant="ghost" onClick={back} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            {savedAt && <span className="hidden text-xs text-muted sm:inline">Draft saved {savedAt}</span>}
            {step < STEP_TITLES.length - 1 ? (
              <Button type="button" onClick={next}>
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="button" onClick={onSubmit} disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Submit application
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="flex items-center justify-between gap-1">
      {STEP_TITLES.map((title, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={title} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full items-center">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  done && "bg-sage text-white",
                  active && "bg-crimson text-white",
                  !done && !active && "bg-navy/8 text-muted",
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              {i < STEP_TITLES.length - 1 && (
                <span className={cn("h-px flex-1", i < step ? "bg-sage" : "bg-line-strong")} />
              )}
            </div>
            <span
              className={cn(
                "hidden text-center text-[0.7rem] font-medium sm:block",
                active ? "text-navy" : "text-muted",
              )}
            >
              {title}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function ReviewScreen({
  values,
  files,
  onEdit,
}: {
  values: ApplicationInput;
  files: Record<string, string>;
  onEdit: (step: number) => void;
}) {
  const rows: { step: number; label: string; items: [string, React.ReactNode][] }[] = [
    {
      step: 0,
      label: "School information",
      items: [
        ["School / network", values.orgName],
        ["Location", [values.cityRegion, values.country].filter(Boolean).join(", ")],
        ["Type", values.schoolType],
        ["Grade levels", values.gradeLevels?.join(", ")],
        ["Primary contact", `${values.contactName} · ${values.contactEmail}`],
      ],
    },
    {
      step: 1,
      label: "Background",
      items: [
        ["Participated in project", values.participatedInProject],
        ["Completed survey", values.completedSurvey],
        ["Has report", values.hasReport],
        ["Application type", values.applicationType],
      ],
    },
    {
      step: 2,
      label: "Goals",
      items: [
        ["Goals", values.schoolGoals],
        ["Priority outcomes", values.priorityOutcomes?.join(", ")],
      ],
    },
    {
      step: 3,
      label: "Team & commitment",
      items: [
        ["Team", values.teamDescription],
        ["School lead", values.schoolLeadName],
        ["Monthly commitment", values.monthlyCommitment ? "Confirmed" : "Not confirmed"],
      ],
    },
    {
      step: 4,
      label: "Documents",
      items: [["Attached", Object.keys(files).length ? `${Object.keys(files).length} file(s)` : "None"]],
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Review your responses before submitting. You can jump back to any section to edit.
      </p>
      {rows.map((r) => (
        <div key={r.step} className="rounded-xl border border-line bg-paper p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-base text-navy">{r.label}</h3>
            <button
              type="button"
              onClick={() => onEdit(r.step)}
              className="text-xs font-semibold text-crimson hover:text-crimson-strong"
            >
              Edit
            </button>
          </div>
          <dl className="space-y-2">
            {r.items.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[140px_1fr] gap-3 text-sm">
                <dt className="text-muted">{k}</dt>
                <dd className="text-navy">{v || "—"}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
