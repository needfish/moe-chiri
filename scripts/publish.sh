#!/usr/bin/env bash
set -euo pipefail

pnpm run music
pnpm run build
npx wrangler deploy
