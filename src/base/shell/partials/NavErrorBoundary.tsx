/**
 * NavErrorBoundary — error boundary for sidebar and page header.
 * Shows a minimal fallback if navigation rendering fails.
 *
 * @see NV-05-ux-shell-sidebar.md §8.3
 */

import { Component, type ErrorInfo, type ReactElement, type ReactNode } from "react";

import { useErrorReporter, type ErrorReporter } from "@/engine/providers/error-reporter";

// ── Default fallback ─────────────────────────────────────────────────────────
// Hardcoded strings — an error boundary fallback must never depend on providers
// (I18nProvider, etc.) that may themselves be missing or broken.

function NavErrorFallback(): ReactElement {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 p-6 text-center">
      <span className="text-destructive" aria-hidden="true">
        &#x26A0;
      </span>
      <p className="text-muted-foreground text-sm">Navigation failed to load.</p>
      <button
        onClick={() => window.location.reload()}
        className="text-primary text-sm underline hover:no-underline"
      >
        Reload page
      </button>
    </div>
  );
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class NavErrorBoundaryInner extends Component<Props & { reporter: ErrorReporter | null }, State> {
  constructor(props: Props & { reporter: ErrorReporter | null }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (this.props.reporter) {
      this.props.reporter.captureError(error, {
        component: "NavErrorBoundary",
        action: "shell_render",
        componentStack: info.componentStack ?? undefined,
      });
    } else {
      console.error("[MIDDAG] Shell rendering error:", error, info.componentStack);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? <NavErrorFallback />;
    }

    return this.props.children;
  }
}

/** Error boundary that reports to the pluggable ErrorReporter (Sentry, New Relic, etc.) */
export function NavErrorBoundary({ children, fallback }: Props): ReactElement {
  const reporter = useErrorReporter();
  return (
    <NavErrorBoundaryInner reporter={reporter} fallback={fallback}>
      {children}
    </NavErrorBoundaryInner>
  );
}
