# Accessibility Notes

Summary of accessibility work and remaining limitations. Verified by code review; a full screen-reader / automated-audit (axe/Lighthouse) pass against the live site is still recommended before pilot.

## Fixed
- **Global focus ring**: `:focus-visible` crimson ring defined in `globals.css` and applied across buttons/inputs/selects/checkbox/tabs.
- **Icon-only Send button** (`components/ai/CoachChat.tsx`): added `aria-label="Send message"`.
- **Dark-region contrast**: footer link/body text raised (`SiteFooter.tsx` `/60`→`/75`, bottom bar `/45`→`/60`); `Logo.tsx` light-tone subtext `/60`→`/75`. The dark "AI with human review" section uses ivory/mist tokens (not low-opacity white) for AA contrast.
- **Custom toggles focus rings** (`components/forms/field-helpers.tsx`): `RadioRow`/`ChipMultiSelect` buttons now have `focus-visible:ring-2 ring-crimson`.
- **Action board status control**: an accessible `<select>` (`aria-label="Status for <task>"`) is the reliable keyboard path for changing status (drag-drop is a non-essential enhancement).
- **Forms**: reflection, contact, invite, reply, new-thread, profile, document-upload forms use associated `<label htmlFor>`/`id`, and surface errors in `role="alert"` regions.
- **Decorative imagery**: hero/accent images use empty `alt=""` with `aria-hidden` on the decorative accent; the hero has a descriptive alt. Resource topic-art bands are decorative (`alt=""`).
- **Reduced motion**: `prefers-reduced-motion` honored globally in `globals.css` and in framer-motion components (`Reveal`, `ProcessTimeline`) via `useReducedMotion()`.
- **Headings**: pages use a single `h1` (PageHero/hero) then `h2`/`h3` section order.

## Remaining / recommended
- **Drag-and-drop reordering** on the action board is not keyboard-operable; the status `<select>` is the accessible equivalent. A fully keyboard-accessible DnD is a nice-to-have.
- **Skip-to-content link**: not added globally; recommended for keyboard users on content-heavy pages.
- **Automated audit**: run axe-core / Lighthouse a11y against production and remediate any contrast/labels findings on real rendered pages (not verifiable from code alone here).
- **Dialog focus management**: verify focus trap/initial focus on any modal dialogs under real interaction.
- **Mobile nav / dashboard sidebar**: verified present (sheet-based); confirm focus order on small screens during manual QA.
