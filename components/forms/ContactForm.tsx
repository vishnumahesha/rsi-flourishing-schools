"use client";

import * as React from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { sendContactMessage } from "@/app/(public)/contact/actions";

const FALLBACK_EMAIL = "flourishingschools@fas.harvard.edu";

type FieldErrors = Partial<Record<"name" | "email" | "organization" | "role" | "message", string>>;

function validateLocally(data: FormData): FieldErrors {
  const errors: FieldErrors = {};
  const name = (data.get("name") as string | null)?.trim() ?? "";
  const email = (data.get("email") as string | null)?.trim() ?? "";
  const message = (data.get("message") as string | null)?.trim() ?? "";

  if (!name) errors.name = "Name is required.";
  else if (name.length > 120) errors.name = "Name must be 120 characters or fewer.";

  if (!email) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";

  if (!message) errors.message = "Message is required.";
  else if (message.length > 5000) errors.message = "Message must be 5,000 characters or fewer.";

  const org = (data.get("organization") as string | null)?.trim() ?? "";
  if (org.length > 160) errors.organization = "Organization must be 160 characters or fewer.";

  const role = (data.get("role") as string | null)?.trim() ?? "";
  if (role.length > 160) errors.role = "Role must be 160 characters or fewer.";

  return errors;
}

export function ContactForm() {
  const [isPending, startTransition] = React.useTransition();
  const [sent, setSent] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});

  if (sent) {
    return (
      <Card className="flex flex-col items-center p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-sage" />
        <h3 className="mt-4 font-display text-xl text-navy">Message received</h3>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Thanks — your message was received. We&apos;ll be in touch.
        </p>
      </Card>
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const localErrors = validateLocally(data);

    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      return;
    }
    setFieldErrors({});

    const name = (data.get("name") as string).trim();
    const email = (data.get("email") as string).trim();
    const organization = (data.get("organization") as string | null)?.trim() || undefined;
    const role = (data.get("role") as string | null)?.trim() || undefined;
    const message = (data.get("message") as string).trim();

    startTransition(async () => {
      const result = await sendContactMessage({ name, email, organization, role, message });
      if (result.ok) {
        setSent(true);
      } else {
        setServerError(result.error);
      }
    });
  }

  return (
    <Card className="p-6 sm:p-8">
      {serverError && (
        <div
          role="alert"
          className="mb-5 flex flex-col gap-2 rounded-lg border border-crimson/30 bg-crimson/5 p-4 text-sm"
        >
          <span className="flex items-center gap-2 font-medium text-crimson">
            <AlertCircle className="h-4 w-4 shrink-0" />
            We couldn&apos;t store your message right now.
          </span>
          <span className="text-muted">
            Please email us directly at{" "}
            <a
              href={`mailto:${FALLBACK_EMAIL}`}
              className="font-medium text-crimson underline underline-offset-2 hover:text-crimson-strong"
            >
              {FALLBACK_EMAIL}
            </a>{" "}
            and we&apos;ll get back to you.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Full name <span aria-hidden="true" className="text-crimson">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              required
              aria-required="true"
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
              placeholder="Jordan Rivera"
              disabled={isPending}
            />
            {fieldErrors.name && (
              <p id="name-error" className="text-xs text-crimson">{fieldErrors.name}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">
              Email <span aria-hidden="true" className="text-crimson">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              aria-required="true"
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              placeholder="you@school.org"
              disabled={isPending}
            />
            {fieldErrors.email && (
              <p id="email-error" className="text-xs text-crimson">{fieldErrors.email}</p>
            )}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="organization">School or organization</Label>
            <Input
              id="organization"
              name="organization"
              aria-describedby={fieldErrors.organization ? "organization-error" : undefined}
              placeholder="Maple Grove School"
              disabled={isPending}
            />
            {fieldErrors.organization && (
              <p id="organization-error" className="text-xs text-crimson">{fieldErrors.organization}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role">Your role</Label>
            <Input
              id="role"
              name="role"
              aria-describedby={fieldErrors.role ? "role-error" : undefined}
              placeholder="Principal, teacher, researcher…"
              disabled={isPending}
            />
            {fieldErrors.role && (
              <p id="role-error" className="text-xs text-crimson">{fieldErrors.role}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="message">
            How can we help? <span aria-hidden="true" className="text-crimson">*</span>
          </Label>
          <Textarea
            id="message"
            name="message"
            required
            aria-required="true"
            aria-describedby={fieldErrors.message ? "message-error" : undefined}
            rows={5}
            placeholder="Tell us a little about your school and what you're hoping to explore."
            disabled={isPending}
          />
          {fieldErrors.message && (
            <p id="message-error" className="text-xs text-crimson">{fieldErrors.message}</p>
          )}
        </div>

        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Sending…" : "Send message"}
          {!isPending && <Send className="h-4 w-4" />}
        </Button>
      </form>
    </Card>
  );
}
