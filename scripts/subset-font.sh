#!/usr/bin/env bash
set -euo pipefail

PYFTSUBSET="${PYFTSUBSET:-/Users/kitan/Library/Python/3.9/bin/pyftsubset}"

usage() {
  cat <<EOF
Usage: $0 <font.woff2> [subset]

Subsets  (latin)           A-Z a-z 0-9 basic punctuation
         (latin-ext)       latin + accented chars for Western European languages
         (all)             no subsetting (just converts to woff2 if needed)
         unicode-range     e.g. "U+0020-007E" or file with unicodes

If no subset is given, defaults to "latin".
Output is written beside the input as <name>-subset.woff2.
EOF
  exit 1
}

font="${1:-}"
subset="${2:-latin}"

[ -f "$font" ] || usage

dir=$(dirname "$font")
base=$(basename "$font")
name="${base%.*}"
dst="${dir}/${name}-subset.woff2"

case "$subset" in
  all)
    # no subsetting, just ensure it's woff2
    if [[ "$font" != *.woff2 ]]; then
      echo "Converting to woff2 without subsetting..."
      "$(dirname "$0")/convert-ttf-to-woff2.sh" "$font"
    else
      cp "$font" "$dst"
      echo "copied: $dst"
    fi
    ;;
  latin)
    unicodes="U+0020-007E,U+00A0-00FF,U+2000-206F,U+20AC,U+2122,U+2190-21BB,U+2212,U+2500-259F,U+2660-26FF,U+2700-27BF,U+FB01-FB02"
    ;;
  latin-ext)
    unicodes="U+0020-00FF,U+0100-017F,U+0180-024F,U+2000-206F,U+20AC,U+2122,U+2190-21BB,U+2212,U+FB01-FB02"
    ;;
  *)
    unicodes="$subset"
    ;;
esac

if [ "$subset" != "all" ]; then
  echo "subsetting: $font ($subset)"

  "$PYFTSUBSET" \
    --unicodes="$unicodes" \
    --output-file="$dst" \
    --flavor="woff2" \
    --no-hinting \
    --desubroutinize \
    --layout-features="*" \
    "$font" 2>&1

  echo ""
  ls -lh "$font" "$dst"
fi
