# Providers Guide

MIDDAG React ships six providers that bridge backend data into React context. Each reads from Inertia shared props and exposes typed hooks.

## I18nProvider {#i18n-provider}

Translation system that reads pre-loaded strings from Inertia shared props (`theme.strings`) and optionally resolves missing keys via an async resolver injected by the host.

| Prop            | Type                                                   | Required | Description                                                                                                                |
|-----------------|--------------------------------------------------------|----------|----------------------------------------------------------------------------------------------------------------------------|
| `children`      | ReactNode                                              | Yes      | App tree to provide translations to.                                                                                       |
| `asyncResolver` | `(key: string, component?: string) => Promise<string>` | No       | Optional async function to resolve strings not in the pre-loaded set.                                                      |
| `overrides`     | `Record<string, string>`                               | No       | Client-side string overrides (e.g. `ptBR` locale). Merged into the lookup chain between server strings and async resolver. |

### useTranslation()

Returns `t` (sync lookup) and `tAsync` (async lookup with resolver fallback).

```tsx
import { useTranslation } from '@middag-io/react';

function MyComponent() {
    const { t, tAsync } = useTranslation();

    // Sync -- returns key itself if not pre-loaded
    const title = t('dashboard_title');

    // Async -- calls resolver if key is missing
    useEffect(() => {
        tAsync('rare_string', 'local_myplugin')
            .then(setLabel);
    }, [tAsync]);

    return <h1>{title}</h1>;
}
```

### Host-specific resolvers

```tsx
// Moodle -- uses core/str.get_string()
const moodleResolver = async (key: string, component?: string) => {
    const { get_string } = await import('core/str');
    return get_string(key, component || 'local_yourplugin');
};

<I18nProvider asyncResolver={moodleResolver}>...</I18nProvider>
```

```tsx
// WordPress -- uses wp.i18n.__()
const wpResolver = async (key: string) => {
    return wp.i18n.__(key, 'your-plugin-textdomain');
};

<I18nProvider asyncResolver={wpResolver}>...</I18nProvider>
```

## AuthProvider {#auth-provider}

Reads the `auth` object from Inertia shared props and provides user data with capability-based access control.

### useAuth()

Returns the authenticated user object and a `can()` function for capability checks.

```tsx
import { useAuth } from '@middag-io/react';

function UserGreeting() {
    const { user, can } = useAuth();

    return (
        <div>
            <p>Hello, {user.name}</p>
            {can('local/middag:manage') && (
                <a href="/settings">Settings</a>
            )}
        </div>
    );
}
```

### `<Can>` / `<Cannot>`

Declarative components for conditional rendering based on capabilities:

```tsx
import { Can, Cannot } from '@middag-io/react';

function ActionBar() {
    return (
        <>
            <Can capability="local/middag:manage">
                <button>Delete</button>
            </Can>
            <Cannot capability="local/middag:manage">
                <p>You do not have permission to manage.</p>
            </Cannot>
        </>
    );
}
```

### Auth data shape

| Field             | Type                              | Description                                            |
|-------------------|-----------------------------------|--------------------------------------------------------|
| `user`            | `{ id, name, email, avatarUrl? }` | Authenticated user object from Inertia shared props.   |
| `capabilities`    | `string[]`                        | List of Moodle/WP capabilities the user holds.         |
| `can(capability)` | `(cap: string) => boolean`        | Returns true if the user has the specified capability. |

## FlashProvider {#flash-provider}

Auto-converts `flash` shared props into Sonner toast notifications. Supports four severity levels: success, error, info, and warning.

::: tip Zero configuration
Just wrap your app with `<FlashProvider>` and flash messages from the backend will appear as toasts automatically. No additional setup is needed.
:::

```php
// Backend (PHP) -- set flash messages
$this->flash('success', 'Record saved successfully.');
$this->flash('error', 'Failed to delete the record.');

// Frontend -- FlashProvider reads flash prop on each
// Inertia navigation and fires the appropriate toast.
// No code needed in your components.
```

Flash supports a structured `toast` variant for custom duration:

```php
// Backend
$this->flash('toast', [
    'severity' => 'info',
    'message'  => 'Processing will take a few minutes.',
    'duration' => 10000,  // 10 seconds
]);
```

## ScopeProvider {#scope-provider}

Dynamic context provider that reads the `scope` Inertia shared prop. Extensions register scope data during PHP `boot()` via `global_scope_manager::set()`.

### useScope()

Returns the full scope object — a key-value map of extension-provided data.

```tsx
import { useScope } from '@middag-io/react';

function OrgBanner() {
    const scope = useScope();
    const org = scope.organization as {
        id: number;
        name: string;
    } | undefined;

    if (!org) return null;
    return <div>Organization: {org.name}</div>;
}
```

### useScopeKey\<T\>(key)

Type-safe accessor for a single scope key:

```tsx
import { useScopeKey } from '@middag-io/react';

interface OrgScope {
    id: number;
    name: string;
    slug: string;
}

function OrgHeader() {
    const org = useScopeKey<OrgScope>('organization');
    return <h2>{org?.name ?? 'No organization'}</h2>;
}
```

### Setting scope from PHP

```php
// In your extension's boot() method:
$scope = $this->container->get(global_scope_manager::class);
$scope->set('organization', [
    'id'   => $org->id,
    'name' => $org->name,
    'slug' => $org->slug,
]);
```

## ProgressProvider {#progress-provider}

Displays a thin NProgress bar at the top of the viewport during Inertia page transitions. Hooks into Inertia router events automatically.

::: tip No configuration needed
Just wrap your app with `<ProgressProvider>`. It listens to `router.on('start')` and `router.on('finish')` events from Inertia and manages the progress bar state.
:::

Behavior on navigation outcomes:

- **Completed** — bar finishes and fades out
- **Interrupted** — bar resets to zero instantly
- **Failed/Cancelled** — bar completes with a brief red flash (uses `var(--destructive)` color)

## ErrorReporterProvider {#error-reporter-provider}

Pluggable error telemetry provider. Wraps the app tree and exposes a `reportError` function via context. Consumers inject their own reporter (Sentry, Datadog, custom) at the host level.

### useErrorReporter()

Returns the `reportError` function to send errors with optional context metadata.

```tsx
import { useErrorReporter } from '@middag-io/react';

function DangerousAction() {
    const { reportError } = useErrorReporter();

    const handleClick = async () => {
        try {
            await riskyOperation();
        } catch (err) {
            reportError(err as Error, {
                component: 'DangerousAction',
                action: 'riskyOperation',
            });
        }
    };

    return <button onClick={handleClick}>Run</button>;
}
```

### Configuring a reporter

```tsx
import { ErrorReporterProvider } from '@middag-io/react';
import type { ErrorReporter } from '@middag-io/react';

// Sentry example
const sentryReporter: ErrorReporter = {
    report: (error, context) => {
        Sentry.captureException(error, { extra: context });
    },
};

<ErrorReporterProvider reporter={sentryReporter}>
    {children}
</ErrorReporterProvider>
```

When no reporter is provided, errors are logged to `console.error` as a fallback.

### Provider composition

Typical provider stack in your app root:

```tsx
import {
    I18nProvider,
    AuthProvider,
    FlashProvider,
    ScopeProvider,
    ProgressProvider,
    ErrorReporterProvider,
} from '@middag-io/react';

function App({ children }) {
    return (
        <ErrorReporterProvider reporter={myReporter}>
            <I18nProvider asyncResolver={resolver}>
                <AuthProvider>
                    <ScopeProvider>
                        <FlashProvider>
                            <ProgressProvider>
                                {children}
                            </ProgressProvider>
                        </FlashProvider>
                    </ScopeProvider>
                </AuthProvider>
            </I18nProvider>
        </ErrorReporterProvider>
    );
}
```
