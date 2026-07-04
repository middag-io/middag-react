# ReUI Manifest — MIDDAG

**Registry:** https://reui.io
**Preset:** `radix-maia` (Radix UI + Maia style)
**Version:** v2.0.2 (installed 2026-04-17)
**Icon Library:** Hugeicons (`@hugeicons/core-free-icons`)
**Font:** Figtree (`@fontsource-variable/figtree`)

## Directory Structure

```
ui/src/reui/
├── *.tsx                    ← Base primitives (shadcn enhanced + ReUI exclusive)
├── data-grid/               ← Data Grid sub-components
├── components/              ← 1,004 example blocks (c-{category}-{number}.tsx)
└── MANIFEST.md              ← This file
```

## Base Primitives (shadcn enhanced)

These are standard shadcn/ui components enhanced by ReUI Maia style.
Installed via `npx shadcn@latest add {name}`.

| File              | Source               | Modified                     |
|-------------------|----------------------|------------------------------|
| alert.tsx         | @reui/alert          | No                           |
| badge.tsx         | @reui/badge          | No                           |
| breadcrumb.tsx    | shadcn/breadcrumb    | No                           |
| button.tsx        | shadcn/button        | No                           |
| button-group.tsx  | shadcn/button-group  | No                           |
| calendar.tsx      | shadcn/calendar      | No                           |
| card.tsx          | shadcn/card          | No                           |
| checkbox.tsx      | shadcn/checkbox      | No                           |
| combobox.tsx      | shadcn/combobox      | No                           |
| dialog.tsx        | shadcn/dialog        | No                           |
| dropdown-menu.tsx | shadcn/dropdown-menu | No                           |
| input.tsx         | shadcn/input         | No                           |
| input-group.tsx   | shadcn/input-group   | No                           |
| kbd.tsx           | shadcn/kbd           | No                           |
| label.tsx         | shadcn/label         | No                           |
| popover.tsx       | shadcn/popover       | No                           |
| radio-group.tsx   | shadcn/radio-group   | No                           |
| scroll-area.tsx   | shadcn/scroll-area   | No                           |
| select.tsx        | shadcn/select        | No                           |
| separator.tsx     | shadcn/separator     | No                           |
| sheet.tsx         | shadcn/sheet         | No                           |
| sidebar.tsx       | shadcn/sidebar       | No                           |
| skeleton.tsx      | shadcn/skeleton      | No                           |
| sonner.tsx        | shadcn/sonner        | Yes — appearance import path |
| spinner.tsx       | shadcn/spinner       | No                           |
| switch.tsx        | shadcn/switch        | No                           |
| tabs.tsx          | shadcn/tabs          | No                           |
| textarea.tsx      | shadcn/textarea      | No                           |
| tooltip.tsx       | shadcn/tooltip       | No                           |

## ReUI Exclusive Primitives

These components are ReUI-original, not in base shadcn/ui.
Installed via `npx shadcn@latest add @reui/{name}`.

| File              | Registry            | Modified |
|-------------------|---------------------|----------|
| autocomplete.tsx  | @reui/autocomplete  | No       |
| data-grid/*.tsx   | @reui/data-grid     | No       |
| date-selector.tsx | @reui/date-selector | No       |
| filters.tsx       | @reui/filters       | No       |
| frame.tsx         | @reui/frame         | No       |
| kanban.tsx        | @reui/kanban        | No       |
| number-field.tsx  | @reui/number-field  | No       |
| phone-input.tsx   | @reui/phone-input   | No       |
| rating.tsx        | @reui/rating        | No       |
| scrollspy.tsx     | @reui/scrollspy     | No       |
| sortable.tsx      | @reui/sortable      | No       |
| stepper.tsx       | @reui/stepper       | No       |
| timeline.tsx      | @reui/timeline      | No       |
| tree.tsx          | @reui/tree          | No       |

## Project-Specific Files (not from ReUI)

| File                 | Purpose                         |
|----------------------|---------------------------------|
| icon-placeholder.tsx | Local utility for icon fallback |

## Example Blocks

`reui/components/c-{category}-{number}.tsx` — 1,004 pre-built compositions.
Installed via `npx shadcn@latest add @reui/c-{category}-{number}`.

See `install-reui-blocks.sh` for the complete category/count inventory.

## Upgrade Procedure

1. Check ReUI version: visit https://reui.io/changelog
2. Reinstall individual primitives: `npx shadcn@latest add @reui/{name} --overwrite`
3. Compare with `git diff` to identify MIDDAG customizations
4. Files marked "Modified: Yes" above need manual merge
5. Update this manifest with new version and date
