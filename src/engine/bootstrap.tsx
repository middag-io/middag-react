/**
 * bootstrap — mounts a PageContract-driven React app at a DOM target.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import type { PageContract } from "@/contracts/page-contract";
import { ContractPage } from "@/engine/ContractPage";
import { registerDefaults } from "@/engine/register-defaults";

export function mountContract(target: HTMLElement, contract: PageContract): void {
  registerDefaults();
  const root = createRoot(target);
  root.render(
    <StrictMode>
      <ContractPage contract={contract} />
    </StrictMode>,
  );
}
