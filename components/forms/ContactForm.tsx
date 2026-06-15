"use client";

import * as React from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export function ContactForm() {
  const [sent, setSent] = React.useState(false);

  if (sent) {
    return (
      <Card className="flex flex-col items-center p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-sage" />
        <h3 className="mt-4 font-display text-xl text-navy">Message received</h3>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Thank you for reaching out. The RSI team will follow up with next steps. (Demo: no message
          was actually sent.)
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="space-y-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" required placeholder="Jordan Rivera" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required placeholder="you@school.org" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="org">School or organization</Label>
          <Input id="org" placeholder="Maple Grove School" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="message">How can we help?</Label>
          <Textarea id="message" required rows={5} placeholder="Tell us a little about your school and what you're hoping to explore." />
        </div>
        <Button type="submit" size="lg">
          Send message
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
