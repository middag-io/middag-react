/**
 * EntityRoutes — contract-level entity-to-route resolution.
 *
 * ContractPage provides the entities map via context.
 * Any block can use useEntityRoute() to resolve entity links.
 */

import { createContext, useContext, type ReactElement, type ReactNode } from "react";
import { router } from "@inertiajs/core";

type EntityRoutes = Record<string, string>;

const EntityRoutesContext = createContext<EntityRoutes>({});

export function EntityRoutesProvider({
  entities,
  children,
}: {
  entities: EntityRoutes;
  children: ReactNode;
}): ReactElement {
  const parent = useContext(EntityRoutesContext);
  const merged = { ...parent, ...entities };
  return <EntityRoutesContext.Provider value={merged}>{children}</EntityRoutesContext.Provider>;
}

/**
 * Resolve an entity type + ID to a URL.
 * Returns null if the entity type is not in the contract's entities map.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useEntityRoute(): (type: string, id: string | number) => string | null {
  const entities = useContext(EntityRoutesContext);
  return (type: string, id: string | number) => {
    const pattern = entities[type];
    if (!pattern) return null;
    return pattern.replace("{id}", String(id));
  };
}

/**
 * Render a value as a navigable entity link.
 * Falls back to plain text if entity type is not in the contract map.
 */
export function EntityLink({
  type,
  id,
  children,
}: {
  type: string;
  id: string | number;
  children: ReactNode;
}): ReactElement {
  const resolve = useEntityRoute();
  const href = resolve(type, id);

  if (!href) return <>{children}</>;

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        router.visit(href);
      }}
      className="text-primary hover:underline"
    >
      {children}
    </a>
  );
}
