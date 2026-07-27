# Plan de NFR Requirements — Unidad 7 (Historial en Tickets)

## Pasos

- [ ] Resolver preguntas de aclaración (abajo)
- [ ] Crear `nfr-requirements.md` (Reliability, Performance, Security, Scalability, Resilience, Maintainability)
- [ ] Crear `tech-stack-decisions.md`

## Preguntas de Aclaración

### Question 1 — Migración de esquema: riesgo asumido
La migración de `supabase/schema.sql` para esta unidad es puramente **aditiva** (tabla `purchases` nueva + columna `products.purchase_id` nueva, nullable) — a diferencia de la Unidad 6, que sí eliminaba una columna existente (`quantity`). No hay pérdida de datos posible en esta migración. ¿Confirmas que no hace falta ninguna decisión adicional de riesgo aquí (a diferencia de Unidad 6)?

A) Confirmado, migración puramente aditiva, sin riesgo de pérdida de datos.

B) Quiero añadir algo más sobre la migración (descríbelo en "Other").

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Volumen esperado y límites de consulta
La lista de historial carga tickets de 20 en 20 (con join completo a sus productos, Q3=B de Functional Design) y, al filtrar, hasta 2000 productos (mismo límite `FILTERED_FETCH_LIMIT` ya existente). Dado que la app es de uso personal (2 usuarios, mismo criterio que el resto del proyecto), ¿confirmas que no hace falta ningún límite/paginación adicional a nivel de productos por ticket (ej. un ticket con cientos de productos en una sola compra es un caso extremo que no necesita protección especial)?

A) Confirmado, sin límite adicional — un ticket normal tiene pocos productos (compra de la pareja), no hace falta proteger ese caso extremo.

B) Quiero un límite defensivo también sobre productos por ticket (descríbelo en "Other").

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3 — RLS de la tabla `purchases`
NFR-11 (Requirements Analysis) ya estableció que `purchases` sigue el mismo modelo RLS permisivo que `products`/`households` (sin autenticación propia, aislamiento por UUID no adivinable del household, excepción SECURITY-08 ya aceptada para el proyecto). ¿Confirmas que no hace falta revisitar esa decisión en esta fase?

A) Confirmado, mismo RLS permisivo, sin revisión adicional.

B) Quiero reconsiderar el modelo de seguridad para `purchases` específicamente (descríbelo en "Other").

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4 — Tech stack
No se introduce ninguna librería, API del navegador nueva, ni dependencia nueva de `package.json` — se reutiliza Supabase (tabla + FK + RLS), vanilla JS/CSS y los componentes comunes ya existentes (`modal.js`, `confirm-modal.js`, `pagination.js`, `optimistic.js`). ¿Confirmas que no hace falta ninguna decisión de stack nueva?

A) Confirmado, sin cambios de stack.

B) Quiero considerar algo distinto (descríbelo en "Other").

C) Other (please describe after [Answer]: tag below)

[Answer]: A
