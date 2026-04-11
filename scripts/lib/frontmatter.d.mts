/**
 * Declaraciones de tipos para `frontmatter.mjs`. Permiten que los scripts
 * TypeScript del proyecto importen el parser con tipado en lugar de `any`.
 */
export function parseFrontmatter(content: string): Record<string, string> | null;
