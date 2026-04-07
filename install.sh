#!/bin/bash
# install.sh — sets up the AI pre-commit hook in any git repo

set -e

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)

if [ -z "$REPO_ROOT" ]; then
  echo "❌  not inside a git repo. run this from your project root."
  exit 1
fi

HOOK_TARGET="$REPO_ROOT/.git/hooks/pre-commit"
HOOK_SOURCE="$(cd "$(dirname "$0")" && pwd)/hook/pre-commit"

# copy hook
cp "$HOOK_SOURCE" "$HOOK_TARGET"
chmod +x "$HOOK_TARGET"

echo ""
echo "✔  AI pre-commit hook installed at $HOOK_TARGET"
echo ""

# check .env exists
if [ ! -f "$REPO_ROOT/.env" ] && [ ! -f "$(dirname "$0")/.env" ]; then
  echo "⚠  no .env file found."
  echo "   create one with: echo 'GROQ_API_KEY=your_key_here' > .env"
  echo "   get a free key at: console.groq.com"
fi

echo ""
echo "   to uninstall: rm $HOOK_TARGET"
echo "   to skip once: git commit --no-verify"
echo ""