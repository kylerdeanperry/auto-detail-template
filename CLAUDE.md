# Elite Service Template — Project Rules

Next.js 15 App Router template that powers **three** separate Vercel projects
from **one** repo: `elite-painting` (painting.kylerperry.com), `elite-roofing`
(roofing.kylerperry.com), and `elite-hvac` (hvac.kylerperry.com). Each Vercel
project differentiates itself at build time via the `INDUSTRY_SLUG` env var.

Companion admin: `kylerperry/agency-os` — it hosts `/api/industries/<slug>/config`
which this template calls during its prebuild step to pull per-client business
data.

## ⚠️ The Fan-Out Rule (READ BEFORE PUSHING)

**One push to `main` = three Vercel builds.** Every `git push origin main` from
this repo triggers `elite-painting`, `elite-roofing`, and `elite-hvac` to all
build in parallel. Empty "trigger" commits, doc-only changes, and drive-by
typos all cost 3x the build minutes.

Ways to avoid wasting builds:

1. **Edit business content in `agency-os`, not here.** Per-industry business
   data (services, testimonials, phone numbers, colors) lives in
   `agency-os/lib/constants/industry-defaults.ts`. Editing there triggers a
   **single** agency-os rebuild; all three templates pick up the change on their
   next natural deploy via `scripts/fetch-industry-config.ts`.

2. **Ignored Build Step** is configured per-project in Vercel dashboard to skip
   builds when the change doesn't touch that industry's code or config. See
   `agency-os/docs/vercel-ops.md` for the exact script.

3. **To re-run a failed build, use Vercel dashboard → Redeploy.** Never push
   an empty commit to retrigger — that's 3 builds for nothing.

## CLI Link Pre-Flight

Before running any `vercel ...` command:

```sh
cat .vercel/project.json
# Expect: "projectName":"elite-painting" (or elite-roofing / elite-hvac)
```

If it shows a different or dead project (e.g., the retired `auto-detail-template`),
re-link:

```sh
rm .vercel/project.json
vercel link   # pick the right elite-<industry> project
```

## Config Flow

Three sources merge at build time (`scripts/fetch-industry-config.ts`):

1. **Business data** — fetched live from `${AGENCY_OS_URL}/api/industries/${INDUSTRY_SLUG}/config` with `X-Build-Secret: ${INDUSTRY_CONFIG_BUILD_SECRET}` header.
2. **Fallback** — `config/fallback/<slug>.json`, used when the fetch fails. Keep this mostly in sync with agency-os' defaults, but agency-os is the source of truth.
3. **Visual** — `config/visual-config/<slug>.json`, checked into the repo. Hero copy, images, CTA labels, section structure. Edit here for layout/design-language changes.

The output is written to `config/industry-config.json` (gitignored, generated per build).

## Design System — Craftsman Studio (Painting)

Painting surfaces currently use the Craftsman Studio palette:

- Base: `#FAF8F5` (paper)
- Ink: `#101920` (deep slate)
- Bronze: `#9B6B3C` (primary accent)
- Sage: `#4A5A4A` (secondary)
- Stone: `#E2DACA` (hairline dividers)

Typography: Fraunces (display, opsz axis) + Instrument Sans (body) + JetBrains Mono
(kickers/meta). All loaded via `next/font` in `app/layout.tsx`.

Token definitions live in `app/globals.css`. Never reintroduce `bg-accent` with
the old Autarq yellow or the legacy `text-slate` — those have been swept.

Roofing and HVAC still use the older Autarq-era tokens; if/when they get
redesigned, follow the same pattern per-industry in `visual-config/<slug>.json`
+ scoped utility classes, or introduce a design-system switch in the fallback.

## Images

Premium imagery lives under `public/images/generated/` and is produced via
`scripts/generate-images.ts` using KIE.ai's Nano Banana 2 (2K). The script is
**resumable** — existing files are skipped unless `--force` is passed.

API key lives in `.env.local` as `KIE_API_KEY`; it is gitignored.

## Env Vars (every elite-* Vercel project needs these on Production + Preview + Development)

| Var | Value |
|---|---|
| `INDUSTRY_SLUG` | `painting` / `roofing` / `hvac` |
| `AGENCY_OS_URL` | `https://www.kylerperry.com` |
| `INDUSTRY_CONFIG_BUILD_SECRET` | shared secret (matches agency-os) |
| `ANTHROPIC_API_KEY` | chatbot |
| `NEXT_PUBLIC_SUPABASE_URL` | leads intake |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | leads intake |
| `LEADS_INTAKE_SECRET` | leads intake |
| `KIE_API_KEY` | local-only, for image generation |
| `CLIENT_ID` | optional UUID — when set, bakes a specific painter's config |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN_PUBLIC` | Mapbox Searchbox token for chat address autocomplete |

CLI `vercel env add <name> preview` may silently fail without flags. Use:
`vercel env add <name> preview --value <value> --yes`. If the CLI still errors,
use the dashboard.

## Package Manager

This repo uses `npm` (`package-lock.json`). Do not mix in `pnpm-lock.yaml`. The
agency-os sibling repo uses `pnpm` — don't confuse them.

## Git Workflow

- Work on `main`.
- **Confirm before pushing.** Any `main` push costs 3 builds. If the change
  doesn't touch code/styles/visual-config, question whether to push at all.
- Never push "empty commit to trigger rebuild" — use Vercel dashboard Redeploy instead.
