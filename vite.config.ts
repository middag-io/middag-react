import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * Vite config for the MIDDAG React ESM library build.
 *
 * Produces an ESM bundle at dist-lib/ for consumption by WordPress,
 * standalone hosts, or any bundler that supports ESM.
 *
 * Run:   npm run build
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist-lib"),
    emptyOutDir: true,
    // Do NOT copy public/ into the library bundle. public/api/ holds demo
    // fixtures (example PageContracts + inspector data) that must never ship
    // in the published npm tarball. The demo serves them via its own
    // publicDir; the lib build only emits the ESM bundle.
    copyPublicDir: false,
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"),
      name: "MiddagReact",
      formats: ["es"],
      fileName: "middag-react",
    },
    cssCodeSplit: false,
    rollupOptions: {
      // i18next / react-i18next / the language detector MUST be external here.
      // The subpaths build (vite.subpaths.config.ts) already externalizes every
      // bare specifier, and the raw-src subpaths (./form/*, ./blocks/*, …)
      // compile react-i18next from the consumer's node_modules. If this main
      // entry bundles its own copy instead, a consumer that mixes `.` and
      // subpath imports ends up with TWO react-i18next module instances — two
      // distinct React contexts. I18nProvider (from `.`) publishes to context
      // A; a useTranslation resolved through the external copy reads context B,
      // finds nothing, and — because instance.ts uses createInstance() (no
      // global default) — throws NO_I18NEXT_INSTANCE. Externalizing dedupes it
      // to the single node_modules copy shared with the subpaths.
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@inertiajs/react",
        "@inertiajs/core",
        "i18next",
        "react-i18next",
        "i18next-browser-languagedetector",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@inertiajs/react": "InertiaReact",
          "@inertiajs/core": "InertiaCore",
        },
      },
    },
  },
});
