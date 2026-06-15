import type { NavItem } from "@/types";

export const primaryNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "Program", href: "/professional-development" },
  { label: "Impact", href: "/impact" },
  { label: "Resources", href: "/resources" },
  { label: "Get Involved", href: "/get-involved" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Program",
    items: [
      { label: "Professional Development", href: "/professional-development" },
      { label: "Flourishing Schools Project", href: "/flourishing-schools-project" },
      { label: "Apply to Participate", href: "/apply" },
      { label: "Research", href: "/research" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Public Library", href: "/resources" },
      { label: "Impact", href: "/impact" },
      { label: "Blog", href: "/blog" },
      { label: "Get Involved", href: "/get-involved" },
    ],
  },
  {
    title: "Organization",
    items: [
      { label: "About RSI", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Responsible AI", href: "/responsible-ai" },
    ],
  },
];
