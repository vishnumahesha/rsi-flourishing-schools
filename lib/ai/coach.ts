import { aiConfigured, runLlm } from "./provider";

export interface CoachMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CoachInput {
  message: string;
  history?: CoachMessage[];
  focusArea?: string;
}

export interface CoachResult {
  source: "ai" | "demo";
  reply: string;
  disclaimer: string;
}

const DISCLAIMER =
  "This reflective coach offers prompts for professional growth, not clinical, legal, or crisis advice. For student safety concerns, follow your school's protocols.";

/** Reflective, non-fabricating fallback. Asks questions; cites nothing. */
function demoReply(input: CoachInput): string {
  const focus = input.focusArea ? ` around ${input.focusArea}` : "";
  return [
    `Thanks for sharing this${focus}. Here are a few reflection prompts to explore it further:`,
    "",
    "• What does a small, visible win look like in the next two weeks?",
    "• Which students or colleagues would notice the change first, and how?",
    "• What is one existing routine you could adapt rather than add to?",
    "• How will you know it's working — what would you observe or hear?",
    "",
    "When you're ready, the curated resource library has low-lift practices you can pair with these reflections. (This is a demonstration response generated without an AI provider key.)",
  ].join("\n");
}

export async function coach(input: CoachInput): Promise<CoachResult> {
  if (!aiConfigured()) {
    return { source: "demo", reply: demoReply(input), disclaimer: DISCLAIMER };
  }

  const system =
    "You are a warm, practical professional-development coach for educators working on student and staff flourishing. " +
    "Favor reflective questions and small, concrete next steps. " +
    "CRITICAL: Never invent research citations or cite specific studies. Do not give clinical, legal, or crisis advice; redirect safety concerns to school protocols. Keep replies concise.";

  const historyText = (input.history ?? [])
    .slice(-6)
    .map((m) => `${m.role === "user" ? "Educator" : "Coach"}: ${m.content}`)
    .join("\n");

  const prompt = `${historyText ? historyText + "\n" : ""}Educator: ${
    input.message
  }${input.focusArea ? `\n(Focus area: ${input.focusArea})` : ""}\nCoach:`;

  const result = await runLlm({ system, prompt, maxTokens: 700 });
  if (!result.available) {
    return { source: "demo", reply: demoReply(input), disclaimer: DISCLAIMER };
  }
  return { source: "ai", reply: result.text, disclaimer: DISCLAIMER };
}
