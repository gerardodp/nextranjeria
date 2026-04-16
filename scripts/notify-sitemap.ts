/**
 * Notifica a Google Search Console que el sitemap ha cambiado, forzando un
 * re-fetch inmediato.
 *
 * Usa `webmasters.sitemaps.submit` con el service account
 * `GOOGLE_SERVICE_ACCOUNT_JSON`, solicitando scope `webmasters` (no readonly)
 * por ser operación de escritura. Si el SA no tiene permisos suficientes en
 * GSC (necesita rol "Propietario"), el submit fallará pero el script **nunca
 * rompe el workflow**: siempre sale con código 0.
 *
 * Se ejecuta:
 *   - Desde el workflow `.github/workflows/scheduled-publish.yml` tras
 *     publicar contenido.
 *   - Puntualmente en local:
 *       GOOGLE_SERVICE_ACCOUNT_JSON=$(cat sa.json) npx tsx scripts/notify-sitemap.ts
 *
 * Pre-requisitos:
 *   - GOOGLE_SERVICE_ACCOUNT_JSON configurado como secret del repo.
 *   - El service account debe ser "Propietario" en Search Console de
 *     nextranjeria.com (Ajustes → Usuarios y permisos).
 *   - Search Console API habilitada en el proyecto de Google Cloud.
 *
 * Si `GOOGLE_SERVICE_ACCOUNT_JSON` no está configurado, el script se salta
 * con warning.
 */
import 'dotenv/config';
import { google } from 'googleapis';
import { getGoogleAuth } from './lib/google-auth.mjs';

const PUBLIC_SITE = 'https://nextranjeria.com';
const SITE_PARAM = process.env.SEARCH_CONSOLE_SITE || PUBLIC_SITE;
const SITEMAP_URL = `${PUBLIC_SITE}/sitemap-index.xml`;

async function main(): Promise<void> {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    console.warn(
      '⚠️  GOOGLE_SERVICE_ACCOUNT_JSON no configurado. Saltando notificación de sitemap.',
    );
    return;
  }

  let authClient: Awaited<ReturnType<typeof getGoogleAuth>>;
  try {
    authClient = await getGoogleAuth({
      scopes: ['https://www.googleapis.com/auth/webmasters'],
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Error inicializando Google Auth: ${msg}`);
    return;
  }

  const webmasters = google.webmasters({ version: 'v3', auth: authClient as any });

  // Resolver el siteUrl exacto (propiedad URL prefix o sc-domain:).
  // Si el valor ya viene como sc-domain:, no reaplicamos el prefijo.
  let site = SITE_PARAM;
  try {
    await webmasters.sites.get({ siteUrl: site });
  } catch {
    if (!SITE_PARAM.startsWith('sc-domain:')) {
      const domain = SITE_PARAM.replace(/^https?:\/\//, '').replace(/\/$/, '');
      site = `sc-domain:${domain}`;
      console.log(`ℹ️  Usando ${site} (fallback sc-domain)`);
    }
  }

  console.log(`📡 Notificando sitemap a GSC: ${SITEMAP_URL}`);
  console.log(`   site: ${site}`);
  try {
    await webmasters.sitemaps.submit({
      siteUrl: site,
      feedpath: SITEMAP_URL,
    });
    console.log(`✅ Sitemap reenviado correctamente`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Error notificando sitemap: ${msg}`);
    console.error(
      '   Comprueba que el service account tiene rol "Propietario" en GSC y\n' +
        '   que la Search Console API está habilitada en Google Cloud.',
    );
  }
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`❌ Error inesperado: ${msg}`);
});
