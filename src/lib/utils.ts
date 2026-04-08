/**
 * Utilidades genéricas.
 */

/**
 * Formatea una fecha en español, formato largo.
 */
export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formatea una fecha en español, formato corto (DD/MM/YYYY).
 */
export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Convierte una ruta de archivo de collection a un slug URL-friendly.
 * Descarta subdirectorios intermedios, conservando el último segmento.
 *
 * `autorizaciones/arraigo-social` → `arraigo-social`
 */
export function entryIdToSlug(id: string): string {
  const parts = id.split('/');
  return parts[parts.length - 1] ?? id;
}

/**
 * Devuelve la categoría (primer segmento) de un entry id con forma
 * `categoria/slug`. Si no hay barra, devuelve undefined.
 */
export function entryIdToCategory(id: string): string | undefined {
  const parts = id.split('/');
  return parts.length > 1 ? parts[0] : undefined;
}

/**
 * Construye la URL canónica de una página de la collection `pages` a
 * partir de su categoría y slug. Devuelve una ruta relativa con
 * trailing slash, por ejemplo `/autorizaciones/arraigo-social/`.
 */
export function pageUrl(category: string, id: string, hub?: string): string {
  const slug = entryIdToSlug(id);
  if (hub === 'regularizacion-2026') {
    return `/regularizacion-2026/${slug}/`;
  }
  return `/${category}/${slug}/`;
}
