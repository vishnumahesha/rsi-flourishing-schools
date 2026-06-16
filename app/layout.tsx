import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rsi-flourishing.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RSI Flourishing Schools — Professional Development Platform",
    template: "%s · RSI Flourishing Schools",
  },
  description:
    "A research-backed professional development platform that helps schools turn flourishing data into evidence-based practice, guided reflection, and long-term improvement.",
  keywords: [
    "flourishing schools",
    "professional development",
    "student well-being",
    "character skills",
    "Research Schools International",
    "evidence-based education",
  ],
  openGraph: {
    title: "RSI Flourishing Schools — Professional Development Platform",
    description:
      "Turn flourishing research into school-wide practice with AI-supported analysis and human-led professional development.",
    url: siteUrl,
    siteName: "RSI Flourishing Schools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RSI Flourishing Schools",
    description: "Turn flourishing research into school-wide practice.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
