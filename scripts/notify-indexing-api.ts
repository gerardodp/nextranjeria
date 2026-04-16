/**
 * Notifica a la Google Indexing API sobre URLs publicadas o actualizadas.
 *
 * Se ejecuta desde `.github/workflows/scheduled-publish.yml` tras el commit
 * del cron de publicación programada. Lee la variable de entorno
 * `PUBLISHED_FILES` (output del paso `publish`) con las rutas relativas de
 * los archivos procesados, las convierte en URLs públicas y las notifica
 * una a una.
 *
 * Peculiaridad de nextranjería: la URL pública no se puede derivar sólo de
 * la colección y el slug (como en otros sitios del stack). `pages` se
 * enruta por `category` o `hub`, y `faqs` preserva subcarpetas. Por eso
 * este script **lee el frontmatter** de cada archivo publicado y delega
 * la construcción de la URL en `buildEntryUrl` (compartido con el
 * generador de sitemap).
 *
 * Comportamiento ante errores: loguea y continúa. Nunca falla el workflow
 * (siempre sale con código 0). Esto es intencional: la publicación ya ocurrió
 * y no queremos que un problema con Google bloquee el pipeline.
 *
 * Pre-requisitos:
 *   - GOOGLE_SERVICE_ACCOUNT_JSON configurado como secret (JSON del SA).
 *   - Service account propietario en Search Console de nextranjeria.com.
 *   - Indexing API habilitada en el proyecto de Google Cloud.
 *
 * Si GOOGLE_SERVICE_ACCOUNT_JSON no está configurado, el script se salta
 * con warning.
 */
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { join, isAbsolute } from 'node:path';
import { google } from 'googleapis';
import { buildEntryUrl } from './build-sitemap-lastmod.mjs';
import { parseFrontmatter } from './lib/frontmatter.mjs';

const INDEXING_SCOPE = 'https://www.googleapis.com/auth/indexing';

/**
 * Dado un path relativo al repo (p. ej.
 * `src/content/pages/actualidad/regularizacion-2026/que-es.mdx`), devuelve la
 * URL pública canónica o `null` si la entrada no es enrutable (no publicada,
 * colección desconocida, sin category/hub en `pages`, etc.).
 */
function pathToUrl(repoRelativePath: string): string | null {
  const parts = repoRelativePath.split('/');
  if (parts.length < 4 || parts[0] !== 'src' || parts[1] !== 'content') {
    return null;
  }
  const collection = parts[2];

  const absPath = isAbsolute(repoRelativePath)
    ? repoRelativePath
    : join(process.cwd(), repoRelativePath);

  let fm: Record<string, any> | null;
  try {
    const content = readFileSync(absPath, 'utf-8');
    fm = parseFrontmatter(content);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`  ⚠️  No se pudo leer ${repoRelativePath}: ${msg}`);
    return null;
  }
  if (!fm) return null;

  return buildEntryUrl(collection, absPath, fm);
}

async function main(): Promise<void> {
  const publishedFiles = (process.env.PUBLISHED_FILES || '').trim();
  if (!publishedFiles) {
    console.log('ℹ️  No hay archivos publicados para notificar.');
    return;
  }

  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!credentialsJson) {
    console.warn(
      '⚠️  GOOGLE_SERVICE_ACCOUNT_JSON no configurado. Saltando notificación a Indexing API.',
    );
    return;
  }

  // Convertir paths → URLs públicas.
  const paths = publishedFiles.split(',').map((p) => p.trim()).filter(Boolean);
  const urls: string[] = [];
  for (const p of paths) {
    const url = pathToUrl(p);
    if (url) {
      urls.push(url);
    } else {
      console.warn(`  ⚠️  No se pudo derivar URL pública de: ${p}`);
    }
  }

  if (urls.length === 0) {
    console.log('ℹ️  Ninguna URL derivable. Nada que notificar.');
    return;
  }

  // Parsear credenciales.
  let credentials: Record<string, unknown>;
  try {
    credentials = JSON.parse(credentialsJson);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ GOOGLE_SERVICE_ACCOUNT_JSON no es JSON válido: ${msg}`);
    return;
  }

  // Inicializar cliente.
  let indexing: ReturnType<typeof google.indexing>;
  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [INDEXING_SCOPE],
    });
    const client = await auth.getClient();
    indexing = google.indexing({ version: 'v3', auth: client as any });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Error inicializando cliente de Google Auth: ${msg}`);
    return;
  }

  // Notificar cada URL.
  console.log(`\n📡 Notificando ${urls.length} URL(s) a Google Indexing API:`);
  let successCount = 0;
  let errorCount = 0;

  for (const url of urls) {
    try {
      await indexing.urlNotifications.publish({
        requestBody: {
          url,
          type: 'URL_UPDATED',
        },
      });
      console.log(`  ✅ ${url}`);
      successCount++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ❌ ${url}: ${msg}`);
      errorCount++;
    }
  }

  console.log(
    `\n📊 Resumen: ${successCount} notificada(s), ${errorCount} error(es)`,
  );
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`❌ Error inesperado: ${msg}`);
});
