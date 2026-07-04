/**
 * Action hierarchy — canonical OSS shape (middag-php-ui) + Pro overlay.
 *
 * The canonical `Action` VO (id, label, target, intent, confirmation, capability)
 * is generated from php-ui into `@/contracts/generated`. React adds a Pro
 * `display` channel and the row-level conditional fields used by DenseTable.
 *
 * DA-05: `ActionBase` / `ExecutableAction` / `ConditionalAction` are kept as the
 * public names (barrel stability), now expressed in terms of the canonical Action.
 */

import type { Confirmation, HttpMethod, Action as WireAction } from "@/contracts/generated";

import type { FormCondition } from "./shared";

// ── Canonical enums (re-exported under the firewall names) ───────────────────

/** Semantic intent for action buttons (8 canonical values, php-ui parity). */
export type { ActionIntent } from "@/contracts/generated";

/** HTTP method for action execution (alias of the canonical HttpMethod enum). */
export type ActionMethod = HttpMethod;

// ── Confirmation (canonical + Pro overlay) ───────────────────────────────

/**
 * Confirmation dialog shown before executing an action. Canonical `Confirmation`
 * (title/message/variant/labels) plus Pro polling-aware fields.
 */
export interface ActionConfirmation extends Confirmation {
  /** Pro semantic accent for the dialog. */
  intent?: "danger" | "warning" | "default";
  /** Keep the dialog open until a polling cycle resolves. */
  waitForPolling?: boolean;
  /** Message shown while waiting for polling. */
  waitingMessage?: string;
}

// ── Canonical Action ─────────────────────────────────────────────────────

/**
 * Canonical action: a discriminated `target` (link | route | request), a
 * semantic `intent`, an i18n-aware `label`, optional confirmation and
 * capability gate. The premium `display` channel is not part of the free
 * Action; it lives on `ProAction` in `@middag-io/react-pro`.
 */
export interface Action extends Omit<WireAction, "confirmation"> {
  /** Confirmation dialog (Pro-extended). */
  confirmation?: ActionConfirmation;
}

/** Shared base for all action types (DA-05: now the canonical Action). */
export type ActionBase = Action;

/** Executable action (DA-05: the canonical Action carries its own target). */
export type ExecutableAction = Action;

/**
 * Conditional action — row-level action with per-row visibility, disabled, and
 * loading state. Used by DenseTable where conditions evaluate against each row.
 */
export interface ConditionalAction extends Action {
  /** Row action display variant. */
  variant?: "icon" | "button";
  /** Show this action only when condition is met (evaluated per row). */
  visible_when?: FormCondition;
  /** Disable this action when condition is met (evaluated per row). */
  disabled_when?: FormCondition;
  /** Show loading spinner when condition is met (evaluated per row). */
  loading_when?: FormCondition;
  /** Field name in row data containing a tooltip reason when disabled. */
  disabled_reason_field?: string;
}
