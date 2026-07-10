#!/bin/bash
# doctor.sh — Validate development environment for @middag-io/react.
#
# Usage: npm run doctor
#
# Checks: node, npm, git, dependencies, configs, builds, hooks.
# Exit 0 = all OK, Exit 1 = issues found.

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

PASS=0
WARN=0
FAIL=0

pass() { echo "  ✓ $1"; PASS=$((PASS + 1)); }
warn() { echo "  ⚠ $1"; WARN=$((WARN + 1)); }
fail() { echo "  ✗ $1"; FAIL=$((FAIL + 1)); }

echo "=== @middag-io/react — Doctor ==="
echo ""

# ── 1. Runtime ──────────────────────────────────────────────────────────────

echo "[1/7] Runtime"

if command -v node >/dev/null 2>&1; then
  NODE_VER=$(node -v)
  NODE_MAJOR=$(echo "$NODE_VER" | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_MAJOR" -ge 20 ]; then
    pass "Node $NODE_VER"
  else
    warn "Node $NODE_VER (recommended: >=20)"
  fi
else
  fail "Node not found"
fi

if command -v npm >/dev/null 2>&1; then
  pass "npm $(npm -v)"
else
  fail "npm not found"
fi

if command -v npx >/dev/null 2>&1; then
  pass "npx available"
else
  fail "npx not found"
fi

if command -v git >/dev/null 2>&1; then
  pass "git $(git --version | awk '{print $3}')"
else
  fail "git not found"
fi

# ── 2. Git config ───────────────────────────────────────────────────────────

echo ""
echo "[2/7] Git config"

if [ -d ".git" ]; then
  pass ".git directory exists"
else
  fail ".git directory missing — run 'git init'"
fi

HOOKS_PATH=$(git config core.hooksPath 2>/dev/null || echo "")
if [ "$HOOKS_PATH" = ".githooks" ]; then
  pass "core.hooksPath = .githooks"
else
  warn "core.hooksPath = '${HOOKS_PATH:-unset}' (expected: .githooks) — run 'npm run prepare'"
fi

if [ -x ".githooks/pre-commit" ] && [ -x ".githooks/commit-msg" ] && [ -x ".githooks/pre-push" ]; then
  pass "Git hooks executable (pre-commit, commit-msg, pre-push)"
else
  warn "Git hooks missing or not executable — run 'chmod +x .githooks/*'"
fi

REMOTE=$(git remote get-url origin 2>/dev/null || echo "")
if echo "$REMOTE" | grep -q "middag-io/middag-react"; then
  pass "Remote: $REMOTE"
else
  warn "Remote: '${REMOTE:-none}' (expected: middag-io/middag-react)"
fi

# ── 3. Dependencies ────────────────────────────────────────────────────────

echo ""
echo "[3/7] Dependencies"

if [ -d "node_modules" ]; then
  pass "node_modules exists"
else
  fail "node_modules missing — run 'npm install'"
fi

if [ -f "package-lock.json" ]; then
  pass "package-lock.json exists"
else
  warn "package-lock.json missing — run 'npm install'"
fi

for pkg in react react-dom @inertiajs/react @inertiajs/core; do
  if [ -d "node_modules/$pkg" ]; then
    pass "Peer dep: $pkg"
  else
    fail "Peer dep missing: $pkg — run 'npm install'"
  fi
done

# ── 4. Config files ─────────────────────────────────────────────────────────

echo ""
echo "[4/7] Config files"

for f in package.json tsconfig.json vite.config.ts vite.mock.config.ts eslint.config.js components.json .npmrc .npmignore .changeset/config.json; do
  if [ -f "$f" ]; then
    pass "$f"
  else
    fail "$f missing"
  fi
done

PKG_NAME=$(node -e "console.log(require('./package.json').name)" 2>/dev/null)
if [ "$PKG_NAME" = "@middag-io/react" ]; then
  pass "Package name: $PKG_NAME"
else
  warn "Package name: '$PKG_NAME' (expected: @middag-io/react)"
fi

# ── 5. TypeScript ───────────────────────────────────────────────────────────

echo ""
echo "[5/7] TypeScript"

TSC_OUT=$(npx tsc --noEmit 2>&1)
TSC_EXIT=$?
if [ $TSC_EXIT -eq 0 ]; then
  pass "tsc --noEmit (0 errors)"
else
  ERRORS=$(echo "$TSC_OUT" | grep -c "error TS" || echo "?")
  fail "tsc --noEmit ($ERRORS errors)"
fi

# ── 6. Build ────────────────────────────────────────────────────────────────

echo ""
echo "[6/7] Build"

BUILD_OUT=$(npm run build 2>&1)
BUILD_EXIT=$?
if [ $BUILD_EXIT -eq 0 ]; then
  pass "vite build (lib ESM)"
  if [ -f "dist-lib/middag-react.js" ]; then
    SIZE=$(wc -c < "dist-lib/middag-react.js" | tr -d ' ')
    pass "dist-lib/middag-react.js (${SIZE} bytes)"
  else
    warn "dist-lib/middag-react.js not found after build"
  fi
else
  fail "vite build failed"
fi

# ── 7. Examples ─────────────────────────────────────────────────────────────

echo ""
echo "[7/7] ReUI Examples"

if [ -d "examples" ]; then
  EXAMPLE_COUNT=$(find examples -name "c-*.tsx" -type f 2>/dev/null | wc -l | tr -d ' ')
  if [ "$EXAMPLE_COUNT" -gt 0 ]; then
    pass "Examples: $EXAMPLE_COUNT files"
  else
    warn "Examples dir exists but empty — run 'npm run sync:examples'"
  fi
else
  warn "No examples — run 'npm run sync:examples'"
fi

# ── Summary ─────────────────────────────────────────────────────────────────

echo ""
echo "=== Results ==="
echo "  ✓ $PASS passed"
echo "  ⚠ $WARN warnings"
echo "  ✗ $FAIL failures"

if [ $FAIL -gt 0 ]; then
  echo ""
  echo "Fix failures before committing."
  exit 1
fi

if [ $WARN -gt 0 ]; then
  echo ""
  echo "Warnings are non-blocking but worth fixing."
fi

echo ""
echo "Environment OK."
exit 0
