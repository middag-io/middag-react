# i18n Manifest — @middag-io/react

The library owns a private i18next instance (`createInstance()`) so it never
mutates a host app's global singleton. Domain code calls `t('key', params)`;
host-provided strings resolve lazily via `useHostString`.

## Stack

| Package                            | Version | Role                                                  |
|------------------------------------|---------|-------------------------------------------------------|
| `i18next`                          | ^26.3.1 | Core translation engine (native CLDR plurals)         |
| `react-i18next`                    | ^17.0.8 | React bindings (`useTranslation`, store re-render)    |
| `i18next-browser-languagedetector` | ^8.2.1  | Locale detection (localStorage → navigator → htmlTag) |
| `i18next-parser`                   | ^9.4.0  | Dev-only key extraction (`npm run i18n:extract`)      |

> `i18next-icu` is intentionally **not** installed — see D1.

## Namespace layout

The library bundles flat, dotted keys (`keySeparator: false`) under two
namespaces; hosts contribute a third axis at runtime.

| Namespace                    | Owner                  | Bundled? | Notes                                                                                                                          |
|------------------------------|------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------|
| `ui`                         | this library           | yes      | Default namespace. UI chrome strings (`middag.ui.*`), EN + pt-BR.                                                              |
| `validators`                 | this library           | yes      | Validation messages mirroring the framework violation keys, EN + pt-BR.                                                        |
| host component / text-domain | the host (Moodle / WP) | **no**   | Moodle component (e.g. `mod_unidade`) or WP text-domain. Added at runtime via `addResource`; returned RAW (D5). Never bundled. |

Bundled catalogs live in `src/i18n/locales/<locale>/<namespace>.json`. Supported
locales: `en` (fallback) and `pt-BR`. Server locales like `pt_BR` are normalized
to BCP-47 (`pt-BR`) by `normalizeLocale`.

## Locked decisions (D1–D6)

- **D1 — Drop `i18next-icu`.** `i18next-icu@2.x` pins `i18next@22`; never tested
  against the `i18next@26` that `react-i18next@17` hard-requires. We use i18next
  **native** plurals (CLDR `_one`/`_other`) + single-brace interpolation. The
  validation contract carries only `{param}` — no plural/select — so nothing is
  lost. Inline ICU stays an optional future opt-in.
- **D2 — `react.bindI18nStore: 'added'` is REQUIRED.** react-i18next does not
  re-render on `addResource`'s `'added'` event by default. Without it the lazy
  host resolver would resolve strings that never appear. It MUST be in `init`.
- **D3 — Single-brace interpolation (`prefix:'{'`, `suffix:'}'`).** Matches the
  framework `{param}` (e.g. `{limit}`) and the existing UI strings (`{min}`,
  `{max}`, `{count}`, `{label}`). i18next's default `{{double}}` is overridden so
  no string is re-authored.
- **D4 — `keySeparator: false`.** The flat dotted keys
  (`middag.ui.validation.required`) are kept verbatim; only relocated into
  namespace resources. Namespaces are the only structural axis — no nesting.
- **D5 — Host strings returned RAW.** `useHostString` returns the stored value
  (`i18n.getResource(...)`) with no interpolation, so Moodle `{$a->field}` /
  WP `%s` are never run through i18next. Interpolation belongs to the string's
  owner; host strings are server-final.
- **D6 — Framework Inertia error shape.** The framework v0.11.0 Inertia adapter
  delivers `errors[field]` as the structured `{message,key,domain,params}` object
  (the `ValidationErrorSerializer` shape). The wire `.message` is the guaranteed
  fallback for any key not yet present in the local `validators` namespace.

## Execution deviations (what shipped differs from the plan)

- **Typed resources relaxed to open string keys.** The plan proposed a
  `CustomTypeOptions.resources` augmentation that types `t()` against the JSON
  literal keys. That was relaxed: `src/@types/i18next.d.ts` keeps `defaultNS` and
  `keySeparator` but does **not** type a literal key union. Reason: this codebase
  builds keys dynamically (template literals like
  `middag.ui.form.document.${docType}.any`) and resolves many strings at runtime
  from host/server catalogs not bundled here — a literal-key union would reject
  valid `t()` calls.
- **`nonExplicitSupportedLngs` replaced by `load: 'currentOnly'`.** The plan set
  `nonExplicitSupportedLngs: true`. With explicit BCP-47 codes in `supportedLngs`
  (e.g. `pt-BR`), enabling it makes `isSupportedCode` strip the region suffix and
  fail the lookup. `load: 'currentOnly'` + exact codes is the working
  configuration (see `instance.ts`).

## Extraction workflow

```bash
npm run i18n:extract   # i18next --config i18next-parser.config.js
```

This scaffolds catalog entries for newly-added literal `t('key')` calls.

> **Safety — `keepRemoved: true` (deviation from the plan's `false`).** Most keys
> in this codebase are NOT statically discoverable: they are built from template
> literals or pulled at runtime from host/server catalogs. A run with
> `keepRemoved: false` DESTROYS the catalogs — a dry-run cut `en/ui.json` from 226
> to 105 keys and blanked dozens of pt-BR translations. `keepRemoved: true` makes
> extraction strictly **additive**: it adds newly-found literal keys and never
> deletes an existing key or pt-BR value. Treat extraction as a helper for new
> strings, not a source of truth — review and translate the empty pt-BR
> scaffolds it produces before committing.

Note: the binary shipped by `i18next-parser` is named `i18next` (not
`i18next-parser`); the npm script uses the correct name.

### Authoring strings

- Add UI strings as `t('middag.ui.<area>.<key>')` and provide the pt-BR value in
  `src/i18n/locales/pt-BR/ui.json` (EN defaults live in the `en` catalog).
- Host strings come from the host (Moodle component / WP text-domain) at runtime —
  never bundle them into the library catalogs.
