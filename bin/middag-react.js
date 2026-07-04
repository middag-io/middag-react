#!/usr/bin/env node
/* global console, process */

/**
 * @middag-io/react CLI
 *
 * Run from inside ui/ (where @middag-io/react is installed).
 *
 * Commands:
 *   doctor     — Validate project setup
 *   dev        — Start mock dev server
 *   add-block  — Scaffold a new block type
 *   upgrade    — Check for updates and run codemods
 *
 * For bootstrapping a new project, use: npx create-middag-ui
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

// ── Helpers ────────────────────────────────────────────────────────────────

function log(msg) { console.log(`\x1b[36m@middag-io/react\x1b[0m ${msg}`); }
function success(msg) { console.log(`  \x1b[32m✓\x1b[0m ${msg}`); }
function warn(msg) { console.log(`  \x1b[33m⚠\x1b[0m ${msg}`); }
function fail(msg) { console.log(`  \x1b[31m✗\x1b[0m ${msg}`); }

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: "inherit", ...opts });
}

// ── Commands ───────────────────────────────────────────────────────────────

function cmdDoctor(cwd) {
  log("Checking project setup...\n");
  let pass = 0, warns = 0, fails = 0;

  // Node version
  const nodeVer = process.version;
  const nodeMajor = parseInt(nodeVer.slice(1), 10);
  if (nodeMajor >= 20) { success(`Node ${nodeVer}`); pass++; }
  else { warn(`Node ${nodeVer} (recommended: >= 20)`); warns++; }

  // @middag-io/react installed
  const libPath = join(cwd, "node_modules", "@middag-io", "react");
  if (existsSync(libPath)) { success("@middag-io/react installed"); pass++; }
  else { fail("@middag-io/react not found — run: npm install"); fails++; }

  // Registry config (GitHub Packages uses ~/.npmrc global, npm public needs nothing)
  const globalNpmrc = join(process.env.HOME || process.env.USERPROFILE || "", ".npmrc");
  const localNpmrc = join(cwd, ".npmrc");
  if (existsSync(globalNpmrc) && readFileSync(globalNpmrc, "utf8").includes("@middag-io:registry")) {
    success("GitHub Packages registry configured (global ~/.npmrc)");
    pass++;
  } else if (existsSync(localNpmrc) && readFileSync(localNpmrc, "utf8").includes("@middag-io:registry")) {
    success("Registry configured (local .npmrc)");
    warn("Consider moving token to ~/.npmrc (global) for security");
    pass++; warns++;
  } else {
    success("Using npm public registry (no auth needed)");
    pass++;
  }

  // Peer dependencies
  for (const dep of ["react", "react-dom", "@inertiajs/react"]) {
    const depPath = join(cwd, "node_modules", dep);
    if (existsSync(depPath)) { success(`Peer dep: ${dep}`); pass++; }
    else { fail(`Peer dep missing: ${dep}`); fails++; }
  }

  // TypeScript
  const tsconfigPath = join(cwd, "tsconfig.json");
  if (existsSync(tsconfigPath)) { success("tsconfig.json"); pass++; }
  else { warn("tsconfig.json missing"); warns++; }

  // Vite config
  const viteConfig = join(cwd, "vite.mock.config.ts");
  if (existsSync(viteConfig)) { success("vite.mock.config.ts"); pass++; }
  else { warn("vite.mock.config.ts missing"); warns++; }

  // Summary
  console.log(`\n  ${pass} passed, ${warns} warnings, ${fails} failures`);
  if (fails > 0) {
    console.log("\n  Fix failures before proceeding.");
    console.log("  Docs: https://docs.middag.io/getting-started\n");
    process.exit(1);
  }
  if (warns > 0) console.log("\n  Warnings are non-blocking but worth fixing.\n");
  else console.log("\n  Environment OK.\n");
}

function cmdDev(cwd) {
  if (!existsSync(join(cwd, "package.json"))) {
    fail("package.json not found. Are you inside ui/?");
    process.exit(1);
  }
  log("Starting mock dev server...\n");
  run("npm run dev:mock", { cwd });
}

function cmdAddBlock(cwd, blockType) {
  if (!blockType) {
    fail("Usage: npx @middag-io/react add-block <type_key>");
    console.log("  Example: npx @middag-io/react add-block chart_panel");
    process.exit(1);
  }

  const pascalName = blockType
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("") + "Block";

  const blockDir = join(cwd, "src", "blocks");
  mkdirSync(blockDir, { recursive: true });

  const blockPath = join(blockDir, `${pascalName}.tsx`);
  if (existsSync(blockPath)) {
    warn(`${blockPath} already exists`);
    return;
  }

  writeFileSync(blockPath, `import type { BlockProps } from "@middag-io/react";

interface ${pascalName}Data {
  title: string;
  // Add your block data fields here
}

export function ${pascalName}({ block }: BlockProps<${pascalName}Data>) {
  return (
    <div className="rounded-md border p-4">
      <h3 className="text-sm font-medium text-foreground">
        {block.data.title}
      </h3>
      {/* Implement your block UI here */}
    </div>
  );
}
`);
  success(`Created ${blockPath}`);

  // Create mock data factory
  const mockDataDir = join(cwd, "mock", "data");
  mkdirSync(mockDataDir, { recursive: true });

  const factoryPath = join(mockDataDir, `${blockType}.ts`);
  if (!existsSync(factoryPath)) {
    writeFileSync(factoryPath, `import type { BlockDescriptor } from "@middag-io/react";

export function create${pascalName.replace("Block", "")}Block(
  t: (key: string) => string,
): BlockDescriptor {
  return {
    key: "${blockType}_1",
    type: "${blockType}",
    data: {
      title: t("${blockType}.title"),
    },
  };
}
`);
    success(`Created ${factoryPath}`);
  }

  console.log(`\n  Next steps:`);
  console.log(`    1. Register the block: registerBlock("${blockType}", ${pascalName})`);
  console.log(`    2. Add i18n keys for "${blockType}.*" in EN and PT-BR`);
  console.log(`    3. Use in a PageContract: { key: "${blockType}_1", type: "${blockType}", data: {...} }`);
  console.log(`\n  Docs: https://docs.middag.io/guides/custom-blocks\n`);
}

/**
 * Parse a semver string like "0.7.0" or "^0.6.0" into [major, minor, patch].
 * Strips leading ^ ~ >= etc.
 */
function parseSemver(v) {
  const m = String(v).match(/(\d+)\.(\d+)\.(\d+)/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

/**
 * Compare two semver tuples: -1 (a < b), 0 (a == b), 1 (a > b).
 */
function compareSemver(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }
  return 0;
}

/**
 * Discover codemod files in bin/codemods/ and return those whose version
 * is > currentVer and <= targetVer, sorted ascending.
 */
function discoverCodemods(currentVer, targetVer) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const codemodsDir = join(__dirname, "codemods");

  if (!existsSync(codemodsDir)) return [];

  const files = readdirSync(codemodsDir).filter((f) => /^v[\d.]+\.mjs$/.test(f));
  const candidates = [];

  for (const file of files) {
    const ver = parseSemver(file);
    if (!ver) continue;
    // Include codemods where: currentVer < codemodVer <= targetVer
    if (compareSemver(ver, currentVer) > 0 && compareSemver(ver, targetVer) <= 0) {
      candidates.push({ file, ver, path: join(codemodsDir, file) });
    }
  }

  // Sort ascending by version
  candidates.sort((a, b) => compareSemver(a.ver, b.ver));
  return candidates;
}

async function cmdUpgrade(cwd) {
  log("Checking for updates...\n");
  const pkgPath = join(cwd, "package.json");

  if (!existsSync(pkgPath)) {
    fail("package.json not found. Are you inside ui/?");
    process.exit(1);
  }

  try {
    const latest = execSync("npm view @middag-io/react version 2>/dev/null", { encoding: "utf8" }).trim();
    const currentPkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    const currentRaw = currentPkg.dependencies?.["@middag-io/react"] || "unknown";

    console.log(`  Current: ${currentRaw}`);
    console.log(`  Latest:  ${latest}`);

    const currentVer = parseSemver(currentRaw);
    const targetVer = parseSemver(latest);

    if (currentRaw.includes(latest)) {
      success("Already up to date");
    } else {
      log("Updating...");
      run("npm install @middag-io/react@latest", { cwd });
      success(`Updated to ${latest}`);
    }

    // ── Codemods ────────────────────────────────────────────────────────
    if (currentVer && targetVer && compareSemver(currentVer, targetVer) < 0) {
      const codemods = discoverCodemods(currentVer, targetVer);

      if (codemods.length > 0) {
        console.log("");
        log(`Running ${codemods.length} codemod(s)...\n`);

        let applied = 0;
        for (const cm of codemods) {
          const mod = await import(cm.path);
          const desc = mod.description || cm.file;
          console.log(`  \x1b[36m▸\x1b[0m ${cm.file}: ${desc}`);
          try {
            await mod.default(cwd);
            applied++;
          } catch (err) {
            fail(`Codemod ${cm.file} failed: ${err.message}`);
          }
        }

        console.log("");
        success(`${applied}/${codemods.length} codemod(s) applied`);
      } else {
        console.log("");
        success("No codemods needed for this upgrade");
      }
    }
  } catch {
    warn("Could not check latest version (network or auth issue)");
    console.log("  Try: npm install @middag-io/react@latest\n");
  }
}

// ── Main ───────────────────────────────────────────────────────────────────

const [,, command, ...args] = process.argv;
const cwd = process.cwd();

switch (command) {
  case "init":
    log("The init command has moved to a separate package.");
    console.log("  Run: npx create-middag-ui\n");
    console.log("  This works without GitHub Packages auth.");
    console.log("  Docs: https://docs.middag.io/cli\n");
    break;
  case "doctor":
    cmdDoctor(cwd);
    break;
  case "dev":
    cmdDev(cwd);
    break;
  case "add-block":
    cmdAddBlock(cwd, args[0]);
    break;
  case "upgrade":
    await cmdUpgrade(cwd);
    break;
  default:
    console.log(`
  @middag-io/react CLI (run from ui/)

  Commands:
    doctor            Validate project setup
    dev               Start mock dev server
    add-block <type>  Scaffold a new block type
    upgrade           Check for updates and run codemods

  Bootstrap a new project:
    npx create-middag-ui

  Examples:
    npx @middag-io/react doctor
    npx @middag-io/react add-block chart_panel

  Docs: https://docs.middag.io
`);
    if (command) {
      fail(`Unknown command: ${command}`);
      process.exit(1);
    }
}
