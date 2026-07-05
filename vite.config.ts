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
      external: ["react", "react-dom", "react/jsx-runtime", "@inertiajs/react", "@inertiajs/core"],
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
