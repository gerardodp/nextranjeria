/**
 * Resolución de relaciones cruzadas entre collections.
 * A partir del frontmatter (`relatedPages`, `relatedGuides`, `relatedFaqs`),
 * carga los entries y los convierte a una forma renderizable.
 */
import { getEntry, type CollectionEntry } from 'astro:content';
import { entryIdToSlug, pageUrl } from './utils';

export interface RelatedItem {
  title: string;
  href: string;
  description?: string;
  eyebrow?: string;
}

async function resolvePage(ref: {
  collection: 'pages';
  id: string;
}): Promise<RelatedItem | null> {
  const entry = await getEntry(ref);
  if (!entry || entry.data.status === 'draft') return null;
  return {
    title: entry.data.title,
    description: entry.data.description,
    href: pageUrl(entry.data.category, entry.id, entry.data.hub),
    eyebrow: 'Página',
  };
}

async function resolveGuide(ref: {
  collection: 'guides';
  id: string;
}): Promise<RelatedItem | null> {
  const entry = await getEntry(ref);
  if (!entry || entry.data.status === 'draft') return null;
  return {
    title: entry.data.title,
    description: entry.data.description,
    href: `/guias/${entryIdToSlug(entry.id)}/`,
    eyebrow: 'Guía',
  };
}

async function resolveFaq(ref: {
  collection: 'faqs';
  id: string;
}): Promise<RelatedItem | null> {
  const entry = await getEntry(ref);
  if (!entry || entry.data.status === 'draft') return null;
  return {
    title: entry.data.question,
    description: entry.data.shortAnswer,
    href: `/faq/${entryIdToSlug(entry.id)}/`,
    eyebrow: 'Pregunta frecuente',
  };
}

export async function getRelatedItems(
  entry: CollectionEntry<'pages'> | CollectionEntry<'guides'>,
): Promise<RelatedItem[]> {
  const relatedPages = entry.data.relatedPages ?? [];
  const relatedGuides = entry.data.relatedGuides ?? [];
  const relatedFaqs = entry.data.relatedFaqs ?? [];

  const [pages, guides, faqs] = await Promise.all([
    Promise.all(relatedPages.map(resolvePage)),
    Promise.all(relatedGuides.map(resolveGuide)),
    Promise.all(relatedFaqs.map(resolveFaq)),
  ]);

  return [...pages, ...guides, ...faqs].filter(
    (x): x is RelatedItem => x !== null,
  );
}
