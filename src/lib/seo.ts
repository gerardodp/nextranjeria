/**
 * Builders de JSON-LD para SEO y GEO (Generative Engine Optimization).
 */
import type { CollectionEntry } from 'astro:content';

interface SiteContext {
  site: URL;
  pageUrl: string;
}

export function buildArticleJsonLd(
  entry: CollectionEntry<'pages'> | CollectionEntry<'guides'>,
  ctx: SiteContext,
): Record<string, unknown> {
  const url = new URL(ctx.pageUrl, ctx.site).toString();
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.data.title,
    description: entry.data.description,
    datePublished: entry.data.pubDate.toISOString(),
    dateModified: (entry.data.updatedDate ?? entry.data.lastReviewed).toISOString(),
    inLanguage: 'es-ES',
    isAccessibleForFree: true,
    mainEntityOfPage: url,
    author: {
      '@type': 'Organization',
      name: 'Nextranjería',
      url: ctx.site.toString(),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nextranjería',
      url: ctx.site.toString(),
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: { label: string; href?: string }[],
  ctx: SiteContext,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href
        ? { item: new URL(item.href, ctx.site).toString() }
        : {}),
    })),
  };
}

export function buildDefinedTermJsonLd(
  entry: CollectionEntry<'glossary'>,
  ctx: SiteContext,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: entry.data.term,
    alternateName: entry.data.aliases,
    description: entry.data.shortDefinition,
    inLanguage: 'es-ES',
    url: new URL(ctx.pageUrl, ctx.site).toString(),
    inDefinedTermSet: new URL('/glosario/', ctx.site).toString(),
  };
}

export function buildLegislationJsonLd(
  entry: CollectionEntry<'normativa'>,
  ctx: SiteContext,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Legislation',
    name: entry.data.title,
    alternateName: entry.data.shortTitle,
    legislationIdentifier: entry.data.boeId,
    legislationType: entry.data.type,
    datePublished: entry.data.publishedDate?.toISOString(),
    description: entry.data.summary,
    url: entry.data.boeUrl ?? new URL(ctx.pageUrl, ctx.site).toString(),
    inLanguage: 'es-ES',
  };
}
