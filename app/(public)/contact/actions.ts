"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  organization: z.string().max(160).optional(),
  role: z.string().max(160).optional(),
  message: z.string().min(1).max(5000),
});

type ContactInput = z.infer<typeof contactSchema>;

type ContactResult =
  | { ok: true }
  | { ok: false; status: "validation"; error: string }
  | { ok: false; status: "unconfigured"; error: string }
  | { ok: false; status: "unstored"; error: string };

export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      status: "validation",
      error: parsed.error.issues.map((i) => i.message).join(". "),
    };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      ok: false,
      status: "unconfigured",
      error: "Email delivery isn't configured yet.",
    };
  }

  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    organization: parsed.data.organization ?? null,
    role: parsed.data.role ?? null,
    message: parsed.data.message,
  });

  if (error) {
    return {
      ok: false,
      status: "unstored",
      error: error.message,
    };
  }

  return { ok: true };
}
