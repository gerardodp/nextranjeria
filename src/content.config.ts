import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

// -----------------------------------------------------------------------------
// Enums compartidos
// -----------------------------------------------------------------------------

export const contentCategories = [
  'autorizaciones',
  'trabajo',
  'estudios',
  'ciudadanos-ue',
  'proteccion-internacional',
  'nacionalidad',
  'tramites',
  'normativa',
  'actualidad',
] as const;

/**
 * Categorías donde `fichaRapida` es obligatoria (validado en CI).
 * Son categorías "estructurales" donde cada página describe un procedimiento
 * o autorización concreta con datos verificables (normativa, quién, plazo, coste).
 */
export const fichaRapidaRequiredCategories = [
  'autorizaciones',
  'trabajo',
  'estudios',
  'ciudadanos-ue',
  'proteccion-internacional',
  'nacionalidad',
  'tramites',
] as const;

export const normativeStatuses = [
  'vigente',
  'pendiente',
  'transitorio',
  'historico',
] as const;

export const contentStatuses = [
  'draft',
  'review',
  'scheduled',
  'published',
] as const;

export const profileTags = [
  'sin-papeles',
  'recien-llegado',
  'estudiante',
  'trabajador',
  'emprendedor',
  'familia',
  'ciudadano-ue',
  'solicitante-asilo',
  'profesional-cualificado',
] as const;

export const authorizationTags = [
  'arraigo',
  'reagrupacion-familiar',
  'no-lucrativa',
  'cuenta-ajena',
  'cuenta-propia',
  'larga-duracion',
  'tarjeta-azul',
  'nomada-digital',
  'startup',
  'temporada',
  'investigador',
  'ICT',
] as const;

export const procedureTags = [
  'solicitud-inicial',
  'renovacion',
  'modificacion',
  'recurso',
  'cita-previa',
  'documentacion',
] as const;

export const normativeTags = [
  'LOEX',
  'reglamento-extranjeria',
  'ley-emprendedores',
  'ley-startups',
  'RD-240-2007',
  'ley-asilo',
  'codigo-civil',
] as const;

export const hubs = ['regularizacion-2026'] as const;

export const normativaTypes = [
  'ley-organica',
  'ley',
  'real-decreto',
  'real-decreto-ley',
  'orden-ministerial',
  'instruccion',
  'circular',
  'directiva-ue',
  'reglamento-ue',
  'codigo-civil-articulos',
] as const;

export const normativaStatus = [
  'en-vigor',
  'pendiente-publicacion',
  'pendiente-entrada-vigor',
  'derogada',
  'modificada',
  'historica',
] as const;

// -----------------------------------------------------------------------------
// Base mixin — campos comunes a casi todas las collections
// -----------------------------------------------------------------------------

const baseSchema = z.object({
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(160),
  author: z.string().default('Nextranjería'),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  /**
   * Obligatorio: fecha en la que un humano revisó el contenido y confirmó
   * que sigue siendo correcto según la normativa vigente.
   * Puede ser igual a `updatedDate` pero se mantiene como campo aparte
   * porque conceptualmente responde a una pregunta distinta:
   * "¿sigue siendo cierto?" vs "¿cuándo se editó por última vez?".
   */
  lastReviewed: z.coerce.date(),
  status: z.enum(contentStatuses).default('draft'),
  scheduledDate: z.coerce.date().optional(),
  canonicalUrl: z.url().optional(),
  noindex: z.boolean().default(false),
  featuredImage: z.string().optional(),
  featuredImageAlt: z.string().optional(),
});

// -----------------------------------------------------------------------------
// Ficha rápida — estructura en frontmatter (no componente MDX)
// -----------------------------------------------------------------------------

const fichaRapidaSchema = z.object({
  normativa: z.string().min(1),
  quien: z.string().min(1),
  plazo: z.string().min(1),
  coste: z.string().min(1),
});

// -----------------------------------------------------------------------------
// pages — páginas técnicas por materia
// -----------------------------------------------------------------------------

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: baseSchema.extend({
    category: z.enum(contentCategories),
    hub: z.enum(hubs).optional(),
    normativeStatus: z.enum(normativeStatuses),
    normativeReferences: z.array(reference('normativa')).default([]),
    appliesToProfiles: z.array(z.enum(profileTags)).default([]),
    appliesToSituations: z.array(reference('guides')).default([]),
    authorizationTags: z.array(z.enum(authorizationTags)).default([]),
    procedureTags: z.array(z.enum(procedureTags)).default([]),
    normativeTags: z.array(z.enum(normativeTags)).default([]),
    fichaRapida: fichaRapidaSchema.optional(),
    relatedPages: z.array(reference('pages')).default([]),
    relatedGuides: z.array(reference('guides')).default([]),
    relatedFaqs: z.array(reference('faqs')).default([]),
    glossaryTerms: z.array(reference('glossary')).default([]),
    tableOfContents: z.boolean().default(true),
  }),
});

// -----------------------------------------------------------------------------
// guides — guías por situación
// -----------------------------------------------------------------------------

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: baseSchema.extend({
    category: z.enum(contentCategories),
    hub: z.enum(hubs).optional(),
    normativeStatus: z.enum(normativeStatuses),
    normativeReferences: z.array(reference('normativa')).default([]),
    situationProfile: z.enum(profileTags),
    appliesToSituations: z.array(reference('guides')).default([]),
    authorizationTags: z.array(z.enum(authorizationTags)).default([]),
    procedureTags: z.array(z.enum(procedureTags)).default([]),
    normativeTags: z.array(z.enum(normativeTags)).default([]),
    estimatedReadTime: z.number().int().positive(),
    relatedPages: z.array(reference('pages')).default([]),
    relatedGuides: z.array(reference('guides')).default([]),
    relatedFaqs: z.array(reference('faqs')).default([]),
    glossaryTerms: z.array(reference('glossary')).default([]),
    tableOfContents: z.boolean().default(true),
  }),
});

// -----------------------------------------------------------------------------
// faqs — preguntas frecuentes atómicas
// -----------------------------------------------------------------------------

const faqs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/faqs' }),
  schema: baseSchema
    .omit({ title: true, description: true })
    .extend({
      question: z.string().min(1).max(140),
      shortAnswer: z.string().min(1).max(400),
      category: z.enum(contentCategories),
      hub: z.enum(hubs).optional(),
      normativeStatus: z.enum(normativeStatuses),
      normativeReferences: z.array(reference('normativa')).default([]),
      appliesToProfiles: z.array(z.enum(profileTags)).default([]),
      appliesToSituations: z.array(reference('guides')).default([]),
      authorizationTags: z.array(z.enum(authorizationTags)).default([]),
      procedureTags: z.array(z.enum(procedureTags)).default([]),
      relatedFaqs: z.array(reference('faqs')).default([]),
      relatedPages: z.array(reference('pages')).default([]),
      relatedGuides: z.array(reference('guides')).default([]),
      glossaryTerms: z.array(reference('glossary')).default([]),
    }),
});

// -----------------------------------------------------------------------------
// glossary — términos del glosario
// -----------------------------------------------------------------------------

const glossary = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/glossary' }),
  schema: z.object({
    term: z.string().min(1),
    aliases: z.array(z.string()).default([]),
    shortDefinition: z.string().min(1).max(300),
    longDefinition: z.string().optional(),
    category: z.enum(contentCategories),
    author: z.string().default('Nextranjería'),
    normativeReferences: z.array(reference('normativa')).default([]),
    relatedTerms: z.array(reference('glossary')).default([]),
    relatedPages: z.array(reference('pages')).default([]),
    lastReviewed: z.coerce.date(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    status: z.enum(contentStatuses).default('draft'),
    noindex: z.boolean().default(false),
  }),
});

// -----------------------------------------------------------------------------
// normativa — fichas de leyes, reglamentos e instrucciones
// -----------------------------------------------------------------------------

const normativa = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/normativa' }),
  schema: z.object({
    title: z.string().min(1).max(120),
    shortTitle: z.string().min(1).max(60),
    longTitle: z.string().min(1),
    type: z.enum(normativaTypes),
    boeId: z.string().optional(),
    boeUrl: z.url().optional(),
    publishedDate: z.coerce.date().optional(),
    effectiveDate: z.coerce.date().optional(),
    status: z.enum(normativaStatus),
    replacedBy: reference('normativa').optional(),
    replaces: z.array(reference('normativa')).default([]),
    modifiedBy: z.array(reference('normativa')).default([]),
    subject: z.string().min(1),
    summary: z.string().min(1).max(500),
    pdfPath: z.string().optional(),
    /**
     * `true` si se trata de un material explicativo institucional
     * (Q&A ministerial, nota de prensa, comparecencia) sin valor normativo.
     * Se marca para que el sitio pueda mostrar claramente que no es
     * fuente normativa aplicable.
     */
    officialQnA: z.boolean().default(false),
    relatedPages: z.array(reference('pages')).default([]),
    tags: z.array(z.enum(normativeTags)).default([]),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    lastReviewed: z.coerce.date(),
    contentStatus: z.enum(contentStatuses).default('draft'),
    noindex: z.boolean().default(false),
  }),
});

export const collections = {
  pages,
  guides,
  faqs,
  glossary,
  normativa,
};
