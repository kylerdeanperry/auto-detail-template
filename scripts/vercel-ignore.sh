#!/usr/bin/env bash
# Vercel Ignored Build Step for the elite-service-template repo.
#
# Three Vercel projects (elite-painting / elite-roofing / elite-hvac) all
# build from this single repo on every push to main. This script short-
# circuits the build when the commit doesn't actually affect the industry
# that Vercel is currently building for.
#
# Exit code contract:
#   0 = SKIP this build  (Vercel stops here, doesn't use build minutes)
#   1 = PROCEED with build
#
# Activated via vercel.json -> "ignoreCommand": "bash scripts/vercel-ignore.sh".

set -e

SLUG="${INDUSTRY_SLUG:?INDUSTRY_SLUG must be set on the Vercel project}"

# Paths that, if touched, require a real build for ANY industry.
# Industry-specific config is gated on the slug itself below.
if git diff HEAD^ HEAD --quiet -- \
  "app/" \
  "components/" \
  "lib/" \
  "styles/" \
  "public/images/" \
  "public/logo.svg" \
  "public/favicon.ico" \
  "config/visual-config/$SLUG.json" \
  "config/fallback/$SLUG.json" \
  "package.json" \
  "package-lock.json" \
  "pnpm-lock.yaml" \
  "next.config.mjs" \
  "next.config.ts" \
  "tailwind.config.ts" \
  "postcss.config.mjs" \
  "tsconfig.json" \
  "components.json" \
  "scripts/fetch-industry-config.ts"; then
  echo "No relevant changes for ${SLUG} — skipping build."
  exit 0
fi

echo "Relevant changes detected for ${SLUG} — building."
exit 1
