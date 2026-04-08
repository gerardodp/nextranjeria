/**
 * Helpers específicos de la collection `normativa`.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

const TYPE_LABELS: Record<
  CollectionEntry<'normativa'>['data']['type'],
  string
> = {
  'ley-organica': 'Ley Orgánica',
  ley: 'Ley',
  'real-decreto': 'Real Decreto',
  'real-decreto-ley': 'Real Decreto-ley',
  'orden-ministerial': 'Orden ministerial',
  instruccion: 'Instrucción',
  circular: 'Circular',
  'directiva-ue': 'Directiva UE',
  'reglamento-ue': 'Reglamento UE',
  'codigo-civil-articulos': 'Código Civil (artículos)',
};

const STATUS_LABELS: Record<
  CollectionEntry<'normativa'>['data']['status'],
  string
> = {
  'en-vigor': 'En vigor',
  'pendiente-publicacion': 'Pendiente de publicación',
  'pendiente-entrada-vigor': 'Pendiente de entrada en vigor',
  derogada: 'Derogada',
  modificada: 'Modificada',
  historica: 'Histórica',
};

export function normativaTypeLabel(
  type: CollectionEntry<'normativa'>['data']['type'],
): string {
  return TYPE_LABELS[type];
}

export function normativaStatusLabel(
  status: CollectionEntry<'normativa'>['data']['status'],
): string {
  return STATUS_LABELS[status];
}

type NormativaEntry = CollectionEntry<'normativa'>;

export async function getNormativaByStatus(): Promise<{
  vigentes: NormativaEntry[];
  pendientes: NormativaEntry[];
  historicas: NormativaEntry[];
  contextoInstitucional: NormativaEntry[];
}> {
  const all = await getCollection('normativa');
  return {
    vigentes: all.filter(
      (e: NormativaEntry) =>
        e.data.status === 'en-vigor' && !e.data.officialQnA,
    ),
    pendientes: all.filter(
      (e: NormativaEntry) =>
        (e.data.status === 'pendiente-publicacion' ||
          e.data.status === 'pendiente-entrada-vigor') &&
        !e.data.officialQnA,
    ),
    historicas: all.filter(
      (e: NormativaEntry) =>
        (e.data.status === 'derogada' ||
          e.data.status === 'historica' ||
          e.data.status === 'modificada') &&
        !e.data.officialQnA,
    ),
    contextoInstitucional: all.filter(
      (e: NormativaEntry) => e.data.officialQnA,
    ),
  };
}
