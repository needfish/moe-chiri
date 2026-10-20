#!/usr/bin/env bash
msg="${1:-update}"
if command -v jj >/dev/null && jj root >/dev/null 2>&1; then
  jj commit -m "$msg"
  jj bookmark set -r @- main
  jj git push
else
  git add -A
  git commit -m "$msg"
  git push
fi
