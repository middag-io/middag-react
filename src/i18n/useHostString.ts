/**
 * useHostString — lazily resolve ONE host string (Moodle/WP) into i18next.
 *
 * Host catalogs are never preloaded. On first use, the injected resolver
 * fetches the single (key, component) pair; addResource writes it and (because
 * init sets react.bindI18nStore:'added') consumers re-render. The value is
 * returned RAW via getResource — host strings are server-interpolated already
 * and must never pass through i18next interpolation (plan D5).
 */
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { Namespace } from "i18next";

import { getHostStringResolver } from "./host-resolver";

export function useHostString(key: string, component: string): string {
  // Bind to the host component namespace; re-renders on 'added' (init D2).
  // Cast to Namespace: host components (e.g. "mod_unidade") are dynamic and
  // not in the static CustomTypeOptions.resources map.
  const ns = component as Namespace;
  const { i18n, ready } = useTranslation(ns, { useSuspense: false });
  const requested = useRef<Set<string>>(new Set());
  const lng = i18n.resolvedLanguage ?? i18n.language;

  useEffect(() => {
    const resolver = getHostStringResolver();
    if (!ready || !resolver) return;
    if (i18n.exists(key, { ns })) return;
    const id = `${lng}:${component}:${key}`;
    if (requested.current.has(id)) return;
    requested.current.add(id);

    let cancelled = false;
    void resolver(key, component, lng)
      .then((value) => {
        if (!cancelled) i18n.addResource(lng, component, key, value);
      })
      .catch(() => {
        requested.current.delete(id); // allow retry on next render
      });

    return () => {
      cancelled = true;
    };
  }, [key, component, ns, lng, ready, i18n]);

  // Raw lookup — no interpolation on host strings.
  const raw = i18n.getResource(lng, component, key) as string | undefined;
  return raw ?? key;
}
