# Infrastructure Design — Unidad 7: Historial en Tickets

## Deployment Environment
**Decisión (Question 1 = A)**: sin cambios — Vercel (producción + previews) + mismo proyecto Supabase único.

## Compute Infrastructure
N/A — sin backend propio.

## Storage Infrastructure
Migración aditiva sobre `supabase/schema.sql`: nueva tabla `purchases` (FK a `households`) + nueva columna `products.purchase_id` (FK a `purchases`, `on delete cascade`), vía SQL versionado, mismo patrón que unidades anteriores.

## Messaging Infrastructure
**Decisión (Question 3 original = B, resuelta con la aclaración = A)**: `purchases` se añade a `supabase_realtime` (misma publicación ya usada por `products` desde Unidad 2). Alcance completo (BR-59): INSERT y DELETE de `purchases` se reflejan en vivo en la vista de historial mientras está abierta y sin filtro activo, reutilizando `common/realtime-subscription.js` (generalizado, ver `functional-design/frontend-components.md`) con `table: 'purchases'`.

## Networking Infrastructure
N/A — sin nuevos orígenes externos, CSP existente sigue siendo válida.

## Monitoring Infrastructure
N/A — mismo criterio que unidades anteriores.

## Shared Infrastructure
N/A — mismo proyecto Supabase/Vercel único ya compartido.
