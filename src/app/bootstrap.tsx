/**
 * bootstrap — mounts a PageContract-driven React app at a DOM target.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ContractPage } from "@/app/ContractPage";
import { registerDefaults } from "@/app/register-defaults";
import type { PageContract } from "@/contracts/page-contract";

export function mountContract(target: HTMLElement, contract: PageContract): void {
  registerDefaults();
  const root = createRoot(target);
  root.render(
    <StrictMode>
      <ContractPage contract={contract} />
    </StrictMode>,
  );
}
