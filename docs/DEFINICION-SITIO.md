# Nextranjería — Definición del sitio

> Documento de referencia para el diseño, contenido y arquitectura de información del sitio.
> Fecha de creación: abril 2026. Marco normativo vigente a esa fecha.

---

## 1. Identidad del proyecto

### 1.1 Nombre

**Nextranjería** — juego de palabras entre "next" (siguiente paso, futuro) y "extranjería". Transmite orientación hacia adelante, hacia lo que viene, sin quedarse en el problema sino avanzando hacia la solución.

### 1.2 Misión

Ofrecer información clara, rigurosa y accesible sobre extranjería, inmigración y nacionalidad en España. Ser el sitio al que cualquier persona —migrante, familiar, profesional o simplemente interesado— pueda acudir para entender sus derechos, opciones y los pasos concretos de cada proceso.

### 1.3 Lo que NO es Nextranjería

- No es un despacho de abogados ni ofrece asesoramiento legal individualizado.
- No es un medio de comunicación ni persigue la noticia.
- No tiene modelo de negocio. No hay publicidad, afiliaciones ni servicios de pago.
- No es un foro de opinión política sobre inmigración.

### 1.4 Público objetivo

| Perfil | Necesidad principal |
|--------|-------------------|
| **Persona migrante en España** | Entender su situación legal, opciones de regularización, renovaciones |
| **Persona que quiere venir a España** | Conocer vías legales de entrada, requisitos, visados |
| **Familiar de persona migrante** | Reagrupación familiar, derechos derivados |
| **Profesional internacional** | Nómada digital, emprendedor, investigador, profesional cualificado |
| **Estudiante internacional** | Visado de estudios, prácticas, transición a permiso de trabajo |
| **Ciudadano UE/EEE en España** | Registro, certificado, derechos específicos |
| **Persona solicitante de protección internacional** | Asilo, refugio, protección subsidiaria |
| **Profesionales del sector** (abogados, trabajadores sociales, ONGs) | Referencia normativa actualizada |
| **Ciudadanía general** | Comprender el fenómeno migratorio con datos y rigor |

### 1.5 Principios editoriales

1. **Claridad ante todo.** Lenguaje comprensible sin sacrificar precisión. Explicar el "qué significa esto en la práctica" después de cada concepto técnico.
2. **Rigor normativo.** Toda afirmación se apoya en normativa vigente citada expresamente (ley, artículo, fecha). Cuando algo cambia, se actualiza o se marca como pendiente de actualización.
3. **Sin bulos ni atajos.** No reproducimos rumores, interpretaciones no contrastadas ni "trucos". Si algo es discutido entre juristas, lo decimos.
4. **Visión acogedora, no militante.** Creemos que la inmigración es un fenómeno positivo y natural. Lo expresamos desde los datos y el tono, no desde el eslogan.
5. **Transparencia temporal.** Cada contenido lleva fecha de última revisión y referencia normativa. El lector siempre sabe si lo que lee está vigente.
6. **Accesibilidad.** Diseño inclusivo. Textos pensados para personas cuyo español puede no ser nativo. Estructura predecible y navegación intuitiva.

---

## 2. Arquitectura de información

### 2.1 Estructura principal de navegación

```
NEXTRANJERÍA
│
├── INICIO
│   └── (Bienvenida, buscador destacado, contenido destacado, alertas normativas)
│
├── GUÍAS POR SITUACIÓN ← (entrada principal para el usuario final)
│   ├── Estoy en España sin papeles
│   ├── Quiero venir a España a trabajar
│   ├── Quiero venir a España a estudiar
│   ├── Quiero venir a España sin trabajar
│   ├── Quiero emprender o teletrabajar desde España
│   ├── Soy ciudadano/a de la UE
│   ├── Quiero traer a mi familia
│   ├── Necesito protección internacional
│   ├── Quiero obtener la nacionalidad española
│   └── Ya tengo permiso y necesito renovar
│
├── AUTORIZACIONES DE RESIDENCIA
│   ├── Residencia temporal no lucrativa
│   ├── Residencia y trabajo por cuenta ajena
│   ├── Residencia y trabajo por cuenta propia
│   ├── Arraigo
│   │   ├── Arraigo social
│   │   ├── Arraigo sociolaboral
│   │   ├── Arraigo socioformativo
│   │   ├── Arraigo familiar
│   │   └── Arraigo de segunda oportunidad
│   ├── Reagrupación familiar
│   ├── Circunstancias excepcionales
│   │   ├── Razones humanitarias
│   │   ├── Víctimas de violencia de género
│   │   ├── Víctimas de trata
│   │   ├── Víctimas de violencia sexual
│   │   └── Colaboración con autoridades
│   ├── Residencia de larga duración
│   │   ├── Larga duración (nacional)
│   │   └── Larga duración UE
│   └── Residencia para familiares de ciudadanos españoles
│
├── TRABAJO Y EMPRENDIMIENTO
│   ├── Permiso de trabajo por cuenta ajena
│   ├── Permiso de trabajo por cuenta propia
│   ├── Profesionales altamente cualificados / Tarjeta Azul UE
│   ├── Traslados intraempresariales (ICT)
│   ├── Investigadores
│   ├── Nómadas digitales y teletrabajadores
│   ├── Emprendedores y startups (Ley 28/2022)
│   ├── Trabajadores de temporada
│   └── Prácticas formativas y voluntariado
│
├── ESTUDIAR EN ESPAÑA
│   ├── Visado de estudios
│   ├── Estancia por estudios (tarjeta de estudiante)
│   ├── Trabajar mientras estudias
│   ├── Prácticas durante y después de los estudios
│   ├── Modificación de estancia a residencia
│   └── Visado de búsqueda de empleo (hijos/nietos de españoles)
│
├── CIUDADANOS UE/EEE Y FAMILIARES
│   ├── Certificado de registro de ciudadano UE
│   ├── Residencia permanente UE
│   ├── Tarjeta de familiar de ciudadano UE
│   ├── Familiares no comunitarios: derechos y trámites
│   └── Brexit: ciudadanos británicos en España
│
├── PROTECCIÓN INTERNACIONAL
│   ├── Derecho de asilo y estatuto de refugiado
│   ├── Protección subsidiaria
│   ├── Apatridia
│   ├── Protección temporal (directiva UE)
│   ├── El procedimiento paso a paso
│   └── Derechos durante la solicitud
│
├── NACIONALIDAD ESPAÑOLA
│   ├── Nacionalidad por residencia
│   │   ├── Requisitos generales (10 años)
│   │   ├── Plazos reducidos (1, 2 y 5 años)
│   │   ├── Exámenes CCSE y DELE A2
│   │   └── El procedimiento paso a paso
│   ├── Nacionalidad por opción
│   ├── Nacionalidad por carta de naturaleza
│   ├── Doble nacionalidad
│   ├── Recuperación de la nacionalidad
│   └── Ley de Memoria Democrática (cerrada oct. 2025) ← archivo histórico
│
├── TRÁMITES Y PROCEDIMIENTOS
│   ├── El NIE: qué es, para qué sirve, cómo obtenerlo
│   ├── La TIE: tarjeta de identidad de extranjero
│   ├── El empadronamiento
│   ├── Cita previa en extranjería
│   ├── Plataforma MiResidencia (trámites online)
│   ├── Certificado digital y Cl@ve
│   ├── Tasas y formularios
│   ├── Plazos de resolución y silencio administrativo
│   └── Recursos: qué hacer si te deniegan
│       ├── Recurso de alzada
│       ├── Recurso de reposición
│       └── Recurso contencioso-administrativo
│
├── NORMATIVA
│   ├── Marco legal vigente
│   │   ├── Ley Orgánica 4/2000 (LOEX)
│   │   ├── RD 1155/2024 (Reglamento de Extranjería)
│   │   ├── Ley 14/2013 (Emprendedores)
│   │   ├── Ley 28/2022 (Startups)
│   │   ├── RD 240/2007 (Ciudadanos UE)
│   │   ├── Ley 12/2009 (Asilo)
│   │   └── Código Civil arts. 17-28 (Nacionalidad)
│   ├── Instrucciones y circulares (SEM, DGM)
│   └── Histórico de cambios normativos
│
├── ACTUALIDAD ← (no es un medio, pero sí seguimiento de cambios)
│   ├── Cambios normativos recientes
│   ├── Regularización extraordinaria 2026 (anunciada, pendiente de publicación)
│   └── Calendario: fechas clave y plazos
│
├── GLOSARIO
│
└── SOBRE NEXTRANJERÍA
    ├── Qué es este proyecto
    ├── Metodología y fuentes
    ├── Aviso legal (no es asesoramiento jurídico)
    └── Contacto
```

### 2.2 Lógica de navegación: dos puertas de entrada

El sitio ofrece **dos formas complementarias** de acceder a la información:

**A) Por situación personal ("Guías por situación")**
Para el usuario que no sabe terminología jurídica. Llega con una pregunta vital: "estoy sin papeles, ¿qué puedo hacer?" o "quiero traer a mi madre". Estas guías cruzan transversalmente varias secciones técnicas y le llevan de la mano.

**B) Por materia jurídica (secciones temáticas)**
Para quien ya sabe qué busca: "arraigo sociolaboral", "tarjeta azul UE", "recurso de alzada". Acceso directo y técnico.

Ambas rutas se enlazan entre sí constantemente. Una guía por situación enlaza a las páginas técnicas relevantes, y cada página técnica indica en qué guías por situación aparece.

### 2.3 Anatomía de una página de contenido

Cada página de contenido sigue una estructura predecible:

```
┌─────────────────────────────────────────┐
│ TÍTULO                                   │
│ Subtítulo descriptivo en lenguaje llano  │
├─────────────────────────────────────────┤
│ 📋 FICHA RÁPIDA                         │
│  · Normativa aplicable                   │
│  · Quién puede solicitarlo               │
│  · Plazo de resolución                   │
│  · Coste (tasas)                         │
│  · Última actualización: DD/MM/AAAA      │
├─────────────────────────────────────────┤
│ CONTENIDO PRINCIPAL                      │
│  (explicación en lenguaje claro)         │
│                                          │
│  > Bloques "En la práctica" destacados   │
│  > Bloques "Ojo" para advertencias       │
│  > Bloques "Base legal" con cita norm.   │
├─────────────────────────────────────────┤
│ PASO A PASO (cuando aplique)             │
│  1. ► 2. ► 3. ► ...                     │
├─────────────────────────────────────────┤
│ DOCUMENTACIÓN NECESARIA                  │
│  (checklist descargable/imprimible)      │
├─────────────────────────────────────────┤
│ PREGUNTAS FRECUENTES                     │
├─────────────────────────────────────────┤
│ CONTENIDO RELACIONADO                    │
│  (enlaces a otras páginas del sitio)     │
├─────────────────────────────────────────┤
│ METADATOS                                │
│  · Fecha de creación                     │
│  · Fecha de última revisión              │
│  · Normativa de referencia               │
│  · Etiquetas                             │
└─────────────────────────────────────────┘
```

---

## 3. Taxonomías y sistema de etiquetado

### 3.1 Categorías principales (mutuamente excluyentes)

Cada contenido pertenece a **una** categoría principal:

| Categoría | Descripción |
|-----------|-------------|
| `autorizaciones` | Permisos de residencia y trabajo |
| `trabajo` | Régimen laboral, emprendimiento, profesionales |
| `estudios` | Estancias por estudios, prácticas, investigación |
| `ciudadanos-ue` | Régimen comunitario y familiares |
| `proteccion-internacional` | Asilo, refugio, apatridia |
| `nacionalidad` | Todas las vías de acceso a la nacionalidad española |
| `tramites` | Procedimientos administrativos transversales |
| `normativa` | Textos legales, instrucciones, circulares |
| `actualidad` | Cambios normativos, novedades, calendario |

### 3.2 Etiquetas transversales (no excluyentes)

Un contenido puede tener múltiples etiquetas:

**Por tipo de autorización:**
`arraigo` · `reagrupacion-familiar` · `no-lucrativa` · `cuenta-ajena` · `cuenta-propia` · `larga-duracion` · `tarjeta-azul` · `nomada-digital` · `startup` · `temporada` · `investigador` · `ICT`

**Por perfil de usuario:**
`sin-papeles` · `recien-llegado` · `estudiante` · `trabajador` · `emprendedor` · `familia` · `ciudadano-ue` · `solicitante-asilo` · `profesional-cualificado`

**Por tipo de trámite:**
`solicitud-inicial` · `renovacion` · `modificacion` · `recurso` · `cita-previa` · `documentacion`

**Por normativa de referencia:**
`LOEX` · `reglamento-extranjeria` · `ley-emprendedores` · `ley-startups` · `RD-240-2007` · `ley-asilo` · `codigo-civil`

**Por estado temporal:**
`vigente` · `pendiente-actualizacion` · `historico` · `transitorio`

### 3.3 Filtros de navegación

El usuario puede filtrar contenidos combinando:

- **"Soy..."** → perfil de usuario
- **"Necesito..."** → tipo de trámite (solicitar / renovar / recurrir / entender)
- **"Sobre..."** → materia (residencia / trabajo / estudios / nacionalidad / asilo)

---

## 4. Contenidos especiales y transversales

### 4.1 Regularización extraordinaria 2026 — PRIORIDAD MÁXIMA

**Este es el contenido más prioritario del sitio**, aunque a la fecha de arranque la norma aún no esté publicada en BOE. Es un tema de altísimo interés público, generador de enorme desinformación, y precisamente por eso Nextranjería debe estar presente desde el primer momento como referencia fiable.

> **Regla editorial clave**: no hace falta esperar a la publicación en BOE para cubrirlo. Lo que hace falta es ser absolutamente transparente sobre el estado de cada afirmación y actualizar el contenido conforme avance el proceso.

#### Sistema de estados normativos

Cada afirmación del contenido debe etiquetarse según su fuente y grado de certidumbre:

| Estado | Qué significa | Cómo se señala |
|--------|--------------|----------------|
| `Anunciado` | Lo dijo un miembro del Gobierno, Consejo de Ministros o fuente oficial | Bloque azul: "Según el anuncio del Consejo de Ministros del 27/01/2026..." |
| `Borrador / Filtrado` | Procede de borradores públicos, filtraciones verificadas | Bloque amarillo: "Según el borrador conocido a fecha X..." |
| `Publicado en BOE` | Norma ya publicada, aunque pendiente de entrada en vigor | Bloque verde: "Publicado en BOE el DD/MM/AAAA" |
| `En vigor` | Plenamente aplicable | Bloque verde sólido |
| `Contrastado en la práctica` | Criterios de aplicación observados en oficinas | Bloque gris con nota metodológica |
| `Especulación / Rumor` | Circula pero no tiene fuente verificable | Se menciona solo para desmentir o matizar |

#### Estructura del hub de contenidos "Regularización 2026"

El tema tiene entidad propia como **hub** con múltiples páginas interconectadas:

```
Regularización extraordinaria 2026 (landing del hub)
│
├── ¿Qué es y en qué punto está? (estado actualizado)
├── ¿A quién afecta? (ámbito subjetivo)
├── Requisitos (lo que se sabe / lo que falta saber)
├── Cómo prepararse mientras no sale la norma
│   ├── Empadronamiento: por qué es clave desde ya
│   ├── Antecedentes penales: cómo obtenerlos ahora
│   ├── Documentos que conviene reunir ya
│   └── Qué NO hacer mientras esperas
├── Preguntas frecuentes (con respuestas honestas sobre incertidumbre)
├── Bulos y confusiones habituales (desmontados con rigor)
├── Calendario y seguimiento (línea temporal actualizada)
├── Diferencias con el arraigo y otras vías
└── Cuando salga la norma:
    ├── Procedimiento paso a paso
    ├── Documentación definitiva
    ├── Dónde y cómo presentar
    └── Qué pasa si te deniegan
```

#### Cómo prepararse sin norma publicada (valor inmediato)

Aunque no haya Real Decreto, hay muchas cosas útiles que una persona puede hacer **ya**, y este es el ángulo de valor real del contenido en fase previa:

- **Empadronarse cuanto antes** (si aún no lo está) y conservar certificados históricos
- **Solicitar antecedentes penales** en país de origen (suele tardar)
- **Reunir justificantes de permanencia** en España anteriores al 31/12/2025
- **Conservar cualquier documento con fecha**: contratos, recibos, informes médicos, volantes escolares
- **No pagar por "reservas de cita"** ni servicios que prometan plaza garantizada

#### Lucha contra la desinformación

Una página dedicada a **bulos y confusiones habituales** desmintiendo:

- Que ya se puede solicitar
- Que hay un número limitado de plazas por orden de llegada
- Que basta con tener una oferta de trabajo
- Que los antecedentes de cualquier tipo descartan automáticamente
- Confusiones con el arraigo social
- Ofertas fraudulentas de "tramitación garantizada"

#### Política de actualización del hub

Este contenido es **vivo**. Cada página del hub lleva:

- Fecha de última revisión muy visible (día, no solo mes)
- Resumen de cambios recientes ("Actualizado el X: se ha publicado el borrador...")
- Un aviso claro si la información ha quedado desfasada
- Versionado: los contenidos antiguos se archivan accesibles, no se borran

Cuando la norma se publique en BOE, las páginas se reescriben con el marco ya vigente, manteniendo el histórico accesible para quien quiera ver la evolución.

#### Documentos de contexto institucional

Materiales explicativos del Ministerio (Q&A, notas de prensa, comparecencias) se tratan como **contexto institucional**: útiles para entender la orientación política y lo que cabe esperar, pero **no tienen valor normativo por sí mismos**. Se citan como tales, siempre con fuente y fecha.

### 4.2 Golden Visa (archivo histórico)

- Eliminada por LO 1/2025, efectiva desde 3 de abril de 2025
- Página que explica: qué era, por qué se eliminó, qué pasa con los titulares actuales
- Alternativas vigentes para inversores

### 4.3 Ley de Memoria Democrática — Nacionalidad (archivo histórico)

- Vía cerrada en octubre de 2025 tras más de 680.000 solicitudes
- Página explicativa con contexto histórico
- Estado de tramitación de solicitudes pendientes

### 4.4 Glosario

Términos clave explicados en lenguaje llano con referencia normativa:

Ejemplos: *arraigo, autorización de residencia, cita previa, CCSE, certificado de registro, circunstancias excepcionales, Cl@ve, cuenta ajena/propia, DELE A2, empadronamiento, estancia, GECCO, informe de integración social, larga duración, LOEX, NIE, nómada digital, OAR, padrón, protección subsidiaria, reagrupación, recurso de alzada, reglamento, residencia, SEM, silencio administrativo, situación nacional de empleo, tarjeta azul UE, TIE, UGE-CE...*

---

## 5. Elementos de diseño de contenido

### 5.1 Bloques especiales recurrentes

| Bloque | Uso | Ejemplo |
|--------|-----|---------|
| **Ficha rápida** | Resumen estructurado al inicio de cada página | Normativa, quién, plazo, coste, fecha |
| **En la práctica** | Traducir jerga legal a lenguaje cotidiano | "Esto significa que si llevas 2 años empadronado..." |
| **Base legal** | Cita textual o referencia precisa a normativa | "Art. 124.1 RD 1155/2024" |
| **Ojo** | Advertencia sobre errores comunes o cambios recientes | "Cuidado: este plazo cambió en mayo de 2025" |
| **Paso a paso** | Secuencia numerada de acciones concretas | "1. Pide cita previa → 2. Reúne documentación..." |
| **Checklist** | Lista de documentos necesarios (imprimible) | Pasaporte, empadronamiento, contrato... |
| **Ejemplo** | Caso práctico que ilustra una situación | "María llegó de Colombia hace 3 años..." |
| **Pregunta frecuente** | Formato pregunta-respuesta colapsable | "¿Puedo trabajar mientras tramito el arraigo?" |

### 5.2 Sistema de fechado y vigencia

Cada contenido muestra obligatoriamente:

- **Fecha de publicación**
- **Fecha de última revisión**
- **Normativa de referencia** (con enlace al BOE cuando sea posible)
- **Indicador de estado**: `Vigente` | `Pendiente de actualización` | `Contenido histórico`

### 5.3 Interconexión de contenidos

- Cada página técnica indica en qué **guías por situación** es relevante
- Cada guía por situación enlaza a las **páginas técnicas** correspondientes
- Los bloques de **contenido relacionado** al final de cada página
- El **glosario** se enlaza contextualmente (tooltip o enlace en primera mención de cada término)

---

## 6. Tono y estilo editorial

### 6.1 Voz

- **Segunda persona directa**: "Si llevas dos años viviendo en España..." (no "el interesado deberá...")
- **Activa y concreta**: "Necesitas un contrato de trabajo" (no "será necesario disponer de...")
- **Honesta sobre la complejidad**: "Este trámite puede ser lento y frustrante. Aquí te explicamos qué esperar."

### 6.2 Lo que evitamos

- Lenguaje burocrático innecesario ("el administrado", "la persona interesada deberá proceder a...")
- Promesas de resultado ("seguro que te lo aprueban si...")
- Sensacionalismo ("¡España abre sus puertas!" / "¡Expulsiones masivas!")
- Victimismo o paternalismo
- Opinión política disfrazada de información
- Datos no verificados o fuentes anónimas

### 6.3 Cuando hay incertidumbre

Lo decimos explícitamente:

> "Este punto está sujeto a interpretación administrativa y puede variar según la oficina de extranjería. La normativa dice X (art. Y), pero en la práctica hemos observado que..."

> "A fecha de [fecha], este aspecto está pendiente de desarrollo reglamentario."

---

## 7. Marco normativo de referencia (vigente a abril 2026)

| Norma | Materia | Estado |
|-------|---------|--------|
| **Ley Orgánica 4/2000** (LOEX) | Derechos y libertades de extranjeros | Vigente (última reforma: LO 1/2025) |
| **Real Decreto 1155/2024** | Reglamento de Extranjería | Vigente desde 20/05/2025. Sustituye al RD 557/2011 |
| **Ley 14/2013** | Emprendedores e internacionalización | Vigente (modificada por Ley 28/2022 y LO 1/2025) |
| **Ley 28/2022** | Startups / Nómadas digitales | Vigente |
| **Orden PJC/44/2026** | Umbral salarial de referencia para Tarjeta Azul UE | Vigente desde 30/01/2026 |
| **Real Decreto 240/2007** | Ciudadanos UE y familiares | Vigente |
| **Ley 12/2009** | Asilo y protección subsidiaria | Vigente |
| **Código Civil, arts. 17-28** | Nacionalidad española | Vigente |
| **RD 865/2001** | Estatuto de apátrida | Vigente |
| **Instrucción SEM 1/2025** | Arraigo (desarrollo del nuevo Reglamento) | Vigente |
| **LO 1/2025** | Supresión Golden Visa (entre otras reformas) | Vigente desde 03/04/2025 |
| **Regularización extraordinaria 2026 (anunciada)** | Medida extraordinaria pendiente de publicación formal | Entrada en vigor prevista a inicios de abril de 2026; plazo previsto hasta el 30/06/2026 |

### 7.1 Documentos de contexto institucional

- Preguntas y respuestas institucionales sobre la regularización extraordinaria 2026: material explicativo útil para contexto político y administrativo, pero sin valor normativo por sí mismo

---

## 8. Hoja de ruta de contenidos (prioridad)

### Fase 0 — Lanzamiento inmediato (prioridad absoluta)

0. **Hub Regularización extraordinaria 2026** — publicación desde el primer día del sitio, aunque la norma aún no esté en BOE. Este contenido justifica por sí solo el lanzamiento y es el principal motor de tráfico y utilidad pública inicial. Incluye:
   - Landing del hub con estado actualizado
   - "Qué hacer mientras no sale la norma" (valor inmediato)
   - Página de bulos y confusiones habituales
   - Calendario y línea temporal
   - FAQ honestas sobre la incertidumbre

### Fase 1 — Contenidos urgentes y de alta demanda

1. **Arraigo** (5 modalidades, reforma reciente, altísima demanda y fuertemente relacionado con la regularización)
2. **Empadronamiento** (pieza clave transversal: tanto para regularización como para arraigo)
3. **Guías por situación** (las 3-4 más demandadas: sin papeles, venir a trabajar, traer familia, nacionalidad)
4. **Trámites esenciales**: NIE, TIE, cita previa, antecedentes penales
5. **Nacionalidad por residencia**

### Fase 2 — Contenidos estructurales

6. Residencia y trabajo por cuenta ajena y propia
7. Reagrupación familiar
8. Estudiantes (visado, estancia, modificación)
9. Nómadas digitales y emprendedores
10. Ciudadanos UE y familiares
11. Renovaciones
12. Recursos administrativos

### Fase 3 — Contenidos especializados

13. Protección internacional (asilo, refugio, apatridia)
14. Tarjeta Azul UE y profesionales cualificados
15. Traslados intraempresariales
16. Trabajadores de temporada
17. Golden Visa (archivo)
18. Ley de Memoria Democrática (archivo)
19. Normativa completa y glosario

---

## 9. Funcionalidades de navegación

### 9.1 Buscador

Buscador prominente en la home y accesible desde cualquier página. Debe entender búsquedas en lenguaje natural:

- "quiero traer a mi madre" → Reagrupación familiar de ascendientes
- "llevo 3 años sin papeles" → Arraigo social
- "soy colombiana y quiero la nacionalidad" → Nacionalidad por residencia (plazo reducido 2 años)

### 9.2 Asistente de orientación (futuro)

Widget interactivo tipo "¿Cuál es tu situación?" con preguntas guiadas que lleva al usuario a la guía más relevante para su caso. No es asesoramiento legal; es orientación dentro del propio contenido del sitio.

### 9.3 Alertas normativas

Banner o sistema de notificaciones para cambios normativos relevantes. Se muestra en las páginas afectadas y en la sección de actualidad.

---

## 10. Consideraciones de accesibilidad e inclusión

- **Idioma principal**: español. Valorar en el futuro traducciones parciales a idiomas de las principales comunidades migrantes (árabe, francés, inglés, chino, ucraniano, rumano).
- **Nivel de lectura**: apuntar a un nivel comprensible para personas con español intermedio (B1-B2).
- **Accesibilidad web**: cumplimiento WCAG 2.1 nivel AA como mínimo.
- **Diseño responsive**: mobile-first (muchos usuarios accederán desde el móvil).
- **Imprimibilidad**: las checklists de documentación y los pasos a paso deben poder imprimirse limpiamente.

---

*Este documento es un documento vivo. Se actualizará conforme avance el diseño y desarrollo del sitio.*
