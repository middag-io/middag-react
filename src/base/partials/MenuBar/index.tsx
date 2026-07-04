/**
 * MenuBar — data-driven wrapper over the ReUI Menubar primitive.
 *
 * Renders a horizontal application menu bar from a `menus` contract: each menu
 * has a trigger label and a list of entries (action items or separators). Kept
 * product-agnostic — entries carry an `onSelect` callback and optional shortcut
 * text; the caller wires behavior. Labels are expected already-translated.
 */

import { type ReactElement } from "react";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/reui/menubar";
import { useTranslation } from "@/i18n/useTranslation";

export interface MenuBarActionEntry {
  type?: "item";
  /** Visible, already-translated label. */
  label: string;
  /** Optional shortcut hint shown right-aligned (e.g. "⌘S"). */
  shortcut?: string;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface MenuBarSeparatorEntry {
  type: "separator";
}

export type MenuBarEntry = MenuBarActionEntry | MenuBarSeparatorEntry;

export interface MenuBarMenuSpec {
  /** Trigger label, already-translated. */
  label: string;
  entries: MenuBarEntry[];
}

export interface MenuBarProps {
  menus: MenuBarMenuSpec[];
  /** Accessible label for the menu bar. Defaults to a translated built-in. */
  ariaLabel?: string;
  className?: string;
}

export function MenuBar({ menus, ariaLabel, className }: MenuBarProps): ReactElement {
  const { t } = useTranslation();

  return (
    <Menubar aria-label={ariaLabel ?? t("middag.ui.menubar.label")} className={className}>
      {menus.map((menu, menuIndex) => (
        <MenubarMenu key={`${menu.label}-${menuIndex}`}>
          <MenubarTrigger>{menu.label}</MenubarTrigger>
          <MenubarContent>
            {menu.entries.map((entry, entryIndex) =>
              entry.type === "separator" ? (
                <MenubarSeparator key={`sep-${entryIndex}`} />
              ) : (
                <MenubarItem
                  key={`${entry.label}-${entryIndex}`}
                  disabled={entry.disabled}
                  onSelect={entry.onSelect}
                >
                  {entry.label}
                  {entry.shortcut ? <MenubarShortcut>{entry.shortcut}</MenubarShortcut> : null}
                </MenubarItem>
              ),
            )}
          </MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  );
}
