/**
 * Host string resolver registry.
 *
 * Hosts (Moodle, WordPress) inject a per-key async resolver so the client can
 * lazily fetch ONE string at a time (e.g. Moodle get_string(key, component)).
 * Never preloads the host catalog. See useHostString for the consumption hook.
 */
export type HostStringResolver = (key: string, component: string, lng: string) => Promise<string>;

let resolver: HostStringResolver | null = null;

export function setHostStringResolver(fn: HostStringResolver | null): void {
  resolver = fn;
}

export function getHostStringResolver(): HostStringResolver | null {
  return resolver;
}
