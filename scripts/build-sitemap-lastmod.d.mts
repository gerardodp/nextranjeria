/**
 * Declaraciones de tipos para `build-sitemap-lastmod.mjs`.
 * Permiten que los scripts TypeScript del proyecto y el propio
 * `astro.config.mjs` (cuando se chequea con tsc) importen los helpers
 * con tipado en lugar de `any`.
 */
export const SITE: string;

export function buildContentLastmodMap(): Map<string, Date>;
