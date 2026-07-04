/**
 * Connectors VOs — TypeScript mirror of PHP VOs in
 * `classes/extensions/core/connectors/connector/*`.
 */

export type ConnectorStatus =
  | "unconfigured"
  | "configured"
  | "connected"
  | "degraded"
  | "disconnected";

export interface CredentialField {
  key: string;
  label: string;
  type: "text" | "password" | "url" | "select";
  required?: boolean;
  placeholder?: string | null;
}

export interface HealthCheckResult {
  success: boolean;
  latency_ms: number | null;
  error_message: string | null;
  resulting_status: string;
  checked_at: number;
}

export interface ConnectorListItem {
  id: number;
  fullname: string;
  connector_type: string;
  extension: string;
  status: ConnectorStatus;
  enabled: boolean;
  last_check_at: number | null;
  latency_ms: number | null;
}

export interface ConnectorDetail {
  id: number;
  fullname: string;
  description: string | null;
  connector_type: string;
  endpoint: string | null;
  extension: string;
  status: ConnectorStatus;
  enabled: boolean;
  created_at: number;
  modified_at: number;
  credential_fields: CredentialField[];
  health_history: HealthCheckResult[];
}

export interface ConnectorTypeInfo {
  type: string;
  name: string;
  extension: string;
  credential_fields: CredentialField[];
}
