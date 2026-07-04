# Codemods

Automatic migration scripts for breaking changes between versions.

Each codemod is a `.mjs` file named `v{VERSION}.mjs` (e.g., `v0.7.0.mjs`).
The upgrade command runs all codemods between the current and target version.

## Writing a codemod

Export a default function that receives the project root path:

```js
export default async function migrate(projectRoot) {
  // Read, transform, write files
}

export const description = "What this codemod does";
```
