# Code Generation Plan — Unidad 1: Fundaciones

## Contexto de la unidad
- **Historias implementadas**: US-1.1, US-1.3, US-1.4 (completas); US-1.2 (parcial, sin Realtime — se completa en Unidad 2); stopgaps de US-5.1 y US-5.2 (versión mínima, se pulen en Unidad 4)
- **Dependencias**: ninguna (primera unidad)
- **Entidades de datos propias**: `households`, `products` (esquema completo, ver `domain-entities.md`)
- **Estructura de código**: por módulo/feature, según `unit-of-work.md` (aprobado en Units Generation) — **no** se usa el patrón genérico `src/{unit-name}/` de `code-generation.md`, ya que el propio proyecto ya definió y aprobó una estructura por feature en Inception.

## Estructura de directorios (workspace root)
```
lista-compra/
  index.html
  package.json
  vercel.json
  .env.example
  .gitignore
  src/
    common/
      supabase-client.js
      validation.js
      optimistic.js
      pagination.js
    list/
      product-form.js
      product-list.js
      product-item.js
    onboarding/
      name-prompt.js        (stopgap, se sustituye en Unidad 4)
      create-household.js   (versión mínima, se pule en Unidad 4)
  css/
    style.css
  supabase/
    schema.sql
  tests/
    common/
      validation.test.js
      optimistic.test.js
      pagination.test.js
```

## Pasos de generación

- [x] **Step 1 — Project Structure Setup**: crear `package.json` (deps: `@supabase/supabase-js`; devDeps: `vitest`, `fast-check`), `.gitignore`, `.env.example`, esqueleto de carpetas.
- [x] **Step 2 — Database Migration Script**: crear `supabase/schema.sql` con tablas `households`/`products`, constraints `CHECK` (BR-1, BR-2), políticas RLS permisivas (Question 1 de NFR Design), índices necesarios para paginación por `created_at`.
- [x] **Step 3 — Business Logic Generation**: crear `src/common/supabase-client.js`, `src/common/validation.js` (`validateProductName`, `validateQuantity`, `validateCategory`), `src/common/optimistic.js`, `src/common/pagination.js`.
- [x] **Step 4 — Business Logic Unit Testing**: crear `tests/common/validation.test.js` (PBT con fast-check para PBT-02/03/07/08/09 + tests de ejemplo para casos límite, PBT-10), `tests/common/optimistic.test.js`, `tests/common/pagination.test.js` (Vitest).
- [x] **Step 5 — Business Logic Summary**: resumen en `aidlc-docs/construction/unidad-1/code/business-logic-summary.md`.
- [x] **Step 6 — API/Repository Layer**: **N/A** — no hay capa de API/repositorio propia; el cliente Supabase (`supabase-client.js`, Step 3) actúa como única puerta de acceso a datos, ya cubierto.
- [x] **Step 7 — Frontend Components Generation**: crear `index.html`, `css/style.css`, `src/list/product-form.js`, `src/list/product-list.js`, `src/list/product-item.js`, `src/onboarding/name-prompt.js` (stopgap), `src/onboarding/create-household.js` (mínimo).
- [x] **Step 8 — Frontend Components Unit Testing**: crear tests de comportamiento del formulario (validación inline) y de la lista (paginación/render), usando Vitest + jsdom.
- [x] **Step 9 — Frontend Components Summary**: resumen en `aidlc-docs/construction/unidad-1/code/frontend-summary.md`.
- [x] **Step 10 — Documentation Generation**: crear/actualizar `README.md` (setup local, variables de entorno, cómo correr tests, cómo desplegar).
- [x] **Step 11 — Deployment Artifacts Generation**: crear `vercel.json` (cabeceras de seguridad SECURITY-04).

## Trazabilidad de historias
| Historia | Step(s) que la implementan |
|---|---|
| US-1.1 — Añadir producto | Step 3, 7 |
| US-1.2 — Ver lista en tiempo real (parcial: carga inicial + paginación, sin Realtime) | Step 3, 7 |
| US-1.3 — Editar producto pendiente | Step 3, 7 |
| US-1.4 — Eliminar producto pendiente | Step 3, 7 |
| US-5.1 (stopgap) — Nombre local | Step 7 (`name-prompt.js`) |
| US-5.2 (stopgap mínimo) — Crear household | Step 7 (`create-household.js`) |

**Nota**: los tests se generan en esta etapa pero se **ejecutan** en la etapa de Build and Test (tras completar todas las unidades o al final de cada unidad, según se decida en esa etapa).
