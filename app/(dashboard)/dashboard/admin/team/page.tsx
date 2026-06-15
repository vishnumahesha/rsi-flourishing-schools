import { PageHeading, DashCard, DemoNotice } from "@/components/dashboard/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { demoTeam } from "@/lib/content/demo";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { UserPlus } from "lucide-react";

export default function TeamPage() {
  return (
    <>
      <PageHeading
        title="Team"
        description="Educators and staff participating in your flourishing journey."
        action={<Button variant="outline" size="sm"><UserPlus className="mr-2 h-4 w-4" /> Invite member</Button>}
      />
      <DemoNotice />
      <DashCard>
        <ul className="divide-y divide-line">
          {demoTeam.map((m) => (
            <li key={m.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy text-sm font-bold text-ivory">{m.initials}</span>
              <div className="min-w-0">
                <div className="font-medium text-navy">{m.name}</div>
                <div className="text-xs text-slate">{m.title}</div>
              </div>
              <Badge variant="outline" className="ml-auto">{ROLE_LABELS[m.role] ?? m.role}</Badge>
            </li>
          ))}
        </ul>
      </DashCard>
    </>
  );
}
