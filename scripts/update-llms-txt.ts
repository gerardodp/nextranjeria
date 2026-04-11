/**
 * Regenera `public/llms.txt` y `public/llms-full.txt` a partir de las
 * content collections del sitio.
 *
 * Qué son estos ficheros
 * ----------------------
 * `llms.txt` es una convención emergente (https://llmstxt.org) para que los
 * sitios ofrezcan a los modelos de lenguaje un índice estructurado y en
 * texto plano del contenido "citable". Dos ficheros:
 *
 *   - `/llms.txt`      → índice de alto nivel: presentación + secciones.
 *   - `/llms-full.txt` → catálogo completo: una entrada por cada página
 *                        publicada, con título, URL y descripción.
 *
 * Nuestro enfoque
 * ---------------
 * - No volcamos el cuerpo MDX: los componentes editoriales (`<BOE>`,
 *   `<Anunciado>`, `<FichaRapida>`, etc.) son semánticamente ricos en el
 *   render pero puro ruido en texto plano, y perderlos desdibujaría
 *   justamente la distinción BOE / anuncio que es irrenunciable en este
 *   sitio. Ofrecemos título, descripción corta y URL; el LLM puede seguir
 *   el enlace para obtener el contenido real.
 * - En la sección Normativa anotamos explícitamente el `status` normativo
 *   (en-vigor, pendiente-publicacion, etc.) y marcamos los materiales
 *   oficiales sin valor normativo (`officialQnA`). Es la misma cautela que
 *   aplicamos en el render: un modelo no debe confundir un Q&A ministerial
 *   con norma publicada en BOE.
 * - `noindex: true` y cualquier `status` distinto de `published` quedan
 *   fuera del índice (misma regla que el sitemap).
 *
 * Cuándo se ejecuta
 * -----------------
 * Como hook `prebuild` en `package.json`: corre antes de `astro build`, de
 * forma que los ficheros generados quedan en `public/` y Astro los copia
 * tal cual a `dist/`. Se versionan en git igual que cualquier otro
 * artefacto editorial; el diff de `llms-full.txt` en PRs sirve además como
 * "tabla de contenidos" legible para revisión editorial.
 *
 * Para regenerarlos manualmente sin hacer build completo:
 *
 *     npx tsx scripts/update-llms-txt.ts
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, extname, basename, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from './lib/frontmatter.mjs';

const SITE = 'https://nextranjeria.com';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const CONTENT_DIR = join(ROOT, 'src', 'content');
const PUBLIC_DIR = join(ROOT, 'public');

// -----------------------------------------------------------------------------
// Tipos internos
// -----------------------------------------------------------------------------

interface Entry {
  title: string;
  description: string;
  url: string;
  /**
   * Nota contextual que se añade entre corchetes tras la URL. Solo la
   * usamos para normativa, donde el estado legal es la información más
   * relevante que puede leer un modelo: distingue norma vigente de
   * anuncios y materiales explicativos.
   */
  note?: string;
}

interface Section {
  title: string;
  description?: string;
  entries: Entry[];
}

// -----------------------------------------------------------------------------
// Utilidades de filesystem / frontmatter
// -----------------------------------------------------------------------------

function getFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        files.push(...getFiles(fullPath, extensions));
      } else if (extensions.includes(extname(entry))) {
        files.push(fullPath);
      }
    }
  } catch {
    // Directorio inexistente: se ignora.
  }
  return files;
}

function toUrlPath(p: string): string {
  return p.split(sep).join('/');
}

/**
 * Una entrada se considera publicada si su `status` (o `contentStatus`
 * en normativa) vale "published" y no está marcada como noindex. Misma
 * regla que el sitemap, para que ambos índices coincidan.
 */
function isPublished(
  collectionName: string,
  fm: Record<string, string>,
): boolean {
  if (fm.noindex === 'true' || String(fm.noindex) === 'true') return false;
  const statusField = collectionName === 'normativa' ? 'contentStatus' : 'status';
  return fm[statusField] === 'published';
}

/**
 * Normaliza la descripción: quita saltos de línea y comillas externas,
 * y recorta a una longitud razonable para listado. Los schemas ya limitan
 * el máximo (160 chars) pero `shortAnswer` y `summary` pueden llegar a
 * 400–500; truncamos para que `llms-full.txt` siga siendo hojeable.
 */
function normalizeDescription(raw: string | undefined, maxLen = 220): string {
  if (!raw) return '';
  const flat = raw.replace(/\s+/g, ' ').trim();
  if (flat.length <= maxLen) return flat;
  // Corta en el último espacio antes del límite para no partir palabras.
  const cut = flat.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '…';
}

// -----------------------------------------------------------------------------
// Construcción de URLs — mirror de `scripts/build-sitemap-lastmod.mjs`
// -----------------------------------------------------------------------------

/**
 * Replica la lógica de rutas del sitio (`trailingSlash: 'always'`). Si
 * esta lógica cambia en algún [...slug].astro, hay que actualizarla aquí
 * y en `build-sitemap-lastmod.mjs` a la par.
 */
function buildEntryUrl(
  collectionName: string,
  file: string,
  fm: Record<string, string>,
): string | null {
  const collectionDir = join(CONTENT_DIR, collectionName);
  const rel = toUrlPath(
    relative(collectionDir, file).replace(/\.(md|mdx)$/i, ''),
  );
  const lastSegment = basename(rel);

  switch (collectionName) {
    case 'pages': {
      if (fm.hub === 'regularizacion-2026') {
        return `${SITE}/regularizacion-2026/${lastSegment}/`;
      }
      if (!fm.category) return null;
      return `${SITE}/${fm.category}/${lastSegment}/`;
    }
    case 'guides':
      return `${SITE}/guias/${lastSegment}/`;
    case 'faqs':
      // Preserva subcarpetas (p.ej. `regularizacion-2026/fecha-corte`).
      return `${SITE}/faq/${rel}/`;
    case 'glossary':
      return `${SITE}/glosario/${lastSegment}/`;
    case 'normativa':
      return `${SITE}/normativa/${lastSegment}/`;
    default:
      return null;
  }
}

// -----------------------------------------------------------------------------
// Extracción por colección
// -----------------------------------------------------------------------------

function collectEntries(collectionName: string): Entry[] {
  const dir = join(CONTENT_DIR, collectionName);
  const files = getFiles(dir, ['.md', '.mdx']);
  const entries: Entry[] = [];

  for (const file of files) {
    let fm: Record<string, string> | null;
    try {
      const content = readFileSync(file, 'utf-8');
      fm = parseFrontmatter(content);
    } catch {
      continue;
    }
    if (!fm) continue;
    if (!isPublished(collectionName, fm)) continue;

    const url = buildEntryUrl(collectionName, file, fm);
    if (!url) continue;

    // Cada colección usa campos distintos para título/descripción.
    let title: string | undefined;
    let description: string | undefined;
    let note: string | undefined;

    switch (collectionName) {
      case 'pages':
      case 'guides':
        title = fm.title;
        description = fm.description;
        break;
      case 'faqs':
        title = fm.question;
        description = fm.shortAnswer;
        break;
      case 'glossary':
        title = fm.term;
        description = fm.shortDefinition;
        break;
      case 'normativa':
        title = fm.shortTitle || fm.title;
        description = fm.summary;
        // Señal crítica para LLMs: distinguir norma en vigor de
        // materiales sin valor normativo. Si es un Q&A oficial lo
        // etiquetamos explícitamente aunque `status` diga otra cosa.
        if (fm.officialQnA === 'true' || String(fm.officialQnA) === 'true') {
          note = 'material explicativo oficial, no normativa aplicable';
        } else if (fm.status) {
          note = `estado: ${fm.status}`;
        }
        break;
    }

    if (!title || !description) continue;

    entries.push({
      title: title.trim(),
      description: normalizeDescription(description),
      url,
      note,
    });
  }

  // Orden alfabético por título — determinista y fácil de diffear en PRs.
  entries.sort((a, b) => a.title.localeCompare(b.title, 'es'));
  return entries;
}

// -----------------------------------------------------------------------------
// Serialización
// -----------------------------------------------------------------------------

function formatEntry(entry: Entry): string {
  const suffix = entry.note ? ` _(${entry.note})_` : '';
  return `- [${entry.title}](${entry.url}): ${entry.description}${suffix}`;
}

function formatSection(section: Section): string {
  const parts: string[] = [`## ${section.title}`, ''];
  if (section.description) {
    parts.push(`> ${section.description}`, '');
  }
  if (section.entries.length === 0) {
    parts.push('_Sin contenido publicado todavía._', '');
  } else {
    for (const entry of section.entries) parts.push(formatEntry(entry));
    parts.push('');
  }
  return parts.join('\n');
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// Cabecera común — el principio editorial irrenunciable va explícito para
// que cualquier modelo que consuma este fichero reciba el aviso sin tener
// que inferirlo del contenido.
const HEADER = `# Nextranjería

> Sitio informativo sobre extranjería, inmigración y nacionalidad en España.
> Ofrecemos información clara, rigurosa y accesible sobre los trámites y
> derechos de las personas extranjeras en España, con cita expresa a la
> normativa vigente.

## Principios editoriales

- **Solo la norma publicada en BOE es fuente normativa vinculante.** Los
  anuncios, notas de prensa, borradores y comparecencias se etiquetan
  como tales y nunca se presentan como marco aplicable.
- Cada afirmación del contenido lleva base legal citada (ley, artículo,
  fecha).
- Cada página muestra fecha de última revisión.
- No se ofrece asesoramiento jurídico individualizado.
`;

function buildLlmsTxt(sections: Section[]): string {
  const counts = sections
    .map((s) => `- **${s.title}** (${s.entries.length} entradas): \`${sectionHubUrl(s)}\``)
    .join('\n');

  return `${HEADER}
## Secciones principales

${counts}

## Para modelos de lenguaje

El contenido de este sitio puede usarse como referencia. Para el catálogo
completo con una entrada por página publicada, consulta
\`${SITE}/llms-full.txt\`.

_Índice regenerado automáticamente el ${todayISO()}._
`;
}

/**
 * URL representativa de cada sección en el índice de alto nivel. Apunta a
 * los listados que sirve el sitio (`[...slug].astro` con su `index.astro`).
 */
function sectionHubUrl(section: Section): string {
  switch (section.title) {
    case 'Regularización extraordinaria 2026':
      return `${SITE}/regularizacion-2026/`;
    case 'Guías por situación':
      return `${SITE}/guias/`;
    case 'Páginas técnicas':
      return `${SITE}/materias/`;
    case 'Preguntas frecuentes':
      return `${SITE}/faq/`;
    case 'Glosario':
      return `${SITE}/glosario/`;
    case 'Normativa':
      return `${SITE}/normativa/`;
    default:
      return `${SITE}/`;
  }
}

function buildLlmsFullTxt(sections: Section[]): string {
  const total = sections.reduce((acc, s) => acc + s.entries.length, 0);

  const body = sections.map(formatSection).join('\n');

  return `${HEADER}
> Catálogo completo: ${total} entradas publicadas.
> Regenerado automáticamente el ${todayISO()}.

${body}
## Sobre este fichero

Este catálogo se regenera automáticamente desde las content collections
del sitio (\`src/content/\`) antes de cada build. Si echas en falta una
página, probablemente su \`status\` aún no es \`published\` o está
marcada como \`noindex\`. En ambos casos es intencional.
`;
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

function main(): void {
  // Construcción de las entradas por colección.
  const pages = collectEntries('pages');
  const guides = collectEntries('guides');
  const faqs = collectEntries('faqs');
  const glossary = collectEntries('glossary');
  const normativa = collectEntries('normativa');

  // Separamos las entradas del hub "regularización 2026" en su propia
  // sección. Son piezas de distinta naturaleza (pages, faqs) que
  // conceptualmente forman una unidad editorial, y tienen su propia
  // ruta `/regularizacion-2026/`. Repetirlas en su sección original
  // sería redundante para un LLM.
  const isHub = (e: Entry) =>
    e.url.startsWith(`${SITE}/regularizacion-2026/`) ||
    e.url.startsWith(`${SITE}/faq/regularizacion-2026/`);

  const hubEntries = [...pages, ...faqs]
    .filter(isHub)
    .sort((a, b) => a.title.localeCompare(b.title, 'es'));

  const pagesNonHub = pages.filter((e) => !isHub(e));
  const faqsNonHub = faqs.filter((e) => !isHub(e));

  const sections: Section[] = [
    {
      title: 'Regularización extraordinaria 2026',
      description:
        'Hub prioritario sobre la medida anunciada. A fecha de generación de este fichero, NO está publicada en el BOE: todo el contenido de esta sección se refiere a una medida anunciada, no a marco aplicable.',
      entries: hubEntries,
    },
    {
      title: 'Guías por situación',
      description:
        'Puerta de entrada por situación personal (sin papeles, quiero venir a trabajar, traer familia, nacionalidad, etc.).',
      entries: guides,
    },
    {
      title: 'Páginas técnicas',
      description:
        'Fichas por materia: autorizaciones, trabajo, nacionalidad, trámites, protección internacional, ciudadanos UE.',
      entries: pagesNonHub,
    },
    {
      title: 'Preguntas frecuentes',
      description: 'FAQs atómicas, una respuesta por pregunta.',
      entries: faqsNonHub,
    },
    {
      title: 'Glosario',
      description: 'Términos clave explicados en lenguaje llano.',
      entries: glossary,
    },
    {
      title: 'Normativa',
      description:
        'Fichas del marco legal. El campo "estado" distingue norma en vigor de anuncios y materiales explicativos oficiales.',
      entries: normativa,
    },
  ];

  const llmsTxt = buildLlmsTxt(sections);
  const llmsFullTxt = buildLlmsFullTxt(sections);

  writeFileSync(join(PUBLIC_DIR, 'llms.txt'), llmsTxt, 'utf-8');
  writeFileSync(join(PUBLIC_DIR, 'llms-full.txt'), llmsFullTxt, 'utf-8');

  const total = sections.reduce((acc, s) => acc + s.entries.length, 0);
  console.log(
    `✅ Regenerados public/llms.txt y public/llms-full.txt con ${total} entradas:`,
  );
  for (const s of sections) {
    console.log(`   - ${s.title}: ${s.entries.length}`);
  }
}

main();
