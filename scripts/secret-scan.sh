#!/usr/bin/env bash
# Safe secret scan over TRACKED files only. Prints matches; exits non-zero if
# anything secret-looking is found (excluding known false positives).
# Usage: bash scripts/secret-scan.sh
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

fail=0

echo "== JWT-looking strings (eyJ...) =="
# Exclude package-lock integrity hashes (sha512-...) which legitimately contain 'eyJ'.
if git grep -nE "eyJ[A-Za-z0-9_-]{20,}" -- . ':(exclude)package-lock.json' | grep -v "integrity"; then
  echo "  ^ POTENTIAL SECRET"; fail=1
else
  echo "  none"
fi

echo "== service_role references =="
if git grep -n "service_role" -- . ':(exclude)*.md' ':(exclude)db/migrations/*'; then
  echo "  ^ review (allowed in migrations/docs as identifiers, not values)";
else
  echo "  none"
fi

echo "== Supabase project ref in code (not docs) =="
if git grep -n "cwhnvbutorpaequjowgc" -- . ':(exclude)*.md'; then
  echo "  ^ review"; fail=1
else
  echo "  none outside docs"
fi

echo "== .env.local tracked? =="
if git ls-files --error-unmatch .env.local >/dev/null 2>&1; then
  echo "  .env.local IS TRACKED — REMOVE IMMEDIATELY"; fail=1
else
  echo "  not tracked (good)"
fi

if [ "$fail" -ne 0 ]; then
  echo "SECRET SCAN: FINDINGS ABOVE — do not commit/deploy until resolved."
  exit 1
fi
echo "SECRET SCAN: clean."
