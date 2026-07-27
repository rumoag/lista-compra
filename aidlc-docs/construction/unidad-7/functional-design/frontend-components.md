# Frontend Components — Unidad 7: Historial en Tickets

## Componentes reescritos

### `history/history-list.js` (reescrito)
- **Responsabilidad**: pasa de listar productos individuales a listar **tickets** (`purchase` + sus `products`, join completo, Q3=B).
- Construye cada `purchase` con una copia de `bought_at` en `created_at` (BR-57) antes de pasarlo a `common/pagination.js` (que no se modifica).
- Pinta cada fila con `history/ticket-row.js` (nuevo).
- Al hacer click en una fila, abre `history/ticket-modal.js` (nuevo) con el `purchase` ya cargado en memoria.
- Filtrado (Flujo 7): sigue orquestando `history/history-filters.js` (sin cambios) y `history/filters.js` (sin cambios, Q6=A) sobre productos; deriva los `purchase_id` a mostrar.
- Estado vacío: mismo patrón que hoy ("Aún no hay compras registradas." / "No hay resultados para el filtro aplicado."), ahora referido a tickets.
- Historial en vivo (Flujo 8, BR-59): se suscribe a `common/realtime-subscription.js` con `table: 'purchases'` mientras el modo paginado está activo; ignora eventos mientras hay un filtro activo; desuscribe en `cleanup()`.

### `history/history-filters.js`
- **Sin cambios** (Q6=A) — misma UI, mismo `onChange({ nameQuery, dateFrom, dateTo })`.

### `history/filters.js`
- **Sin cambios** (Q6=A) — `filterByName`/`filterByDateRange` se siguen aplicando sobre productos individuales.

## Componentes generalizados

### `common/realtime-subscription.js` (movido y generalizado desde `bulk-actions/realtime-subscription.js`)
- **Motivo** (BR-59): la Unidad 7 necesita el mismo mecanismo de suscripción INSERT/DELETE, pero sobre `purchases` en vez de `products`. Se generaliza a `createRealtimeSubscription({ householdId, table })`, con `table` como parámetro (antes hardcodeado a `'products'`).
- **`bulk-actions/realtime-subscription.js` se elimina**; `list/product-list.js` pasa a importar `common/realtime-subscription.js` con `table: 'products'`, sin cambio de comportamiento visible.

## Componentes nuevos

### `history/ticket-row.js`
- **Responsabilidad**: fila de la lista principal de historial — fecha/hora formateada, `bought_by`, número total de productos (BR-55). Click invoca `onOpen(purchase)`.
- **Props**: `purchase` (`{ id, bought_by, bought_at, products: [...] }`), callback `onOpen`.

### `history/ticket-modal.js`
- **Responsabilidad**: abre `common/modal.js` con el detalle del ticket.
  - Cuerpo: lista de productos (nombre + cantidad) vía `history/ticket-product-row.js` (nuevo), cada uno con botones "Desmarcar"/"Eliminar" (BR-53).
  - Pie: botones "Deshacer ticket" (BR-51) y "Eliminar ticket" (BR-52), ambos abriendo `common/confirm-modal.js` (Q2=A) antes de ejecutar.
  - Tras cada acción individual, recalcula productos restantes (BR-54) y, si llega a 0, borra el `purchase` huérfano y cierra el modal (`close()` de `common/modal.js`).
- **Props**: `purchase`, callbacks `onTicketChanged` (para refrescar/retirar la fila en `history-list.js`) y `onTicketRemoved` (ticket deshecho/eliminado/vaciado).

### `history/ticket-product-row.js`
- **Responsabilidad**: fila de producto dentro del modal — nombre + cantidad + botones "Desmarcar"/"Eliminar" (sin fecha/quién, ya mostrados a nivel de ticket, Q10=A).
- **Props**: `product`, callbacks `onUnmark(id)`, `onDelete(id)`.

## Cambios en `supabase/schema.sql`
- Nueva tabla `purchases` (`domain-entities.md`).
- Nueva columna `products.purchase_id` con FK `on delete cascade` hacia `purchases(id)` (BR-52).
- RLS de `purchases`: mismo patrón permisivo que `products`/`households` (NFR-11).

## Sin cambios
- `stats/stats-page.js`, `stats/calculations.js` (FR-23/BR-58).
- `bulk-actions/selection-bar.js`, `list/product-list.js` (la creación del ticket, BR-50, se añade dentro del `remoteOperation` existente de "Marcar como comprados", sin cambios de UI).
- `common/modal.js`, `common/confirm-modal.js`, `common/pagination.js`, `common/optimistic.js` (reutilizados tal cual).
