#!/usr/bin/env bash
#
# Pack acceptance test — validates that consumers can install and compile
# against the published package. Catches broken .d.ts, missing exports,
# and dependency issues that unit tests miss.
#
# Usage: bash scripts/test-pack-acceptance.sh
# Prerequisites: npm run build (lib must be built first)
#

set -euo pipefail

echo "=== Pack Acceptance Test ==="

# 1. Pack the lib
echo "[1/5] Packing @middag-io/react..."
TARBALL=$(npm pack --pack-destination /tmp 2>/dev/null | tail -1)
TARBALL_PATH="/tmp/$TARBALL"
echo "  Packed: $TARBALL_PATH"

# 2. Create temp consumer project
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR" "$TARBALL_PATH"' EXIT
echo "[2/5] Creating temp consumer in $TEMP_DIR..."

cat > "$TEMP_DIR/package.json" << 'PKGJSON'
{
  "name": "test-consumer",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@inertiajs/react": "^2.0.0",
    "@inertiajs/core": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
}
PKGJSON

cat > "$TEMP_DIR/tsconfig.json" << 'TSCONFIG'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": false,
    "esModuleInterop": true
  },
  "include": ["test-imports.ts"]
}
TSCONFIG

# Test file that exercises key exports
cat > "$TEMP_DIR/test-imports.ts" << 'TESTIMPORTS'
// Verify core exports compile
import type {
  PageContract,
  PageMeta,
  BlockDescriptor,
  LayoutDescriptor,
  ContractPageProps,
  SharedProps,
  SharedPropsAuth,
  NavigationTreePayload,
  NavigationNode,
  DenseTableBlockData,
  MetricCardBlockData,
  FormCondition,
  ActionConfirmation,
  ConnectorStatus,
  ConnectorDetail,
  PageAction,
  Breadcrumb,
  PageContractValidationError,
} from "@middag-io/react";

// Verify runtime exports exist
import {
  ContractPage,
  registerDefaults,
  registerShell,
  registerLayout,
  registerBlock,
  resolveShell,
  resolveLayout,
  resolveBlock,
  shellRegistry,
  layoutRegistry,
  blockRegistry,
  I18nProvider,
  useTranslation,
  validatePageContract,
  pageContractSchema,
} from "@middag-io/react";

// Verify types are usable (not just importable). shell/layout template are plain
// strings in the free wire surface; the premium Shell/LayoutTemplate unions and
// FormPanelBlockData moved to @middag-io/react-pro.
const _contract: PageContract = {
  version: "1",
  shell: "product",
  page: { key: "test", title: "Test" },
  layout: { template: "stack", regions: {} },
};

// Verify validation function returns correct type
const _errors: PageContractValidationError[] | null = validatePageContract(_contract);

// Suppress unused variable warnings
void _contract;
void _errors;
void ContractPage;
void registerDefaults;
void registerShell;
void registerLayout;
void registerBlock;
void resolveShell;
void resolveLayout;
void resolveBlock;
void shellRegistry;
void layoutRegistry;
void blockRegistry;
void I18nProvider;
void useTranslation;
void pageContractSchema;
TESTIMPORTS

# 3. Install dependencies + packed tarball
echo "[3/5] Installing dependencies..."
cd "$TEMP_DIR"
npm install --no-audit --no-fund "$TARBALL_PATH" 2>&1 | tail -3

# 4. Run tsc
echo "[4/5] Running TypeScript compiler..."
if npx tsc --noEmit 2>&1; then
  echo "  ✓ TypeScript compilation succeeded"
else
  echo "  ✗ TypeScript compilation FAILED"
  echo ""
  echo "  This means consumers cannot use the package."
  echo "  Common causes: unresolved @/ path aliases in .d.ts,"
  echo "  missing exports in index.ts, wrong types field in package.json."
  exit 1
fi

# 5. Done
echo "[5/5] Done!"
echo ""
echo "=== Pack Acceptance Test PASSED ==="
echo "  Consumer can install, import types, and compile against @middag-io/react."
