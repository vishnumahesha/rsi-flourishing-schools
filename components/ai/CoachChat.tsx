"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { CoachMessage } from "@/lib/ai/coach";
import { Send, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const STARTERS = [
  "How do I keep belonging circles short but meaningful?",
  "Staff reflection feels like a chore — how do I shift that?",
  "What's a small first step for schoolwide well-being?",
];

export function CoachChat() {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [source, setSource] = useState<"ai" | "demo" | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: content, history: messages }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply }]);
      setDisclaimer(data.disclaimer ?? null);
      setSource(data.source ?? null);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Sorry — I couldn't respond just now. Please try again." },
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-surface shadow-soft">
      <div className="flex items-center gap-2 border-b border-line px-5 py-3">
        <Sparkles className="h-4 w-4 text-crimson" />
        <span className="font-display text-base text-navy">Reflective coach</span>
        {source && (
          <Badge variant={source === "ai" ? "crimson" : "muted"} className="ml-auto">
            {source === "ai" ? "AI" : "Demo"}
          </Badge>
        )}
      </div>

      <div className="max-h-[52vh] min-h-[280px] space-y-4 overflow-y-auto px-5 py-5">
        {messages.length === 0 ? (
          <div>
            <p className="text-sm text-slate">
              Ask about a challenge you&apos;re working through. The coach offers
              reflection prompts and small next steps — not clinical or crisis advice.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-line-strong px-3 py-1.5 text-left text-sm text-slate hover:border-navy/30 hover:bg-navy/5"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm",
                  m.role === "user"
                    ? "bg-crimson text-ivory"
                    : "border border-line bg-paper text-navy",
                )}
              >
                {m.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate">
            <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
          </div>
        )}
        <div ref={endRef} />
      </div>

      {disclaimer && (
        <div className="flex items-start gap-2 border-t border-line bg-paper px-5 py-2.5 text-xs text-slate">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />
          {disclaimer}
        </div>
      )}

      <div className="flex items-end gap-2 border-t border-line p-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={1}
          placeholder="Type your question…"
          className="min-h-[44px] resize-none"
        />
        <Button size="icon" aria-label="Send message" onClick={() => send(input)} disabled={loading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
