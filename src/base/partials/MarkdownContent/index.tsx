/**
 * MarkdownContent — renders sanitized markdown with syntax highlighting.
 *
 * Uses react-markdown with rehype-highlight for code blocks and rehype-sanitize
 * for XSS prevention. External links open in a new tab; internal links use
 * Inertia router for SPA navigation.
 *
 * @see NV-05-ux-blocks.md §5 (markdown content rendering)
 */

import { useCallback, useState, type ComponentPropsWithoutRef, type ReactElement } from "react";
import ReactMarkdown from "react-markdown";
import { CheckmarkSquare01Icon, Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

import { copyToClipboard } from "@/base/utils/clipboard";
import { Skeleton } from "@/components/reui/skeleton";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface MarkdownContentProps {
  content: string;
  maxHeight?: number;
  isLoading?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Sanitize schema                                                   */
/* ------------------------------------------------------------------ */

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: (defaultSchema.tagNames ?? []).filter((tag) => tag !== "script" && tag !== "style"),
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), "className"],
    span: [...(defaultSchema.attributes?.span ?? []), "className"],
  },
};

/* ------------------------------------------------------------------ */
/*  CodeBlockCopyButton                                               */
/* ------------------------------------------------------------------ */

function CodeBlockCopyButton({ code }: { code: string }): ReactElement {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="bg-background/80 absolute top-2 right-2 rounded p-1 opacity-0 transition-opacity group-hover/codeblock:opacity-100 focus:opacity-100"
      aria-label={t("middag.ui.markdown.copy_code")}
    >
      <HugeiconsIcon
        icon={copied ? CheckmarkSquare01Icon : Copy01Icon}
        size={14}
        className={cn(
          "transition-colors",
          copied ? "text-success" : "text-muted-foreground hover:text-foreground",
        )}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Link helpers                                                      */
/* ------------------------------------------------------------------ */

function isExternalUrl(href: string): boolean {
  try {
    const url = new URL(href, window.location.origin);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/*  Custom renderers                                                  */
/* ------------------------------------------------------------------ */

function extractTextContent(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractTextContent).join("");
  if (children && typeof children === "object" && "props" in children) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- React children traversal
    return extractTextContent((children as any).props?.children);
  }
  return String(children ?? "");
}

const markdownComponents = {
  h1: ({ children, ...props }: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="text-foreground mt-6 mb-4 text-2xl font-bold first:mt-0" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="text-foreground mt-5 mb-3 text-xl font-semibold first:mt-0" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="text-foreground mt-4 mb-2 text-lg font-semibold first:mt-0" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: ComponentPropsWithoutRef<"h4">) => (
    <h4 className="text-foreground mt-3 mb-2 text-base font-semibold first:mt-0" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p className="text-foreground mb-4 text-base leading-relaxed last:mb-0" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul className="text-foreground mb-4 list-disc space-y-1 pl-6" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol className="text-foreground mb-4 list-decimal space-y-1 pl-6" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li className="text-base leading-relaxed" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="border-primary/30 text-muted-foreground mb-4 border-l-4 pl-4 italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => <hr className="border-border my-6" {...props} />,
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
    if (!href) {
      return <span {...props}>{children}</span>;
    }

    if (isExternalUrl(href)) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline-offset-2 hover:underline"
          {...props}
        >
          {children}
        </a>
      );
    }

    // Internal link: use Inertia router
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          router.visit(href);
        }}
        className="text-primary underline-offset-2 hover:underline"
        {...props}
      >
        {children}
      </a>
    );
  },
  pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => {
    const codeText = extractTextContent(children);

    return (
      <div className="group/codeblock relative mb-4">
        <pre
          className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100 dark:bg-zinc-950"
          {...props}
        >
          {children}
        </pre>
        <CodeBlockCopyButton code={codeText} />
      </div>
    );
  },
  code: ({ className, children, ...props }: ComponentPropsWithoutRef<"code">) => {
    // Inline code (not inside a <pre>)
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm" {...props}>
          {children}
        </code>
      );
    }

    // Code block (inside <pre>) — rendered by rehype-highlight
    return (
      <code className={cn("font-mono text-sm", className)} {...props}>
        {children}
      </code>
    );
  },
  table: ({ children, ...props }: ComponentPropsWithoutRef<"table">) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: ComponentPropsWithoutRef<"th">) => (
    <th className="border-border bg-muted border px-3 py-2 text-left font-semibold" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: ComponentPropsWithoutRef<"td">) => (
    <td className="border-border border px-3 py-2" {...props}>
      {children}
    </td>
  ),
  img: ({ src, alt, ...props }: ComponentPropsWithoutRef<"img">) => (
    <img src={src} alt={alt ?? ""} className="mb-4 max-w-full rounded" loading="lazy" {...props} />
  ),
  strong: ({ children, ...props }: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold" {...props}>
      {children}
    </strong>
  ),
};

/* ------------------------------------------------------------------ */
/*  Skeleton                                                          */
/* ------------------------------------------------------------------ */

function MarkdownContentSkeleton(): ReactElement {
  return (
    <div className="max-w-[720px] space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export function MarkdownContent({
  content,
  maxHeight,
  isLoading,
}: MarkdownContentProps): ReactElement {
  const { t } = useTranslation();

  if (isLoading) {
    return <MarkdownContentSkeleton />;
  }

  // Empty content
  if (!content || content.trim().length === 0) {
    return (
      <div className="max-w-[720px]">
        <p className="text-muted-foreground text-sm italic">{t("middag.ui.markdown.no_content")}</p>
      </div>
    );
  }

  return (
    <div
      className={cn("prose-reset max-w-[720px]", maxHeight && "overflow-y-auto")}
      style={maxHeight ? { maxHeight: `${maxHeight}px` } : undefined}
    >
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight, [rehypeSanitize, sanitizeSchema]]}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- react-markdown components typing
        components={markdownComponents as any}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
