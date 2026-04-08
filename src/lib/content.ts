/**
 * Helpers para cargar y filtrar entradas de las content collections.
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { contentCategories } from '@/content.config';

export type PageCategory = (typeof contentCategories)[number];

export async function getPublishedPages(): Promise<CollectionEntry<'pages'>[]> {
  const all = await getCollection('pages');
  return all.filter(
    (e: CollectionEntry<'pages'>) =>
      e.data.status !== 'draft' && !e.data.noindex,
  );
}

export async function getPublishedGuides(): Promise<CollectionEntry<'guides'>[]> {
  const all = await getCollection('guides').catch(() => []);
  return all.filter(
    (e: CollectionEntry<'guides'>) =>
      e.data.status !== 'draft' && !e.data.noindex,
  );
}

export async function getPublishedFaqs(): Promise<CollectionEntry<'faqs'>[]> {
  const all = await getCollection('faqs').catch(() => []);
  return all.filter(
    (e: CollectionEntry<'faqs'>) =>
      e.data.status !== 'draft' && !e.data.noindex,
  );
}

export async function getGlossaryTerms(): Promise<CollectionEntry<'glossary'>[]> {
  const all = await getCollection('glossary');
  return all.filter(
    (e: CollectionEntry<'glossary'>) =>
      e.data.status !== 'draft' && !e.data.noindex,
  );
}

export async function getNormativaEntries(): Promise<CollectionEntry<'normativa'>[]> {
  return await getCollection('normativa');
}

/**
 * Construye el array de paths para una ruta dinámica por categoría.
 * Excluye páginas del hub `regularizacion-2026` (que tienen su propia ruta).
 */
export async function getCategoryPaths(
  category: PageCategory,
): Promise<
  { params: { slug: string }; props: { entry: CollectionEntry<'pages'> } }[]
> {
  const pages = await getCollection('pages');
  return pages
    .filter(
      (p: CollectionEntry<'pages'>) =>
        p.data.category === category && p.data.hub !== 'regularizacion-2026',
    )
    .map((page: CollectionEntry<'pages'>) => ({
      params: { slug: page.id.replace(new RegExp(`^${category}/`), '') },
      props: { entry: page },
    }));
}

export async function getHubPages(
  hub: 'regularizacion-2026',
): Promise<CollectionEntry<'pages'>[]> {
  const pages = await getPublishedPages();
  return pages
    .filter((p: CollectionEntry<'pages'>) => p.data.hub === hub)
    .sort(
      (a: CollectionEntry<'pages'>, b: CollectionEntry<'pages'>) =>
        a.data.pubDate.getTime() - b.data.pubDate.getTime(),
    );
}

export async function resolveGlossaryTerms(
  refs: { collection: 'glossary'; id: string }[],
): Promise<
  {
    slug: string;
    term: string;
    shortDefinition: string;
  }[]
> {
  if (refs.length === 0) return [];
  const results = await Promise.all(
    refs.map(async (ref) => {
      const entry = await getEntry(ref);
      if (!entry) return null;
      return {
        slug: entry.id,
        term: entry.data.term,
        shortDefinition: entry.data.shortDefinition,
      };
    }),
  );
  return results.filter((r): r is NonNullable<typeof r> => r !== null);
}
