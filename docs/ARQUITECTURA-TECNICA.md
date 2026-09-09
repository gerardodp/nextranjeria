# Arquitectura técnica de Nextranjería

> **Nota de lectura.** Este documento es el plan técnico original del
> arranque del proyecto (2026-04-07), conservado como registro de las
> decisiones de arquitectura y su porqué. Se escribió *antes* de existir
> código, por lo que algunas secciones describen intenciones que la
> realidad ha matizado:
>
> - Los **Hitos 1 y 2** están completados; los **Hitos 3-5** solo en parte.
> - Los **slash commands** de `.claude/commands/` nunca llegaron a crearse.
> - El **dashboard privado** (`/mi-dashboard/`) no está implementado.
>
> Para el estado editorial real y vigente, ver `docs/HOJA-DE-RUTA.md`.
> Para la identidad y taxonomías del sitio, `docs/DEFINICION-SITIO.md`.

## Contexto

Nextranjería arranca como un sitio puramente informativo sobre extranjería, inmigración y nacionalidad en España. Hoy solo existe `docs/DEFINICION-SITIO.md` (identidad, taxonomías, anatomía de página, hub Regularización 2026, sistema de estados normativos), `docs/HOJA-DE-RUTA.md` (5 fases priorizadas) y 13 PDFs de normativa vigente. **No hay código todavía.**

Necesitamos montar la arquitectura técnica reproduciendo el stack y las prácticas operativas del proyecto independiente `~/code/quealarma` (Astro+MDX, content collections con Zod, organización agéntica vía slash commands, automatización con scripts y GitHub Actions, dashboard privado, optimización SEO+GEO-LLM), **sin reproducir nada de su modelo comercial** (afiliación, productos, reviews, comparativas) y adaptando la pieza fundamental: el **sistema de estados normativos** (anunciado/borrador/BOE/vigente/transitorio/histórico) que es el corazón editorial del rigor que el proyecto se exige a sí mismo.

El estilo visual de partida es deliberadamente mínimo y básico (Hito 5 lo reemplaza vía `/frontend-design` por algo editorial moderno limpio). El objetivo no es lanzar pulido, es **lanzar pronto** con el hub de Regularización 2026 como punta de lanza (es Fase 0 absoluta en la hoja de ruta, aunque la norma aún no esté en BOE).

## Decisiones tomadas

1. **5 collections especializadas**: `pages` (técnicas por materia), `guides` (por situación), `faqs`, `glossary`, `normativa`.
2. **Estado normativo dual**: campo `normativeStatus` en frontmatter (estado dominante de la página) **+** componentes MDX inline (`<Anunciado>`, `<Borrador>`, `<BOE>`, `<EnVigor>`, `<Rumor>`, `<BaseLegal>`, etc.) para etiquetar afirmaciones puntuales. Imprescindible para el hub Regularización 2026.
3. **Automatización**: publish-scheduled diario + validación CI en PR + llms-full.txt/Indexing API + sync semanal de Google Search Console. NO se incluye detector de caducidad normativa (mitigación: dashboard con orden por `lastReviewed`).
4. **Dualidad modelo**: collection `pages` y `guides` con cross-references bidireccionales (`appliesToSituations` ↔ `relatedPages`).
5. **Hub** como dimensión ortogonal a `category` (campo `hub: 'regularizacion-2026'`), no como categoría más. Cada página del hub mantiene su categoría lógica.
6. **`fichaRapida` en frontmatter** (estructurada, validable) en lugar de componente MDX. Obligatoria por CI en `pages` de categorías estructurales.
7. **Glosario contextual manual**: `<Glosario term="arraigo">arraigo</Glosario>` con tooltip `title=""` en Fase 0 (JS tooltip relegado a Fase 5).

## Stack

- Astro 6 static + `@astrojs/mdx` + `@astrojs/react` + `@astrojs/sitemap` + `@astrojs/vercel`
- TypeScript strict, Tailwind v4 (CSS-first con `@theme`), node 22
- Path aliases: `@/*`, `@components/*`, `@layouts/*`, `@lib/*`, `@data/*`, `@content/*`
- Vercel deploy + service account de Google (GSC, GA4, Indexing API)

## Schemas Zod (`src/content.config.ts`)

### Enums compartidos
```
contentCategory = ['autorizaciones','trabajo','estudios','ciudadanos-ue',
  'proteccion-internacional','nacionalidad','tramites','normativa','actualidad']

normativeStatus = ['vigente','pendiente','transitorio','historico']
contentStatus   = ['draft','review','scheduled','published']
profileTag      = ['sin-papeles','recien-llegado','estudiante','trabajador',
                   'emprendedor','familia','ciudadano-ue','solicitante-asilo',
                   'profesional-cualificado']
authorizationTag = ['arraigo','reagrupacion-familiar','no-lucrativa','cuenta-ajena',
                    'cuenta-propia','larga-duracion','tarjeta-azul','nomada-digital',
                    'startup','temporada','investigador','ICT']
procedureTag    = ['solicitud-inicial','renovacion','modificacion','recurso',
                   'cita-previa','documentacion']
normativeTag    = ['LOEX','reglamento-extranjeria','ley-emprendedores','ley-startups',
                   'RD-240-2007','ley-asilo','codigo-civil']
hub             = ['regularizacion-2026']
```

### Base mixin
`title (≤80)`, `description (≤160)`, `pubDate`, `updatedDate?`, **`lastReviewed`** (obligatorio: distinto de `updatedDate`), `status`, `scheduledDate?`, `canonicalUrl?`, `noindex`, `featuredImage?`, `featuredImageAlt?`.

### `pages` (técnicas)
`category`, `hub?`, `normativeStatus`, `normativeReferences[]` (slugs de `normativa`, validado en CI), `appliesToProfiles[]`, `appliesToSituations[]` (slugs de `guides`), `authorizationTags[]`, `procedureTags[]`, `normativeTags[]`, `fichaRapida?: { normativa, quien, plazo, coste }` (obligatoria por CI en categorías estructurales), `relatedPages[]`, `relatedGuides[]`, `relatedFaqs[]`, `glossaryTerms[]`, `tableOfContents`.

### `guides` (por situación)
Como `pages`, pero **sin** `fichaRapida`, **con** `situationProfile: profileTag` (1, no array), `estimatedReadTime` obligatorio.

### `faqs`
`question (≤140)`, `shortAnswer (≤400)`, `category`, `hub?`, `normativeStatus`, perfiles, situaciones, refs normativas, `relatedFaqs/Pages/Guides[]`, `glossaryTerms[]`.

### `glossary`
`term`, `aliases[]`, `shortDefinition (≤300)`, `longDefinition?`, `category`, `normativeReferences[]`, `relatedTerms[]`, `relatedPages[]`, `lastReviewed`.

### `normativa`
Fichas de leyes/reglamentos con metadata gruesa: `title`, `shortTitle`, `longTitle`, `type` (ley-organica/ley/real-decreto/real-decreto-ley/orden-ministerial/instruccion/circular/directiva-ue/reglamento-ue/codigo-civil-articulos), `boeId?`, `boeUrl?`, `publishedDate?`, `effectiveDate?`, `status` (en-vigor/pendiente-publicacion/pendiente-entrada-vigor/derogada/modificada/historica), `replacedBy?`, `replaces[]`, `modifiedBy[]`, `subject`, `summary (≤500)`, `pdfPath?`, `officialQnA` (flag para "Q&A institucional sin valor normativo"), `relatedPages[]`, `tags[]`.

## Componentes MDX (día 1)

**Estado normativo** (`src/components/normative/`):
`<BaseLegal ref articulo>`, `<Anunciado fuente fecha>`, `<Borrador fecha>`, `<BOE fecha ref>`, `<EnVigor desde ref>`, `<EnLaPractica>`, `<Rumor>`. Cada uno renderiza un bloque con badge de color usando tokens CSS `--color-status-*`.

**Editoriales** (`src/components/content/`):
`<FichaRapida>` (auto-inyecta del frontmatter si no se pasan props), `<PasoAPaso>`/`<Paso>`, `<Checklist>` (clase `print:` para imprimir), `<Ojo>`, `<Ejemplo>`, `<Glosario term>` (link + tooltip), `<Faq question>` (acumula FAQPage JSON-LD), `<AlertaNormativa>`.

**Inyección global**: `src/mdx-components.ts` exporta el mapping; los layouts hacen `<Content components={mdxComponents}/>` para que los MDX no tengan que importar nada.

**Layouts inyectan** (no van en MDX): `EstadoNormativo`, `FechaRevision`, `AplicaA`, `RelatedContent`, `TerminosUsados`, `HubNav`.

## Estructura de directorios

```
nextranjeria/
├── .claude/{commands/, settings.json}
├── .github/workflows/{content-validation,scheduled-publish,sync-backlog-gsc}.yml
├── docs/                                    # ya existe (definición + ruta + PDFs)
│   ├── content-model.md                     # NUEVO: schema en prosa
│   ├── content-governance.md                # NUEVO: cuándo usar qué bloque
│   ├── seo-and-geo.md                       # NUEVO
│   └── editorial-style.md                   # NUEVO
├── public/{favicon.svg, og-default.png, fonts/, llms.txt, llms-full.txt, normativa/}
├── scripts/
│   ├── lib/{frontmatter,content-loader,similarity,google-auth,url-to-slug}.mjs
│   ├── publish-scheduled.ts                 # portado quealarma
│   ├── update-llms-txt.ts                   # portado
│   ├── notify-indexing-api.ts               # portado
│   ├── sync-backlog-from-gsc.ts             # portado
│   ├── validate-frontmatter.ts              # portado
│   ├── validate-internal-links.ts           # portado
│   ├── check-duplication.ts                 # portado
│   ├── check-links.ts                       # portado
│   ├── build-sitemap-lastmod.mjs            # portado
│   ├── validate-normative-references.ts     # NUEVO
│   ├── validate-cross-references.ts         # NUEVO
│   ├── validate-status-coherence.ts         # NUEVO
│   ├── validate-ficha-rapida.ts             # NUEVO
│   └── build-hub-index.ts                   # NUEVO
├── src/
│   ├── content.config.ts                    # 5 collections con Zod
│   ├── mdx-components.ts                    # mapping global
│   ├── middleware.ts                        # auth dashboard
│   ├── content/{pages,guides,faqs,glossary,normativa}/
│   ├── components/{content,normative,layout,seo,ui,dashboard}/
│   ├── layouts/{Base,Content,Guide,Faq,Glossary,Normativa,Hub,Listing}Layout.astro
│   ├── lib/{seo,related-content,glossary,normativa,utils,content,google-auth}.ts
│   ├── data/{content-backlog.json, hubs.json, profiles.json}
│   ├── pages/
│   │   ├── index.astro
│   │   ├── {sobre,metodologia,aviso-legal,politica-privacidad,contacto}.astro
│   │   ├── {robots.txt,rss.xml}.ts
│   │   ├── regularizacion-2026/{index,[...slug]}.astro
│   │   ├── {autorizaciones,trabajo,estudios,ciudadanos-ue,proteccion-internacional,
│   │   │   nacionalidad,tramites,actualidad}/[...slug].astro
│   │   ├── {guias,faq,glosario,normativa}/{index,[...slug]}.astro
│   │   └── mi-dashboard/{index,login}.astro + api/{backlog,analytics,
│   │       search-console,content-health,hub-regularizacion}.ts + logout.ts
│   └── styles/global.css
├── astro.config.mjs, tsconfig.json, vercel.json, package.json, .nvmrc
├── AGENTS.md, CLAUDE.md, README.md
```

**Routing por categoría**: las páginas viven en `src/content/pages/<categoría>/<slug>.mdx` y resuelven a URLs limpias `/autorizaciones/arraigo-social/`.

## Slash commands (`.claude/commands/`)

**Críticos para Fase 0**: `/generate-page`, `/generate-guide`, `/generate-faq`, `/generate-glossary-entry`, `/generate-normativa`, `/refresh-hub-regularizacion`, `/update-llms-txt`, `/check-links`.

**Importantes**: `/fill-relations` (autorrellena `relatedX` a partir del cuerpo), `/normativa-ingest` (procesa PDF de `docs/normativa/`), `/seo-audit`, `/generate-next`, `/seed-backlog`, `/refresh-backlog`.

**Específicos de extranjería que no existen en quealarma**:
- `/refresh-hub-regularizacion`: recorre el hub, busca novedades y propone cambios de estado normativo.
- `/normativa-ingest`: procesa PDFs locales para crear fichas estructuradas.
- `/fill-relations`: porque el frontmatter es pesado (≥7 arrays de relaciones).

**No se portan**: `/generate-review`, `/generate-comparative`, `/generate-article` (sustituidas por `/generate-page` y `/generate-guide`).

## GitHub Actions

1. **`content-validation.yml`** (en PR): `npm run build` (Zod) + `validate-frontmatter` + `validate-normative-references` + `validate-cross-references` + `validate-ficha-rapida` + `validate-status-coherence --ci` + `check-links` + `validate-internal-links --ci` + `tsc --noEmit`. Bloquea merge.
2. **`scheduled-publish.yml`** (cron 06:00 UTC): `publish-scheduled.ts` → `update-llms-txt.ts` → `build-hub-index.ts` → commit/push → `notify-indexing-api.ts`.
3. **`sync-backlog-gsc.yml`** (cron lunes 07:00 UTC): `sync-backlog-from-gsc.ts` → commit/push.

## Dashboard (`/mi-dashboard/`)

Auth por cookie + `DASHBOARD_SECRET`/`DASHBOARD_PASSWORD` (igual que quealarma). Tabs:
1. **Resumen**: clics/impresiones/CTR/posición 28d, contenido publicado, cola, gaps.
2. **SEO**: top queries/páginas GSC.
3. **Contenido**: stats por collection, gaps, huérfanos.
4. **Estado normativo** (NUEVO, sustituye "Afiliados"): tabla por `normativeStatus`, alertas de páginas pendientes >14 días, `lastReviewed` >180 días.
5. **Hub Regularización 2026** (NUEVO): snapshot del hub, eventos de cambio de estado.
6. **Analytics GA4**: pageviews por sección. Sin affiliate clicks.

Endpoints API: `/backlog`, `/search-console`, `/analytics`, `/content-health` (NUEVO), `/hub-regularizacion` (NUEVO).

## Estilo Fase 0 (mínimo)

- Tailwind v4 + tokens en `@theme`. Paleta neutra: azul grisáceo formal `#1e3a5f`. Tokens `--color-status-{vigente,pendiente,transitorio,historico}`.
- Tipografía: Inter body (self-hosted, copiada de quealarma). Headings: serif moderada o Inter pesado. Decisión final en Hito 5.
- Clase propia `.prose-legal` con interlineado 1.7, enlaces subrayados discretos. NO usar `@tailwindcss/typography` (queremos control granular).
- Layouts mínimos: `Base`, `Content`, `Guide`, `Faq`, `Glossary`, `Normativa`, `Hub`, `Listing`.
- UI básica: `Button`, `Badge`, `StatusPill`, `Chip`, `Card`, `Alert`.

**Hito 5** invoca `/frontend-design` para sustituir paleta/tipografía/UI básica por algo editorial moderno limpio. Solo toca `global.css`, `components/ui/`, `components/layout/` y los layouts. No modifica schemas, MDX de contenido, scripts ni dashboard.

## Hitos de ejecución

> **Estado: Hitos 1 y 2 completados el 8 de abril de 2026.** Build estático con
> 34 páginas, `astro check` limpio (0 errores, 0 warnings, 0 hints), 5 content
> collections Zod validadas, 13 fichas de normativa ingestadas, hub
> Regularización 2026 con 5 páginas respetando el principio "solo BOE es
> vinculante" (componentes `<Anunciado>`, `<Borrador>`, `<Rumor>`).

### Hito 1 — Bootstrap ✅
Proyecto compilable con 1 página de prueba que usa todos los componentes.
- Crear `package.json`, `astro.config.mjs`, `tsconfig.json`, `.nvmrc`, `vercel.json`, `.gitignore`
- `src/content.config.ts` con las 5 collections
- `src/mdx-components.ts`
- Todos los componentes `normative/`, `content/`, `ui/`, `layout/`, `seo/` (stubs estilados al mínimo)
- Todos los layouts
- `src/lib/{seo,related-content,glossary,normativa,utils,content}.ts`
- `src/styles/global.css` con tokens y fuentes
- `src/pages/index.astro` (home mínima)
- `src/pages/robots.txt.ts` con AI crawlers permitidos
- `src/pages/autorizaciones/[...slug].astro`
- `public/{favicon.svg, og-default.png, fonts/, llms.txt}` (copiar fuentes de quealarma)
- 1 MDX de prueba: `src/content/pages/autorizaciones/arraigo-social.mdx` que usa todos los bloques
- 1 entrada de `glossary/arraigo.mdx` y 1 de `normativa/real-decreto-1155-2024-reglamento-extranjeria.mdx`
- `AGENTS.md`, `CLAUDE.md` mínimos

**Criterio de hecho**: `npm run build` y `npm run check` limpios, `/autorizaciones/arraigo-social/` renderiza con todos los bloques, las 5 collections cargan sin warnings.

### Hito 2 — Contenido Fase 0 ✅
Hub Regularización 2026 + empadronamiento + páginas institucionales. El sitio es ya útil para usuarios reales.
- Páginas del hub en `src/content/pages/actualidad/regularizacion-2026/*.mdx` (5+ páginas)
- `src/content/pages/tramites/empadronamiento.mdx`
- Páginas institucionales `.astro`
- Ingesta de las 13 normativas a `src/content/normativa/` (vía `/generate-normativa`)
- Home con destaque del hub
- Backlog poblado con gaps de Fase 1

**Desviaciones respecto al plan original:**
- La ingesta de normativa se hizo manualmente leyendo los PDFs uno a uno, no con `/generate-normativa` (ese slash command es Hito 3).
- `npm run check` ejecuta solo `astro check`, no `astro check && tsc --noEmit`. Motivo: `tsc --noEmit` puro no conoce los módulos virtuales de Astro (`astro:content`) ni los componentes `.astro`, y genera falsos positivos. `astro check` ya hace type-checking completo del TypeScript del proyecto. Para recuperar el `tsc` habría que configurar un tsconfig dedicado que excluya `.astro` y confíe en los tipos generados; no es prioritario ahora.
- Se incluyó una página extra en el hub: "Diferencias entre regularización 2026 y arraigo" (6 páginas en total, el plan pedía 5+).
- El feedback de memoria "solo contenido, nada operativo" quedó superado por este plan y se actualizó la memoria en consecuencia.

### Hito 3 — Automatización
Scripts CI, workflows, slash commands, docs operativas.
- Todos los scripts portados de quealarma + los 4 nuevos validadores + `build-hub-index.ts`
- Los 3 workflows de GitHub Actions
- Todos los slash commands (`.claude/commands/`)
- `docs/{content-model,content-governance,seo-and-geo,editorial-style}.md`

### Hito 4 — Dashboard
`/mi-dashboard/` privado con tabs Resumen/SEO/Contenido/Estado normativo/Hub.
- `src/middleware.ts`, login/logout, `Dashboard.tsx`, los 5 endpoints API
- `src/lib/google-auth.ts`, `.env.example`

### Hito 5 — Refinamiento visual
Invocar `/frontend-design` para reemplazar estilos mínimos por editorial moderno limpio.
- Modifica solo: `global.css`, `components/ui/`, `components/layout/`, headers/footers de layouts
- NO toca: schemas, MDX de contenido, scripts, workflows, dashboard

## Verificación end-to-end (Hito 1)

```
cd /Users/gerardo.diaz/code/nextranjeria/nextranjeria
npm install
npm run build       # sin errores ni warnings, las 5 collections cargan
npm run check       # astro check + tsc --noEmit limpio
npm run dev
```

Checks visuales:
- `localhost:4321/` → home con navegación y enlace al hub
- `localhost:4321/autorizaciones/arraigo-social/` → muestra título, breadcrumbs, `StatusPill`, `FichaRapida` con los 4 campos, cuerpo con `<BaseLegal>`, `<EnLaPractica>`, `<Ojo>`, `<PasoAPaso>`, `<Glosario>` con tooltip nativo, "Términos usados", "Contenido relacionado" y JSON-LD Article en `<head>`
- `localhost:4321/glosario/arraigo/` → entrada con definiciones
- `localhost:4321/normativa/real-decreto-1155-2024-reglamento-extranjeria/` → ficha con link a BOE
- `localhost:4321/robots.txt` → directivas AI crawlers presentes

Validación de schemas: introducir un error deliberado (quitar `fichaRapida.normativa`) debe hacer fallar el build con mensaje Zod claro.

## Archivos críticos para iniciar

- `src/content.config.ts` (5 collections con Zod, todos los enums)
- `astro.config.mjs` (mdx, react, sitemap, vercel, build hooks)
- `src/mdx-components.ts` (mapping global)
- `src/layouts/ContentLayout.astro` (inyección de mdx components, ficha rápida desde frontmatter, JSON-LD)
- `src/components/normative/BaseLegal.astro` (el componente de estado normativo más importante; el resto siguen su patrón)

Referencias en quealarma para consultar durante implementación (no copiar a ciegas):
- `src/content.config.ts`, `astro.config.mjs`
- `src/layouts/ArticleLayout.astro`
- `src/lib/related-content.ts`
- `scripts/publish-scheduled.ts`, `scripts/update-llms-txt.ts`
- `.github/workflows/scheduled-publish.yml`
- `src/components/dashboard/Dashboard.tsx`, `src/middleware.ts`
