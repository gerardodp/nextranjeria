/**
 * Declaraciones de tipos para `build-sitemap-lastmod.mjs`.
 * Permiten que los scripts TypeScript del proyecto y el propio
 * `astro.config.mjs` (cuando se chequea con tsc) importen los helpers
 * con tipado en lugar de `any`.
 */
export const SITE: string;

export function buildContentLastmodMap(): Map<string, Date>;

/**
 * Construye la URL pública canónica de una entrada a partir del nombre de
 * la colección, la ruta absoluta del archivo y su frontmatter parseado.
 * Devuelve null si la entrada no debería aparecer en el sitemap.
 */
export function buildEntryUrl(
  collectionName: string,
  file: string,
  fm: Record<string, any>,
): string | null;
