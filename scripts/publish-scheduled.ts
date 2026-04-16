/**
 * Cron diario de publicación programada.
 *
 * Escanea las content collections buscando entradas con `status: scheduled`
 * (o `contentStatus: scheduled` en normativa) cuya `scheduledDate` sea hoy o
 * anterior, y las pasa a `published`:
 *   - Primera publicación: sobreescribe `pubDate` con `scheduledDate`.
 *   - Republicación (existe `updatedDate` previo): solo actualiza
 *     `updatedDate`, conserva `pubDate` original.
 *
 * Escribe en `GITHUB_OUTPUT`:
 *   - updated=true|false
 *   - count=N
 *   - files=path1,path2,...   (rutas relativas al repo, consumidas por
 *     scripts/notify-indexing-api.ts)
 *
 * El workflow que lo invoca vive en `.github/workflows/scheduled-publish.yml`.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, appendFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { parseFrontmatter } from './lib/frontmatter.mjs';

const CONTENT_DIR = join(process.cwd(), 'src', 'content');

/**
 * Colecciones escaneadas y campo de estado que cada una usa. `normativa`
 * es el único caso con `contentStatus` en vez de `status`.
 */
const COLLECTIONS: Array<{ name: string; statusField: 'status' | 'contentStatus' }> = [
  { name: 'pages', statusField: 'status' },
  { name: 'guides', statusField: 'status' },
  { name: 'faqs', statusField: 'status' },
  { name: 'glossary', statusField: 'status' },
  { name: 'normativa', statusField: 'contentStatus' },
];

const today = new Date();
today.setHours(0, 0, 0, 0);

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

let updatedCount = 0;
const updatedFiles: string[] = [];

for (const { name, statusField } of COLLECTIONS) {
  const dir = join(CONTENT_DIR, name);
  const files = getFiles(dir, ['.md', '.mdx']);

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    const fm = parseFrontmatter(content);
    if (!fm) continue;

    if (fm[statusField] !== 'scheduled') continue;
    if (!fm.scheduledDate) continue;

    const scheduledDate = new Date(fm.scheduledDate);
    scheduledDate.setHours(0, 0, 0, 0);
    if (scheduledDate > today) continue;

    const isRepublication = Boolean(fm.updatedDate);

    // Estado → published. Usamos un regex dinámico sobre el nombre del campo
    // porque normativa utiliza `contentStatus`.
    const statusRegex = new RegExp(`^${statusField}:\\s*["']?scheduled["']?`, 'm');
    let updated = content.replace(statusRegex, `${statusField}: "published"`);

    // pubDate solo se actualiza en primeras publicaciones.
    if (!isRepublication) {
      updated = updated.replace(
        /^pubDate:\s*.+$/m,
        `pubDate: ${fm.scheduledDate}`,
      );
    }

    // updatedDate siempre se escribe (insertar si no existe, actualizar si sí).
    if (/^updatedDate:\s*.+$/m.test(updated)) {
      updated = updated.replace(
        /^updatedDate:\s*.+$/m,
        `updatedDate: ${fm.scheduledDate}`,
      );
    } else {
      updated = updated.replace(
        /^pubDate:\s*(.+)$/m,
        `pubDate: $1\nupdatedDate: ${fm.scheduledDate}`,
      );
    }

    writeFileSync(file, updated, 'utf-8');
    updatedCount++;
    updatedFiles.push(file.replace(process.cwd() + '/', ''));
  }
}

console.log(`\n📅 Publicación programada: ${updatedCount} archivo(s) actualizado(s)`);
for (const f of updatedFiles) {
  console.log(`  ✅ ${f}`);
}

if (updatedCount === 0) {
  console.log('  No hay contenido programado para publicar hoy.');
}

// Outputs para GitHub Actions.
const outputFile = process.env.GITHUB_OUTPUT;
if (outputFile) {
  appendFileSync(outputFile, `updated=${updatedCount > 0}\n`);
  appendFileSync(outputFile, `count=${updatedCount}\n`);
  appendFileSync(outputFile, `files=${updatedFiles.join(',')}\n`);
}
