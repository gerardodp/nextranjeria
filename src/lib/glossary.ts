/**
 * Helpers específicos del glosario.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export async function getGlossarySorted(): Promise<CollectionEntry<'glossary'>[]> {
  const all = await getCollection('glossary');
  return all
    .filter(
      (e: CollectionEntry<'glossary'>) =>
        e.data.status !== 'draft' && !e.data.noindex,
    )
    .sort((a: CollectionEntry<'glossary'>, b: CollectionEntry<'glossary'>) =>
      a.data.term.localeCompare(b.data.term, 'es'),
    );
}

/**
 * Agrupa términos por letra inicial (A, B, C...). Los aliases no
 * modifican la agrupación: cada término aparece una vez bajo la letra
 * de su `term` principal.
 */
export async function getGlossaryByLetter(): Promise<
  { letter: string; entries: CollectionEntry<'glossary'>[] }[]
> {
  const sorted = await getGlossarySorted();
  const groups = new Map<string, CollectionEntry<'glossary'>[]>();
  for (const entry of sorted) {
    const letter = entry.data.term.charAt(0).toUpperCase();
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter)!.push(entry);
  }
  return Array.from(groups.entries()).map(([letter, entries]) => ({
    letter,
    entries,
  }));
}
