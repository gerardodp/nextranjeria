# Operaciones de Nextranjería

Todo lo que hay que saber para operar el sitio y que no se deduce leyendo el
código: servicios externos de los que depende, decisiones de arquitectura
operativa y sus porqués, y los procedimientos manuales recurrentes.

Documentos hermanos: `DEFINICION-SITIO.md` (identidad y taxonomías),
`HOJA-DE-RUTA.md` (orden editorial), `ARQUITECTURA-TECNICA.md` (plan de
arranque y decisiones de arquitectura).

---

## 1. Servicios externos

El repo no es autosuficiente. El sitio depende de cuatro servicios externos,
y las credenciales de todos ellos viven **fuera** del repositorio.

| Servicio | Qué aloja | Dónde viven las credenciales |
|---|---|---|
| **Vercel** | Build y hosting de producción | Cuenta Vercel + vínculo proyecto↔repo |
| **GitHub** | Repo y el cron de publicación programada | Secrets del repositorio |
| **Google Cloud** | Service account para indexación | `.env` local + secrets de GitHub |
| **Search Console** | Propiedad de dominio, envío de sitemap | Permisos por cuenta y por service account |
| **Registrador DNS** | `nextranjeria.com` y su verificación TXT | Panel del registrador |

### Dominio

El dominio de producción es **`nextranjeria.com`**. El `.es` nunca existió:
fue un residuo del arranque que quedó hardcodeado en varios sitios y se
corrigió en el commit `a73e53f`. Si aparece `nextranjeria.es` en cualquier
parte del repo, es un bug.

### Service account de Google

- Proyecto GCP: **`nextranjeria-dashboard`**
- Email del SA: `indexing@nextranjeria-dashboard.iam.gserviceaccount.com`
- Clave JSON en `.env`, variable `GOOGLE_SERVICE_ACCOUNT_JSON` (una sola línea)
- Secrets equivalentes en GitHub Actions: `GOOGLE_SERVICE_ACCOUNT_JSON` y
  `SEARCH_CONSOLE_SITE`

**Cuatro APIs a habilitar en GCP:**

1. `siteverification.googleapis.com` — Site Verification API, para `verify-sa-in-gsc.ts`
2. `indexing.googleapis.com` — Indexing API, para `notify-indexing-api.ts`
3. `searchconsole.googleapis.com` — Search Console API, para `notify-sitemap.ts`
4. `analyticsdata.googleapis.com` — Analytics Data API, para lectura GA4 futura

**Permisos:** el SA está como Propietario en la propiedad
`sc-domain:nextranjeria.com` de Search Console. En GA4 falta darle rol Lector
(pendiente hasta que se monte el dashboard).

> **Bug conocido de la UI de Search Console con `sc-domain:`.** Añadir el email
> del service account como propietario no persiste: la UI acepta la acción pero
> no la guarda. La solución es verificar primero por **DNS TXT** con la Site
> Verification API:
>
> ```bash
> npx tsx scripts/verify-sa-in-gsc.ts --get-token   # devuelve el TXT
> # añadir ese registro TXT al DNS raíz (@) del dominio
> npx tsx scripts/verify-sa-in-gsc.ts --confirm
> ```
>
> Después de esto, añadir el SA como Propietario en la UI de GSC ya funciona.

---

## 2. Publicación programada

El contenido con `status: scheduled` (o `contentStatus: scheduled` en la
colección `normativa`) se publica mediante una **cola externa + un GitHub
Action** (`.github/workflows/scheduled-publish.yml`). Cron diario a las 06:00
UTC; también lanzable con `workflow_dispatch`.

**Por qué así:** separa el *cuándo* (la cola) del *cómo* (el action que toca el
repo). El action queda como **único escritor** que commitea contenido, lo que
mantiene atómicos los cambios de contenido y sus artefactos derivados
(sitemap, `llms.txt`, `llms-full.txt`, pings a Indexing API y sitemap a GSC).

**Consecuencias prácticas:**

- Cuando se proponga un automatismo post-publicación (regenerar índices,
  notificar crawlers…), su sitio natural es **un step más de este action**, no
  un hook local ni un workflow independiente.
- El worker de la cola idealmente **no toca el repo**: cambia el frontmatter y
  dispara el action.
- Si `publish-scheduled.ts` no encuentra nada vencido, el job termina sin
  commit ni pings.
- Los scripts (`publish-scheduled`, `update-llms-txt`, `notify-indexing-api`,
  `notify-sitemap`) son todos idempotentes y stand-alone.

### Cambios editoriales no programados

Los cambios masivos que van directos a `main` (por ejemplo, actualizar el hub
tras la entrada en vigor de una norma) no pasan por el cron. Para forzar
indexación inmediata, ping manual en local:

```bash
PUBLISHED_FILES="src/content/.../a.mdx,src/content/.../b.mdx" \
  npx tsx scripts/notify-indexing-api.ts
```

Cuota de la Indexing API: 200 URLs/día, muy por encima del uso real.

### Fallbacks

- Si `GOOGLE_SERVICE_ACCOUNT_JSON` no está definida, los scripts salen con un
  warning y **código 0**: no rompen el workflow. Esto significa que un secret
  ausente falla **en silencio** — si la indexación deja de funcionar tras una
  migración, es el primer sitio donde mirar.
- `notify-sitemap.ts` hace fallback a `sc-domain:` solo si el valor de entrada
  no llevaba ya ese prefijo, para evitar duplicarlo.

---

## 3. Convenciones editoriales

### Rigor normativo

El principio irrenunciable está en `CLAUDE.md`: solo la norma publicada en BOE
es marco aplicable. Pero se complementa con una segunda regla que no es obvia:

**Los temas candentes se publican aunque la norma no esté todavía en BOE.** El
valor del sitio está en ser la referencia fiable frente a la desinformación, y
eso exige estar presente desde que el tema genera interés, no esperar a la
publicación. El rigor no está en esperar, está en etiquetar con precisión el
estado de cada afirmación y actualizar conforme avanza: anuncio → borrador →
BOE → entrada en vigor → desarrollo.

### Atribución de autores

El pool vive en `src/data/authors.json`: Elena Navarro, Marcos Delgado, Sofía
Ramos y Javier Costa. Cada MDX de `pages`, `faqs` o `glossary` lleva `author`
en el frontmatter; si se omite, el default es "Nextranjería".

**No hay especialización temática.** Los cuatro son intercambiables y firman
cualquier materia. El criterio es un reparto **equilibrado y rotativo**: antes
de elegir, contar cuántas piezas tiene cada uno y asignar al más rezagado.
Nunca inventar autores fuera del pool.

Los autores tienen solo nombre, sin cargo ni bio, deliberadamente: no se
atribuye responsabilidad profesional ficticia en contenido legal.

### Rutas privadas

No mencionar rutas privadas (dashboards, admin) en `robots.txt`, en el
`filter` del sitemap ni en ninguna configuración pública del repo: listarlas
es una pista de que existen. Hubo un `Disallow: /mi-dashboard/` y una
exclusión paralela en `astro.config.mjs`; ambas se retiraron en `d925c08`.

Las rutas privadas se protegen en código (auth, `noindex` en el layout,
middleware) o simplemente no existen como páginas servidas.

### PDFs de normativa

Los PDFs de las normas vigentes están en `docs/normativa/` y son **fuente
primaria**. Usarlos para verificar artículos concretos o citar textualmente,
con preferencia sobre fuentes secundarias (artículos web, resúmenes de
despachos).

---

## 4. Estado editorial: regularización 2026

El **RD 316/2026** (BOE-A-2026-8284, de 14 de abril) se publicó el 15/04/2026
y entró en vigor el **16/04/2026**. Modifica el RD 1155/2024 creando dos vías
de arraigo extraordinario: **D.A. 20.ª** (solicitantes de protección
internacional) y **D.A. 21.ª** (vías alternativas laboral, familiar y por
vulnerabilidad).

**Datos clave que no hay que perder de vista:**

- Plazo de solicitud: hasta el **30/06/2026**
- Fecha de corte: **01/01/2026**
- Permanencia ininterrumpida exigida: **5 meses**
- Tasa: **38,28 €**

El hub, las 14 FAQs y las fichas de normativa están alineados con la norma en
vigor (commit `fd2a43c`). La ficha del RD 1155/2024 quedó como `modificada`
con `modifiedBy` apuntando al RD 316/2026, y el Q&A ministerial pasó a
`historica` como antecedente superado.

Para cualquier modificación futura del hub (instrucciones operativas del
Ministerio, correcciones del BOE): actualizar `lastReviewed`, reenviar el
sitemap y notificar las URLs tocadas al Indexing API.

---

## 5. Entorno de desarrollo

Astro 6 exige **Node >= 22.12**. El repo tiene `.nvmrc`, así que basta:

```bash
nvm use
npm ci
npm run dev
```

Si el shell arranca con una versión anterior de Node, `astro check` y
`astro build` fallarán con un error de versión poco descriptivo.

---

## 6. Checklist de traspaso a otro equipo

Lo que **no** viaja con un `git clone` y hay que transferir aparte:

- [ ] **Repositorio**: transferir o dar acceso. Verificar que Actions queda
      habilitado tras la transferencia — los workflows con `schedule` a veces
      se desactivan al cambiar de propietario.
- [ ] **Secrets de GitHub Actions**: `GOOGLE_SERVICE_ACCOUNT_JSON` y
      `SEARCH_CONSOLE_SITE`. **No se transfieren con el repo**; hay que
      recrearlos a mano o los pasos de indexación fallarán en silencio.
- [ ] **Proyecto GCP** `nextranjeria-dashboard`: transferir, o crear un SA
      nuevo en el proyecto del equipo y habilitar las cuatro APIs.
- [ ] **Clave del service account**: que el equipo genere la suya y se
      **revoque la antigua**. No enviar la clave por Slack ni email.
- [ ] **Search Console**: añadir a los nuevos propietarios de
      `sc-domain:nextranjeria.com` y re-verificar el SA si cambia (ver el bug
      de la UI en la sección 1).
- [ ] **GA4**: confirmar si la propiedad existe; `GA4_PROPERTY_ID` está vacío
      en `.env`. Si existe, dar rol Lector al SA.
- [ ] **Vercel**: transferir el proyecto, el dominio y su configuración.
- [ ] **Dominio** `nextranjeria.com`: registrador y DNS, incluido el registro
      TXT de verificación de Search Console.
