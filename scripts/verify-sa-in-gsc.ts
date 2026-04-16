/**
 * Verifica un service account como propietario de nextranjeria.com en Google
 * Search Console usando la Site Verification API.
 *
 * Por qué existe este script:
 *   La UI de GSC tiene un bug conocido al añadir service accounts como
 *   "Propietario" en propiedades `sc-domain:`: el modal de "Usuarios y
 *   permisos" acepta el email, cierra el diálogo, pero nunca persiste la
 *   entrada. Como tampoco hay opción de propietario delegado para
 *   `sc-domain:`, la única ruta fiable es la Site Verification API: el propio
 *   service account pide a Google un token DNS TXT, se añade al DNS del
 *   dominio y luego se confirma vía API.
 *
 * Flujo:
 *   1. `npx tsx scripts/verify-sa-in-gsc.ts --get-token`
 *      → Imprime el valor TXT que debe añadirse al DNS raíz de nextranjeria.com
 *        (tipo `google-site-verification=xxx...`).
 *   2. Añadir el registro TXT en el proveedor DNS.
 *      Host/Subdominio: @ (raíz)
 *      Tipo: TXT
 *      Valor: el que devolvió el paso 1
 *      Esperar 5–15 minutos a propagación.
 *   3. `npx tsx scripts/verify-sa-in-gsc.ts --confirm`
 *      → Llama a siteVerification.webResource.insert. Si Google lee el TXT,
 *        el service account queda como propietario verificado de
 *        `sc-domain:nextranjeria.com` automáticamente.
 *
 * Pre-requisitos:
 *   - GOOGLE_SERVICE_ACCOUNT_JSON exportado con el JSON del service account
 *     que se quiere verificar.
 *   - La Site Verification API debe estar habilitada en el proyecto de
 *     Google Cloud (console.cloud.google.com → APIs & Services → Library →
 *     "Google Site Verification API" → Enable).
 *
 * Uso:
 *   GOOGLE_SERVICE_ACCOUNT_JSON=$(cat sa.json) npx tsx scripts/verify-sa-in-gsc.ts --get-token
 *   GOOGLE_SERVICE_ACCOUNT_JSON=$(cat sa.json) npx tsx scripts/verify-sa-in-gsc.ts --confirm
 */
import 'dotenv/config';
import { google } from 'googleapis';
import { getGoogleAuth } from './lib/google-auth.mjs';

const DOMAIN = 'nextranjeria.com';
const SITE_IDENTIFIER = DOMAIN;
const VERIFICATION_METHOD = 'DNS_TXT';

type Mode = 'get-token' | 'confirm';

function parseMode(): Mode {
  const arg = process.argv[2];
  if (arg === '--get-token') return 'get-token';
  if (arg === '--confirm') return 'confirm';
  console.error('Uso: verify-sa-in-gsc.ts [--get-token|--confirm]');
  process.exit(2);
}

async function main(): Promise<void> {
  const mode = parseMode();

  const authClient = await getGoogleAuth({
    scopes: ['https://www.googleapis.com/auth/siteverification'],
  });

  const siteVerification = google.siteVerification({
    version: 'v1',
    auth: authClient as any,
  });

  if (mode === 'get-token') {
    const res = await siteVerification.webResource.getToken({
      requestBody: {
        site: {
          identifier: SITE_IDENTIFIER,
          type: 'INET_DOMAIN',
        },
        verificationMethod: VERIFICATION_METHOD,
      },
    });

    const token = res.data.token;
    if (!token) {
      console.error('❌ Google no devolvió token');
      process.exit(1);
    }

    console.log('');
    console.log(`✅ Token obtenido. Añade este registro TXT al DNS de ${DOMAIN}:`);
    console.log('');
    console.log('   Host/Subdominio: @ (raíz del dominio)');
    console.log('   Tipo:            TXT');
    console.log(`   Valor:           ${token}`);
    console.log('');
    console.log('Tras propagación (5–15 min), ejecuta:');
    console.log('   npx tsx scripts/verify-sa-in-gsc.ts --confirm');
    console.log('');
    return;
  }

  // mode === 'confirm'
  console.log(`📡 Confirmando verificación DNS de ${DOMAIN}...`);
  try {
    const res = await siteVerification.webResource.insert({
      verificationMethod: VERIFICATION_METHOD,
      requestBody: {
        site: {
          identifier: SITE_IDENTIFIER,
          type: 'INET_DOMAIN',
        },
      },
    });
    console.log('✅ Verificación completada.');
    console.log('   Owners:', res.data.owners?.join(', ') || '(vacío)');
    console.log('');
    console.log('El service account ya es propietario verificado de');
    console.log(`   sc-domain:${DOMAIN}`);
    console.log('Ahora `sitemaps.submit` debería funcionar. Prueba con:');
    console.log('   GOOGLE_SERVICE_ACCOUNT_JSON=$(cat sa.json) \\');
    console.log(`     SEARCH_CONSOLE_SITE=sc-domain:${DOMAIN} \\`);
    console.log('     npx tsx scripts/notify-sitemap.ts');
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Error confirmando verificación: ${msg}`);
    console.error('');
    console.error('Posibles causas:');
    console.error('  - El TXT aún no ha propagado (espera unos minutos más).');
    console.error('  - El TXT no está en la raíz (debe ser @, no www).');
    console.error('  - El valor del TXT no coincide con el que dio --get-token.');
    console.error('  - La Site Verification API no está habilitada en Google Cloud.');
    process.exit(1);
  }
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`❌ Error inesperado: ${msg}`);
  process.exit(1);
});
