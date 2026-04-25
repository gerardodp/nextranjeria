# Nextranjería — Hoja de ruta temporal

> Documento operativo para ordenar el trabajo en el tiempo. Vivo: se actualiza conforme avanza el proyecto.
> Última actualización: 25 de abril de 2026 (fichas D.A. 20.ª y 21.ª en `/autorizaciones/` y bloque de procedimientos avanzados en `/tramites/`).

---

## Principio rector

**Lanzar cuanto antes con el hub de Regularización Extraordinaria 2026 como punta de lanza.** El sitio se publica con lo mínimo imprescindible para ser útil y crece desde ahí. No esperar a tenerlo todo: cada semana en blanco es una semana en la que la desinformación ocupa el espacio que debería ocupar Nextranjería.

---

## Fase 0 — Lanzamiento mínimo viable

**Objetivo**: tener el sitio en línea con el hub de Regularización 2026 y la mínima infraestructura editorial alrededor.

### 0.1 Decisiones previas (bloqueantes)
- [x] Confirmar nombre definitivo y dominio (Nextranjería, nextranjeria.com)
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
- [x] Página índice de vías a la nacionalidad (`/nacionalidad/vias-nacionalidad/`) — mapa de las 5 formas de adquisición (origen, opción, residencia, carta de naturaleza, posesión de estado) más recuperación. Base legal: arts. 17 a 26 Cc
- [x] Nacionalidad por residencia: requisitos generales (10 años) — residencia legal, continuada e inmediatamente anterior, buena conducta cívica, suficiente grado de integración, silencio negativo. Base legal: art. 22 Cc
- [x] Plazos reducidos (1, 2 y 5 años) — desglose completo de los supuestos del art. 22.1 y 22.2 Cc: refugiados, iberoamericanos/Andorra/Filipinas/Guinea Ecuatorial/Portugal/sefardíes, nacidos en España, matrimonio con español, viudos, tutelados, hijos y nietos de originariamente españoles
- [x] Exámenes CCSE y DELE A2 — formato, convocatorias, exención del DELE para hispanohablantes, validez indefinida, cómo se incorporan al expediente
- [x] Procedimiento paso a paso — tramitación electrónica, documentación, plazo legal de un año con silencio negativo, jura/promesa en 180 días, inscripción en el Registro Civil

**Estado Fase 1.4: completada el 11 de abril de 2026.** 5 fichas técnicas nuevas en `/nacionalidad/`, apoyadas en el Código Civil arts. 17-28 (único PDF disponible para nacionalidad). Guía por situación "Quiero la nacionalidad española" actualizada para enlazar a las fichas. Build de 64 páginas, `astro check` limpio. El desarrollo reglamentario del procedimiento (RD 1004/2015) y la normativa específica del Instituto Cervantes quedan por incorporar como fichas de normativa cuando se carguen los PDFs en el repo.

---

## Fase 2 — Estructurales

**Objetivo**: cubrir el resto del marco habitual de extranjería.

### 2.1 Trabajo
- [x] Residencia y trabajo por cuenta ajena — ficha técnica completa con requisitos del trabajador y del empleador (art. 74 RD 1155/2024), situación nacional de empleo y Catálogo de Difícil Cobertura (art. 75), medios económicos del empleador persona física (art. 76), procedimiento (art. 77), cambio de empleador (art. 79) y diferencias con arraigo sociolaboral y cuenta propia
- [x] Residencia y trabajo por cuenta propia — requisitos (art. 84), viabilidad del proyecto, procedimiento vía consulado (art. 85), comparativa con Ley 14/2013 de emprendedores y novedad del RD 1155/2024 (renovación a 4 años con habilitación para cuenta ajena)
- [x] Renovaciones de permisos de trabajo — plazos (60 antes / 90 después), silencio positivo a los 3 meses, supuestos de renovación sin continuidad laboral (art. 80.2), descubiertos de cotización imputables al empleador (art. 80.7), duración ampliada a 4 años (arts. 81 y 87) y salto a larga duración
- [x] Modificación de la situación — los tres supuestos del Título XI: de estudios a trabajo (art. 190), de residencia temporal a residencia y trabajo (art. 191) y modificaciones dentro del primer año (art. 192). Con mención de la autorización provisional con habilitación a jornada completa

**Estado Fase 2.1: completada el 12 de abril de 2026.** 4 fichas técnicas nuevas en `/trabajo/`, apoyadas en el Título IV (Cap. III y IV) y Título XI del RD 1155/2024 más la LOEX. Nueva ruta `/trabajo/` con índice propio y enlace añadido al `SiteHeader`. Build de 69 páginas, `astro check` limpio (0 errores, 0 warnings). Distribución de autoría: Elena Navarro (cuenta ajena), Marcos Delgado (cuenta propia), Sofía Ramos (renovaciones), Javier Costa (modificación).

### 2.2 Familia
- [x] Reagrupación familiar (página completa) — ficha técnica en `/autorizaciones/reagrupacion-familiar/` basada en el **Título IV, Capítulo II, arts. 65 a 71** del RD 1155/2024. Cubre definición, familiares reagrupables (art. 66), requisitos del reagrupante (art. 67, con medios económicos al 150% IPREM + 50% por miembro adicional y cláusula de interés superior del menor, y el informe de vivienda del art. 3.c Ley 12/2023), procedimiento con silencio positivo (art. 68), residencia independiente del reagrupado (art. 69, con los supuestos de ruptura tras 2 años de convivencia, violencia de género y mayoría de edad del hijo), reagrupación en cadena (art. 70) y renovación a 4 años (art. 71). Novedad RD 1155/2024: habilitación directa para trabajar de cónyuge, pareja e hijos reagrupados (art. 65.2)
- [x] Familiares de ciudadanos españoles — ficha en `/ciudadanos-ue/familiares-ciudadano-espanol.mdx` con la arquitectura normativa correcta: RD 240/2007 interpretado por la **STS 1 de junio de 2010** (BOE-A-2010-16822) y la **DA 19ª del Reglamento LOEX** (introducida por la DF 3ª del propio RD 240/2007). Cubre tarjeta de familiar de la Unión (art. 8), concepto de "a cargo", art. 2 bis para pareja no registrada, mantenimiento del derecho tras ruptura (art. 9) y residencia permanente (arts. 10-11)
- [x] Familiares de ciudadanos UE — ficha en `/ciudadanos-ue/familiares-ciudadano-ue.mdx` con la aplicación directa del RD 240/2007. Destaca el requisito previo del titular UE (art. 7: trabajador, recursos suficientes, estudiante o familiar), certificado de registro de ciudadano de la Unión, tarjeta para el familiar no comunitario (art. 8), art. 2 bis para familiares extendidos y pareja no registrada, visado gratuito y preferente (art. 4), mantenimiento del derecho (art. 9), residencia permanente (arts. 10-11) y garantías frente a la expulsión (art. 15: amenaza real, actual y suficientemente grave)

**Estado Fase 2.2: completada el 12 de abril de 2026.** 3 fichas técnicas nuevas apoyadas en el RD 1155/2024 (reagrupación ordinaria) y en el RD 240/2007 (régimen comunitario). Primera vez que se publica contenido en la categoría `ciudadanos-ue`: nueva ruta `/ciudadanos-ue/` con índice propio y enlace añadido al `SiteHeader` entre "Trabajo" y "Trámites". Guía "Quiero traer a mi familia" actualizada para corregir la referencia errónea al "Título X" (ahora Título IV, Cap. II, arts. 65-71) y enlazar a las tres fichas reales en vez de marcarlas como "en preparación". Distribución de autoría: Javier Costa (reagrupación, también autor de la guía de familia), Elena Navarro (familiares de español), Marcos Delgado (familiares de UE).

### 2.3 Estudios
- [ ] Visado de estudios
- [ ] Estancia por estudios (tarjeta de estudiante)
- [ ] Trabajar mientras estudias
- [ ] Modificación de estancia a residencia
- [ ] Visado de búsqueda de empleo (hijos/nietos de españoles)

### 2.4 Ciudadanos UE/EEE
- [ ] Certificado de registro de ciudadano UE
- [ ] Residencia permanente UE
- [x] Tarjeta de familiar de ciudadano UE — cubierta por las dos fichas publicadas en Fase 2.2: `familiares-ciudadano-espanol.mdx` y `familiares-ciudadano-ue.mdx` (ambas en `/ciudadanos-ue/`)
- [ ] Brexit: ciudadanos británicos en España

### 2.5 Procedimientos avanzados
- [x] Plazos de resolución y silencio administrativo — `/tramites/silencio-administrativo-extranjeria/`. Tabla por procedimiento (positivo/negativo), causas de suspensión del plazo, certificado acreditativo y plazos para recurrir tras silencio negativo
- [x] Recurso de alzada — `/tramites/recurso-alzada-extranjeria/`. Cuándo cabe en extranjería (minoritario: visados, homologaciones), órgano superior jerárquico, plazos y diferencias con reposición
- [x] Recurso de reposición — `/tramites/recurso-reposicion-extranjeria/`. Recurso potestativo ante el mismo órgano, estructura del escrito, decisión reposición vs. contencioso
- [x] Recurso contencioso-administrativo — `/tramites/recurso-contencioso-extranjeria/`. Vía judicial, órgano competente, abogado/procurador obligatorios, justicia gratuita, costas, suspensión cautelar y recursos contra la sentencia
- [ ] Plataforma MiResidencia: cómo usarla

**Estado Fase 2.5: completada el 25 de abril de 2026** (4 de 5 fichas; MiResidencia queda pendiente como pieza más operativa que jurídica). 4 fichas técnicas nuevas en `/tramites/`, apoyadas en la Ley 39/2015 (PAC) y la Ley 29/1998 (LJCA). Distribución de autoría: Marcos Delgado (silencio), Elena Navarro (reposición), Javier Costa (alzada), Sofía Ramos (contencioso).

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

## Hito extraordinario: publicación del RD 316/2026 (16 de abril de 2026)

El 15 de abril de 2026 se publicó en el BOE el **Real Decreto 316/2026**, que
modifica el Reglamento de Extranjería (RD 1155/2024) y articula la llamada
"regularización extraordinaria 2026" como dos nuevas vías de arraigo
(disposiciones adicionales 20.ª y 21.ª) con plazo de solicitud hasta el
**30 de junio de 2026**. Entrada en vigor: 16 de abril de 2026.

### Actualización de contenidos
- [x] Ficha nueva `normativa/real-decreto-316-2026-modificacion-reglamento-extranjeria.mdx` (`status: en-vigor`).
- [x] `normativa/real-decreto-1155-2024-reglamento-extranjeria.mdx` pasa a `status: modificada`, con `modifiedBy` al RD 316/2026 y sección que enumera los artículos retocados.
- [x] `normativa/qa-ministerial-regularizacion-2026.mdx` pasa a `status: historica` como antecedente institucional superado.
- [x] 5 páginas del hub reescritas con `normativeStatus: vigente`, usando `<EnVigor>`/`<BOE>` en lugar de `<Borrador>`/`<Anunciado>`.
- [x] 9 FAQs del hub reescritas con los datos reales del RD.
- [x] 5 FAQs nuevas: `declaracion-responsable-antecedentes`, `informe-vulnerabilidad-quien-emite`, `diferencia-da-20-da-21`, `proteccion-temporal-ucrania`, `hijos-menores-expediente`.
- [x] Guía `estoy-sin-papeles` actualizada: ahora habla de las tres vías vivas (arraigo ordinario + D.A. 20.ª + D.A. 21.ª).

### Infraestructura de indexación
- [x] Service account `indexing@nextranjeria-dashboard.iam.gserviceaccount.com` creado en GCP con las cuatro APIs habilitadas (Site Verification, Indexing, Search Console, Analytics Data).
- [x] Verificación del SA como propietario de `sc-domain:nextranjeria.com` vía `scripts/verify-sa-in-gsc.ts` (DNS TXT).
- [x] Scripts portados de QueAlarma: `notify-sitemap.ts`, `notify-indexing-api.ts`, `publish-scheduled.ts`, `verify-sa-in-gsc.ts`, `lib/google-auth.mjs`.
- [x] Workflow `.github/workflows/scheduled-publish.yml` con cron diario (06:00 UTC) para publicación programada + ping a Indexing API + reenvío de sitemap a GSC.
- [x] Secrets en GitHub Actions: `GOOGLE_SERVICE_ACCOUNT_JSON` y `SEARCH_CONSOLE_SITE`.
- [x] Primer ping manual: sitemap reenviado y 23 URLs del hub notificadas a Indexing API (todas OK).

### Fichas de las nuevas vías de arraigo (25 de abril de 2026)

Tras una semana con el hub funcionando con la regularización ya en
vigor, el siguiente paso natural era darle a las dos D.A. su **propia
ficha técnica en `/autorizaciones/`**, al mismo nivel que las cinco
modalidades de arraigo ordinario. Hasta ahora vivían descritas dentro
del hub (`/regularizacion-2026/que-es/`, `como-prepararse/`), pero
faltaba la ficha de procedimiento autocontenida que el resto de
arraigos sí tenían.

- [x] `autorizaciones/arraigo-da-20-2026.mdx` — D.A. 20.ª (solicitantes de protección internacional). Autor: Marcos Delgado.
- [x] `autorizaciones/arraigo-da-21-2026.mdx` — D.A. 21.ª (vía general con tres requisitos alternativos). Autora: Sofía Ramos.

Ambas con `hub: regularizacion-2026` para que el hub las cargue como
piezas propias y enlazadas con las FAQs preexistentes. Tabla
comparativa entre ambas D.A. en la ficha de la 20.ª y comparativa con
arraigo social ordinario en la de la 21.ª.

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
