"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, initials } from "@/lib/utils";
import {
  getDashboardNav,
  inferRoleFromPath,
  type DashNavSection,
} from "@/lib/content/dashboard-nav";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { Menu, LogOut, ExternalLink, ChevronDown } from "lucide-react";

const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

interface ShellUser {
  name: string;
  email: string;
}

export function DashboardShell({
  role,
  user,
  children,
}: {
  role: string | null;
  user: ShellUser | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const effectiveRole = role ?? inferRoleFromPath(pathname) ?? "school_admin";
  const nav = getDashboardNav(effectiveRole);
  const display = user ?? { name: "Demo User", email: "demo@flourishing.dev" };

  async function signOut() {
    if (supabaseConfigured) {
      try {
        await createClient().auth.signOut();
      } catch {
        /* ignore */
      }
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-dvh bg-ivory">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  className="grid h-9 w-9 place-items-center rounded-lg border border-line text-slate lg:hidden"
                  aria-label="Open navigation"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="p-5">
                  <Link href="/" className="inline-flex">
                    <Logo />
                  </Link>
                </div>
                <SidebarNav
                  nav={nav}
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                />
              </SheetContent>
            </Sheet>
            <Link href="/" className="hidden sm:inline-flex">
              <Logo />
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden rounded-full bg-crimson-soft px-3 py-1 text-xs font-semibold text-crimson sm:inline">
              {ROLE_LABELS[effectiveRole] ?? "Member"}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-2.5 text-sm hover:bg-paper">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-navy text-[0.7rem] font-bold text-ivory">
                    {initials(display.name)}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-semibold text-navy">{display.name}</div>
                  <div className="truncate text-xs font-normal text-slate">
                    {display.email}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Public site
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {supabaseConfigured ? "Sign out" : "Exit demo"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-line bg-surface/60 lg:block">
          <SidebarNav nav={nav} pathname={pathname} />
        </aside>

        <main className="min-w-0 flex-1">
          <Container className="py-8 lg:py-10" size="wide">
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
}

function SidebarNav({
  nav,
  pathname,
  onNavigate,
}: {
  nav: DashNavSection[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-6 p-4">
      {nav.map((section) => (
        <div key={section.heading}>
          <div className="px-3 pb-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate/70">
            {section.heading}
          </div>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== pathname && pathname.startsWith(item.href + "/"));
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-crimson text-ivory shadow-soft"
                        : "text-slate hover:bg-paper hover:text-navy",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
