# Business Logic Summary — Unidad 1: Fundaciones

## Archivos generados

- **Created**: `src/common/supabase-client.js` — instancia única del cliente Supabase, configurada vía `config.generated.js` (generado en build time, ver `scripts/generate-config.js`).
- **Created**: `src/common/validation.js` — `validateProductName`, `validateQuantity`, `validateCategory`, `normalizeWhitespace` (BR-1, BR-2).
- **Created**: `src/common/optimistic.js` — `applyOptimistic` (BR-6, fail-fast sin reintentos).
- **Created**: `src/common/pagination.js` — `createPaginator` (paginación por cursor sobre `created_at`).
- **Created**: `supabase/schema.sql` — esquema completo (`households`, `products`), constraints `CHECK` para BR-1/BR-2, RLS permisivo, índice para paginación.
- **Created**: `scripts/generate-config.js` — genera `src/common/config.generated.js` desde variables de entorno en build time.

## Tests generados

- **Created**: `tests/common/validation.test.js` — PBT con `fast-check` (invariantes de aceptación/rechazo, determinismo, idempotencia de `normalizeWhitespace`) + tests de ejemplo para casos límite (vacío, 50/51 caracteres, acentos, puntuación no permitida). Cubre PBT-02/03/07/08/09 (bloqueantes en modo parcial) y PBT-10.
- **Created**: `tests/common/optimistic.test.js` — tests de ejemplo: aplicación inmediata, reversión ante fallo, sin reintentos automáticos.
- **Created**: `tests/common/pagination.test.js` — tests de ejemplo: primera página, avance de cursor, `prependItem`, `removeItem`, `reset`.

## Trazabilidad
- BR-1, BR-2 → `validation.js` + constraints en `schema.sql`
- BR-3 → FK `household_id` + RLS en `schema.sql`
- BR-5 → `status default 'pending'` + constraint en `schema.sql`
- BR-6 → `optimistic.js`
- Patrón de paginación (NFR Design) → `pagination.js`
