# Forms Guide

The `FormPanelBlock` renders schema-driven forms from the page contract. The backend defines the form structure, field types, and validation — the frontend renders it automatically.

## Form Schema Structure {#form-schema-structure}

A form is described by `FormPanelBlockData`, which contains the submission endpoint, HTTP method, schema tree, current values, and errors:

```
FormPanelBlockData
├── action: "/api/endpoint"
├── method: "post" | "put" | "patch"
├── schema: FormSchemaNode[]
│   ├── FormSectionNode  { kind: 'section', id, label, children[] }
│   ├── FormGroupNode    { kind: 'group', id, columns, children[] }
│   ├── FormHeaderNode   { kind: 'header', label }
│   └── FormFieldNode    { kind: 'field', key, component, props }
├── values: { field_key: current_value }
├── errors: { field_key: "error message" }
└── meta: { submitLabel, cancelLabel, cancelHref, multiStep }
```

## Available Field Components {#available-field-components}

The `component` field on each `FormFieldNode` determines which input component renders:

| Component       | Value Type | Description                                                          |
|-----------------|------------|----------------------------------------------------------------------|
| `text`          | string     | Single-line text input.                                              |
| `textarea`      | string     | Multi-line text area. Supports rows prop.                            |
| `email`         | string     | Email input with browser validation.                                 |
| `password`      | string     | Password input with masked characters.                               |
| `url`           | string     | URL input with browser validation.                                   |
| `int`           | number     | Integer input. Supports min, max, step.                              |
| `float`         | number     | Decimal number input. Supports min, max, step.                       |
| `currency`      | number     | Locale-aware currency input. Props: currency, currencyLocale.        |
| `select`        | string     | Dropdown select. Requires options array.                             |
| `multiselect`   | string[]   | Searchable multi-select with chips (>8 options) or checkboxes (<=8). |
| `radio`         | string     | Radio button group. Requires options array.                          |
| `checkbox`      | boolean    | Single checkbox toggle.                                              |
| `switch`        | boolean    | Toggle switch control.                                               |
| `date`          | string     | Calendar popover date picker (YYYY-MM-DD).                           |
| `datetime`      | string     | Calendar + time picker (YYYY-MM-DDTHH:mm).                           |
| `phone`         | string     | International phone input (E.164). Country selector with flags.      |
| `document`      | string     | Country-aware document input (30+ locales via validator.js).         |
| `color`         | string     | Color picker + hex input.                                            |
| `slug`          | string     | URL-friendly slug with auto-generation.                              |
| `tags`          | string[]   | Chip-based tag input.                                                |
| `duration`      | number     | Duration input in seconds.                                           |
| `file`          | File       | File upload. Supports accept and multiple props.                     |
| `entity_picker` | string     | Searchable entity selection with avatar support.                     |
| `rating`        | number     | Star rating input. Props: maxRating (default 5).                     |
| `date_range`    | string[]   | Date range selector with filter operators and presets.               |
| `hidden`        | string     | Hidden field, not rendered visually.                                 |
| `static`        | string     | Read-only display value (not editable).                              |
| `header`        | n/a        | Section header label inside a group.                                 |

### Common Field Props

| Prop            | Type                 | Default    | Description                                        |
|-----------------|----------------------|------------|----------------------------------------------------|
| `label`         | string               | (required) | Field label displayed above the input.             |
| `placeholder`   | string               |            | Placeholder text inside the input.                 |
| `helpText`      | string               |            | Help text displayed below the input.               |
| `required`      | boolean              | false      | Whether the field is required.                     |
| `disabled`      | boolean              | false      | Whether the field is disabled.                     |
| `options`       | `{ value, label }[]` |            | Options for select, multiselect, and radio fields. |
| `min`           | number               |            | Minimum value for number fields.                   |
| `max`           | number               |            | Maximum value for number fields.                   |
| `visible_when`  | FormCondition        |            | Show field only when condition is met.             |
| `hidden_when`   | FormCondition        |            | Hide field when condition is met.                  |
| `required_when` | FormCondition        |            | Make field required when condition is met.         |
| `disabled_when` | FormCondition        |            | Disable field when condition is met.               |

## Conditional Fields {#conditional-fields}

Fields can be shown, hidden, required, or disabled based on other field values using `FormCondition` objects:

```ts
{
    kind: 'field',
    key: 'notification_email',
    component: 'email',
    props: {
        label: 'Notification Email',
        visible_when: {
            field: 'email_notifications',
            operator: 'equals',
            value: 'true',
        },
    },
}
```

Available operators:

| Operator     | Description                                               |
|--------------|-----------------------------------------------------------|
| `equals`     | Field value strictly equals the given value.              |
| `not_equals` | Field value does not equal the given value.               |
| `in`         | Field value is included in the given array of values.     |
| `not_in`     | Field value is not included in the given array of values. |

## Sections and Groups {#sections-and-groups}

Form schemas support structural nodes for organizing fields:

- **Sections** — collapsible containers with a label and optional `defaultCollapsed`.
- **Groups** — multi-column layouts (`columns: 1 | 2`).
- **Nesting** — Section > Group > Field.

```ts
{
    kind: 'section',
    id: 'contact',
    label: 'Contact Information',
    defaultCollapsed: false,
    children: [
        {
            kind: 'group',
            id: 'name-group',
            columns: 2,
            children: [
                { kind: 'field', key: 'first_name', component: 'text', props: { label: 'First Name', required: true } },
                { kind: 'field', key: 'last_name', component: 'text', props: { label: 'Last Name', required: true } },
            ],
        },
        { kind: 'field', key: 'email', component: 'email', props: { label: 'Email', required: true } },
    ],
}
```

## FormFieldNode Discriminated Union {#field-union}

`FormFieldNode` is a TypeScript discriminated union — narrow by `component` to access type-specific props:

```
SimpleFormField      — text, email, url, password, color
TextareaFormField    — textarea (+ rows)
NumericFormField     — int, float (+ min, max, step)
SelectFormField      — select, radio (+ options)
MultiSelectFormField — multiselect (+ options)
BooleanFormField     — checkbox, switch
DateFormField        — date, datetime
DurationFormField    — duration
FileFormField        — file (+ accept, multiple, maxFiles, maxSize)
EntityPickerFormField — entity_picker (+ autocomplete props)
PhoneFormField       — phone (+ country props)
DocumentFormField    — document (+ document validation props)
CurrencyFormField    — currency (+ currency, currencyLocale)
SlugFormField        — slug (+ sourceField, prefix)
TagsFormField        — tags (+ maxTags)
RatingFormField      — rating (+ maxRating)
DateRangeFormField   — date_range (+ operator)
HeaderFormField      — header (label only, no FieldPropsBase)
HiddenFormField      — hidden (key + default value)
StaticFormField      — static (read-only display)
```

Narrow by `component` to access type-specific props:

```ts
if (field.component === 'entity_picker') {
    // TypeScript narrows to EntityPickerFormField
    field.props.autocompleteHref;  // ✓ available
    field.props.entityAvatarField; // ✓ available
}
```

## Server Errors {#server-errors}

Validation errors returned by the backend are passed in the `errors` field of `FormPanelBlockData`. Each key maps to a field key:

```php
// Backend returns errors:
return back()->withErrors(['email' => 'Invalid email format']);
```

```ts
// Contract (received by frontend)
{
    errors: {
        email: 'Invalid email format'
    }
}
```

::: tip Real-time feedback
Errors are displayed inline next to each field automatically. The form block matches error keys to field keys in the schema.
:::

## PHP Example {#php-example}

Full PHP example showing how to build a form contract from the backend:

```php
$form = [
    'type' => 'form_panel',
    'key' => 'settings-form',
    'data' => [
        'action' => '/api/settings',
        'method' => 'put',
        'schema' => [
            [
                'kind' => 'section',
                'id' => 'general',
                'label' => 'General Settings',
                'children' => [
                    [
                        'kind' => 'field',
                        'key' => 'site_name',
                        'component' => 'text',
                        'props' => [
                            'label' => 'Site Name',
                            'required' => true,
                        ],
                    ],
                    [
                        'kind' => 'field',
                        'key' => 'language',
                        'component' => 'select',
                        'props' => [
                            'label' => 'Language',
                            'options' => [
                                ['value' => 'en', 'label' => 'English'],
                                ['value' => 'pt_br', 'label' => 'Portuguese'],
                            ],
                        ],
                    ],
                ],
            ],
        ],
        'values' => $currentValues,
        'errors' => $request->errors() ?? [],
        'meta' => [
            'submitLabel' => 'Save Settings',
            'cancelHref' => '/dashboard',
            'validation' => 'both',  // 'client' | 'server' | 'both'
        ],
    ],
];
```

## Client-Side Validation {#client-side-validation}

The `FormPanelBlock` uses [react-hook-form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for client-side validation. A Zod schema is generated **dynamically** from the `FormSchemaNode[]` tree:

- Field types produce appropriate validators (`email` → `.email()`, `int` → `.int()`, `url` → `.url()`)
- `required` fields get `.min(1)` for strings or non-nullable for numbers
- The `validation` prop adds custom rules (see below)
- Conditional fields are excluded from validation when hidden

### Validation Props {#validation-props}

Add a `validation` object to any field's props:

```php
[
    'kind' => 'field',
    'key' => 'username',
    'component' => 'text',
    'props' => [
        'label' => 'Username',
        'required' => true,
        'validation' => [
            'minLength' => 3,
            'maxLength' => 32,
            'pattern' => '^[a-z0-9_]+$',
            'patternMessage' => 'Only lowercase letters, numbers, and underscores',
        ],
    ],
]
```

### Validation Modes {#validation-modes}

Control validation behavior via `meta.validation`:

| Mode     | Client | Server  | Use Case                                                  |
|----------|--------|---------|-----------------------------------------------------------|
| `both`   | Zod    | Inertia | Default — immediate feedback + authoritative server check |
| `client` | Zod    | —       | Preview or test forms                                     |
| `server` | —      | Inertia | Forms with complex server-only rules                      |

## Specialized Field Props {#specialized-field-props}

### Phone Field {#phone-field}

International phone input with country flag selector. Value is E.164 format.

| Prop             | Type    | Default | Description                                      |
|------------------|---------|---------|--------------------------------------------------|
| `defaultCountry` | string  | `"BR"`  | ISO 3166-1 alpha-2 country code                  |
| `fixedCountry`   | boolean | false   | When true, locks to defaultCountry (no selector) |

```php
['component' => 'phone', 'props' => ['label' => 'Phone', 'defaultCountry' => 'US', 'fixedCountry' => true]]
```

### Document Field {#document-field}

Country-aware document validation using [validator.js](https://github.com/validatorjs/validator.js) `isTaxID` (30+ countries). The host sends a **locale** and an optional **scope** to restrict to person or company documents.

| Prop            | Type   | Default     | Description                                                                             |
|-----------------|--------|-------------|-----------------------------------------------------------------------------------------|
| `documentType`  | string | `"generic"` | validator.js locale (`"pt-BR"`, `"en-US"`, `"de-DE"`, etc.), `"generic"`, or custom key |
| `documentScope` | string | `"any"`     | `"person"` (individual), `"company"` (business), or `"any"` (both)                      |
| `documentMasks` | object |             | Custom format masks merged with built-in. `#` = digit placeholder.                      |

**Supported locales:** `pt-BR`, `en-US`, `en-GB`, `en-CA`, `en-IE`, `de-DE`, `de-AT`, `fr-FR`, `fr-BE`, `fr-LU`, `it-IT`, `es-ES`, `es-AR`, `pt-PT`, `nl-NL`, `pl-PL`, `sv-SE`, `dk-DK`, `fi-FI`, `hr-HR`, `hu-HU`, `ro-RO`, `bg-BG`, `cs-CZ`, `sk-SK`, `sl-SI`, `el-GR`, `el-CY`, `et-EE`, `lv-LV`, `lt-LT`, `mt-MT`, `uk-UA`.

```php
// Brazil — CPF only (person)
['component' => 'document', 'props' => [
    'label' => 'CPF',
    'documentType' => 'pt-BR',
    'documentScope' => 'person',
]]

// Brazil — CNPJ only (company)
['component' => 'document', 'props' => [
    'label' => 'CNPJ',
    'documentType' => 'pt-BR',
    'documentScope' => 'company',
]]

// Brazil — both CPF and CNPJ (default scope: "any")
['component' => 'document', 'props' => [
    'label' => 'CPF / CNPJ',
    'documentType' => 'pt-BR',
]]

// US — EIN only (company)
['component' => 'document', 'props' => [
    'label' => 'EIN',
    'documentType' => 'en-US',
    'documentScope' => 'company',
]]

// Custom country with host-defined mask
[
    'component' => 'document',
    'props' => [
        'label' => 'RUT',
        'documentType' => 'cl-CL',
        'documentMasks' => [
            'cl-CL' => ['pattern' => '##.###.###-#', 'maxLength' => 12],
        ],
    ],
]
```

Each scope gets its own mask and placeholder. Placeholders resolve via i18n key `middag.ui.form.document.{locale}.{scope}` — e.g., `pt-BR.person` = "CPF", `pt-BR.company` = "CNPJ", `pt-BR.any` = "CPF / CNPJ". Built-in scoped masks: `pt-BR`, `en-US`, `it-IT`, `fr-FR`, `es-AR`, `pl-PL`, `nl-NL`, `fi-FI`, `ro-RO`, `sv-SE`.

### Entity Picker {#entity-picker-field}

Searchable entity selection with avatar and subtitle support:

| Prop                   | Type   | Default | Description                                  |
|------------------------|--------|---------|----------------------------------------------|
| `autocompleteHref`     | string |         | Async search URL. Receives `?q=search_term`. |
| `autocompleteMinChars` | number | 2       | Min chars before search triggers             |
| `entityAvatarField`    | string |         | Field name in response for avatar URL        |
| `entitySubtitleField`  | string |         | Field name in response for subtitle          |

**Static mode** (options prop): local filtering, no HTTP requests.
**Async mode** (autocompleteHref): debounced fetch, avatar + subtitle display.

```php
[
    'component' => 'entity_picker',
    'props' => [
        'label' => 'Instructor',
        'autocompleteHref' => '/api/users/search',
        'autocompleteMinChars' => 2,
        'entityAvatarField' => 'avatar_url',
        'entitySubtitleField' => 'department',
    ],
]
```

API response format: `{ items: [{ value, label, avatar_url, department }] }`

### Currency Field {#currency-field}

Locale-aware currency input with formatted display:

| Prop             | Type   | Default | Description                                     |
|------------------|--------|---------|-------------------------------------------------|
| `currency`       | string | `"BRL"` | ISO 4217 currency code                          |
| `currencyLocale` | string |         | Override locale for formatting (e.g. `"en-US"`) |

### Multiselect Field {#multiselect-field}

Automatically switches between two modes:

- **≤8 options**: Checkbox list (simple, always visible)
- **>8 options**: Searchable combobox with selected items as removable badges
