# Unit of Work Plan — Lista de la Compra Compartida

**Nota**: Application Design se omitió (SKIP) porque no hay una capa de servicios propia — el backend es Supabase gestionado. Este proyecto es un **monolito de un único servicio desplegable** (la app web) organizado en **módulos lógicos**, no microservicios independientes. Las "unidades de trabajo" aquí son agrupaciones de historias para el desarrollo secuencial, no servicios separados.

## Checklist de ejecución

- [ ] Confirmar respuestas a las preguntas de contexto (abajo)
- [ ] Generar `aidlc-docs/inception/application-design/unit-of-work.md` con definición de las 4 unidades, responsabilidades y organización de código
- [ ] Generar `aidlc-docs/inception/application-design/unit-of-work-dependency.md` con matriz de dependencias
- [ ] Generar `aidlc-docs/inception/application-design/unit-of-work-story-map.md` mapeando las 13 historias a las 4 unidades
- [ ] Validar que todas las historias quedan asignadas a alguna unidad

## Propuesta base de unidades (de execution-plan.md, a confirmar)

1. **Unidad 1 — Fundaciones**: Setup Supabase, esquema de datos, CRUD básico de pendientes
2. **Unidad 2 — Tiempo real y acciones en lote**: Realtime, selección múltiple, marcar comprados
3. **Unidad 3 — Historial y estadísticas**: historial con filtros/corrección, cálculo de estadísticas
4. **Unidad 4 — Onboarding y acceso**: nombre local, creación de hogar, QR, PWA opcional

## Preguntas de contexto

### Question 1 — Agrupación de historias (Story Grouping)
¿Confirmas la agrupación de las 13 historias en estas 4 unidades tal como se propuso en el execution plan (Feature 1→Unidad 1, Feature 2→Unidad 2, Features 3+4→Unidad 3, Feature 5→Unidad 4)?

A) Sí, confirmo esa agrupación

B) No, prefiero otra agrupación (descríbela)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Dependencias e integración entre unidades
¿Cómo prefieres gestionar la dependencia de las unidades 2, 3 y 4 sobre el esquema de datos de la Unidad 1?

A) Estrictamente secuencial: no se empieza la Unidad 2 hasta que la Unidad 1 esté generada y probada, y así sucesivamente

B) Flexible: el esquema de datos completo (de las 4 unidades) se define desde la Unidad 1, permitiendo generar código de varias unidades en paralelo si se desea más adelante

X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 3 — Organización del código (Greenfield)
¿Qué estructura de directorios prefieres para el proyecto (monolito de un solo servicio, sin backend propio más allá de Supabase)?

A) Estructura plana simple: `/` con `index.html`, `/js`, `/css`, y `/supabase` para el esquema SQL/migraciones (adecuado para una app vanilla JS pequeña)

B) Estructura por módulo/feature: carpetas separadas por feature (ej. `/src/list`, `/src/history`, `/src/stats`, `/src/onboarding`)

X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 4 — Despliegue
Todas las unidades forman parte de la misma aplicación desplegada como un único sitio en Vercel/Netlify. ¿Confirmas que no hace falta ningún despliegue independiente por unidad (ej. no hay funciones serverless separadas por feature)?

A) Confirmo: despliegue único de todo el sitio, sin servicios independientes por unidad

B) No, quiero funciones/servicios desplegados por separado para alguna unidad (descríbelo)

X) Other (please describe after [Answer]: tag below)

[Answer]: A
