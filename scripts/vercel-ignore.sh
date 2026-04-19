#!/usr/bin/env bash
# Vercel Ignored Build Step for elite-service-template.
#
# Three Vercel projects (elite-painting / elite-roofing / elite-hvac) all
# build from this single repo on every push to main. This script decides
# per project whether a given commit actually affects it.
#
# Exit code contract:
#   0 = SKIP this build  (Vercel stops immediately; no build minutes)
#   1 = PROCEED with build
#
# Activated via vercel.json -> "ignoreCommand": "bash scripts/vercel-ignore.sh".

set -e

SLUG="${INDUSTRY_SLUG:?INDUSTRY_SLUG must be set on the Vercel project}"

# ── 1. Shared code paths (rebuild ALL industries when these change) ──
SHARED_PATHS=(
  "app/"
  "components/"
  "lib/"
  "styles/"
  "public/logo.svg"
  "public/favicon.ico"
  "public/manifest.json"
  "package.json"
  "package-lock.json"
  "pnpm-lock.yaml"
  "next.config.mjs"
  "next.config.ts"
  "tailwind.config.ts"
  "postcss.config.mjs"
  "tsconfig.json"
  "components.json"
  "scripts/fetch-industry-config.ts"
)

if ! git diff HEAD^ HEAD --quiet -- "${SHARED_PATHS[@]}"; then
  echo "Shared code changed — building ${SLUG}."
  exit 1
fi

# ── 2. Industry-specific config (rebuild only that industry) ─────────
if ! git diff HEAD^ HEAD --quiet -- \
  "config/visual-config/${SLUG}.json" \
  "config/fallback/${SLUG}.json"; then
  echo "${SLUG} config changed — building."
  exit 1
fi

# ── 3. Industry-specific generated images ────────────────────────────
# HVAC and roofing use a `<slug>-*` prefix. Painting is the original and
# uses unprefixed filenames (hero-, prep-, protection-, communication-,
# portfolio-hero-*, portfolio-0N-*, estimator-phone-mock).
CHANGED_IMAGES=$(git diff HEAD^ HEAD --name-only -- "public/images/generated/" || true)

case "${SLUG}" in
  painting)
    # Everything that is NOT hvac- or roofing- prefixed belongs to painting.
    if echo "${CHANGED_IMAGES}" | grep -v -E "^public/images/generated/(hvac-|roofing-)" | grep -q "public/images/generated/"; then
      echo "painting images changed — building."
      exit 1
    fi
    ;;
  hvac|roofing)
    if echo "${CHANGED_IMAGES}" | grep -q "^public/images/generated/${SLUG}-"; then
      echo "${SLUG} images changed — building."
      exit 1
    fi
    ;;
esac

echo "No relevant changes for ${SLUG} — skipping build."
exit 0
