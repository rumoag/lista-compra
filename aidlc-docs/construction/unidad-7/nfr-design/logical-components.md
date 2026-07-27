# Logical Components — Unidad 7: Historial en Tickets

**Decisión (Question 2 = A)**: sin componentes de infraestructura nuevos (sin colas, sin caché, sin circuit breakers) — llamadas directas a Supabase, mismo criterio que el resto del proyecto.

## `history/ticket-row.js`
Componente de presentación puro, sin acceso a datos propio — recibe el `purchase` (con sus `products` ya cargados) y un callback `onOpen`.

## `history/ticket-modal.js`
Usa `common/modal.js` y `common/confirm-modal.js` (deshacer/eliminar ticket completo). Escribe directamente contra `supabase-client.js` (update/delete sobre `products` y `purchases`), mismo patrón `applyOptimistic` que el resto del proyecto. Orquesta `history/ticket-product-row.js` para cada producto.

## `history/ticket-product-row.js`
Componente de presentación puro — recibe `product` y callbacks `onUnmark`/`onDelete`; no accede a datos directamente (las escrituras las hace `ticket-modal.js`).

## `history/history-list.js` (reescrito)
Orquesta todo: `common/pagination.js` (con el alias `created_at`, BR-57), `history/history-filters.js` + `history/filters.js` (sin cambios) para derivar `purchase_id` a mostrar, `common/realtime-subscription.js` (`table: 'purchases'`, BR-59) y `history/ticket-modal.js` al abrir un ticket.

## `common/realtime-subscription.js` (generalizado desde `bulk-actions/realtime-subscription.js`)
Sin dependencias de datos propias más allá de `common/supabase-client.js`; ahora parametrizado por `table` para servir tanto a `list/product-list.js` (`table: 'products'`) como a `history/history-list.js` (`table: 'purchases'`).

## Diagrama de dependencias (nuevas relaciones de esta unidad)

```
history/history-list.js
  ├─ common/pagination.js (sin cambios, cursor = created_at alias de bought_at)
  ├─ history/history-filters.js (sin cambios)
  ├─ history/filters.js (sin cambios)
  ├─ common/realtime-subscription.js (table: 'purchases', BR-59)
  ├─ history/ticket-row.js
  └─ history/ticket-modal.js
       ├─ common/modal.js
       ├─ common/confirm-modal.js (deshacer/eliminar ticket completo)
       ├─ common/optimistic.js
       └─ history/ticket-product-row.js

list/product-list.js
  └─ common/realtime-subscription.js (table: 'products', generalizado desde bulk-actions/realtime-subscription.js)
```
