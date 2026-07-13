/**
 * DataTable — high-level table partial wrapping ReUI DataGrid.
 *
 * Features: search, filters, column visibility, sorting, row selection,
 * bulk actions, row actions, skeleton loading, empty state, mobile card layout.
 *
 * @see NV-05-ux-blocks.md
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { MoreHorizontalIcon, SlidersHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";

import { useRemember } from "@/base/hooks/useRemember";
import { EmptyPlaceholder } from "@/base/partials/EmptyPlaceholder";
import { FilterBar } from "@/base/partials/FilterBar";
import { getIcon } from "@/base/utils/icons";
import { renderLabel } from "@/i18n/render-label";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { Button } from "@/primitives/reui/button";
import { Checkbox } from "@/primitives/reui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/primitives/reui/dropdown-menu";
import { Skeleton } from "@/primitives/reui/skeleton";

import { resolveCellRenderer } from "./cell-registry";
import type {
  DataTableColumn,
  DataTableParamChange,
  DataTableProps,
  DataTableRowAction,
} from "./types";

// ---------------------------------------------------------------------------
// Null-safe text fallback (used when no cell renderer is registered)
// ---------------------------------------------------------------------------

function NullSafe({ children }: { children: unknown }): ReactElement {
  if (children == null || children === "") {
    return <span className="text-muted-foreground">&mdash;</span>;
  }
  return <>{String(children)}</>;
}

// ---------------------------------------------------------------------------
// Row action overlay
// ---------------------------------------------------------------------------

function RowActionButtons<TData>({
  row,
  actions,
}: {
  row: TData;
  actions: DataTableRowAction<TData>[];
}): ReactElement {
  const { t } = useTranslation();
  const visible = actions.filter((a) => !a.hidden?.(row));
  if (visible.length === 0) return <></>;

  const inline = visible.slice(0, 2);
  const overflow = visible.slice(2);

  return (
    <div className="flex items-center justify-end gap-1">
      {inline.map((action) => {
        const isDisabled = action.disabled?.(row) ?? false;
        const isLoading = action.loading?.(row) ?? false;
        const reason = action.disabledReason?.(row);
        const isButton = action.variant === "button";

        return (
          <Button
            key={action.id}
            variant={isButton ? (action.intent === "danger" ? "destructive" : "outline") : "ghost"}
            size={isButton ? "xs" : "icon-xs"}
            onClick={(e) => {
              e.stopPropagation();
              if (!isDisabled && !isLoading) action.onAction(row);
            }}
            title={isDisabled && reason ? reason : action.label}
            disabled={isDisabled || isLoading}
            className={cn(
              !isButton && action.intent === "danger" && "text-destructive hover:text-destructive",
            )}
          >
            {isLoading ? (
              <svg
                className="size-3.5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : action.icon ? (
              <HugeiconsIcon
                icon={getIcon(action.icon) as unknown as IconSvgElement}
                className="size-3.5"
              />
            ) : null}
            {isButton && <span className="text-xs">{action.label}</span>}
          </Button>
        );
      })}
      {overflow.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={t("middag.ui.table.row_actions")}
              onClick={(e) => e.stopPropagation()}
            >
              <HugeiconsIcon icon={MoreHorizontalIcon} className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {overflow.map((action) => {
              const isDisabled = action.disabled?.(row) ?? false;
              const isLoading = action.loading?.(row) ?? false;

              return (
                <DropdownMenuItem
                  key={action.id}
                  onClick={() => {
                    if (!isDisabled && !isLoading) action.onAction(row);
                  }}
                  disabled={isDisabled || isLoading}
                  className={cn(action.intent === "danger" && "text-destructive")}
                >
                  {action.icon && (
                    <HugeiconsIcon
                      icon={getIcon(action.icon) as unknown as IconSvgElement}
                      className="mr-2 size-3.5"
                    />
                  )}
                  {action.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton width classes for column meta
// ---------------------------------------------------------------------------

const SKELETON_WIDTHS = ["w-3/4", "w-1/2", "w-2/3", "w-5/6", "w-1/3"];

// ---------------------------------------------------------------------------
// Mobile card layout
// ---------------------------------------------------------------------------

function MobileCardView<TData>({
  rows,
  columns,
  rowKey,
  rowActions,
  rowSelection,
  onToggleRow,
  hasBulkActions,
  onRowClick,
  t,
}: {
  rows: TData[];
  columns: DataTableColumn<TData>[];
  rowKey: (row: TData) => string;
  rowActions?: DataTableRowAction<TData>[];
  rowSelection: RowSelectionState;
  onToggleRow: (key: string) => void;
  hasBulkActions: boolean;
  onRowClick?: (row: TData) => void;
  t: (key: string) => string;
}): ReactElement {
  return (
    <div className="flex flex-col gap-3 p-3">
      {rows.map((row) => {
        const key = rowKey(row);
        const isSelected = !!rowSelection[key];
        const clickable = !!onRowClick;

        return (
          <div
            key={key}
            className={cn(
              "space-y-2 rounded-lg border p-4 transition-colors",
              clickable && "hover:border-primary/50 cursor-pointer",
              isSelected && "bg-muted/50 border-primary/30",
            )}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
            onClick={clickable ? () => onRowClick(row) : undefined}
            onKeyDown={
              clickable
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onRowClick(row);
                    }
                  }
                : undefined
            }
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {hasBulkActions && (
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleRow(key)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={t("middag.ui.table.select_row")}
                  />
                )}
                <span className="text-sm font-medium">
                  {columns[0] && renderCellValue(columns[0], row)}
                </span>
              </div>
              {rowActions && rowActions.length > 0 && (
                <RowActionButtons row={row} actions={rowActions} />
              )}
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              {columns.slice(1).map((col) => (
                <div key={col.key}>
                  <dt className="text-muted-foreground text-xs">{col.label}</dt>
                  <dd>{renderCellValue(col, row)}</dd>
                </div>
              ))}
            </dl>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getRowValue<TData>(row: TData, key: string): unknown {
  return (row as Record<string, unknown>)[key];
}

function renderCellValue<TData>(col: DataTableColumn<TData>, row: TData): ReactNode {
  const value = getRowValue(row, col.key);

  if (col.render) return col.render(value, row);

  if (col.type && col.type !== "text" && col.type !== "custom") {
    const Renderer = resolveCellRenderer(col.type);
    if (Renderer) {
      return (
        <Renderer
          value={value}
          row={row as unknown as Record<string, unknown>}
          column={{
            key: col.key,
            href: col.href,
            entityType: col.entityType,
            entityIdField: col.entityIdField,
            statusMap: col.statusMap,
            timestampFormat: col.timestampFormat,
          }}
        />
      );
    }
  }

  return <NullSafe>{value}</NullSafe>;
}

function makeRowKey<TData>(rowKeyProp: DataTableProps<TData>["rowKey"]): (row: TData) => string {
  if (typeof rowKeyProp === "function") return rowKeyProp;
  return (row: TData) => String((row as Record<string, unknown>)[rowKeyProp as string]);
}

// ---------------------------------------------------------------------------
// useDebounce
// ---------------------------------------------------------------------------

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// ---------------------------------------------------------------------------
// Density toggle (compact / comfortable / spacious)
// ---------------------------------------------------------------------------

type DensityLevel = "compact" | "comfortable" | "spacious";
const DENSITY_HEIGHTS: Record<DensityLevel, string> = {
  compact: "32px",
  comfortable: "40px",
  spacious: "48px",
};

/** Density icon SVGs — distinct line spacing per level */
const DENSITY_ICONS: Record<DensityLevel, ReactElement> = {
  compact: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-3.5 w-3.5"
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="11" x2="20" y2="11" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="4" y1="19" x2="20" y2="19" />
    </svg>
  ),
  comfortable: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-3.5 w-3.5"
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  ),
  spacious: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-3.5 w-3.5"
    >
      <line x1="4" y1="8" x2="20" y2="8" />
      <line x1="4" y1="16" x2="20" y2="16" />
    </svg>
  ),
};

function DensityToggle({
  value,
  onChange,
}: {
  value: DensityLevel;
  onChange: (d: DensityLevel) => void;
}): ReactElement {
  const { t } = useTranslation();
  const levels: DensityLevel[] = ["compact", "comfortable", "spacious"];
  return (
    <div
      role="group"
      aria-label={t("middag.ui.table.density")}
      className="border-border/60 flex h-[30px] items-center gap-0 rounded-[5px] border p-0.5"
    >
      {levels.map((level) => {
        const label = t(`middag.ui.table.density_${level}`);
        return (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            aria-label={label}
            aria-pressed={value === level}
            title={label}
            className={cn(
              "flex items-center justify-center rounded px-1.5 py-1 transition-all",
              value === level
                ? "bg-accent text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {DENSITY_ICONS[level]}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Minimal table column header (preview 03 style)
// ---------------------------------------------------------------------------

function MinimalColumnHeader<TData, TValue>({
  column,
  title,
}: {
  column: import("@tanstack/react-table").Column<TData, TValue>;
  title: string;
}): ReactElement {
  const isSorted = column.getIsSorted();
  const canSort = column.getCanSort();

  const handleClick = () => {
    if (!canSort) return;
    if (isSorted === "asc") column.toggleSorting(true);
    else if (isSorted === "desc") column.clearSorting();
    else column.toggleSorting(false);
  };

  if (canSort) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="text-muted-foreground hover:text-secondary-foreground flex h-full cursor-pointer items-center text-[11px] font-semibold tracking-[0.04em] whitespace-nowrap uppercase select-none"
      >
        {title}
        <span
          className={cn("ml-1 text-[9px]", isSorted ? "text-primary opacity-100" : "opacity-30")}
        >
          {isSorted === "desc" ? "\u25BC" : "\u25B2"}
        </span>
      </button>
    );
  }

  return (
    <div className="text-muted-foreground flex h-full items-center text-[11px] font-semibold tracking-[0.04em] whitespace-nowrap uppercase select-none">
      {title}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DataTable component
// ---------------------------------------------------------------------------

export function DataTable<TData extends object>({
  columns,
  rows,
  rowKey: rowKeyProp,
  pagination,
  sort,
  filters,
  appliedFilters = {},
  rowActions,
  actionsAlwaysVisible = false,
  bulkActions,
  isLoading = false,
  searchPlaceholder: _searchPlaceholder,
  searchValue: controlledSearch = "",
  emptyStateIcon,
  emptyStateTitle: _emptyStateTitle,
  emptyStateDescription,
  emptyStateCTA,
  onParamChange,
  onBulkAction,
  onRowClick,
  selectedRowKey,
  remember = false,
  rememberKey,
  clientSide = false,
}: DataTableProps<TData> & { clientSide?: boolean }): ReactElement {
  const { t } = useTranslation();
  const emptyStateTitle = _emptyStateTitle ?? t("middag.ui.table.empty_title");
  const getKey = useMemo(() => makeRowKey(rowKeyProp), [rowKeyProp]);

  // -----------------------------------------------------------------------
  // Local state
  // -----------------------------------------------------------------------
  const [searchInput, setSearchInput] = useState(controlledSearch);
  const debouncedSearch = useDebounce(searchInput, 300);
  const prevDebouncedRef = useRef(debouncedSearch);

  // Client-side pagination state (only used when clientSide=true)
  const [clientPagination, setClientPagination] = useState({
    pageIndex: 0,
    pageSize: pagination?.perPage ?? 10,
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  // Column visibility + density are client-only view prefs (never sent to the
  // server). useRemember persists them across history nav when the block opts
  // in via `remember`; otherwise it is a plain useState (default).
  const rememberScope = rememberKey ?? "datatable";
  const [columnVisibility, setColumnVisibility] = useRemember<VisibilityState>(
    () => {
      const vis: VisibilityState = {};
      for (const col of columns) {
        if (col.visible === false) vis[col.key] = false;
      }
      return vis;
    },
    `${rememberScope}:columns`,
    remember,
  );
  const [isMobile, setIsMobile] = useState(false);
  const [density, setDensity] = useRemember<DensityLevel>(
    "comfortable",
    `${rememberScope}:density`,
    remember,
  );

  // Sync controlled search prop
  useEffect(() => {
    setSearchInput(controlledSearch);
  }, [controlledSearch]);

  // Detect mobile breakpoint
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    handler(mql);
    mql.addEventListener("change", handler as (e: MediaQueryListEvent) => void);
    return () => mql.removeEventListener("change", handler as (e: MediaQueryListEvent) => void);
  }, []);

  // Emit search changes
  useEffect(() => {
    if (debouncedSearch !== prevDebouncedRef.current) {
      prevDebouncedRef.current = debouncedSearch;
      onParamChange?.({ search: debouncedSearch, page: 0 });
    }
  }, [debouncedSearch, onParamChange]);

  // -----------------------------------------------------------------------
  // Sorting bridge: DataTable sort <-> TanStack SortingState
  // -----------------------------------------------------------------------
  const initialSorting: SortingState = useMemo(
    () => (sort ? [{ id: sort.key, desc: sort.direction === "desc" }] : []),
    [sort],
  );
  const [clientSorting, setClientSorting] = useState<SortingState>(initialSorting);
  const sortingState = clientSide ? clientSorting : initialSorting;

  const handleSortingChange = useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      const next = typeof updater === "function" ? updater(sortingState) : updater;
      if (clientSide) {
        setClientSorting(next);
        return;
      }
      if (next.length === 0) {
        onParamChange?.({ sort: null });
      } else {
        const s = next[0];
        onParamChange?.({
          sort: { key: s.id, direction: s.desc ? "desc" : "asc" },
        });
      }
    },
    [sortingState, onParamChange, clientSide],
  );

  // -----------------------------------------------------------------------
  // Build TanStack column defs
  // -----------------------------------------------------------------------
  const hasBulkActions = bulkActions && bulkActions.length > 0;

  // Sync inspector selectedRowKey into TanStack row selection for visual highlight
  useEffect(() => {
    if (selectedRowKey) {
      setRowSelection({ [selectedRowKey]: true });
    } else if (!hasBulkActions) {
      setRowSelection({});
    }
  }, [selectedRowKey, hasBulkActions]);

  const tanstackColumns = useMemo<ColumnDef<TData, unknown>[]>(() => {
    const defs: ColumnDef<TData, unknown>[] = [];

    // Selection column
    if (hasBulkActions) {
      defs.push({
        id: "_select",
        header: ({ table: tbl }) => (
          <Checkbox
            checked={
              tbl.getIsAllPageRowsSelected() || (tbl.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(v) => tbl.toggleAllPageRowsSelected(!!v)}
            aria-label={t("middag.ui.table.select_all")}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
            onClick={(e) => e.stopPropagation()}
            aria-label={t("middag.ui.table.select_row")}
          />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
      });
    }

    // Data columns
    for (let colIdx = 0; colIdx < columns.length; colIdx++) {
      const col = columns[colIdx];
      const isFirstDataCol = colIdx === 0;
      const isNumeric =
        (col.type as string) === "number" ||
        col.key === "acessos" ||
        col.key === "records" ||
        col.key === "seats_total" ||
        col.key === "seats_usados";
      defs.push({
        id: col.key,
        accessorFn: (row: TData) => getRowValue(row, col.key),
        header: ({ column }) => <MinimalColumnHeader column={column} title={col.label} />,
        cell: ({ row }) => (
          <span
            className={cn(
              "block text-[13px] break-words",
              isFirstDataCol && "font-medium",
              isNumeric && "text-right tabular-nums",
            )}
          >
            {renderCellValue(col, row.original)}
          </span>
        ),
        size: col.width,
        minSize: col.minWidth ?? 80,
        enableSorting: col.sortable ?? false,
        enableHiding: col.hideable !== false,
        meta: {
          headerTitle: col.label,
          headerClassName: isNumeric ? "text-right" : undefined,
          skeleton: (
            <Skeleton
              className={cn("h-4", SKELETON_WIDTHS[columns.indexOf(col) % SKELETON_WIDTHS.length])}
            />
          ),
        },
      });
    }

    // Row actions column
    if (rowActions && rowActions.length > 0) {
      defs.push({
        id: "_actions",
        header: () => null,
        cell: ({ row }) => (
          <div
            className={
              actionsAlwaysVisible ? "" : "opacity-0 transition-opacity group-hover/row:opacity-100"
            }
          >
            <RowActionButtons row={row.original} actions={rowActions} />
          </div>
        ),
        size: rowActions.some((a) => a.variant === "button")
          ? Math.max(200, rowActions.filter((a) => a.variant === "button").length * 110)
          : rowActions.length > 2
            ? 120
            : 80,
        enableSorting: false,
        enableHiding: false,
      });
    }

    return defs;
  }, [columns, hasBulkActions, rowActions, actionsAlwaysVisible, t]);

  // -----------------------------------------------------------------------
  // Row id map for TanStack row selection
  // -----------------------------------------------------------------------
  const getRowId = useCallback((row: TData) => getKey(row), [getKey]);

  // -----------------------------------------------------------------------
  // TanStack table instance
  // -----------------------------------------------------------------------
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table vs React Compiler known limitation
  const table = useReactTable({
    data: rows,
    columns: tanstackColumns,
    state: {
      sorting: sortingState,
      rowSelection,
      columnVisibility,
      ...(clientSide
        ? { pagination: clientPagination, globalFilter: debouncedSearch }
        : {
            pagination: pagination
              ? { pageIndex: pagination.page, pageSize: pagination.perPage }
              : undefined,
          }),
    },
    ...(clientSide
      ? {}
      : {
          pageCount: pagination ? Math.ceil(pagination.total / pagination.perPage) : undefined,
        }),
    manualPagination: clientSide ? false : !!pagination,
    manualSorting: clientSide ? false : true,
    enableRowSelection: !!hasBulkActions || !!selectedRowKey,
    enableGlobalFilter: clientSide,
    // Match nested values (not just scalar cells) so object/array cells like the
    // tag-chip column [{label, href}] are searchable by their label — the built-in
    // includesString stringifies the whole cell ("[object Object]") and misses them.
    // Collect VALUES only (never keys, to avoid every row matching a field name)
    // and skip href/url to avoid link-text false positives.
    globalFilterFn: (row, _columnId, filterValue) => {
      if (filterValue == null || filterValue === "") return true;
      const needle = String(filterValue).toLowerCase();
      const collect = (v: unknown): string => {
        if (v == null) return "";
        if (Array.isArray(v)) return v.map(collect).join(" ");
        if (typeof v === "object") {
          return Object.entries(v as Record<string, unknown>)
            .filter(([k]) => k !== "href" && k !== "url")
            .map(([, val]) => collect(val))
            .join(" ");
        }
        return String(v);
      };
      return collect(row.original).toLowerCase().includes(needle);
    },
    onSortingChange: handleSortingChange,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: clientSide
      ? setClientPagination
      : (updater) => {
          if (!pagination) return;
          const current = {
            pageIndex: pagination.page,
            pageSize: pagination.perPage,
          };
          const next = typeof updater === "function" ? updater(current) : updater;
          const changes: DataTableParamChange = {};
          if (next.pageIndex !== current.pageIndex) changes.page = next.pageIndex;
          if (next.pageSize !== current.pageSize) {
            changes.perPage = next.pageSize;
            changes.page = 0;
          }
          onParamChange?.(changes);
        },
    getCoreRowModel: getCoreRowModel(),
    ...(clientSide
      ? {
          getSortedRowModel: getSortedRowModel(),
          getFilteredRowModel: getFilteredRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
        }
      : {}),
    getRowId,
  });

  // -----------------------------------------------------------------------
  // Selected keys for bulk actions
  // -----------------------------------------------------------------------
  const selectedKeys = useMemo(
    () => Object.keys(rowSelection).filter((k) => rowSelection[k]),
    [rowSelection],
  );
  const hasSelection = selectedKeys.length > 0;

  const handleBulkAction = useCallback(
    (actionId: string) => {
      onBulkAction?.(actionId, selectedKeys);
    },
    [onBulkAction, selectedKeys],
  );

  // -----------------------------------------------------------------------
  // Filter handlers (client-side uses local state + TanStack column filters)
  // -----------------------------------------------------------------------
  const [clientFilters, setClientFilters] = useState<Record<string, string | string[]>>({});
  const activeFilters = clientSide ? clientFilters : appliedFilters;

  const handleFilterApply = useCallback(
    (key: string, value: string | string[]) => {
      if (clientSide) {
        setClientFilters((prev) => ({ ...prev, [key]: value }));
        table.getColumn(key)?.setFilterValue(value);
        table.setPageIndex(0);
        return;
      }
      onParamChange?.({
        filters: { ...appliedFilters, [key]: value },
        page: 0,
      });
    },
    [appliedFilters, onParamChange, clientSide, table],
  );

  const handleFilterRemove = useCallback(
    (key: string) => {
      if (clientSide) {
        setClientFilters((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        table.getColumn(key)?.setFilterValue(undefined);
        table.setPageIndex(0);
        return;
      }
      const next = { ...appliedFilters };
      delete next[key];
      onParamChange?.({ filters: next, page: 0 });
    },
    [appliedFilters, onParamChange, clientSide, table],
  );

  const handleFilterClearAll = useCallback(() => {
    if (clientSide) {
      setClientFilters({});
      table.resetColumnFilters();
      table.setPageIndex(0);
      return;
    }
    onParamChange?.({ filters: {}, page: 0 });
  }, [onParamChange, clientSide, table]);

  // -----------------------------------------------------------------------
  // Column count for visibility toggle threshold
  // -----------------------------------------------------------------------
  const recordCount = clientSide
    ? table.getFilteredRowModel().rows.length
    : (pagination?.total ?? rows.length);
  const isEmpty = !isLoading && rows.length === 0;

  // -----------------------------------------------------------------------
  // Skeleton rows for loading state
  // -----------------------------------------------------------------------
  const skeletonRowCount = pagination?.perPage ?? 10;

  // -----------------------------------------------------------------------
  // Pagination helpers
  // -----------------------------------------------------------------------
  const pageIndex = clientSide ? table.getState().pagination.pageIndex : (pagination?.page ?? 0);
  const pageSize = clientSide
    ? table.getState().pagination.pageSize
    : (pagination?.perPage ?? rows.length);
  const pageCount = clientSide
    ? table.getPageCount()
    : pagination
      ? Math.ceil(pagination.total / pagination.perPage)
      : 1;
  const pageSizes = pagination?.pageSizes ?? [10, 25, 50, 100];
  const showPagination = clientSide ? rows.length > pageSize : !!pagination;
  const paginationFrom = pageIndex * pageSize + 1;
  const paginationTo = Math.min(
    (pageIndex + 1) * pageSize,
    clientSide ? recordCount : (pagination?.total ?? rows.length),
  );

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <div>
      {/* Bulk Action Bar (preview 03 style) */}
      {hasSelection && bulkActions && bulkActions.length > 0 && (
        <div className="bg-primary text-primary-foreground flex items-center gap-2.5 px-4 py-1.5 text-xs font-medium">
          <span>{t("middag.ui.table.selected", { count: selectedKeys.length })}</span>
          {bulkActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleBulkAction(action.id)}
              className="rounded px-2.5 py-1 text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
              style={{ background: "oklch(1 0 0 / 0.12)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "oklch(1 0 0 / 0.22)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "oklch(1 0 0 / 0.12)")}
              onFocus={(e) => (e.currentTarget.style.background = "oklch(1 0 0 / 0.22)")}
              onBlur={(e) => (e.currentTarget.style.background = "oklch(1 0 0 / 0.12)")}
            >
              {renderLabel(action.label, t)}
            </button>
          ))}
          <button
            onClick={() => {
              setRowSelection({});
              table.toggleAllPageRowsSelected(false);
            }}
            className="ml-auto rounded px-2.5 py-1 text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
            style={{ background: "oklch(1 0 0 / 0.12)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "oklch(1 0 0 / 0.22)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "oklch(1 0 0 / 0.12)")}
            onFocus={(e) => (e.currentTarget.style.background = "oklch(1 0 0 / 0.22)")}
            onBlur={(e) => (e.currentTarget.style.background = "oklch(1 0 0 / 0.12)")}
          >
            {t("middag.ui.table.clear_selection")}
          </button>
        </div>
      )}

      {/* Toolbar (Jira-like enterprise style) */}
      <div className="border-border/50 flex flex-wrap items-center gap-2 border-b px-4 py-2">
        {/* Search input */}
        <div className="relative w-[220px]">
          <svg
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={_searchPlaceholder ?? t("middag.ui.table.search_placeholder")}
            className="border-border bg-popover text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-[30px] w-full rounded-[5px] border pr-2.5 pl-8 text-xs transition-[border-color,box-shadow] outline-none focus:ring-2"
          />
        </div>

        {/* Applied filter chips (enterprise label:value style) */}
        {Object.entries(activeFilters).map(([key, value]) => {
          const filter = filters?.find((f) => f.key === key);
          const displayValue = Array.isArray(value) ? value.join(", ") : value;
          const optionLabel =
            filter?.options?.find((o) => o.value === displayValue)?.label ?? displayValue;
          return (
            <span
              key={key}
              className="border-border bg-popover inline-flex h-[30px] items-center gap-1 rounded-[5px] border py-0.5 pr-1.5 pl-2.5 text-xs font-medium transition-colors"
            >
              <span className="text-muted-foreground">{filter?.label ?? key}:</span>
              <span className="text-foreground font-semibold">{optionLabel}</span>
              <button
                type="button"
                onClick={() => handleFilterRemove(key)}
                aria-label={t("middag.ui.table.remove_filter", { label: filter?.label ?? key })}
                className="text-muted-foreground hover:text-foreground ml-0.5 cursor-pointer text-sm leading-none opacity-60 hover:opacity-100"
              >
                {"\u00D7"}
              </button>
            </span>
          );
        })}

        {/* Filter trigger (dashed add button) */}
        {filters && filters.length > 0 && (
          <FilterBar
            filters={filters}
            applied={appliedFilters}
            onApply={handleFilterApply}
            onRemove={handleFilterRemove}
            onClearAll={handleFilterClearAll}
            hideChips
          />
        )}

        <div className="flex-1" />

        {/* Results count */}
        <span className="text-muted-foreground text-[11px] font-medium tabular-nums">
          {t("middag.ui.table.record", { count: recordCount })}
        </span>

        {/* Density toggle */}
        <DensityToggle value={density} onChange={setDensity} />

        {/* Column visibility */}
        {(() => {
          const hideableColumns = table.getAllColumns().filter((c) => c.getCanHide());
          if (hideableColumns.length === 0) return null;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground inline-flex h-[30px] w-[30px] items-center justify-center rounded-[5px] border transition-colors"
                  title={t("middag.ui.table.columns")}
                  aria-label={t("middag.ui.table.columns")}
                >
                  <HugeiconsIcon
                    icon={SlidersHorizontalIcon}
                    strokeWidth={2}
                    className="h-3.5 w-3.5"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{t("middag.ui.table.columns")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {hideableColumns.map((c) => (
                  <DropdownMenuCheckboxItem
                    key={c.id}
                    checked={c.getIsVisible()}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(value) => c.toggleVisibility(!!value)}
                  >
                    {(c.columnDef.meta as { headerTitle?: string } | undefined)?.headerTitle ??
                      c.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })()}

        {/* Save as view */}
        <button
          type="button"
          className="border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground inline-flex h-[30px] w-[30px] items-center justify-center rounded-[5px] border transition-colors"
          title={t("middag.ui.table.save_view")}
          aria-label={t("middag.ui.table.save_view")}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-3.5 w-3.5"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>

      {/* Table or Empty State */}
      {isEmpty ? (
        <EmptyPlaceholder
          variant="no-results"
          icon={emptyStateIcon}
          title={emptyStateTitle}
          description={emptyStateDescription}
          cta={emptyStateCTA}
        />
      ) : isMobile ? (
        <MobileCardView
          rows={rows}
          columns={columns}
          rowKey={getKey}
          rowActions={rowActions}
          rowSelection={rowSelection}
          onToggleRow={(key) => {
            setRowSelection((prev) => ({
              ...prev,
              [key]: !prev[key],
            }));
          }}
          hasBulkActions={!!hasBulkActions}
          onRowClick={onRowClick}
          t={t}
        />
      ) : (
        <div
          className="overflow-auto"
          role="region"
          aria-label={t("middag.ui.table.scroll_region")}
          tabIndex={0}
        >
          <table className="w-full border-collapse" role="grid">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      scope="col"
                      className="text-muted-foreground h-8 px-4 text-left text-[11px] font-semibold tracking-[0.04em] uppercase"
                      style={header.getSize() !== 150 ? { width: header.getSize() } : undefined}
                      aria-sort={
                        header.column.getCanSort()
                          ? header.column.getIsSorted() === "asc"
                            ? "ascending"
                            : header.column.getIsSorted() === "desc"
                              ? "descending"
                              : "none"
                          : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: skeletonRowCount }, (_, i) => (
                    <tr key={`skeleton-${i}`}>
                      {table.getAllColumns().map((col) => (
                        <td
                          key={col.id}
                          className="border-border/50 border-b px-4"
                          style={{ height: DENSITY_HEIGHTS[density] }}
                        >
                          <Skeleton
                            className={cn(
                              "h-4",
                              SKELETON_WIDTHS[
                                table.getAllColumns().indexOf(col) % SKELETON_WIDTHS.length
                              ],
                            )}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                : table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={cn(
                        "group/row cursor-pointer transition-[background] duration-75",
                        "hover:bg-sidebar-hover",
                        row.getIsSelected() && "bg-info-subtle",
                      )}
                      data-state={row.getIsSelected() ? "selected" : undefined}
                      onClick={() => onRowClick?.(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="border-border/50 truncate overflow-hidden border-b px-4 align-middle text-[13px] whitespace-nowrap"
                          style={{
                            height: DENSITY_HEIGHTS[density],
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {showPagination && !isEmpty && (
        <div className="border-border flex items-center justify-between border-t px-4 py-2">
          <span className="text-muted-foreground text-xs tabular-nums">
            {paginationFrom} - {paginationTo} {t("middag.ui.table.pagination_of")} {recordCount}
          </span>
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              aria-label={t("middag.ui.table.pagination_rows_per_page")}
              onChange={(e) => {
                if (clientSide) {
                  table.setPageSize(Number(e.target.value));
                } else {
                  onParamChange?.({ perPage: Number(e.target.value), page: 0 });
                }
              }}
              className="border-border text-muted-foreground h-7 rounded border bg-transparent px-1.5 text-xs"
            >
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size} {t("middag.ui.table.pagination_per_page")}
                </option>
              ))}
            </select>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon-xs"
                disabled={pageIndex === 0}
                onClick={() =>
                  clientSide ? table.previousPage() : onParamChange?.({ page: pageIndex - 1 })
                }
                aria-label={t("middag.ui.table.previous_page")}
              >
                &lsaquo;
              </Button>
              <span className="text-muted-foreground flex items-center px-1.5 text-xs tabular-nums">
                {pageIndex + 1} / {pageCount}
              </span>
              <Button
                variant="outline"
                size="icon-xs"
                disabled={pageIndex >= pageCount - 1}
                onClick={() =>
                  clientSide ? table.nextPage() : onParamChange?.({ page: pageIndex + 1 })
                }
                aria-label={t("middag.ui.table.next_page")}
              >
                &rsaquo;
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
