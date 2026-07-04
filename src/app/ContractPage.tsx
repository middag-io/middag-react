/**
 * ContractPage — entry point for any page driven by PageContract.
 *
 * Resolves shell → layout → blocks through registries (ADR-807).
 * Feature pages compose their contract in the backend; the runtime
 * handles rendering deterministically.
 *
 * Validation (D4): Zod validates the contract shape on entry. Invalid
 * contracts render a diagnostic panel in dev, preventing white screens.
 *
 * Fallbacks (D5): Unknown layout falls back to "stack" with console.warn.
 */

import { Suspense, useCallback, useMemo, type ReactElement } from "react";

import { EntityRoutesProvider } from "@/app/EntityRoutes";
import { isLazyBlock, LazyBlock } from "@/app/LazyBlock";
import { resolveBlock, resolveLayout, resolveShell } from "@/app/registries";
import { NavErrorBoundary } from "@/base/shell/partials/NavErrorBoundary";
import { OverlayScreen } from "@/base/shell/partials/OverlayScreen";
import type { BlockDescriptor, ContractPageProps } from "@/contracts/page-contract";
import { validatePageContract } from "@/contracts/page-contract-schema";
import { useTranslation } from "@/i18n/useTranslation";

// Registry-based dynamic component resolution (ADR-807 §6). Shell and Layout are
// stable singleton references retrieved from the registry — not new components.
/* eslint-disable react-hooks/static-components */
export function ContractPage({ contract, overlay }: ContractPageProps): ReactElement {
  // All hooks called unconditionally before any early returns.
  const { t } = useTranslation();
  const validationErrors = useMemo(() => validatePageContract(contract), [contract]);

  const Shell = useMemo(
    () => resolveShell(contract?.shell) ?? resolveShell("immersive"),
    [contract?.shell],
  );

  // D5: unknown layout falls back to "stack" instead of rendering error
  const Layout = useMemo(() => {
    const resolved = resolveLayout(contract?.layout?.template);
    if (!resolved) {
      return resolveLayout("stack");
    }
    return resolved;
  }, [contract?.layout?.template]);

  // D15: stable reference — prevents Layout re-renders if it's memoized
  const renderBlock = useCallback(
    (block: BlockDescriptor): ReactElement | null => {
      const Block = resolveBlock(block.type);

      if (!Block) {
        // role="alert" surfaces the diagnostic to assistive tech; the specific
        // block type is a dev-only detail (verbose só DEV) — prod shows only the
        // translated category so internal keys never leak to end users.
        return (
          <div
            key={block.key}
            role="alert"
            className="border-muted-foreground/30 text-muted-foreground rounded border border-dashed p-2 text-xs"
          >
            {t("middag.ui.block.unknown_type")}
            {import.meta.env.DEV ? (
              <>
                {" "}
                <code>{block.type}</code>
              </>
            ) : null}
          </div>
        );
      }

      // Lazy blocks fetch data via Inertia partial reload on mount
      if (isLazyBlock(block)) {
        return (
          <NavErrorBoundary key={block.key}>
            <LazyBlock block={block} Component={Block} />
          </NavErrorBoundary>
        );
      }

      return (
        <NavErrorBoundary key={block.key}>
          <Suspense fallback={<div className="bg-muted animate-pulse rounded p-4" />}>
            <Block block={block} />
          </Suspense>
        </NavErrorBoundary>
      );
    },
    [t],
  );

  // ── Early returns after all hooks ───────────────────────────────────────

  if (validationErrors) {
    // The per-field validation list is a dev diagnostic (verbose só DEV); prod
    // renders only the translated headline inside the alert.
    return (
      <div
        role="alert"
        className="border-destructive/20 bg-destructive/10 text-destructive m-4 rounded-md border p-4 text-sm"
      >
        <p className="font-semibold">{t("middag.ui.contract.invalid")}</p>
        {import.meta.env.DEV ? (
          <ul className="mt-2 list-inside list-disc space-y-1">
            {validationErrors.map((err, i) => (
              <li key={i}>
                <code className="text-xs">{err.field || "root"}</code>: {err.message}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }

  if (!Shell) {
    return (
      <div
        role="alert"
        className="border-destructive/20 bg-destructive/10 text-destructive m-4 rounded-md border p-4 text-sm"
      >
        {t("middag.ui.shell.unknown_type")}
        {import.meta.env.DEV ? (
          <>
            {" "}
            <code>{contract.shell}</code>
          </>
        ) : null}
      </div>
    );
  }

  if (!Layout) {
    return (
      <div
        role="alert"
        className="border-destructive/20 bg-destructive/10 text-destructive m-4 rounded-md border p-4 text-sm"
      >
        {t("middag.ui.layout.unknown_type")}
        {import.meta.env.DEV ? (
          <>
            {" "}
            <code>{contract.layout.template}</code>
          </>
        ) : null}
      </div>
    );
  }

  const shellContent = (
    <EntityRoutesProvider entities={contract.entities ?? {}}>
      <Shell>
        <Layout layout={contract.layout} renderBlock={renderBlock} />
      </Shell>
    </EntityRoutesProvider>
  );

  if (overlay) {
    return <OverlayScreen>{shellContent}</OverlayScreen>;
  }

  return shellContent;
}
