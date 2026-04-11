// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { buildContentLastmodMap } from './scripts/build-sitemap-lastmod.mjs';

// Mapa URL → Date precomputado al cargar la config. Lo consume
// `serialize()` más abajo para inyectar `<lastmod>` en cada `<url>`.
// Ver `scripts/build-sitemap-lastmod.mjs` para los detalles del cálculo.
const urlToLastmod = buildContentLastmodMap();

// Rutas que nunca deben aparecer en el sitemap. Son páginas legales o
// meta que no aportan valor de indexación. No listamos aquí rutas
// privadas (p. ej. paneles internos) para no dar pistas públicas de su
// existencia: se bloquean en el código, no en configuración visible.
const SITEMAP_EXCLUDED = [
  '/aviso-legal/',
  '/politica-privacidad/',
  '/contacto/',
];

// https://astro.build/config
export default defineConfig({
  site: 'https://nextranjeria.com',
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: false },
    imageService: true,
  }),
  integrations: [
    mdx(),
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      filter: (page) => !SITEMAP_EXCLUDED.some((path) => page.includes(path)),
      serialize(item) {
        const lastmod = urlToLastmod.get(item.url);
        return lastmod ? { ...item, lastmod: lastmod.toISOString() } : item;
      },
    }),
  ],
  vite: {
    plugins: [/** @type {any} */ (tailwindcss())],
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
  build: {
    format: 'directory',
  },
  trailingSlash: 'always',
});
