#!/bin/bash
# sync-reui-examples.sh — Sync ReUI component examples from @reui registry.
#
# Usage:
#   npm run sync:examples              # Full sync (auto-discover + install + patch + format)
#   npm run sync:examples -- --dry-run # List what would be installed
#   npm run sync:examples -- --check   # Exit 1 if new examples available (for CI)
#
# Auto-discovers available examples from the ReUI registry index.
# Destination: src/primitives/examples/
# Registry: radix-maia via components.json @reui registry
#
# This script is the source of truth for ReUI examples in middag-react.

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

DRY_RUN=false
CHECK_ONLY=false
[ "$1" = "--dry-run" ] && DRY_RUN=true
[ "$1" = "--check" ] && CHECK_ONLY=true

REGISTRY_URL="https://reui.io/r/index.json"
PARALLEL=${REUI_PARALLEL:-4}

echo "=== @middag-io/react — ReUI Examples Sync ==="

# ── Step 0: Auto-discover categories from registry ──────────────────────────

echo "[0/3] Discovering available examples from registry..."

CATEGORIES=$(curl -sf "$REGISTRY_URL" 2>/dev/null | node -e "
  const d=[];
  process.stdin.on('data',c=>d.push(c));
  process.stdin.on('end',()=>{
    try {
      const items = JSON.parse(d.join(''));
      const keys = Array.isArray(items) ? items.map(i=>i.name||i) : Object.keys(items);
      const cats = {};
      for (const name of keys) {
        const m = String(name).match(/^c-(.+)-(\d+)$/);
        if (m) cats[m[1]] = Math.max(cats[m[1]]||0, parseInt(m[2]));
      }
      for (const [k,v] of Object.entries(cats).sort()) process.stdout.write(k+':'+v+'\n');
    } catch(e) {
      process.stderr.write('Failed to parse registry: '+e.message+'\n');
      process.exit(1);
    }
  })
" 2>/dev/null) || true

# Fallback: if registry is unreachable, use hardcoded catalog
if [ -z "$CATEGORIES" ]; then
  echo "  Registry unreachable — using fallback catalog."
  CATEGORIES=$(cat << 'FALLBACK'
accordion:11
alert:20
alert-dialog:14
aspect-ratio:8
autocomplete:12
avatar:35
badge:25
breadcrumb:15
button:61
button-group:57
calendar:30
card:18
carousel:11
chart:25
checkbox:22
collapsible:10
combobox:20
command:8
context-menu:10
data-grid:29
date-selector:4
dialog:10
drawer:5
dropdown-menu:18
empty:20
field:11
file-upload:10
filters:9
frame:18
hover-card:8
input:31
input-group:40
input-otp:6
item:12
kanban:5
kbd:6
label:13
menubar:5
native-select:6
navigation-menu:4
number-field:6
pagination:15
phone-input:8
popover:11
progress:8
radio-group:17
rating:9
resizable:10
scroll-area:5
scrollspy:2
select:33
separator:6
sheet:4
skeleton:10
slider:12
sonner:21
sortable:7
spinner:12
stepper:15
switch:14
table:17
tabs:9
textarea:6
timeline:12
toggle:14
toggle-group:16
tooltip:16
tree:7
FALLBACK
)
else
  echo "  Registry OK — auto-discovered categories."
fi

# Count
CAT_COUNT=$(echo "$CATEGORIES" | wc -l | tr -d ' ')
TOTAL=$(echo "$CATEGORIES" | awk -F: '{s+=$2} END {print s}')
echo "  Categories: $CAT_COUNT"
echo "  Total examples: $TOTAL"

# ── Check mode: compare with installed ──────────────────────────────────────

if [ "$CHECK_ONLY" = true ]; then
  INSTALLED=$(ls src/primitives/examples/c-*.tsx 2>/dev/null | wc -l | tr -d ' ')
  echo ""
  echo "  Installed: $INSTALLED"
  echo "  Available: $TOTAL"
  if [ "$INSTALLED" -lt "$TOTAL" ]; then
    DIFF=$((TOTAL - INSTALLED))
    echo "  NEW: $DIFF examples available. Run 'npm run sync:examples' to update."
    exit 1
  else
    echo "  Up to date."
    exit 0
  fi
fi

# ── Dry run: list categories ────────────────────────────────────────────────

if [ "$DRY_RUN" = true ]; then
  echo ""
  echo "DRY RUN — would install:"
  echo "$CATEGORIES" | while IFS=: read -r cat max; do
    echo "  $cat: $max examples"
  done
  exit 0
fi

# ── Step 1: Install examples ────────────────────────────────────────────────

echo ""
echo "[1/3] Installing ReUI examples (parallel=$PARALLEL)..."

echo "$CATEGORIES" | xargs -P "$PARALLEL" -I {} bash -c '
  cat="${1%%:*}"
  max="${1##*:}"
  args=""
  for i in $(seq 1 "$max"); do
    args="$args @reui/c-${cat}-${i}"
  done
  if npx shadcn@latest add $args --overwrite --yes >/dev/null 2>&1; then
    echo "  OK: $cat ($max)"
  else
    echo "  FAIL: $cat"
  fi
' _ {}

echo "  Categories processed: $CAT_COUNT"

# ── Step 2: Post-install patches ────────────────────────────────────────────

echo ""
echo "[2/3] Applying post-install patches..."

# use-mobile.ts — ReUI overwrites with setState-in-effect pattern.
# Restore useSyncExternalStore version (React 18+ best practice).
cat > src/lib/hooks/use-mobile.ts << 'PATCH_EOF'
import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;

function subscribe(callback: () => void): () => void {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
    return window.innerWidth < MOBILE_BREAKPOINT;
}

function getServerSnapshot(): boolean {
    return false;
}

export function useIsMobile(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
PATCH_EOF
echo "  Patched: use-mobile.ts (useSyncExternalStore)"

# Remove duplicate hooks dir recreated by ReUI
if [ -d "src/hooks" ]; then
  rm -rf src/hooks
  echo "  Removed: src/hooks/ (duplicate — canonical is src/lib/hooks/)"
fi

# ── Step 3: Canonicalize examples (deterministic output) + format ───────────

echo ""
echo "[3/3] Canonicalizing examples + formatting..."

# WHY: the registry's raw output is non-deterministic across syncs (Tailwind class
# order, import statement/member order, semicolons, line wrapping all drift between
# registry styles, e.g. radix-maia -> radix-nova). Without canonicalization every
# re-sync produces hundreds of cosmetic-only diffs that mask real content changes.
#
# Import PATHS are already correct: shadcn rewrites them on install via the
# components.json aliases (hooks -> @/lib/hooks, ui -> @/primitives/reui). Here we
# only neutralize FORMATTING so output is a pure function of upstream content.
#
# Examples are .prettierignore'd (untouched by everyday `npm run format`) and
# eslint-ignored (no import-sort rule exists), so this script owns their canonical
# form and applies it explicitly.

PRETTIER="$PROJECT_ROOT/node_modules/.bin/prettier"

# (a) Prettier pass — adds semicolons, wraps, and (via prettier-plugin-tailwindcss
#     from .prettierrc) sorts Tailwind classes. --ignore-path /dev/null bypasses the
#     examples entry in .prettierignore; --config forces the plugin to load.
"$PRETTIER" --config "$PROJECT_ROOT/.prettierrc" --ignore-path /dev/null \
  --write "src/primitives/examples/c-"'*'".tsx" >/dev/null 2>&1
echo "  Prettier + Tailwind class order applied to examples"

# (b) Deterministic import sort — statements + named members. No eslint rule does
#     this and examples are eslint-ignored, so do it here. Runs AFTER prettier so
#     every import already terminates in ';' (regex relies on it).
node -e '
const fs = require("fs"), path = require("path");
const dir = "src/primitives/examples";
for (const fn of fs.readdirSync(dir).filter((f) => /^c-.*\.tsx$/.test(f))) {
  const p = path.join(dir, fn);
  let s = fs.readFileSync(p, "utf8");
  const m = s.match(/^(?:import[\s\S]*?;\s*)+/);
  if (!m) continue;
  const imports = m[0]
    .match(/import[\s\S]*?;/g)
    .map((x) => {
      x = x.replace(/\s+/g, " ").trim();
      return x.replace(/\{([^}]*)\}/, (_, g) =>
        "{ " + g.split(",").map((t) => t.trim()).filter(Boolean).sort().join(", ") + " }",
      );
    })
    .sort();
  s = imports.join("\n") + "\n" + s.slice(m[0].length).replace(/^\s+/, "");
  fs.writeFileSync(p, s);
}
'
echo "  Imports sorted (statements + members)"

# (c) Second prettier pass — re-wraps any long import the sorter collapsed, so the
#     final bytes match what prettier would emit for the sorted order (idempotent).
"$PRETTIER" --config "$PROJECT_ROOT/.prettierrc" --ignore-path /dev/null \
  --write "src/primitives/examples/c-"'*'".tsx" >/dev/null 2>&1

# (d) Format the rest of the repo (examples stay ignored here).
npm run format

# ── Summary ─────────────────────────────────────────────────────────────────

block_count=$(ls src/primitives/examples/c-*.tsx 2>/dev/null | wc -l | tr -d ' ')

echo ""
echo "=== Sync Complete ==="
echo "Examples in src/primitives/examples/: $block_count"
echo "Run 'npm run typecheck' to verify."
