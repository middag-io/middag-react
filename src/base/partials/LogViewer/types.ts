/**
 * LogViewer shared types.
 *
 * Log lines are parsed server-side by log_reader_service::parse_line().
 * The React viewer receives structured data, not raw text.
 */

export type LogSeverity = "ERROR" | "CRITICAL" | "WARNING" | "INFO" | "DEBUG" | "NOTICE" | "RAW";

export interface ParsedLogLine {
  datetime: string;
  origin: string;
  actor: string;
  level: LogSeverity | string;
  message: string;
  context: Record<string, unknown> | unknown[];
}

export interface LogViewerProps {
  lines: ParsedLogLine[];
  filename: string;
  downloadUrl: string;
  totalLines: number;
  hasMore: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
  onClose?: () => void;
}
