/**
 * Stable `data-testid` values for acceptance tests (Moodle Behat, Playwright).
 *
 * Every id derives from an identifier the page contract already carries — a
 * block `key`, an action `id`, a field `key`, a row key — never from a label,
 * so a test keeps working when the text is reworded or translated. The fixed
 * ids name the few engine surfaces that have no contract identifier of their
 * own (the confirmation dialog, the form submit, the row-actions menu).
 *
 * Ids are scoped by their container, not globally unique: a test looks for
 * `row-action-edit` inside `row-42`, or for `field-name` inside `block-user-form`.
 */

export const TEST_IDS = {
  confirmDialog: "confirm-dialog",
  confirmDialogConfirm: "confirm-dialog-confirm",
  confirmDialogCancel: "confirm-dialog-cancel",
  formSubmit: "form-submit",
  rowActionsMenu: "row-actions",
} as const;

export function blockTestId(key: string): string {
  return `block-${key}`;
}

export function actionTestId(id: string): string {
  return `action-${id}`;
}

export function fieldTestId(key: string): string {
  return `field-${key}`;
}

export function rowTestId(key: string | number): string {
  return `row-${key}`;
}

export function rowActionTestId(id: string): string {
  return `row-action-${id}`;
}
