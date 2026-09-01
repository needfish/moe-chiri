#!/usr/bin/env bash
set -euo pipefail

pnpm run build
npx wrangler deploy
