# Nextranjería — guía rápida para Claude Code

Nextranjería es un sitio informativo sobre extranjería, inmigración y
nacionalidad en España. Toda la información sobre identidad, taxonomías,
público objetivo y hoja de ruta editorial vive en:

- `docs/DEFINICION-SITIO.md` — documento maestro del sitio
- `docs/HOJA-DE-RUTA.md` — orden editorial por fases
- `.plans/arranque.md` — plan técnico completo del stack

## Principio editorial irrenunciable

> **Solo la norma publicada en BOE es marco aplicable.** Anuncios,
> comparecencias, notas de prensa y borradores no son normativa vigente
> y deben etiquetarse explícitamente como tales usando los componentes
> MDX de estado (`<Anunciado>`, `<Borrador>`, `<Rumor>`, etc.).

Esto aplica incluso cuando la medida es muy esperada (regularización
extraordinaria 2026): nada se presenta como marco aplicable hasta que
aparece en el BOE.

## Stack técnico

Astro 6 estático + MDX + content collections con Zod + Tailwind v4
(CSS-first con `@theme`) + deploy Vercel. Node 22. TypeScript strict.

## Collections

- `pages` — páginas técnicas por materia (tienen `category` y `fichaRapida`)
- `guides` — guías por situación personal (tienen `situationProfile`)
- `faqs` — preguntas frecuentes atómicas
- `glossary` — términos del glosario
- `normativa` — fichas de leyes, reglamentos, instrucciones

Los schemas están en `src/content.config.ts`.

## Componentes MDX globales

Los MDX no necesitan importar componentes. El mapping en
`src/mdx-components.ts` expone:

- Estado normativo: `BaseLegal`, `Anunciado`, `Borrador`, `BOE`, `EnVigor`, `EnLaPractica`, `Rumor`
- Editoriales: `FichaRapida`, `PasoAPaso`/`Paso`, `Checklist`, `Ojo`, `Ejemplo`, `Glosario`, `Faq`, `AlertaNormativa`

## Rutas

Las páginas viven en `src/content/pages/<categoria>/<slug>.mdx` y se
sirven como `/categoria/slug/` a través de las rutas dinámicas en
`src/pages/<categoria>/[...slug].astro`. El hub Regularización 2026
tiene su propia ruta `/regularizacion-2026/[...slug].astro` y sus
páginas llevan `hub: 'regularizacion-2026'` en el frontmatter.
