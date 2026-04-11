/**
 * Parser ligero de frontmatter YAML para los scripts del proyecto.
 * Solo soporta campos escalares de primer nivel (sin objetos anidados
 * ni listas multilinea). Suficiente para los campos que usa
 * build-sitemap-lastmod.mjs: status/contentStatus, pubDate, updatedDate,
 * lastReviewed, category, hub, noindex.
 */
export function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    // Ignorar indentados (items de listas, propiedades anidadas).
    if (line.startsWith('  ') || line.startsWith('\t')) continue;

    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      frontmatter[key] = value;
    }
  }

  return frontmatter;
}
