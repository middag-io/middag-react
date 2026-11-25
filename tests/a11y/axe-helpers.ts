/**
 * axe-core runner for the accessibility gate.
 *
 * Fails on serious and critical violations only. Color contrast is left to
 * scripts/check-contrast.mjs: jsdom computes no styles, so axe cannot measure
 * it here.
 */

import axe from "axe-core";

const BLOCKING_IMPACTS = new Set(["serious", "critical"]);

export interface BlockingViolation {
  id: string;
  impact: string;
  help: string;
  targets: string[];
}

export async function blockingViolations(
  context: Element | Document = document,
): Promise<BlockingViolation[]> {
  const results = await axe.run(context, {
    resultTypes: ["violations"],
    rules: { "color-contrast": { enabled: false } },
  });
  return results.violations
    .filter((v) => BLOCKING_IMPACTS.has(v.impact ?? ""))
    .map((v) => ({
      id: v.id,
      impact: v.impact ?? "",
      help: v.help,
      targets: v.nodes.map((n) => n.target.join(" ")),
    }));
}
