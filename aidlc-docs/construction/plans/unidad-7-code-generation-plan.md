# Plan de Code Generation — Unidad 7: Historial en Tickets

## Contexto de la unidad
- **Cubre**: agrupación del historial en tickets (Ciclo 2, mejora sobre Unidad 3), con modal de detalle, deshacer/eliminar ticket completo, acciones individuales, filtros reutilizados, paginación por ticket e historial en vivo (BR-59).
- **Dependencias**: Unidad 1 (`products`, `common/supabase-client.js`), Unidad 2 (`bulk-actions/realtime-subscription.js`, `common/optimistic.js`), Unidad 3 (`history/filters.js`, `history/history-filters.js`), Unidad 5/6 (`common/modal.js`, `common/confirm-modal.js`, `common/pagination.js`).
- **Entidades propias**: tabla `purchases` (nueva) + `products.purchase_id` (nueva).
- **Fuera de esta unidad**: cualquier otra pantalla del rediseño; estadísticas (sin cambios, BR-58).

## Pasos

1. [x] **Migración de esquema** — `supabase/schema.sql`: tabla `purchases` (domain-entities.md) + RLS permisiva + columna `products.purchase_id` (FK `on delete cascade`) + índice de paginación (`purchases(household_id, bought_at desc)`) + `alter publication supabase_realtime add table purchases` (BR-59)

2. [x] **`common/realtime-subscription.js`** (nuevo, generaliza `bulk-actions/realtime-subscription.js` con parámetro `table`) + test movido/actualizado en `tests/common/realtime-subscription.test.js`
3. [x] **Eliminar `bulk-actions/realtime-subscription.js`** y su test antiguo; actualizar el import en `list/product-list.js` (`table: 'products'`)

4. [x] **`list/product-list.js`** — `handleMarkAsBought` crea el registro en `purchases` (insert) y asigna `purchase_id` a los productos seleccionados en la misma operación optimista (BR-50) + test actualizado

5. [x] **`history/ticket-product-row.js`** (nuevo) — fila de producto dentro del modal (nombre + cantidad + Desmarcar/Eliminar, BR-53) + tests
6. [x] **`history/ticket-row.js`** (nuevo) — fila de la lista de historial (fecha/hora + quién + número de productos, BR-55) + tests
7. [x] **`history/ticket-modal.js`** (nuevo) — modal de detalle: lista de `ticket-product-row.js`, Deshacer ticket (BR-51) y Eliminar ticket (BR-52) con confirmación, limpieza de huérfano (BR-54) + tests
8. [x] **`history/history-list.js`** (reescrito) — lista de tickets (join completo, Q3=B), paginación con alias `created_at` (BR-57), filtrado derivando `purchase_id` (BR-56), historial en vivo (BR-59), apertura de `ticket-modal.js` + tests (nuevo `tests/history/history-list.test.js`, mismo patrón de query-builder mockeado que `product-list.test.js`)

9. [x] **`css/style.css`** — estilos de fila de ticket (reutilizando `.product-item`/`.card` existentes) y pie de acciones del modal de ticket

10. [x] **Documentación** — resumen en `aidlc-docs/construction/unidad-7/code/`, nota de migración en `README.md`

## Trazabilidad
Cubre FR-18 a FR-23 y NFR-9 a NFR-11 de `requirements.md` (Ciclo 2 — Historial en Tickets), BR-50 a BR-59 de `functional-design/business-rules.md` (Unidad 7).

## Nota sobre cobertura de test
A diferencia de la nota original de Unidad 3 ("`history-list.js` sin test unitario dedicado"), esta reescritura introduce lógica de negocio sustancial (agrupación, huérfanos, filtrado derivado, realtime) que justifica un test dedicado, con el mismo patrón de query-builder mockeado que ya se usa en `tests/list/product-list.test.js`.
