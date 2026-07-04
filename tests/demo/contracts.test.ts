/**
 * FREE demo harness contract validation.
 *
 * The demo/ harness must run on the Community engine alone: every shell,
 * layout and block referenced by its PageContracts has to resolve from
 * registerDefaults() (plus the harness's own "product" -> BasicShell
 * mapping) — never from @middag-io/react-pro.
 */
import { beforeAll, describe, expect, test } from "vitest";

import { registerDefaults } from "@/app/register-defaults";
import { registerShell, resolveBlock, resolveLayout, resolveShell } from "@/app/registries";
import { BasicShell } from "@/base/shell/BasicShell";
import type { BlockDescriptor, PageContract } from "@/contracts/page-contract";

import { loginContract } from "../../demo/pages/login";
import { taskDetailContract } from "../../demo/pages/task-detail";
import { editTaskContract, newTaskContract } from "../../demo/pages/task-form";
import { tasksContract } from "../../demo/pages/tasks";

const contracts: Record<string, PageContract> = {
  login: loginContract,
  tasks: tasksContract,
  "task-form (new)": newTaskContract,
  "task-form (edit)": editTaskContract,
  "task-detail": taskDetailContract,
};

beforeAll(() => {
  registerDefaults();
  // Mirrors demo/main.tsx: the Community harness maps the "product" shell
  // key to BasicShell (the rich ProductShell ships in react-pro).
  registerShell("product", BasicShell);
});

describe.each(Object.entries(contracts))("FREE demo contract: %s", (_name, contract) => {
  test("shell resolves from Community registrations", () => {
    expect(resolveShell(contract.shell ?? "basic")).toBeDefined();
  });

  test("layout template resolves from Community registrations", () => {
    expect(resolveLayout(contract.layout.template)).toBeDefined();
  });

  test("every block type resolves from Community registrations", () => {
    const regions = contract.layout.regions ?? {};
    const blocks = Object.values(regions).flat() as BlockDescriptor[];
    expect(blocks.length).toBeGreaterThan(0);
    for (const block of blocks) {
      expect(resolveBlock(block.type), `block "${block.type}" must resolve`).toBeDefined();
    }
  });
});
