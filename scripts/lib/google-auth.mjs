/**
 * Helper de autenticación Google para scripts Node.
 *
 * Lee `process.env` en vez de `import.meta.env` porque los scripts corren con
 * tsx fuera del runtime Vite/Astro.
 */
import { google } from 'googleapis';

const _authCache = new Map();

/**
 * Devuelve un cliente autenticado de Google usando el service account
 * `GOOGLE_SERVICE_ACCOUNT_JSON`.
 *
 * @param {Object} [options]
 * @param {string[]} [options.scopes] - OAuth scopes a solicitar. Por defecto
 *   solo lectura de Search Console. Pasa
 *   `['https://www.googleapis.com/auth/webmasters']` para operaciones de
 *   escritura como `sitemaps.submit`.
 */
export async function getGoogleAuth({
  scopes = ['https://www.googleapis.com/auth/webmasters.readonly'],
} = {}) {
  const cacheKey = [...scopes].sort().join(',');
  if (_authCache.has(cacheKey)) return _authCache.get(cacheKey);

  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!credentialsJson) {
    throw new Error(
      'GOOGLE_SERVICE_ACCOUNT_JSON no configurado. Exportar la variable de entorno o añadirla a .env',
    );
  }

  const credentials = JSON.parse(credentialsJson);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes,
  });

  const clientPromise = auth.getClient();
  _authCache.set(cacheKey, clientPromise);
  return clientPromise;
}

export function getSearchConsoleSite() {
  return process.env.SEARCH_CONSOLE_SITE || 'https://nextranjeria.com';
}
