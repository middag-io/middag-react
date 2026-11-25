/**
 * Boundary helpers for block data sent by a PHP producer.
 *
 * PHP encodes an empty associative array as a JSON list (`[]`), so the wire
 * contract accepts `[]` wherever a map may be empty: table and card rows,
 * `filters`, `filters.applied` and a column's `statusMap`. Blocks normalise
 * those values here, once, before rendering. Open enums arrive as any string;
 * `knownValue` keeps a value the renderer supports and drops the rest, so the
 * caller falls back to its default.
 */

/** A map as PHP may send it: the map, or `[]` when it is empty. */
export type PhpMap<T extends object> = T | [];

/** The map, or `undefined` when PHP sent an empty list or nothing. */
export function mapOrUndefined<T extends object>(
  value: PhpMap<T> | null | undefined,
): T | undefined {
  if (value == null || Array.isArray(value)) return undefined;
  return value;
}

/** Rows with every `[]` row turned into an empty record. */
export function normalizeRows(
  rows: ReadonlyArray<PhpMap<Record<string, unknown>>>,
): Record<string, unknown>[] {
  return rows.map((row) => (Array.isArray(row) ? {} : row));
}

/** Applied filter values, as PHP may send them. */
type AppliedFilterValues = Record<string, string | string[]>;

/**
 * A table's `filters` with `[]` normalised: no filters when the whole slot is
 * an empty list, and no applied values when `applied` is one.
 */
export function normalizeFilters<TFilter>(
  filters:
    | PhpMap<{ available: TFilter[]; applied: PhpMap<AppliedFilterValues> }>
    | null
    | undefined,
): { available: TFilter[]; applied: AppliedFilterValues } | undefined {
  const slot = mapOrUndefined(filters);
  if (slot === undefined) return undefined;
  return { available: slot.available, applied: mapOrUndefined(slot.applied) ?? {} };
}

/** The value when it is one of `known`, otherwise `undefined`. */
export function knownValue<T extends string>(
  value: string | null | undefined,
  known: readonly T[],
): T | undefined {
  return value != null && (known as readonly string[]).includes(value) ? (value as T) : undefined;
}
