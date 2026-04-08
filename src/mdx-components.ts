/**
 * Mapping global de componentes MDX.
 *
 * Los layouts hacen `<Content components={mdxComponents} />` para que
 * los MDX de contenido no tengan que importar nada: `<Ojo>...</Ojo>`,
 * `<BaseLegal ref="..." />`, etc. funcionan automáticamente.
 */
import BaseLegal from '@components/normative/BaseLegal.astro';
import Anunciado from '@components/normative/Anunciado.astro';
import Borrador from '@components/normative/Borrador.astro';
import BOE from '@components/normative/BOE.astro';
import EnVigor from '@components/normative/EnVigor.astro';
import EnLaPractica from '@components/normative/EnLaPractica.astro';
import Rumor from '@components/normative/Rumor.astro';

import FichaRapida from '@components/content/FichaRapida.astro';
import PasoAPaso from '@components/content/PasoAPaso.astro';
import Paso from '@components/content/Paso.astro';
import Checklist from '@components/content/Checklist.astro';
import Ojo from '@components/content/Ojo.astro';
import Ejemplo from '@components/content/Ejemplo.astro';
import Glosario from '@components/content/Glosario.astro';
import Faq from '@components/content/Faq.astro';
import AlertaNormativa from '@components/content/AlertaNormativa.astro';

export const mdxComponents = {
  // Estado normativo
  BaseLegal,
  Anunciado,
  Borrador,
  BOE,
  EnVigor,
  EnLaPractica,
  Rumor,
  // Editoriales
  FichaRapida,
  PasoAPaso,
  Paso,
  Checklist,
  Ojo,
  Ejemplo,
  Glosario,
  Faq,
  AlertaNormativa,
};
