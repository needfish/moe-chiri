#!/usr/bin/env bash
msg="${1:-update}"
if command -v jj >/dev/null && jj root >/dev/null 2>&1; then
  jj commit -m "$msg"
  jj bookmark set -r @- main
  for c in $(jj log -r '::main & ~::main@origin & empty() & description("")' \
      --no-graph -T 'change_id.short() ++ "\n"')
  do
    jj describe -r "$c" -m "$msg"
  done
  jj git push
else
  git add -A
  git commit -m "$msg"
  git push
fi
