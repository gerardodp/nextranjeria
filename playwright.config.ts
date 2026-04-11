import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config para los tests e2e del proyecto.
 *
 * Los tests corren SIEMPRE contra producción (`https://nextranjeria.com/`).
 * Validamos el sistema real: HTML publicado en Vercel + container GTM
 * publicado + propiedad GA4 vinculada. Los cambios de código o de GTM
 * se ven reflejados tras cada despliegue/publicación.
 *
 * No usamos `webServer` porque la señal útil de estos tests es lo que
 * el visitante real experimenta en nextranjeria.com, no lo que produce
 * un build local (que no tendría el container GTM publicado aplicado).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // los tests tocan tráfico real a GA4; mejor secuencial
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'https://nextranjeria.com/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
