#!/usr/bin/env bash
set -euo pipefail
AGENCY_OS_PATH="${AGENCY_OS_PATH:-../agency-os}"
cp "$AGENCY_OS_PATH/lib/types/client-config.ts" "$(dirname "$0")/../types/config.ts"
echo "Synced $AGENCY_OS_PATH/lib/types/client-config.ts → types/config.ts"
