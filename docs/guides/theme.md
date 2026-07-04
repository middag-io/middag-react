# Theme Guide

The MIDDAG design system is built on CSS custom properties (design tokens) using the OKLCH color space, which provides perceptually uniform color manipulation — equal numeric steps produce equal visual contrast, regardless of hue.

## Token Reference {#token-reference}

All tokens are defined in `:root` and can be overridden at any scope. Dark mode values are applied via `:root.dark` or `[data-theme="dark"]`.

### Canvas

| Token          | Light Default           | Dark Default               | Purpose            |
|----------------|-------------------------|----------------------------|--------------------|
| `--background` | `oklch(0.99 0.001 286)` | `oklch(0.13 0.01 285.82)`  | Page background    |
| `--foreground` | `oklch(0.17 0.01 286)`  | `oklch(0.93 0.005 285.82)` | Default text color |

### Primary (Brand)

| Token                  | Light Default              | Dark Default              | Purpose                                       |
|------------------------|----------------------------|---------------------------|-----------------------------------------------|
| `--primary`            | `oklch(0.21 0.034 264.06)` | `oklch(0.6 0.06 264.06)`  | Brand color for buttons, links, active states |
| `--primary-foreground` | `oklch(0.98 0 0)`          | `oklch(0.1 0.01 264.06)`  | Text on primary surfaces                      |
| `--primary-subtle`     | `oklch(0.95 0.012 264.06)` | `oklch(0.22 0.03 264.06)` | Soft primary background (badges, tags)        |
| `--primary-muted`      | `oklch(0.88 0.02 264.06)`  | `oklch(0.28 0.04 264.06)` | Muted primary (hover states, borders)         |

### Secondary

| Token                    | Light Default           | Dark Default              | Purpose                      |
|--------------------------|-------------------------|---------------------------|------------------------------|
| `--secondary`            | `oklch(0.97 0.001 286)` | `oklch(0.2 0.005 286.38)` | Secondary button backgrounds |
| `--secondary-foreground` | `oklch(0.45 0.01 286)`  | `oklch(0.9 0.005 285.82)` | Text on secondary surfaces   |

### Destructive

| Token                      | Light Default              | Dark Default             | Purpose                      |
|----------------------------|----------------------------|--------------------------|------------------------------|
| `--destructive`            | `oklch(0.577 0.245 27.33)` | `oklch(0.63 0.24 27.33)` | Error states, delete actions |
| `--destructive-foreground` | `oklch(0.98 0 0)`          | `oklch(0.1 0.01 27.33)`  | Text on destructive surfaces |
| `--destructive-subtle`     | `oklch(0.95 0.05 27.33)`   | `oklch(0.22 0.06 27.33)` | Soft error background        |
| `--destructive-muted`      | `oklch(0.88 0.08 27.33)`   | `oklch(0.28 0.08 27.33)` | Muted error (hover, borders) |

### Success

| Token                  | Light Default          | Dark Default           | Purpose                        |
|------------------------|------------------------|------------------------|--------------------------------|
| `--success`            | `oklch(0.55 0.17 155)` | `oklch(0.62 0.17 155)` | Positive states, confirmations |
| `--success-foreground` | `oklch(0.98 0 0)`      | `oklch(0.1 0.01 155)`  | Text on success surfaces       |
| `--success-subtle`     | `oklch(0.95 0.04 155)` | `oklch(0.2 0.04 155)`  | Soft success background        |
| `--success-muted`      | `oklch(0.88 0.06 155)` | `oklch(0.26 0.06 155)` | Muted success (hover, borders) |

### Warning

| Token                  | Light Default         | Dark Default          | Purpose                             |
|------------------------|-----------------------|-----------------------|-------------------------------------|
| `--warning`            | `oklch(0.75 0.18 75)` | `oklch(0.78 0.18 75)` | Caution states, non-blocking alerts |
| `--warning-foreground` | `oklch(0.18 0.02 75)` | `oklch(0.15 0.02 75)` | Text on warning surfaces            |
| `--warning-subtle`     | `oklch(0.96 0.04 75)` | `oklch(0.22 0.04 75)` | Soft warning background             |
| `--warning-muted`      | `oklch(0.9 0.06 75)`  | `oklch(0.28 0.06 75)` | Muted warning (hover, borders)      |

### Info

| Token               | Light Default          | Dark Default           | Purpose                     |
|---------------------|------------------------|------------------------|-----------------------------|
| `--info`            | `oklch(0.58 0.16 250)` | `oklch(0.65 0.16 250)` | Informational callouts      |
| `--info-foreground` | `oklch(0.98 0 0)`      | `oklch(0.1 0.01 250)`  | Text on info surfaces       |
| `--info-subtle`     | `oklch(0.95 0.04 250)` | `oklch(0.2 0.04 250)`  | Soft info background        |
| `--info-muted`      | `oklch(0.88 0.06 250)` | `oklch(0.26 0.06 250)` | Muted info (hover, borders) |

### Neutral (Surface & Structure)

| Token                 | Light Default              | Dark Default               | Purpose                                          |
|-----------------------|----------------------------|----------------------------|--------------------------------------------------|
| `--muted`             | `oklch(0.97 0.001 286)`    | `oklch(0.2 0.005 286.38)`  | Muted backgrounds (disabled, secondary panels)   |
| `--muted-foreground`  | `oklch(0.58 0.008 286)`    | `oklch(0.6 0.01 285.82)`   | Text on muted surfaces (help text, placeholders) |
| `--accent`            | `oklch(0.97 0.001 286)`    | `oklch(0.22 0.005 286.38)` | Accent backgrounds (hover rows, active nav)      |
| `--accent-foreground` | `oklch(0.21 0.014 285.82)` | `oklch(0.9 0.005 285.82)`  | Text on accent surfaces                          |

### Structure

| Token      | Light Default               | Dark Default               | Purpose              |
|------------|-----------------------------|----------------------------|----------------------|
| `--border` | `oklch(0.92 0.004 286)`     | `oklch(0.28 0.005 286.32)` | Default border color |
| `--input`  | `oklch(0.92 0.004 286)`     | `oklch(0.28 0.005 286.32)` | Input field borders  |
| `--ring`   | `oklch(0.708 0.028 256.85)` | `oklch(0.55 0.04 256.85)`  | Focus ring color     |

### Overlays

| Token                  | Light Default               | Dark Default               | Purpose                     |
|------------------------|-----------------------------|----------------------------|-----------------------------|
| `--popover`            | `oklch(1 0 0)`              | `oklch(0.18 0.008 285.82)` | Popover/dropdown background |
| `--popover-foreground` | `oklch(0.145 0.014 285.82)` | `oklch(0.93 0.005 285.82)` | Text inside popovers        |
| `--card`               | `oklch(1 0 0)`              | `oklch(0.17 0.008 285.82)` | Card background             |
| `--card-foreground`    | `oklch(0.145 0.014 285.82)` | `oklch(0.93 0.005 285.82)` | Text inside cards           |

### Invert

| Token                 | Light Default              | Dark Default              | Purpose                             |
|-----------------------|----------------------------|---------------------------|-------------------------------------|
| `--invert`            | `oklch(0.21 0.014 285.82)` | `oklch(0.7 0.01 285.82)`  | Inverted surface (tooltips, toasts) |
| `--invert-foreground` | `oklch(0.985 0 0)`         | `oklch(0.13 0.01 285.82)` | Text on inverted surfaces           |

### Sidebar

| Token                          | Light Default              | Dark Default               | Purpose                         |
|--------------------------------|----------------------------|----------------------------|---------------------------------|
| `--sidebar`                    | `oklch(0.975 0.002 286)`   | `oklch(0.12 0.008 285.82)` | Sidebar background              |
| `--sidebar-foreground`         | `oklch(0.45 0.01 286)`     | `oklch(0.7 0.01 264.06)`   | Sidebar text color              |
| `--sidebar-primary`            | `oklch(0.21 0.034 264.06)` | `oklch(0.6 0.06 264.06)`   | Sidebar active item color       |
| `--sidebar-primary-foreground` | `oklch(0.98 0 0)`          | `oklch(0.1 0.01 264.06)`   | Text on sidebar active items    |
| `--sidebar-accent`             | `oklch(0.93 0.012 264)`    | `oklch(0.22 0.02 264.06)`  | Sidebar hover/focus background  |
| `--sidebar-accent-foreground`  | `oklch(0.21 0.014 285.82)` | `oklch(0.9 0.005 285.82)`  | Text on sidebar accent surfaces |
| `--sidebar-hover`              | `oklch(0.955 0.003 286)`   | `oklch(0.185 0.006 286)`   | Sidebar item hover background   |
| `--sidebar-border`             | `oklch(0.91 0.005 286)`    | `oklch(0.25 0.005 286.32)` | Sidebar divider/border color    |

### Chart

| Token       | Light Default               | Dark Default               | Purpose                       |
|-------------|-----------------------------|----------------------------|-------------------------------|
| `--chart-1` | `oklch(0.646 0.222 41.116)` | `oklch(0.7 0.2 41.116)`    | Chart series 1 (orange)       |
| `--chart-2` | `oklch(0.6 0.118 184.714)`  | `oklch(0.65 0.12 184.714)` | Chart series 2 (teal)         |
| `--chart-3` | `oklch(0.398 0.07 227.392)` | `oklch(0.5 0.07 227.392)`  | Chart series 3 (steel blue)   |
| `--chart-4` | `oklch(0.828 0.189 84.429)` | `oklch(0.85 0.17 84.429)`  | Chart series 4 (yellow-green) |
| `--chart-5` | `oklch(0.769 0.188 70.08)`  | `oklch(0.8 0.17 70.08)`    | Chart series 5 (amber)        |

### Typography

| Token         | Default                                                        | Purpose               |
|---------------|----------------------------------------------------------------|-----------------------|
| `--font-sans` | `"Figtree Variable", "Figtree", ui-sans-serif, system-ui, ...` | Primary UI font stack |
| `--font-mono` | `"JetBrains Mono", "Fira Code", ui-monospace, ...`             | Monospace font stack  |

### Typography Scale

| Token             | Default                     | Purpose                                      |
|-------------------|-----------------------------|----------------------------------------------|
| `--text-display`  | `clamp(1.75rem, 4vw, 2rem)` | Hero headings, page title emphasis (28-32px) |
| `--text-h1`       | `1.5rem` (24px)             | Page title (one per page)                    |
| `--text-h2`       | `1.25rem` (20px)            | Section title                                |
| `--text-h3`       | `1.125rem` (18px)           | Card title, panel header                     |
| `--text-h4`       | `1rem` (16px)               | Sub-section, field group                     |
| `--text-body-l`   | `1rem` (16px)               | Long reading, descriptions                   |
| `--text-body-m`   | `0.875rem` (14px)           | Body default, table cells, labels            |
| `--text-body-s`   | `0.75rem` (12px)            | Captions, help text, timestamps              |
| `--text-mono`     | `0.8125rem` (13px)          | Code, IDs, technical values                  |
| `--text-overline` | `0.6875rem` (11px)          | Section labels (uppercase)                   |

### Border Radius

| Token           | Default           | Purpose                                         |
|-----------------|-------------------|-------------------------------------------------|
| `--radius`      | `0.625rem` (10px) | Base radius used by Tailwind theme calculations |
| `--radius-none` | `0px`             | No rounding                                     |
| `--radius-sm`   | `4px`             | Small elements (checkboxes, chips)              |
| `--radius-md`   | `6px`             | Medium elements (inputs, small cards)           |
| `--radius-lg`   | `8px`             | Large elements (cards, panels)                  |
| `--radius-xl`   | `12px`            | Extra large (modals, dialogs)                   |
| `--radius-2xl`  | `16px`            | Full panels, hero sections                      |
| `--radius-full` | `9999px`          | Pill shape (avatars, badges)                    |

::: info Tailwind radius mapping
The Tailwind `@theme` block derives `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, and `--radius-2xl` from the base `--radius` value using `calc()`. If you override `--radius`, all Tailwind radius utilities adjust proportionally.
:::

### Shadows

| Token          | Light Default                                   | Dark Default                   | Purpose                             |
|----------------|-------------------------------------------------|--------------------------------|-------------------------------------|
| `--shadow-xs`  | `0 1px 2px oklch(0 0 0 / 0.04)`                 | `0 1px 2px oklch(0 0 0 / 0.2)` | Subtle elevation (buttons)          |
| `--shadow-sm`  | `0 1px 3px ... / 0.06, 0 1px 2px ... / 0.04`    | `... / 0.25, ... / 0.2`        | Low elevation (cards)               |
| `--shadow-md`  | `0 4px 6px ... / 0.06, 0 2px 4px ... / 0.04`    | `... / 0.3, ... / 0.2`         | Medium elevation (dropdowns)        |
| `--shadow-lg`  | `0 10px 15px ... / 0.08, 0 4px 6px ... / 0.04`  | `... / 0.35, ... / 0.2`        | High elevation (popovers)           |
| `--shadow-xl`  | `0 20px 25px ... / 0.08, 0 8px 10px ... / 0.04` | `... / 0.35, ... / 0.2`        | Very high elevation (modals)        |
| `--shadow-2xl` | `0 25px 50px oklch(0 0 0 / 0.12)`               | `... / 0.45`                   | Maximum elevation (command palette) |

Dark mode increases shadow opacity so shadows remain visible on dark surfaces.

### Spacing (8px base grid)

| Token         | Value  | Purpose                      |
|---------------|--------|------------------------------|
| `--space-0`   | `0px`  | No spacing                   |
| `--space-0.5` | `2px`  | Hairline gap                 |
| `--space-1`   | `4px`  | Tight internal padding       |
| `--space-1.5` | `6px`  | Small internal padding       |
| `--space-2`   | `8px`  | Base unit                    |
| `--space-3`   | `12px` | Comfortable internal padding |
| `--space-4`   | `16px` | Standard padding             |
| `--space-5`   | `20px` | Medium gap                   |
| `--space-6`   | `24px` | Section padding              |
| `--space-8`   | `32px` | Large gap                    |
| `--space-10`  | `40px` | Section margin               |
| `--space-12`  | `48px` | Large section margin         |
| `--space-16`  | `64px` | Page-level spacing           |
| `--space-20`  | `80px` | Maximum spacing              |

### Motion

| Token                 | Value                               | Purpose                           |
|-----------------------|-------------------------------------|-----------------------------------|
| `--duration-instant`  | `0ms`                               | No animation                      |
| `--duration-fast`     | `100ms`                             | Micro-interactions (hover, focus) |
| `--duration-normal`   | `150ms`                             | Standard transitions              |
| `--duration-moderate` | `200ms`                             | Panel slides, accordion           |
| `--duration-slow`     | `300ms`                             | Page transitions, modals          |
| `--duration-slower`   | `500ms`                             | Complex animations                |
| `--ease-default`      | `cubic-bezier(0.2, 0, 0, 1)`        | General-purpose easing            |
| `--ease-in`           | `cubic-bezier(0.4, 0, 1, 1)`        | Accelerating (exit)               |
| `--ease-out`          | `cubic-bezier(0, 0, 0.2, 1)`        | Decelerating (enter)              |
| `--ease-bounce`       | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful overshoot                 |

::: tip Reduced motion
When `prefers-reduced-motion: reduce` is active, all animation and transition durations are forced to `0.01ms`.
:::

### Layout Dimensions

| Token                       | Value    | Purpose                             |
|-----------------------------|----------|-------------------------------------|
| `--content-max-width`       | `1280px` | Default content container max-width |
| `--content-narrow`          | `720px`  | Narrow content (forms, articles)    |
| `--content-wide`            | `1440px` | Wide content (dashboards)           |
| `--sidebar-width`           | `260px`  | Sidebar expanded width              |
| `--sidebar-width-collapsed` | `60px`   | Sidebar collapsed width             |
| `--sidebar-width-mobile`    | `300px`  | Sidebar width on mobile (overlay)   |

### Breakpoints

| Token              | Value    | Purpose        |
|--------------------|----------|----------------|
| `--breakpoint-sm`  | `640px`  | Small screens  |
| `--breakpoint-md`  | `768px`  | Tablets        |
| `--breakpoint-lg`  | `1024px` | Laptops        |
| `--breakpoint-xl`  | `1280px` | Desktops       |
| `--breakpoint-2xl` | `1536px` | Large desktops |

### Component Sizing

| Token                 | Value  | Purpose                            |
|-----------------------|--------|------------------------------------|
| `--size-button-sm`    | `32px` | Small button height                |
| `--size-button-md`    | `36px` | Default button height              |
| `--size-button-lg`    | `44px` | Large button height (touch target) |
| `--size-input`        | `36px` | Input field height                 |
| `--size-table-row`    | `48px` | Default table row height           |
| `--size-sidebar-item` | `40px` | Sidebar navigation item height     |
| `--size-avatar-sm`    | `24px` | Small avatar                       |
| `--size-avatar-md`    | `32px` | Default avatar                     |
| `--size-avatar-lg`    | `40px` | Large avatar                       |

### Z-Index Scale

| Token          | Value | Purpose                         |
|----------------|-------|---------------------------------|
| `--z-base`     | `0`   | Base layer                      |
| `--z-sticky`   | `10`  | Sticky headers, toolbars        |
| `--z-dropdown` | `20`  | Dropdown menus                  |
| `--z-overlay`  | `30`  | Overlays, backdrops             |
| `--z-popover`  | `40`  | Popovers, tooltips              |
| `--z-modal`    | `50`  | Modal dialogs                   |
| `--z-toast`    | `60`  | Toast notifications             |
| `--z-command`  | `100` | Command palette (always on top) |

---

## Built-in Themes {#built-in-themes}

::: tip Community + PRO
The **classic** theme ships with the Community package (`@middag-io/react`). The **enterprise**, **soft**, and **midnight** themes ship with the PRO package from GitHub Packages. Community users can also create unlimited custom themes using the same CSS token system — see [Custom Themes](#custom-themes) below.
:::

MIDDAG ships 4 built-in themes that produce **visually distinct** appearances — not just color swaps, but different radius, density, shadows, and component-level behavior.

| Theme              | Primary Hue        | Radius   | Table Row        | Personality                      |
|--------------------|--------------------|----------|------------------|----------------------------------|
| **Classic** (Maia) | 264 dark blue      | 0.625rem | 48px comfortable | Default MIDDAG, shadcn/ui feel   |
| **Enterprise**     | 255 corporate blue | 0.375rem | 40px compact     | Jira/Linear, dense issue-tracker |
| **Soft**           | 330 rose/pink      | 0.75rem  | 52px spacious    | Notion/Craft, friendly consumer  |
| **Midnight**       | 220 deep indigo    | 0.375rem | 36px compact     | GitHub Dark/Vercel, dev-tools    |

### Using built-in themes

Import the theme CSS file after `style.css`:

```ts
// In your main entry point
import "@middag-io/react/style.css";
import "@middag-io/react/themes/enterprise.css";  // or classic, soft, midnight
```

Apply the theme class on `<body>` (so portals like toasts and modals also pick it up):

```ts
document.body.classList.add("theme-enterprise");
```

Or use the exported constants:

```ts
import { THEME_CLASSES } from "@middag-io/react";

document.body.classList.add(THEME_CLASSES.enterprise); // "theme-enterprise"
```

### Multiple themes with runtime switching

Import all themes you want to support, then toggle the class:

```ts
import "@middag-io/react/style.css";
import "@middag-io/react/themes/classic.css";
import "@middag-io/react/themes/enterprise.css";
import "@middag-io/react/themes/soft.css";
import "@middag-io/react/themes/midnight.css";
```

```ts
import { THEME_CLASSES, THEME_IDS, type ThemeId } from "@middag-io/react";

function switchTheme(newTheme: ThemeId) {
  const body = document.body;
  for (const cls of Object.values(THEME_CLASSES)) body.classList.remove(cls);
  body.classList.add(THEME_CLASSES[newTheme]);
}
```

### Component-level overrides (ThemeContext)

CSS tokens control colors, radius, shadows, and sizing. But some differences require component-level variant selection (e.g., enterprise uses outline badges, soft uses pill tabs). The `MIDDAGThemeProvider` exposes these overrides:

```tsx
import { MIDDAGThemeProvider, useThemeOverrides } from "@middag-io/react";

// Wrap your app
<MIDDAGThemeProvider theme="enterprise">
  <App />
</MIDDAGThemeProvider>

// Inside any component
function MyBadge({ label }: { label: string }) {
  const { badge } = useThemeOverrides();
  // badge.variant = "outline" for enterprise, "soft" for soft, "default" for classic
  // badge.rounded = true for soft, false for others
  return <Badge variant={badge.variant}>{label}</Badge>;
}
```

Override definitions per theme:

| Component     | Classic     | Enterprise | Soft      | Midnight  |
|---------------|-------------|------------|-----------|-----------|
| Badge variant | `default`   | `outline`  | `soft`    | `outline` |
| Badge rounded | no          | no         | yes       | no        |
| Button size   | `default`   | `sm`       | `default` | `sm`      |
| Tabs variant  | `default`   | `line`     | `pill`    | `line`    |
| Table density | comfortable | compact    | spacious  | compact   |
| Table striped | no          | yes        | no        | no        |
| Card bordered | no          | yes        | no        | yes       |

`useThemeOverrides()` is safe to call without a provider — returns classic defaults.

### Theme architecture (3 layers)

1. **CSS tokens** (`@middag-io/react/themes/*.css`) — colors, radius, shadows, sizing. Applied via `.theme-*` class on `<body>`.
2. **Theme bridge** (built into `style.css`) — forces re-resolution of Tailwind `--color-*` tokens at theme scope. Transparent to consumers.
3. **ThemeContext** (`MIDDAGThemeProvider`) — component-level overrides (badge variant, button size, etc.). Optional React provider.

---

## Custom Themes (Community + PRO) {#custom-themes}

Any consumer — Community or PRO — can create custom themes using CSS custom properties.

### Step 1: Import the base theme

In your application's main CSS file, import the MIDDAG theme before your overrides:

```css
@import "tailwindcss";
@import "@middag-io/react/theme.css";
```

This loads all design tokens into `:root` and registers the Tailwind `@theme` mappings.

### Step 2: Override specific tokens

After the import, redeclare any token you want to change:

```css
@import "tailwindcss";
@import "@middag-io/react/theme.css";

:root {
  /* Replace the default font stack */
  --font-sans: "Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif;

  /* Adjust the base radius for sharper corners */
  --radius: 0.375rem;

  /* Custom brand color */
  --primary: oklch(0.45 0.2 260);
  --primary-foreground: oklch(0.98 0 0);
}
```

### Step 3: Dark mode overrides

Override tokens specifically for dark mode using `.dark` on the root element:

```css
:root.dark,
[data-theme="dark"] {
  --primary: oklch(0.65 0.15 260);
  --primary-foreground: oklch(0.1 0.01 260);
  --background: oklch(0.1 0.015 280);
}
```

### Step 4: Scoped custom themes

Create named theme variants by nesting token overrides under a class:

```css
.theme-ocean {
  /* Colors */
  --primary: oklch(0.5 0.18 230);
  --primary-foreground: oklch(0.98 0 0);
  --primary-subtle: oklch(0.94 0.04 230);
  --accent: oklch(0.95 0.02 230);

  /* Shape — customize radius, density, shadows */
  --radius: 0.5rem;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --size-table-row: 44px;
  --size-button-md: 34px;

  /* Sidebar */
  --sidebar: oklch(0.15 0.03 230);
  --sidebar-foreground: oklch(0.75 0.02 230);
  --sidebar-width: 256px;
}

:root.dark .theme-ocean,
[data-theme="dark"] .theme-ocean {
  --primary: oklch(0.65 0.14 230);
  --primary-foreground: oklch(0.1 0.01 230);
  --background: oklch(0.12 0.01 230);
  --sidebar: oklch(0.10 0.02 230);
}
```

Apply it to `<body>` so portals (toasts, modals) also pick up the tokens:

```html
<body class="theme-ocean">
  <div id="root" class="middag-root">...</div>
</body>
```

::: warning Theme bridge
If you use Tailwind v4 `@theme` with `var()` references, custom theme classes need a **theme bridge** — re-declarations of `--color-*: var(--*)` at the `.theme-*` scope. See the [built-in theme bridge](https://github.com/middag-io/middag-react/blob/main/src/base/theme/theme-bridge.css) for the pattern. Without this, Tailwind utilities like `bg-primary` won't react to your custom theme's `--primary` value.
:::

---

## Example: WordPress Plugin Theme {#wordpress-plugin-theme}

The `middag-account` WordPress plugin overrides the default Figtree font and injects a brand color. The plugin's PHP enqueues a stylesheet that sets:

```css
:root {
  /* Override the font stack to match WordPress admin */
  --font-sans:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;

  /* Brand color injected via PHP from plugin settings */
  --middag-brand: oklch(0.45 0.12 264);
}
```

The `--middag-brand` custom property is special: the Tailwind `@theme` block maps `--color-primary` to `var(--middag-brand, var(--primary))`, so setting `--middag-brand` overrides the primary color without touching the base token. This allows the host application to brand the UI without conflicting with the default theme.

PHP injection example:

```php
// In your plugin's enqueue callback:
$brand = get_option('middag_brand_color', 'oklch(0.45 0.12 264)');
wp_add_inline_style('middag-react', ":root { --middag-brand: {$brand}; }");
```

---

## Host Integration {#host-integration}

When MIDDAG UI runs inside a host application (WordPress admin, Moodle), the host's fixed header and sidebar occupy screen space. Two CSS custom properties let the MIDDAG layout account for this:

| Property               | Purpose                            | Example                                                      |
|------------------------|------------------------------------|--------------------------------------------------------------|
| `--host-header-height` | Height of the host's fixed top bar | `32px` (WP admin bar), `50px` (Moodle navbar)                |
| `--host-sidebar-width` | Width of the host's fixed sidebar  | `160px` (WP expanded), `36px` (WP collapsed), `0px` (Moodle) |

The MIDDAG sidebar positions itself using these values:

```css
.middag-sidebar {
  top: var(--host-header-height, 0px);
  height: calc(100svh - var(--host-header-height, 0px));
  left: var(--host-sidebar-width, 0px);
}
```

Set these properties in your host adapter or inline style:

```css
:root {
  --host-header-height: 32px;   /* WordPress admin bar */
  --host-sidebar-width: 160px;  /* WordPress sidebar (expanded) */
}

/* When WP sidebar is collapsed */
.folded :root {
  --host-sidebar-width: 36px;
}
```

For Moodle, `--host-header-height` is typically `50px` and `--host-sidebar-width` is `0px` (Moodle uses a top navigation, not a sidebar).

---

## Density {#density}

The DataTable component supports three density levels that control row height:

| Level         | Row Height | Use Case                                            |
|---------------|------------|-----------------------------------------------------|
| `compact`     | `32px`     | Dense data views, power users, maximum rows visible |
| `comfortable` | `40px`     | Default — balanced readability and density          |
| `spacious`    | `48px`     | Touch-friendly, accessibility, relaxed scanning     |

The density toggle is built into the DataTable toolbar and cycles through these levels. The default is `comfortable`.

These heights align with the component sizing tokens:

- `compact` (32px) matches `--size-button-sm`
- `comfortable` (40px) matches `--size-sidebar-item`
- `spacious` (48px) matches `--size-table-row`

---

## Appearance Modes {#appearance-modes}

The theme system supports three appearance modes:

- **system** — auto-detects from the host application (Moodle/WP) or falls back to OS `prefers-color-scheme`.
- **light** — forces light mode regardless of host or OS preference.
- **dark** — forces dark mode regardless of host or OS preference.

Users can override via the appearance toggle in the sidebar footer, which cycles through System > Light > Dark > System.

## Appearance API {#appearance-api}

Import these functions from `@middag-io/react` to control the theme programmatically:

| Function                   | Signature                           | Description                                                                                     |
|----------------------------|-------------------------------------|-------------------------------------------------------------------------------------------------|
| `getStoredAppearance()`    | `() => Appearance`                  | Read the stored preference from localStorage. Returns "system", "light", or "dark".             |
| `setAppearance(pref)`      | `(Appearance) => void`              | Persist preference and apply the resolved theme to DOM immediately.                             |
| `cycleAppearance()`        | `() => Appearance`                  | Cycle to the next mode (system > light > dark > system) and return the new value.               |
| `getEffectiveTheme(pref)`  | `(Appearance) => "light" \| "dark"` | Resolve a preference to the effective theme. For "system", consults host then OS.               |
| `applyTheme(theme)`        | `("light" \| "dark") => void`       | Apply a theme to DOM: sets data-theme on .middag-root elements and toggles .dark on `<html>`.   |
| `toggleDir()`              | `() => "ltr" \| "rtl"`              | Toggle document direction between LTR and RTL. Persists choice in localStorage.                 |
| `initDir()`                | `() => void`                        | Restore persisted direction on page load.                                                       |
| `onSystemThemeChange(cb?)` | `(cb?: () => void) => () => void`   | Listen for OS theme changes. Only reacts when preference is 'system'. Returns cleanup function. |

### Example

```tsx
import { cycleAppearance, getStoredAppearance } from '@middag-io/react';

function ThemeToggle() {
    const [mode, setMode] = useState(getStoredAppearance());

    return (
        <button onClick={() => setMode(cycleAppearance())}>
            {mode === 'system' ? 'System' : mode === 'light' ? 'Light' : 'Dark'}
        </button>
    );
}
```

## useIsDark Hook {#useisdark-hook}

The `useIsDark` hook provides a reactive boolean that updates whenever the theme changes. It uses `useSyncExternalStore` with a MutationObserver on `<html>` to detect class changes:

```tsx
import { useIsDark } from '@middag-io/react';

function MyComponent() {
    const isDark = useIsDark();
    return (
        <div style={{ background: isDark ? '#1a1a1a' : '#ffffff' }}>
            Current theme: {isDark ? 'dark' : 'light'}
        </div>
    );
}
```

::: tip Prefer Tailwind classes
In most cases you can use Tailwind `dark:` prefix classes instead of `useIsDark`. The hook is mainly useful when you need to pass theme information to third-party libraries or canvas-based components.
:::

## Host Theme Detection {#host-theme-detection}

When appearance is set to `system`, the theme engine detects the host application's theme before falling back to OS preference:

- **Moodle** — checks `<html data-theme>`, `.theme-dark` class, and Boost CSS variables.
- **WordPress** — checks `body.admin-color-*` classes and `<html class="dark">`.
- **Fallback** — OS `prefers-color-scheme: dark` media query.

::: info Read-only detection
Host theme detection is read-only. MIDDAG never modifies the host page's own classes or attributes — it only reads them to determine the current theme.
:::

## RTL Support {#rtl-support}

Full right-to-left support is built in:

- `toggleDir()` switches between LTR and RTL, persisting in localStorage.
- `initDir()` restores persisted direction on page load.
- Tailwind RTL utilities (`rtl:` prefix) work automatically.

```ts
import { toggleDir, initDir } from '@middag-io/react';

// On app load, restore persisted direction
initDir();

// Toggle on user action
const newDir = toggleDir();
console.log('Direction:', newDir); // 'rtl' or 'ltr'
```

## Types

```ts
type Appearance = 'system' | 'light' | 'dark';
type EffectiveTheme = 'light' | 'dark';
type AsyncStringResolver = (key: string, component?: string) => Promise<string>;
```
