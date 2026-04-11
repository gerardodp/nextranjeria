/**
 * Post-procesa el `sitemap-index.xml` generado por `@astrojs/sitemap`
 * para inyectar `<lastmod>` en cada entrada hija.
 *
 * `@astrojs/sitemap` emite el índice sin `lastmod`:
 *
 *   <sitemap><loc>https://.../sitemap-0.xml</loc></sitemap>
 *
 * Esto priva a Google de una señal de cambio en el índice y retrasa el
 * re-fetch del sitemap. Tras cada build inyectamos el mayor `<lastmod>`
 * encontrado en los sitemaps hijos:
 *
 *   <sitemap>
 *     <loc>...</loc>
 *     <lastmod>2026-04-11T00:00:00.000Z</lastmod>
 *   </sitemap>
 *
 * El script escanea `sitemap-*.xml` en `dist/` (adapter Vercel con
 * `output: 'static'`) o en `dist/client/` (otros adapters), extrae el
 * máximo `<lastmod>` de cada uno y reescribe `sitemap-index.xml` en el
 * directorio correspondiente.
 *
 * Se ejecuta automáticamente como hook `postbuild` en `package.json`.
 * Si el build no produjo `sitemap-index.xml` (p.ej. porque se deshabilitó
 * el plugin), el script sale en silencio sin error.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Astro con `output: 'static'` + adapter Vercel emite los sitemaps
// directamente bajo `dist/`. Otros adapters los publican en
// `dist/client/`; respetamos ambos para no atar el script al adapter.
function resolveDistDir(): string | null {
  const candidates = [join(process.cwd(), 'dist'), join(process.cwd(), 'dist', 'client')];
  for (const dir of candidates) {
    if (existsSync(join(dir, 'sitemap-index.xml'))) return dir;
  }
  return null;
}

const DIST_DIR = resolveDistDir();
const SITEMAP_INDEX = DIST_DIR ? join(DIST_DIR, 'sitemap-index.xml') : null;

function extractMaxLastmod(xml: string): string | null {
  const matches = xml.match(/<lastmod>([^<]+)<\/lastmod>/g);
  if (!matches || matches.length === 0) return null;
  const dates = matches
    .map((m) => m.replace(/<\/?lastmod>/g, ''))
    .map((d) => new Date(d))
    .filter((d) => !isNaN(d.getTime()));
  if (dates.length === 0) return null;
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
  return maxDate.toISOString();
}

function main(): void {
  if (!DIST_DIR || !SITEMAP_INDEX) {
    console.log('ℹ️  No se encontró sitemap-index.xml en dist/ ni dist/client/. Saltando postbuild.');
    return;
  }

  const indexXml = readFileSync(SITEMAP_INDEX, 'utf-8');

  const childSitemaps = readdirSync(DIST_DIR)
    .filter((f) => /^sitemap-\d+\.xml$/.test(f))
    .map((f) => join(DIST_DIR, f));

  if (childSitemaps.length === 0) {
    console.warn('⚠️  No hay sitemaps hijos. Dejando sitemap-index sin tocar.');
    return;
  }

  // Para cada <sitemap> del índice, localizar el fichero hijo correspondiente
  // y calcular su lastmod.
  const locs = [
    ...indexXml.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>.*?<\/sitemap>/gs),
  ];
  if (locs.length === 0) {
    console.warn('⚠️  sitemap-index.xml no contiene entradas <sitemap>. Nada que hacer.');
    return;
  }

  let updated = indexXml;
  let injected = 0;

  for (const match of locs) {
    const fullMatch = match[0];
    const loc = match[1];
    const filename = loc.split('/').pop();
    if (!filename) continue;
    const childPath = join(DIST_DIR, filename);
    if (!existsSync(childPath)) continue;

    const childXml = readFileSync(childPath, 'utf-8');
    const lastmod = extractMaxLastmod(childXml);
    if (!lastmod) continue;

    const replacement = `<sitemap><loc>${loc}</loc><lastmod>${lastmod}</lastmod></sitemap>`;
    updated = updated.replace(fullMatch, replacement);
    injected++;
  }

  if (injected === 0) {
    console.warn('⚠️  No se pudo inyectar lastmod en ninguna entrada.');
    return;
  }

  writeFileSync(SITEMAP_INDEX, updated, 'utf-8');
  console.log(`✅ Inyectado <lastmod> en ${injected} entrada(s) de sitemap-index.xml`);
}

main();
