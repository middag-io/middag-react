/**
 * FREE demo harness entry point — Community engine only.
 *
 * Consumes the engine from src/ (Vite alias) for fast HMR. Registers the
 * Community defaults and maps the "product" shell key to BasicShell — the
 * rich ProductShell ships in @middag-io/react-pro, which this harness
 * deliberately never imports.
 */
import "@fontsource-variable/figtree";
import "./tailwind.css";
import "@middag-io/react/theme/themes/classic.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BasicShell, registerDefaults, registerShell } from "@middag-io/react";

import { App } from "./App";

registerDefaults();
registerShell("product", BasicShell);

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element in demo/index.html");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
