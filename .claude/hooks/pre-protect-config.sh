#!/usr/bin/env bash
set -euo pipefail

PROTECTED_FILES=(
  ".claude/settings.json"
  ".claude/hooks/pre-protect-config.sh"
  ".claude/hooks/post-lint.sh"
)

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('file_path',''))" 2>/dev/null || true)

for protected in "${PROTECTED_FILES[@]}"; do
  if [[ "$FILE_PATH" == *"$protected"* ]]; then
    echo "BLOCK: $FILE_PATH は保護されたファイルです。手動で変更してください。" >&2
    exit 2
  fi
done
