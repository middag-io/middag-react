# Authentication

`@middag-io/react` is available from two registries. Choose based on your needs.

## npm public registry (recommended) {#npm-public}

No authentication needed. Install directly:

```bash
npm install @middag-io/react
```

You get the compiled library (`dist-lib/`) and TypeScript type definitions. This is sufficient for building plugins.

Imports, type-checking, extends, and compilation all work normally with the npm public package. Your bundler (Vite, webpack) consumes the ESM bundle and produces your plugin's final build.

## GitHub Packages (with source) {#github-packages}

Includes the full TypeScript source alongside the compiled output. Useful for:

- Navigating into library internals in your IDE
- Reading implementation details of shells, layouts, and blocks
- Contributing to the library

::: info Access requirement
GitHub Packages requires membership in the [middag-io](https://github.com/middag-io) organization. A token with `read:packages` scope alone is not sufficient — you must have read access to the repository.
:::

### Setup

1. Create a GitHub Personal Access Token at [github.com/settings/tokens](https://github.com/settings/tokens)
2. Select the `read:packages` scope (that's all you need)
3. Add to your global `~/.npmrc`:

```bash
echo "@middag-io:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN" >> ~/.npmrc
```

4. Install normally:

```bash
npm install @middag-io/react
```

::: warning Token security
Always store your token in `~/.npmrc` (global), never in a project-local `.npmrc` file. Project files can accidentally be committed to git, exposing your token.
:::

### Verify access

```bash
npm whoami --registry=https://npm.pkg.github.com
```

If this prints your GitHub username, you're configured correctly.

## The wizard handles this {#wizard}

`npx create-middag-ui` asks which registry you want during setup and configures everything automatically. You only need this page if you're setting up manually or troubleshooting.

## CI / Docker builds {#ci}

For CI pipelines and Docker builds where the wizard doesn't run:

### npm public (simplest)

No configuration needed. `npm install` works out of the box.

### GitHub Packages in CI

Set `NODE_AUTH_TOKEN` as an environment variable:

```yaml
# GitHub Actions
- uses: actions/setup-node@v5
  with:
    registry-url: https://npm.pkg.github.com
- run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

```dockerfile
# Dockerfile
ARG GITHUB_TOKEN
RUN echo "@middag-io:registry=https://npm.pkg.github.com" >> ~/.npmrc && \
    echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> ~/.npmrc && \
    npm ci && \
    rm ~/.npmrc
```

## Troubleshooting {#troubleshooting}

### `401 Unauthorized` during npm install

Your token is invalid or missing the `read:packages` scope.

1. Check your token: `npm whoami --registry=https://npm.pkg.github.com`
2. If it fails, create a new token at [github.com/settings/tokens](https://github.com/settings/tokens) with `read:packages`
3. Update `~/.npmrc` with the new token

### `404 Not Found` for @middag-io/react

The registry scope line is missing or wrong.

1. Check: `grep middag ~/.npmrc`
2. Should show: `@middag-io:registry=https://npm.pkg.github.com`
3. If missing, add it: `echo "@middag-io:registry=https://npm.pkg.github.com" >> ~/.npmrc`

### Switching between registries

To switch from GitHub Packages to npm public:

```bash
# Remove the scope redirect from ~/.npmrc
sed -i '' '/@middag-io:registry/d' ~/.npmrc
# Reinstall
npm install @middag-io/react
```

To switch from npm public to GitHub Packages, follow the [Setup](#github-packages) steps above.
