export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_FALLBACK === "true";
}
