# Custom Host Integration

Integrate MIDDAG React UI into any application that supports Inertia.js — beyond Moodle and WordPress.

## Overview

MIDDAG React UI is host-agnostic by design. The contract-driven architecture means the frontend does not care where the `PageContract` JSON comes from. Any backend that can:

1. Serve an Inertia.js response
2. Build a `PageContract` JSON object
3. Provide shared props (navigation, auth, theme)

...can use MIDDAG React UI as its frontend.

## Minimal Setup

### 1. Install

```bash
npm install @middag-io/react react react-dom @inertiajs/react @inertiajs/core
```

### 2. Entry Point

```tsx
// main.tsx
import { ContractPage, registerDefaults } from '@middag-io/react';
import { I18nProvider } from '@middag-io/react';
import '@middag-io/react/style.css';

registerDefaults();

// Your custom i18n resolver
const myResolver = async (key: string) => {
    const response = await fetch(`/api/translations/${key}`);
    const data = await response.json();
    return data.value;
};

export function App({ contract, help }) {
    return (
        <I18nProvider asyncResolver={myResolver}>
            <ContractPage contract={contract} help={help} />
        </I18nProvider>
    );
}
```

### 3. Host Adapter CSS Variables

Set these CSS custom properties on your host page so MIDDAG can position itself correctly within your application chrome:

```css
:root {
    --host-header-height: 0px;   /* Height of your app's fixed header */
    --host-sidebar-width: 0px;   /* Width of your app's fixed sidebar */
}
```

If your application has no fixed chrome, set both to `0px` and MIDDAG will occupy the full viewport.

## Shared Props Contract

MIDDAG expects these Inertia shared props on every request:

```ts
interface SharedProps {
    navigation: NavigationTreePayload;  // Sidebar tree
    auth: {
        id: number;
        name: string;
        email: string;
        avatarUrl?: string;
        capabilities: string[];
    };
    theme: {
        strings?: Record<string, string>;  // Pre-loaded i18n strings
        appearance?: 'system' | 'light' | 'dark';
    };
    flash?: {
        success?: string;
        error?: string;
        info?: string;
        warning?: string;
    };
    locale: string;      // e.g. 'en', 'pt-BR'
    version: string;     // e.g. '1.0.0'
}
```

## Custom Providers

If you are not using Inertia.js, you can still use MIDDAG's components by providing your own data through the provider stack:

```tsx
import {
    I18nProvider,
    AuthProvider,
    FlashProvider,
    ScopeProvider,
    ProgressProvider,
} from '@middag-io/react';

function App({ children }) {
    return (
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
    );
}
```

## Theme Detection

For custom hosts, MIDDAG falls back to OS `prefers-color-scheme` when no host-specific detection is available. You can also set the theme explicitly:

```ts
import { setAppearance } from '@middag-io/react';

// Force dark mode
setAppearance('dark');

// Or let the OS decide
setAppearance('system');
```
