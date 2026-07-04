/**
 * DenseTableBlock — contract-driven data table with sort, filter, pagination.
 *
 * Maps BlockDescriptor<DenseTableBlockData> to DataTable partial props.
 * Server interactions use Inertia partial reload.
 *
 * @see NV-05-ux-blocks.md §1
 */

import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";
import { router } from "@inertiajs/core";

import type { BlockProps } from "@/app/registries";
import { usePolling } from "@/base/hooks/usePolling";
import { ConfirmationDialog } from "@/base/partials/ConfirmationDialog";
import { DataTable } from "@/base/partials/DataTable";
import type { DataTableParamChange } from "@/base/partials/DataTable/types";
import { useInspector } from "@/base/shell/partials/InspectorContext";
import { evaluateCondition } from "@/base/utils/conditions";
import { interpolate } from "@/base/utils/interpolate";
import type { ActionConfirmation, DenseTableBlockData } from "@/contracts/block-data";
import { renderLabel } from "@/i18n/render-label";
import { useTranslation } from "@/i18n/useTranslation";
import { resolveActionTarget } from "@/lib/actions/resolve-action-target";

export function DenseTableBlock({ block }: BlockProps<DenseTableBlockData>): ReactElement {
  const { t } = useTranslation();
  const { data, key, meta } = block;
  const isLoading = meta?.loading === true;
  const clientSide = (meta as Record<string, unknown> | undefined)?.clientSide === true;
  const rowKeyField = (meta?.rowKey as string) ?? "id";
  const reloadKey = (meta?.partialReloadKey as string) ?? key;
  // clientSide tables filter in-browser; seed the search box from the URL
  // ?search= param so tag-chip links (e.g. /tickets?search=<tag>) and shareable
  // search URLs actually filter on load. Server mode echoes search via the
  // contract, so this only applies to clientSide.
  const initialClientSearch =
    clientSide && typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("search") ?? "")
      : "";

  const { select, selectedId, enabled: inspectorEnabled } = useInspector();

  usePolling(block.poll);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    confirmation: ActionConfirmation;
    row: Record<string, unknown>;
    href?: string;
    method?: string;
    isNavigation?: boolean;
    waiting: boolean;
    /** Request body for bulk actions (e.g. { ids }); row actions leave this unset. */
    payload?: Record<string, unknown>;
  } | null>(null);

  // Auto-close waitForPolling dialog when polling stops
  const pollingEnabled = (block.poll?.intervalMs ?? 0) > 0;
  const prevPollingRef = useRef(pollingEnabled);
  useEffect(() => {
    if (prevPollingRef.current && !pollingEnabled && confirmDialog?.waiting) {
      setConfirmDialog(null);
    }
    prevPollingRef.current = pollingEnabled;
  }, [pollingEnabled, confirmDialog?.waiting]);

  const handleRowClick = useCallback(
    (row: Record<string, unknown>) => {
      if (inspectorEnabled) {
        const id = row.id ?? row[rowKeyField];
        if (id != null) select(id as string | number);
        return;
      }
      if (data.rowHref) {
        const href = interpolate(data.rowHref, row);
        router.visit(href);
      }
    },
    [inspectorEnabled, rowKeyField, select, data.rowHref],
  );

  // Auto-select first row when inspector is enabled and page loads
  useEffect(() => {
    if (inspectorEnabled && data.rows.length > 0 && selectedId == null) {
      const firstRow = data.rows[0];
      const id = firstRow.id ?? firstRow[rowKeyField];
      if (id != null) select(id as string | number);
    }
  }, [inspectorEnabled, data.rows, rowKeyField, select, selectedId]);

  const handleParamChange = useCallback(
    (params: DataTableParamChange) => {
      const queryParams: Record<string, string | number> = {};

      if (params.page !== undefined) queryParams.page = params.page;
      if (params.perPage !== undefined) queryParams.per_page = params.perPage;
      if (params.sort?.key) {
        queryParams.sort = params.sort.key;
        queryParams.direction = params.sort.direction;
      }
      if (params.search !== undefined) queryParams.search = params.search;
      if (params.filters) {
        Object.entries(params.filters).forEach(([k, v]) => {
          queryParams[`filter[${k}]`] = Array.isArray(v) ? v.join(",") : v;
        });
      }

      router.get(window.location.pathname, queryParams as Record<string, string>, {
        preserveState: true,
        preserveScroll: true,
        only: [reloadKey],
      });
    },
    [reloadKey],
  );

  const handleBulkAction = useCallback(
    (actionId: string, selectedKeys: string[]) => {
      const action = data.bulkActions?.find((a) => a.id === actionId);
      if (!action) return;
      const target = resolveActionTarget(action);
      const method = (target.kind === "link" ? "post" : target.method) as
        | "post"
        | "put"
        | "patch"
        | "delete";

      // Route through the confirmation dialog when the bulk action declares one
      // — symmetry with row actions. Destructive bulk ops must not fire silently.
      if (action.confirmation) {
        setConfirmDialog({
          open: true,
          confirmation: action.confirmation,
          row: { count: selectedKeys.length },
          href: target.url,
          method,
          isNavigation: false,
          waiting: false,
          payload: { ids: selectedKeys },
        });
        return;
      }

      router[method](
        target.url,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Inertia router payload typing
        { ids: selectedKeys } as Record<string, unknown> as any,
        {
          preserveState: true,
          only: [reloadKey],
        },
      );
    },
    [reloadKey, data.bulkActions],
  );

  // Map block columns to DataTable columns
  const columns = data.columns.map((col) => ({
    key: col.key,
    label: renderLabel(col.label, t),
    type:
      col.variant === "badge"
        ? ("status" as const)
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any -- column variant passthrough
          ((col.variant as any) ?? ("text" as const)),
    timestampFormat: col.timestampFormat,
    sortable: col.sortable,
    minWidth: col.minWidth,
    href: col.href,
    entityType: col.entity?.type,
    entityIdField: col.entity?.id,
  }));

  // Map sort
  const sort = data.sort?.column
    ? {
        key: data.sort.column,
        direction: data.sort.direction ?? ("asc" as const),
      }
    : undefined;

  // Map row actions with condition evaluation and confirmation support
  const rowActions = data.rowActions?.map((action) => {
    const target = resolveActionTarget(action);
    return {
      id: action.id,
      label: renderLabel(action.label, t),
      icon: action.icon,
      intent: action.intent === "danger" ? ("danger" as const) : ("default" as const),
      variant: action.variant,
      onAction: (row: Record<string, unknown>) => {
        const resolvedHref = interpolate(target.url, row);

        if (action.confirmation) {
          setConfirmDialog({
            open: true,
            confirmation: action.confirmation,
            row,
            href: resolvedHref,
            method: target.method,
            isNavigation: target.kind === "link",
            waiting: false,
          });
          return;
        }

        // Execute directly (no confirmation)
        if (target.kind === "link") {
          router.visit(resolvedHref);
        } else if (target.method === "delete") {
          router.delete(resolvedHref, {
            preserveState: true,
            only: [reloadKey],
          });
        } else {
          const method = target.method as "post" | "put" | "patch";
          router[method](resolvedHref, {} as never, {
            preserveState: true,
            only: [reloadKey],
          });
        }
      },
      hidden: (row: Record<string, unknown>) => {
        if (action.visible_when) {
          return !evaluateCondition(action.visible_when, row);
        }
        return false;
      },
      disabled: (row: Record<string, unknown>) => {
        if (action.loading_when && evaluateCondition(action.loading_when, row)) return true;
        if (action.disabled_when && evaluateCondition(action.disabled_when, row)) return true;
        return false;
      },
      loading: (row: Record<string, unknown>) => {
        if (action.loading_when) return evaluateCondition(action.loading_when, row);
        return false;
      },
      disabledReason: (row: Record<string, unknown>) => {
        if (action.disabled_reason_field)
          return String(row[action.disabled_reason_field] ?? "") || undefined;
        return undefined;
      },
    };
  });

  // Confirmation dialog handlers
  const handleConfirm = useCallback(() => {
    if (!confirmDialog) return;
    const { href, method, isNavigation, confirmation, payload } = confirmDialog;

    if (confirmation.waitForPolling) {
      setConfirmDialog((prev) => (prev ? { ...prev, waiting: true } : null));
    } else {
      setConfirmDialog(null);
    }

    if (href) {
      if (isNavigation) {
        router.visit(href);
      } else if (method === "delete") {
        // payload carries the bulk { ids } body, if any; row deletes have none.
        router.delete(href, {
          ...(payload ? { data: payload as never } : {}),
          preserveState: true,
          only: [reloadKey],
        });
      } else {
        const reqMethod = (method ?? "post") as "post" | "put" | "patch";
        router[reqMethod](href, (payload ?? {}) as never, {
          preserveState: true,
          only: [reloadKey],
        });
      }
    }
  }, [confirmDialog, reloadKey]);

  const handleCloseConfirm = useCallback(() => {
    setConfirmDialog(null);
  }, []);

  return (
    <>
      <DataTable
        columns={columns}
        rows={data.rows}
        rowKey={rowKeyField}
        pagination={
          data.pagination
            ? {
                ...data.pagination,
                page: Math.max(0, data.pagination.page - 1),
              }
            : undefined
        }
        sort={sort}
        filters={data.filters?.available}
        appliedFilters={data.filters?.applied}
        rowActions={rowActions}
        actionsAlwaysVisible={meta?.actionsAlwaysVisible === true}
        bulkActions={data.bulkActions}
        onRowClick={inspectorEnabled || data.rowHref ? handleRowClick : undefined}
        selectedRowKey={inspectorEnabled && selectedId ? String(selectedId) : undefined}
        isLoading={isLoading}
        searchValue={initialClientSearch}
        searchPlaceholder={data.searchPlaceholder}
        emptyStateIcon={data.emptyState?.icon}
        emptyStateTitle={data.emptyState?.title}
        emptyStateDescription={data.emptyState?.description}
        emptyStateCTA={
          data.emptyState?.cta
            ? {
                label: data.emptyState.cta.label,
                href: data.emptyState.cta.href,
              }
            : undefined
        }
        onParamChange={clientSide ? undefined : handleParamChange}
        onBulkAction={handleBulkAction}
        remember={block.remember ?? false}
        rememberKey={key}
        clientSide={clientSide}
      />
      {confirmDialog && (
        <ConfirmationDialog
          open={confirmDialog.open}
          onClose={handleCloseConfirm}
          onConfirm={handleConfirm}
          title={renderLabel(confirmDialog.confirmation.title, t)}
          message={interpolate(
            renderLabel(confirmDialog.confirmation.message, t),
            confirmDialog.row,
          )}
          intent={confirmDialog.confirmation.intent}
          confirmLabel={renderLabel(confirmDialog.confirmation.confirmLabel, t) || undefined}
          cancelLabel={renderLabel(confirmDialog.confirmation.cancelLabel, t) || undefined}
          waiting={confirmDialog.waiting}
          waitingMessage={confirmDialog.confirmation.waitingMessage}
        />
      )}
    </>
  );
}
