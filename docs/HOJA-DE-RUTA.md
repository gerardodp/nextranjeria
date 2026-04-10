# Nextranjería — Hoja de ruta temporal

> Documento operativo para ordenar el trabajo en el tiempo. Vivo: se actualiza conforme avanza el proyecto.
> Última actualización: 11 de abril de 2026 (Fase 1.3 Guías por situación completada).

---

## Principio rector

**Lanzar cuanto antes con el hub de Regularización Extraordinaria 2026 como punta de lanza.** El sitio se publica con lo mínimo imprescindible para ser útil y crece desde ahí. No esperar a tenerlo todo: cada semana en blanco es una semana en la que la desinformación ocupa el espacio que debería ocupar Nextranjería.

---

## Fase 0 — Lanzamiento mínimo viable

**Objetivo**: tener el sitio en línea con el hub de Regularización 2026 y la mínima infraestructura editorial alrededor.

### 0.1 Decisiones previas (bloqueantes)
- [x] Confirmar nombre definitivo y dominio (Nextranjería, nextranjeria.es)
- [x] Elegir stack técnico (Astro 6 + MDX + Tailwind v4 + 5 content collections con Zod — ver `.plans/arranque.md`)
- [x] Decidir hosting y proceso de despliegue (Vercel, adapter `@astrojs/vercel`)
- [ ] Definir flujo de actualización (quién edita, cómo se publica) — se formaliza en Hito 3 con workflows y slash commands

### 0.2 Contenido editorial mínimo
- [x] **Hub Regularización 2026** — landing del hub (`/regularizacion-2026/`)
- [x] Página: "¿Qué es y en qué punto está?" (con sistema de estados normativos, `<Anunciado>`, `<Borrador>`)
- [x] Página: "¿Cómo prepararse mientras no sale la norma?"
- [x] Página: "Bulos y confusiones habituales" (con `<Rumor>`)
- [x] Página: "Calendario y línea temporal"
- [x] Página: "Diferencias entre regularización 2026 y arraigo"
- [x] FAQ honesta sobre la incertidumbre — 8 FAQs atómicas publicadas en `/faq/regularizacion-2026/`, enlazadas desde hub y páginas del hub vía `relatedFaqs`. Ruta `/faq/` con índice y ficha individual (`FaqLayout`)
- [x] Página de empadronamiento (pieza transversal crítica)
- [x] Página de arraigo social (modelo del Hito 1, sirve de referencia para el resto del arraigo en Fase 1)

### 0.3 Páginas institucionales mínimas
- [x] Home con acceso destacado al hub (sin buscador todavía, previsto para Fase 4)
- [x] "Sobre Nextranjería" (qué somos, qué no somos)
- [x] Aviso legal (no es asesoramiento jurídico)
- [x] Metodología y fuentes
- [x] Política de privacidad y cookies (mínimas)
- [x] Contacto

### 0.4 Sistema editorial básico
- [x] Plantilla de página de contenido con ficha rápida, base legal, fecha de revisión (`ContentLayout.astro` + `fichaRapida` en frontmatter validado por Zod)
- [x] Sistema visual de estados normativos (`<StatusPill>` en la cabecera + componentes MDX `<Anunciado>`, `<Borrador>`, `<BOE>`, `<EnVigor>`, `<EnLaPractica>`, `<Rumor>`)
- [x] Bloques especiales: `<EnLaPractica>`, `<Ojo>`, `<BaseLegal>`, `<PasoAPaso>`/`<Paso>`, `<Checklist>`, `<Ejemplo>`, `<Faq>`, `<Glosario>`, `<AlertaNormativa>`
- [x] Etiquetado de fecha de última revisión visible en cada página (`<FechaRevision>`)
- [x] **Extra de Fase 0**: 13 fichas de normativa con componente `<officialQnA>` para distinguir documentos institucionales sin valor normativo
- [x] **Extra de Fase 0**: glosario arrancado con entrada "arraigo" y rutas `/glosario/`

**Estado Fase 0: completada el 10 de abril de 2026.** Sitio en línea con hub Regularización 2026 + 8 FAQs, empadronamiento, institucionales y 13 fichas de normativa. Build limpio (44 páginas), `astro check` sin errores ni warnings.

---

## Fase 1 — Núcleo de contenidos urgentes

**Objetivo**: cubrir las situaciones más demandadas más allá de la regularización.

### 1.1 Arraigo (las 5 modalidades)
- [x] Página índice: "Qué es el arraigo y qué tipos hay"
- [x] Arraigo social (ya existía en Fase 0, ampliado con relatedPages)
- [x] Arraigo sociolaboral
- [x] Arraigo socioformativo
- [x] Arraigo familiar
- [x] Arraigo de segunda oportunidad
- [x] Página comparativa: "¿Qué arraigo me corresponde?"

### 1.2 Trámites esenciales transversales
- [x] NIE (qué es, cómo se obtiene) — ficha técnica con los tres casos (de oficio, a instancia del interesado en España y desde el exterior). Base legal: art. 205 RD 1155/2024
- [x] TIE (cuándo, cómo, dónde) — ficha técnica con el trámite completo, renovación y duplicado. Base legal: art. 209 RD 1155/2024
- [x] Cita previa en extranjería — mecanismos, alternativas legales cuando no hay citas (registro general ex art. 16.4 Ley 39/2015, presentación electrónica, escrito denunciando imposibilidad material)
- [x] Antecedentes penales (de origen y de España) — apostilla de La Haya, legalización diplomática, traducción jurada, validez de 6 meses, Registro Central de Penados español
- [x] Empadronamiento (refinamiento de la ficha de Fase 0) — ampliado con sección "Trámites para los que necesitarás el empadronamiento" y cross-links a NIE, TIE, antecedentes y certificado digital
- [x] Certificado digital y Cl@ve — FNMT software (ceres.fnmt.es) + Cl@ve PIN/permanente, requisitos para personas extranjeras (NIE en vigor), aviso de webs falsas

**Estado Fase 1.2: completada el 11 de abril de 2026.** 6 fichas nuevas en `/tramites/`, build de 55 páginas, `astro check` limpio. Las fichas se enlazan entre sí y con el hub de arraigo.

### 1.3 Guías por situación (las más demandadas)
- [x] "Estoy en España sin papeles" → orienta a regularización 2026, las 5 modalidades de arraigo, empadronamiento y antecedentes penales. `situationProfile: sin-papeles`. Tono honesto sobre la incertidumbre del BOE
- [x] "Quiero traer a mi familia" → mapa de las tres vías (reagrupación familiar RD 1155/2024, régimen comunitario RD 240/2007, arraigo familiar) con criterios para identificar cuál aplica. `situationProfile: familia`
- [x] "Quiero la nacionalidad española" → vías (residencia, opción, carta de naturaleza, posesión de estado, recuperación) y plazos reducidos. Enlaza a Código Civil arts. 17-26. `situationProfile: recien-llegado`
- [x] "Tengo permiso y necesito renovar" → plazos de presentación (60 días antes, 90 días después), silencio positivo, checklist documental y salto a larga duración. `situationProfile: trabajador`

**Estado Fase 1.3: completada el 11 de abril de 2026.** 4 guías por situación publicadas en `/guias/`, primera vez que se usa la collection `guides` (con `GuideLayout`, `situationProfile` y `estimatedReadTime`). Nueva ruta dinámica `src/pages/guias/[...slug].astro` e index `/guias/` actualizado con listado real. Build de 59 páginas, `astro check` limpio.

### 1.4 Nacionalidad por residencia
- [ ] Página índice de vías a la nacionalidad
- [ ] Nacionalidad por residencia: requisitos generales (10 años)
- [ ] Plazos reducidos (1, 2 y 5 años)
- [ ] Exámenes CCSE y DELE A2
- [ ] Procedimiento paso a paso

---

## Fase 2 — Estructurales

**Objetivo**: cubrir el resto del marco habitual de extranjería.

### 2.1 Trabajo
- [ ] Residencia y trabajo por cuenta ajena
- [ ] Residencia y trabajo por cuenta propia
- [ ] Renovaciones de permisos de trabajo
- [ ] Modificación de la situación

### 2.2 Familia
- [ ] Reagrupación familiar (página completa)
- [ ] Familiares de ciudadanos españoles
- [ ] Familiares de ciudadanos UE

### 2.3 Estudios
- [ ] Visado de estudios
- [ ] Estancia por estudios (tarjeta de estudiante)
- [ ] Trabajar mientras estudias
- [ ] Modificación de estancia a residencia
- [ ] Visado de búsqueda de empleo (hijos/nietos de españoles)

### 2.4 Ciudadanos UE/EEE
- [ ] Certificado de registro de ciudadano UE
- [ ] Residencia permanente UE
- [ ] Tarjeta de familiar de ciudadano UE
- [ ] Brexit: ciudadanos británicos en España

### 2.5 Procedimientos avanzados
- [ ] Plazos de resolución y silencio administrativo
- [ ] Recurso de alzada
- [ ] Recurso de reposición
- [ ] Recurso contencioso-administrativo
- [ ] Plataforma MiResidencia: cómo usarla

---

## Fase 3 — Especializados y de cobertura amplia

**Objetivo**: completar el mapa con los regímenes específicos.

### 3.1 Profesionales internacionales
- [ ] Profesionales altamente cualificados
- [ ] Tarjeta Azul UE
- [ ] Traslados intraempresariales (ICT)
- [ ] Investigadores
- [ ] Nómadas digitales y teletrabajadores
- [ ] Emprendedores y startups (Ley 28/2022)

### 3.2 Otros regímenes
- [ ] Trabajadores de temporada
- [ ] Prácticas formativas
- [ ] Voluntariado
- [ ] Au pair

### 3.3 Protección internacional
- [ ] Derecho de asilo y estatuto de refugiado
- [ ] Protección subsidiaria
- [ ] Apatridia
- [ ] Protección temporal (directiva UE)
- [ ] El procedimiento paso a paso
- [ ] Derechos durante la solicitud

### 3.4 Residencia de larga duración
- [ ] Larga duración (nacional)
- [ ] Larga duración UE

### 3.5 Otras modalidades de nacionalidad
- [ ] Nacionalidad por opción
- [ ] Nacionalidad por carta de naturaleza
- [ ] Doble nacionalidad
- [ ] Recuperación de la nacionalidad

### 3.6 Archivo histórico
- [ ] Golden Visa (qué era, por qué se eliminó, situación de titulares actuales)
- [ ] Ley de Memoria Democrática — Nacionalidad (cerrada oct. 2025)

---

## Fase 4 — Profundidad y herramientas

**Objetivo**: añadir capas de valor que diferencian a Nextranjería como referencia.

### 4.1 Glosario
- [ ] Estructura del glosario
- [ ] Primeras 30 entradas (los términos más críticos)
- [ ] Enlace contextual desde primera mención en cada página

### 4.2 Normativa de referencia
- [ ] Marco legal vigente (página índice con enlaces a BOE)
- [ ] Fichas individuales de cada norma principal
- [ ] Instrucciones y circulares (SEM, DGM)
- [ ] Histórico de cambios normativos

### 4.3 Actualidad y seguimiento
- [ ] Sección de cambios normativos recientes
- [ ] Calendario: fechas clave y plazos
- [ ] Sistema de alertas normativas en páginas afectadas

### 4.4 Asistente de orientación
- [ ] Diseño del flujo de preguntas guiadas
- [ ] Implementación del widget "¿Cuál es tu situación?"
- [ ] Integración con guías por situación

### 4.5 Búsqueda mejorada
- [ ] Buscador en lenguaje natural
- [ ] Autocompletado y sugerencias
- [ ] Sinónimos y términos coloquiales

---

## Fase 5 — Expansión y mantenimiento sostenido

**Objetivo**: crecimiento orgánico, accesibilidad y mantenimiento del rigor.

- [ ] Auditoría de accesibilidad (WCAG 2.1 AA)
- [ ] Revisión de tono y nivel de lectura (B1-B2)
- [ ] Versión imprimible de checklists y pasos a paso
- [ ] Valoración de traducciones parciales (idiomas prioritarios)
- [ ] Protocolo de revisión periódica de contenidos vigentes
- [ ] Sistema de versionado y archivo histórico de cambios
- [ ] Métricas de uso (qué busca la gente, qué no encuentra)

---

## Criterio para decidir qué publicar primero

Cuando dudes entre dos contenidos, prioriza el que cumpla más de estos criterios:

1. **¿Está caliente ahora mismo?** (regularización 2026 = sí)
2. **¿Hay mucha desinformación al respecto?**
3. **¿Afecta a muchas personas?**
4. **¿Es accionable hoy?** (tiene "qué hacer ya" útil)
5. **¿Soluciona una pregunta vital, no académica?**
6. **¿Tenemos base normativa o documental sólida para escribirlo bien?**

---

*Este documento se revisa al cierre de cada fase y siempre que cambie el contexto (publicación de norma, novedad relevante, feedback de usuarios).*
