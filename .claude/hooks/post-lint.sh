#!/usr/bin/env bash
set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('file_path',''))" 2>/dev/null || true)

# TypeScript / TSX ファイル以外はスキップ
if [[ ! "$FILE_PATH" =~ \.(ts|tsx)$ ]]; then
  exit 0
fi

# どのワークスペースか判定
if [[ "$FILE_PATH" == *"/apps/web/"* ]]; then
  WORKSPACE_DIR="apps/web"
elif [[ "$FILE_PATH" == *"/apps/api/"* ]]; then
  WORKSPACE_DIR="apps/api"
elif [[ "$FILE_PATH" == *"/packages/shared/"* ]]; then
  WORKSPACE_DIR="packages/shared"
else
  exit 0
fi

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"
cd "$REPO_ROOT"

# ESLint チェック（設定がある場合のみ）
if [ -f "$WORKSPACE_DIR/eslint.config.mjs" ] || [ -f "$WORKSPACE_DIR/.eslintrc.js" ]; then
  if ! pnpm --filter "$WORKSPACE_DIR" exec eslint "$FILE_PATH" --max-warnings=0 2>&1; then
    echo ""
    echo "ESLint エラーがあります。以下で修正してください:"
    echo "  pnpm --filter $WORKSPACE_DIR exec eslint \"$FILE_PATH\" --fix"
    exit 1
  fi
fi
