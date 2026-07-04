# Plugin Architecture — Boundaries & Ownership

Defines what belongs to the host plugin (`ui/`) vs what comes from the lib (`@middag-io/react`).

This guide uses MIDDAG Account (WordPress) as reference, but the same boundaries apply to any Inertia host.

## Plugin Structure (scaffolded by `create-middag-ui`)

```
ui/src/
├── app/                     # PLUGIN — App bootstrap & registration
│   ├── register-{product}.ts #  Selective block/shell/layout registration
│   └── page-resolver.tsx    #   Contract: prefix + direct page resolution
├── adapters/                # PLUGIN — Inertia mock adapters (dev only)
├── mock/                    # PLUGIN — Dev mock data & navigation
│   ├── navigation.ts        #   Sidebar structure for dev server
│   └── data.ts              #   Synthetic props for direct pages
├── components/
│   └── {product}/           # PLUGIN — Product-specific components
├── lib/                     # PLUGIN — Utilities & hooks
├── pages/                   # PLUGIN — Page components
│   └── mock-contracts/      #   Static PageContract for dev mock
├── contracts.ts             # PLUGIN — Type re-exports from lib
├── entry-wp.tsx             # PLUGIN — WP production entry (or entry-{host}.tsx)
├── main.tsx                 # PLUGIN — Dev server entry
├── app.tsx                  # PLUGIN — Dev mock app (BrowserRouter + routes)
├── tailwind.css             # PLUGIN — Tailwind v4 @theme config
├── theme.css                # PLUGIN — Host isolation + token overrides
└── theme-*.css              # PLUGIN — Optional theme variants
```

## Boundaries

### PLUGIN (host developers own this)

Everything in `ui/src/` that is specific to the product.

| Area                    | What                        | Rule                                        |
|-------------------------|-----------------------------|---------------------------------------------|
| `app/`                  | Bootstrap & registration    | Register only blocks/shells the plugin uses |
| `components/{product}/` | Product-specific components | Custom UI for the product                   |
| `lib/`                  | Utils & hooks               | Shared utilities for the plugin             |
| `pages/`                | Direct pages                | Pages using `usePage()` from Inertia        |
| `mock/`                 | Dev data & navigation       | Mock data files, not inline in app.tsx      |
| `*.css`                 | Themes & Tailwind           | Tokens, host isolation, theme variants      |
| `entry-*.tsx`           | Host entry                  | Boot Inertia in production                  |
| `main.tsx` / `app.tsx`  | Dev entry                   | Mock app with BrowserRouter                 |

### LIB (comes from `@middag-io/react` — don't copy)

| What            | How to use                                                 |
|-----------------|------------------------------------------------------------|
| Shells          | `registerShell("product", ProductShell)`                   |
| Layouts         | `registerLayout("stack", StackLayout)`                     |
| Blocks          | `registerBlock("dense_table", DenseTableBlock)`            |
| ContractPage    | `<ContractPage contract={...} />`                          |
| Registries      | `import { registerBlock } from "@middag-io/react"`         |
| Providers       | `I18nProvider`, `AuthProvider`, `FlashProvider`, etc.      |
| Theme tokens    | `import "@middag-io/react/style.css"`                      |
| ReUI components | `import { Button } from "@middag-io/react/reui/button"`    |
| Mock utilities  | `import { MockPageProvider } from "@middag-io/react/mock"` |

### Rules

1. **Never copy lib components** — import from `@middag-io/react` or `@middag-io/react/reui/*`
2. **Product-specific components** → `components/{product}/` (not `blocks/`)
3. **Mock data** → `mock/data.ts` (not inline in app.tsx)
4. **Navigation** → `mock/navigation.ts` (not inline in app.tsx)
5. **CSS isolation** → `theme.css` handles `#middag-app { all: initial }` for WP
6. **Selective registration** → `register-{product}.ts` (not `registerDefaults()` in production for bundle size)

## Data flow

```
Host (PHP/Moodle) → Inertia props → entry-{host}.tsx → page-resolver → ContractPage or DirectPage
```

- **Contract pages:** Host sends `{ contract: PageContract }` → `ContractPage` renders
- **Direct pages:** Host sends custom props → React component consumes via `usePage()`
- **Dev mode:** `app.tsx` provides mock data via `MockPageProvider`

## Scaffold template

When `create-middag-ui` scaffolds a new project, it should generate:

```
src/
├── mock/
│   ├── navigation.ts    # buildNavigation() — sidebar for dev
│   └── data.ts          # sharedProps + mock page props
├── pages/
│   └── mock-contracts/  # Static PageContract examples
├── app.tsx              # Slim: imports from mock/*, defines routes only
├── main.tsx             # Dev entry
└── entry-wp.tsx         # Host entry (or entry-moodle.tsx)
```

`app.tsx` should contain only route definitions and wrappers — no inline data or navigation.

## Host Slot Injection (PHP → React) {#host-slots}

Components that live inside the host's chrome (e.g. a search bar in Moodle Boost's header) use the `HostSlot` pattern — a React portal that renders inside DOM containers injected by PHP.

**How it works:**

1. PHP renders empty containers with known IDs in the host template:
   ```php
   // local_middag output hook in Boost header:
   echo '<div id="middag-global-search" data-middag-slot="search"></div>';
   echo '<div id="middag-org-selector" data-middag-slot="org"></div>';
   echo '<div id="middag-quick-menu" data-middag-slot="menu"></div>';
   ```

2. React detects these containers via `HostSlot` and portals widgets into them:
   ```tsx
   import { HostSlot, BoostSearchBar } from '@middag-io/react';

   <HostSlot selector="#middag-global-search">
     <BoostSearchBar onActivate={() => openCommandPalette()} />
   </HostSlot>
   ```

3. If the container doesn't exist (e.g. WP without slots, mock without header), nothing renders. A `MutationObserver` detects containers that arrive late (Moodle's async Mustache rendering).

**Reserved slots:**

| Slot ID                | React Component    | Purpose                       |
|------------------------|--------------------|-------------------------------|
| `middag-global-search` | `BoostSearchBar`   | Central search bar (⌘K)       |
| `middag-org-selector`  | `ScopeProvider` UI | Organization/scope selector   |
| `middag-quick-menu`    | Quick-access grid  | MIDDAG quick menu (dashboard) |

All three widgets share the same provider tree (i18n, auth, scope, flash).
