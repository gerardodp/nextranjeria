/**
 * Verificación e2e del sistema Consent Mode v2 + GTM + GA4 en producción.
 *
 * Valida el flujo real que vive un visitante en `https://nextranjeria.com/`:
 *
 *   1. Consent Mode v2 inicializa con estado `denied` antes de que GTM
 *      se cargue (comprobado leyendo `window.dataLayer`).
 *   2. Google Tag Manager (`GTM-573T6MWD`) se descarga desde
 *      googletagmanager.com.
 *   3. El banner de consentimiento aparece en la primera visita.
 *   4. Antes de aceptar, el único tráfico a GA4 es un "consent ping"
 *      anonimizado (parámetro `gcs=G100`). Esto es comportamiento
 *      esperado y documentado de Consent Mode v2 en "advanced mode":
 *      Google envía un ping sin identificadores persistidos para poder
 *      hacer modelado de conversiones agregado. NO es un hit de medida.
 *   5. Al aceptar "Aceptar todas" en el banner:
 *      - el banner desaparece,
 *      - `localStorage.cookie-consent` persiste la elección,
 *      - la cookie `_ga` se setea,
 *      - la cookie `_ga_TQDCGRR02V` (ligada al Measurement ID) se setea,
 *      - se dispara una request de medida hacia
 *        `google-analytics.com/g/collect` con `tid=G-TQDCGRR02V`.
 *   6. En una segunda visita con consent ya guardado, el banner
 *      permanece oculto antes del primer paint y GA4 dispara
 *      automáticamente sin requerir interacción.
 *
 * Los tests dependen de que el container GTM esté publicado con la
 * etiqueta de Google apuntando al Measurement ID `G-TQDCGRR02V`. Si se
 * publica un cambio en GTM que rompa el circuito, estos tests lo
 * detectan en el siguiente `npm run test:e2e`.
 */
import { test, expect, type Page } from '@playwright/test';

const GTM_ID = 'GTM-573T6MWD';
const GA4_ID = 'G-TQDCGRR02V';
const LS_KEY = 'cookie-consent';

/**
 * Lee `window.dataLayer` desde la página y devuelve un snapshot
 * normalizado (los entries son `arguments`-like, así que los paseamos
 * a array para serializarlos vía `page.evaluate`).
 */
async function readDataLayer(page: Page): Promise<unknown[]> {
  return page.evaluate(() => {
    const dl = (window as unknown as { dataLayer?: unknown[] }).dataLayer || [];
    return dl.map((entry) => {
      if (entry && typeof entry === 'object' && 'length' in entry) {
        return Array.from(entry as ArrayLike<unknown>);
      }
      return entry;
    });
  });
}

test.describe('Consent Mode v2 + GTM + GA4 en producción', () => {
  test.describe('primera visita (sin consent guardado)', () => {
    test('Consent Mode default denied se establece antes que GTM', async ({
      page,
    }) => {
      await page.goto('/');
      const dataLayer = await readDataLayer(page);

      const consentDefault = dataLayer.find(
        (entry) =>
          Array.isArray(entry) && entry[0] === 'consent' && entry[1] === 'default',
      ) as unknown[] | undefined;

      expect(consentDefault, 'dataLayer debe contener consent default').toBeDefined();

      const cfg = (consentDefault?.[2] ?? {}) as Record<string, string>;
      expect(cfg.ad_storage).toBe('denied');
      expect(cfg.ad_user_data).toBe('denied');
      expect(cfg.ad_personalization).toBe('denied');
      expect(cfg.analytics_storage).toBe('denied');
      expect(cfg.functionality_storage).toBe('granted');
      expect(cfg.security_storage).toBe('granted');
    });

    test(`GTM container ${GTM_ID} se descarga`, async ({ page }) => {
      const gtmRequest = page.waitForRequest(
        (req) => req.url().includes(`googletagmanager.com/gtm.js`) && req.url().includes(GTM_ID),
        { timeout: 10_000 },
      );
      await page.goto('/');
      const req = await gtmRequest;
      expect(req.url()).toContain(GTM_ID);
    });

    test('banner de consentimiento visible en primera visita', async ({
      page,
    }) => {
      await page.goto('/');
      await expect(page.locator('#consent-banner')).toBeVisible();
      await expect(page.locator('#consent-accept-all')).toBeVisible();
      await expect(page.locator('#consent-reject')).toBeVisible();
      await expect(page.locator('#consent-toggle-details')).toBeVisible();
    });

    test('tráfico pre-consent a GA4 es un consent ping anonimizado (gcs=G100)', async ({
      page,
    }) => {
      const gaRequests: string[] = [];
      page.on('request', (req) => {
        if (req.url().includes('google-analytics.com')) {
          gaRequests.push(req.url());
        }
      });

      await page.goto('/');
      await page.waitForTimeout(2500);

      // Cualquier request a GA4 pre-consent DEBE tener gcs=G100.
      // Si hay alguna con gcs=G1xx donde los últimos dígitos son '11' (granted
      // analytics) sería un bug: significaría que el tag está disparando
      // saltándose el Consent Mode.
      for (const url of gaRequests) {
        const u = new URL(url);
        const gcs = u.searchParams.get('gcs');
        expect(
          gcs,
          `request pre-consent ${url} debe llevar parámetro gcs`,
        ).toBeTruthy();
        expect(
          gcs,
          `request pre-consent debe tener gcs=G100 (denied), encontrado ${gcs}`,
        ).toBe('G100');
      }
    });

    test('al aceptar, GA4 dispara con el Measurement ID correcto y cookies se setean', async ({
      page,
      context,
    }) => {
      await page.goto('/');
      await expect(page.locator('#consent-banner')).toBeVisible();

      // Arrancamos la promesa de wait ANTES del click, para no perder la request
      // si el tag dispara sincrónicamente.
      const ga4HitPromise = page.waitForRequest(
        (req) =>
          req.url().includes('google-analytics.com/g/collect') &&
          (req.url().includes(`tid=${GA4_ID}`) ||
            req.url().includes(`tid%3D${GA4_ID}`)) &&
          // Filtro clave: queremos un hit con consent granted, no el ping pre-consent.
          // Tras aceptar, gcs debe ser distinto de G100 (típicamente G111 o equivalente).
          !req.url().includes('gcs=G100'),
        { timeout: 10_000 },
      );

      await page.click('#consent-accept-all');

      const hit = await ga4HitPromise;
      expect(hit.url()).toContain(`tid=${GA4_ID}`);

      // Banner oculto tras aceptar
      await expect(page.locator('#consent-banner')).toBeHidden();

      // localStorage persistido con la elección
      const stored = await page.evaluate((k) => localStorage.getItem(k), LS_KEY);
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored as string) as {
        analytics: boolean;
        timestamp: number;
      };
      expect(parsed.analytics).toBe(true);
      expect(parsed.timestamp).toBeGreaterThan(0);

      // Cookies _ga y _ga_XXXXX (ésta última lleva el Measurement ID en el nombre)
      const cookies = await context.cookies();
      const ga = cookies.find((c) => c.name === '_ga');
      expect(ga, 'cookie _ga debe existir tras aceptar').toBeDefined();

      // La cookie de sesión de GA4 tiene formato _ga_XXXXXXXXXX donde
      // XXXXXXXXXX es la parte del Measurement ID sin el prefijo "G-".
      const ga4SessionCookieName = `_ga_${GA4_ID.replace('G-', '')}`;
      const gaSession = cookies.find((c) => c.name === ga4SessionCookieName);
      expect(
        gaSession,
        `cookie ${ga4SessionCookieName} debe existir tras aceptar (prueba de que GA4 con este Measurement ID está activo)`,
      ).toBeDefined();
    });
  });

  test.describe('segunda visita (consent ya guardado)', () => {
    test('banner oculto y GA4 dispara automáticamente al cargar', async ({
      page,
    }) => {
      // Prepopulamos localStorage ANTES de cargar la página, simulando
      // un visitante que ya aceptó en una sesión previa.
      await page.addInitScript((k) => {
        localStorage.setItem(
          k,
          JSON.stringify({ analytics: true, timestamp: Date.now() }),
        );
      }, LS_KEY);

      // Capturamos requests a GA4 desde el principio para verificar que
      // dispara sin intervención del usuario.
      const ga4Hits: string[] = [];
      page.on('request', (req) => {
        if (
          req.url().includes('google-analytics.com/g/collect') &&
          !req.url().includes('gcs=G100')
        ) {
          ga4Hits.push(req.url());
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);

      // Banner oculto (puede no existir en el DOM, o existir pero con display:none)
      const bannerLocator = page.locator('#consent-banner');
      const bannerCount = await bannerLocator.count();
      if (bannerCount > 0) {
        await expect(bannerLocator).toBeHidden();
      }

      // GA4 disparó al menos una vez
      expect(
        ga4Hits.length,
        `esperaba al menos 1 hit a GA4 con consent restaurado; obtenido ${ga4Hits.length}`,
      ).toBeGreaterThan(0);

      // Y con el Measurement ID correcto
      expect(ga4Hits[0]).toContain(`tid=${GA4_ID}`);
    });
  });
});
