# Real Content TODO (RSI / HFP input required)

Engineering is in place; these need approved, real content before a public pilot. Do **not** invent any of this — it must come from RSI/HFP.

| Area | Where | What's needed |
|---|---|---|
| Resource citations | `lib/content/resources.ts` (`sourceCitation`) | All resources currently say "Placeholder citation". Public UI now labels these **"Draft · citation pending"** and never prints the placeholder as a real source. Replace with approved peer-reviewed citations, then they render normally. |
| Public resources | `/resources` | Confirm which curated practices are cleared for public release; the rest stay draft-marked. |
| Blog / Updates | `lib/content/blog.ts`, `/blog` | Posts are reframed as forthcoming "Updates" (no fake article pages). Provide real articles + publish dates when ready, then build detail routes. |
| Impact | `/impact` | Currently an honest "What we will document" pre-launch section. Add real school stories / implementation examples / longitudinal results **only once they exist** — no fabricated metrics or testimonials. |
| Research citations | `/research`, `/flourishing-schools-project` | VanderWeele & Hinton (2024) and Kristjánsson & VanderWeele (2025) are already cited. Confirm accuracy / add any others RSI approves. |
| Events | `/get-involved` ("Attend an upcoming event" → /blog) | Provide real event dates/links or point to a real events source. |
| Contact details | `/contact` | Uses `flourishingschools@fas.harvard.edu`. Confirm this is the correct public address; add phone/mailing if desired. |
| Newsletter | (no form shipped) | Decide whether to offer a newsletter. `newsletter_signups` table + RLS exist (migration 0002); a footer form can be added once confirmed. No newsletter claim is currently shown, so nothing dishonest exists today. |
| Program materials | resources / PD session content | Real PD session materials, agendas, and workshop artifacts. |
| Harvard/IQSS/RSI framing | public pages | Keep current factual framing; do not add endorsement language beyond the actual project relationship. |

See `FINAL_REMAINING_SETUP.md` for infrastructure steps and `LAUNCH_QA.md` for the role test matrix.
