/**
 * Escanea las content collections del sitio y devuelve un Map<url, Date>
 * con la fecha de última modificación efectiva de cada página publicada.
 *
 * El `lastmod` se calcula como `max(updatedDate, lastReviewed, pubDate)`
 * (filtrando los undefined). Esto refleja el principio editorial del
 * proyecto: una ficha revisada y confirmada vigente merece aparecer como
 * "fresca" ante crawlers y LLMs aunque el contenido no haya cambiado.
 *
 * El Map lo consume `astro.config.mjs` vía la callback `serialize` del
 * plugin `@astrojs/sitemap`, que inyecta `<lastmod>` en cada `<url>`.
 *
 * Particularidades de nextranjería respecto a otros sitios del stack:
 *  - `pages` se sirve bajo `/<category>/<slug>/` salvo que tengan
 *    `hub: regularizacion-2026`, en cuyo caso van a
 *    `/regularizacion-2026/<slug>/`.
 *  - `faqs` preserva la subcarpeta en el slug (`faq/<subdir>/<slug>/`).
 *  - `normativa` usa `contentStatus` en lugar de `status`.
 *  - Las rutas de collection usan `trailingSlash: 'always'`.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, basename, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from './lib/frontmatter.mjs';

export const SITE = 'https://nextranjeria.es';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const CONTENT_DIR = join(__dirname, '..', 'src', 'content');

/**
 * Colecciones escaneadas. El `urlPath` es el prefijo público bajo el que
 * se publican las entradas, con las excepciones documentadas arriba.
 */
const COLLECTIONS = [
  { name: 'pages', urlPath: null /* resuelto dinámicamente por category/hub */ },
  { name: 'guides', urlPath: 'guias' },
  { name: 'faqs', urlPath: 'faq' },
  { name: 'glossary', urlPath: 'glosario' },
  { name: 'normativa', urlPath: 'normativa' },
];

function getFiles(dir, extensions) {
  const files = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        files.push(...getFiles(fullPath, extensions));
      } else if (extensions.includes(extname(entry))) {
        files.push(fullPath);
      }
    }
  } catch {
    // Directorio inexistente: se ignora.
  }
  return files;
}

/**
 * Normaliza separadores de path a `/` para construir URLs portables
 * entre Darwin/Linux.
 */
function toUrlPath(p) {
  return p.split(sep).join('/');
}

/**
 * Convierte una cadena del frontmatter a Date, o devuelve null si no es
 * parseable. Acepta undefined/vacío sin ruido.
 */
function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Devuelve el máximo de un conjunto de Dates, ignorando null/undefined.
 * Si todos son nulos, devuelve null.
 */
function maxDate(...dates) {
  const valid = dates.filter((d) => d instanceof Date && !isNaN(d.getTime()));
  if (valid.length === 0) return null;
  return new Date(Math.max(...valid.map((d) => d.getTime())));
}

/**
 * Construye la URL pública canónica de una entrada según su colección.
 * Devuelve null si la entrada no debería aparecer en el sitemap (por
 * ejemplo, porque la colección no se enruta).
 */
function buildEntryUrl(collectionName, file, fm) {
  const collectionDir = join(CONTENT_DIR, collectionName);
  // Path relativo dentro de la colección, sin extensión, normalizado a `/`.
  const rel = toUrlPath(
    relative(collectionDir, file).replace(/\.(md|mdx)$/i, ''),
  );
  const lastSegment = basename(rel);

  switch (collectionName) {
    case 'pages': {
      // Páginas con hub tienen su propia ruta; el resto cuelga de su categoría.
      if (fm.hub === 'regularizacion-2026') {
        return `${SITE}/regularizacion-2026/${lastSegment}/`;
      }
      if (!fm.category) return null;
      return `${SITE}/${fm.category}/${lastSegment}/`;
    }
    case 'guides':
      return `${SITE}/guias/${lastSegment}/`;
    case 'faqs':
      // Preserva subcarpetas (p.ej. `regularizacion-2026/antecedentes-penales`).
      return `${SITE}/faq/${rel}/`;
    case 'glossary':
      return `${SITE}/glosario/${lastSegment}/`;
    case 'normativa':
      return `${SITE}/normativa/${lastSegment}/`;
    default:
      return null;
  }
}

/**
 * Determina si una entrada está publicada y debe aparecer en el sitemap.
 * `normativa` usa `contentStatus`; el resto usa `status`. `noindex: true`
 * siempre excluye.
 */
function isPublished(collectionName, fm) {
  if (fm.noindex === 'true' || fm.noindex === true) return false;
  const statusField = collectionName === 'normativa' ? 'contentStatus' : 'status';
  return fm[statusField] === 'published';
}

/**
 * Listados (`src/pages/.../index.astro`) que agregan contenido de las
 * colecciones. Su `lastmod` se deriva del máximo `lastmod` de las URLs
 * hijas que cumplen un predicado. Se expresa como un array en vez de un
 * objeto para garantizar orden determinista.
 *
 * - La home agrega TODO el contenido publicado (cualquier URL del Map).
 * - `/faq/`, `/guias/`, `/glosario/`, `/normativa/` agregan su colección
 *   completa, incluyendo las subrutas (p.ej. `/faq/regularizacion-2026/*`).
 * - Los listados por categoría de `pages` (`/trabajo/`, `/nacionalidad/`,
 *   etc.) agregan las páginas que cuelgan bajo ese prefijo.
 * - `/regularizacion-2026/` es el hub y agrega todas las URLs bajo su
 *   prefijo, vengan de `pages` o de `faqs`.
 * - `/materias/` es un índice de categorías; su señal útil es el máximo
 *   global, así que lo tratamos como la home.
 */
const LISTING_URLS = [
  { url: `${SITE}/`, match: () => true },
  { url: `${SITE}/materias/`, match: () => true },
  { url: `${SITE}/faq/`, match: (u) => u.startsWith(`${SITE}/faq/`) },
  { url: `${SITE}/guias/`, match: (u) => u.startsWith(`${SITE}/guias/`) },
  { url: `${SITE}/glosario/`, match: (u) => u.startsWith(`${SITE}/glosario/`) },
  { url: `${SITE}/normativa/`, match: (u) => u.startsWith(`${SITE}/normativa/`) },
  { url: `${SITE}/autorizaciones/`, match: (u) => u.startsWith(`${SITE}/autorizaciones/`) },
  { url: `${SITE}/trabajo/`, match: (u) => u.startsWith(`${SITE}/trabajo/`) },
  { url: `${SITE}/estudios/`, match: (u) => u.startsWith(`${SITE}/estudios/`) },
  { url: `${SITE}/ciudadanos-ue/`, match: (u) => u.startsWith(`${SITE}/ciudadanos-ue/`) },
  { url: `${SITE}/proteccion-internacional/`, match: (u) => u.startsWith(`${SITE}/proteccion-internacional/`) },
  { url: `${SITE}/nacionalidad/`, match: (u) => u.startsWith(`${SITE}/nacionalidad/`) },
  { url: `${SITE}/tramites/`, match: (u) => u.startsWith(`${SITE}/tramites/`) },
  { url: `${SITE}/actualidad/`, match: (u) => u.startsWith(`${SITE}/actualidad/`) },
  { url: `${SITE}/regularizacion-2026/`, match: (u) => u.startsWith(`${SITE}/regularizacion-2026/`) },
];

/**
 * Lee todas las colecciones publicadas y devuelve un Map<url, Date> con
 * el `lastmod` efectivo de cada URL. El consumidor típico es la callback
 * `serialize` del plugin `@astrojs/sitemap`.
 *
 * El Map incluye también las URLs de listado (ver `LISTING_URLS`), cuyo
 * `lastmod` se calcula como el máximo de los hijos que cumplen su
 * predicado. Así Google recibe una señal de cambio útil en los índices
 * agregados, no sólo en las páginas de detalle.
 */
export function buildContentLastmodMap() {
  const map = new Map();

  for (const { name } of COLLECTIONS) {
    const dir = join(CONTENT_DIR, name);
    const files = getFiles(dir, ['.md', '.mdx']);

    for (const file of files) {
      let fm;
      try {
        const content = readFileSync(file, 'utf-8');
        fm = parseFrontmatter(content);
      } catch {
        continue;
      }
      if (!fm) continue;
      if (!isPublished(name, fm)) continue;

      const lastmod = maxDate(
        toDate(fm.updatedDate),
        toDate(fm.lastReviewed),
        toDate(fm.pubDate),
      );
      if (!lastmod) continue;

      const url = buildEntryUrl(name, file, fm);
      if (!url) continue;

      map.set(url, lastmod);
    }
  }

  // Segunda pasada: derivar `lastmod` de listados. Se añade al Map sólo
  // si hay al menos un hijo que cumpla el predicado; si no, el listado
  // queda sin lastmod (preferible a inventarse una fecha).
  const contentEntries = [...map.entries()];
  for (const listing of LISTING_URLS) {
    const childDates = contentEntries
      .filter(([url]) => listing.match(url))
      .map(([, date]) => date);
    const latest = maxDate(...childDates);
    if (latest) {
      map.set(listing.url, latest);
    }
  }

  return map;
}
