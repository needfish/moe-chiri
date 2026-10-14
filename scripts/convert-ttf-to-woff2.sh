#!/usr/bin/env bash
set -euo pipefail

PYTHON="${PYTHON:-python3}"
PYTHONPATH="${PYTHONPATH:-}"

if [ $# -eq 0 ]; then
  echo "Usage: $0 <input.ttf> [input2.otf ...]"
  exit 1
fi

for src in "$@"; do
  if [ ! -f "$src" ]; then
    echo "skip (not found): $src"
    continue
  fi

  dir=$(dirname "$src")
  base=$(basename "$src")
  name="${base%.*}"
  dst="${dir}/${name}.woff2"

  PYTHONPATH="$PYTHONPATH" "$PYTHON" -c "
from fontTools.ttLib import TTFont
import os
src = '${src//\'/\\\'}'
dst = '${dst//\'/\\\'}'
font = TTFont(src)
font.flavor = 'woff2'
font.save(dst)
font.close()
print(f'converted: {dst} ({os.path.getsize(dst)} bytes)')
" 2>&1 || {
    echo "error converting: $src"
    continue
  }

  ls -lh "$dst"
done
