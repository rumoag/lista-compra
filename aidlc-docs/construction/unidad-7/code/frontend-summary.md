# Frontend Summary — Unidad 7: Historial en Tickets

## Migración de esquema
- **Modificado**: `supabase/schema.sql` — tabla `purchases` (FK a `households`), RLS permisiva, columna `products.purchase_id` (FK `on delete cascade`), índice de paginación (`purchases(household_id, bought_at desc)`), `alter publication supabase_realtime add table purchases`. Migración puramente aditiva (NFR-9), sin pérdida de datos.

## Generalización de Realtime
- **Creado**: `src/common/realtime-subscription.js` (generaliza `src/bulk-actions/realtime-subscription.js` con el parámetro `table`).
- **Eliminado**: `src/bulk-actions/realtime-subscription.js` y su test antiguo.
- **Modificado**: `src/list/product-list.js` (import actualizado, `table: 'products'`).

## Creación de ticket al marcar como comprados (BR-50)
- **Modificado**: `src/list/product-list.js` (`handleMarkAsBought` inserta en `purchases` y enlaza los productos seleccionados con `purchase_id`, en la misma operación optimista).

## Componentes nuevos de historial
- **Creado**: `src/history/ticket-row.js` — fila de la lista principal (fecha/hora, quién, número de productos, BR-55).
- **Creado**: `src/history/ticket-product-row.js` — fila de producto dentro del modal (BR-53).
- **Creado**: `src/history/ticket-modal.js` — modal de detalle: acciones individuales (BR-53), limpieza de huérfano (BR-54), Deshacer ticket (BR-51) y Eliminar ticket (BR-52) con confirmación.
- **Modificado (reescrito)**: `src/history/history-list.js` — lista de tickets (join completo), paginación con alias `created_at→bought_at` (BR-57), filtrado derivando `purchase_id` de productos coincidentes (BR-56), historial en vivo (BR-59).
- **Sin cambios**: `src/history/history-filters.js`, `src/history/filters.js` (Q6=A).

## Scroll infinito (BR-60, seguimiento post-aprobación)
- **Modificado**: `src/history/history-list.js` — sustituye el botón "Cargar más" por un centinela + `IntersectionObserver`, mismo patrón que `list/product-list.js` (BR-48); no se dispara mientras hay un filtro activo (BR-56/BR-57 siguen aplicando).
- **Modificado**: `tests/history/history-list.test.js` — `FakeIntersectionObserver` (mismo patrón que `tests/list/product-list.test.js`) y tests de scroll infinito automático/manual y de que no se dispara con filtro activo.

## CSS
- **Modificado**: `css/style.css` — `.ticket-row-open-area` (área clicable de la fila) y separador entre productos dentro del modal de ticket.

## Tests
- **Creado**: `tests/common/realtime-subscription.test.js` (movido/actualizado desde `tests/bulk-actions/realtime-subscription.test.js`, con casos nuevos para el parámetro `table`).
- **Eliminado**: `tests/bulk-actions/realtime-subscription.test.js`.
- **Modificado**: `tests/list/product-list.test.js` (import actualizado + test nuevo de creación de ticket, BR-50).
- **Creado**: `tests/history/ticket-row.test.js`, `tests/history/ticket-product-row.test.js`, `tests/history/ticket-modal.test.js`.
- **Creado**: `tests/history/history-list.test.js` — a diferencia de la nota de cobertura original de Unidad 3, esta reescritura sí recibe test unitario dedicado (mismo patrón de query-builder mockeado que `product-list.test.js`), dada la lógica de negocio sustancial que introduce (agrupación, huérfanos, filtrado derivado, Realtime).

## Documentación
- **Modificado**: `README.md` (estado actual, nota de migración ampliada a Unidad 7, estructura del proyecto, referencia a Realtime sobre `purchases`).

## Iconos en acciones individuales (BR-61, seguimiento post-aprobación)
- **Modificado**: `src/history/ticket-product-row.js` — "Desmarcar"/"Eliminar" pasan de botones de texto a `icon-button` (↩️/🗑️), mismo patrón que `bulk-actions/selection-bar.js`. Sin cambios de comportamiento ni de tests (no aserta contenido textual de los botones).

## Estética de ticket físico (BR-62, seguimiento post-aprobación)
- **Modificado**: `src/history/ticket-modal.js` — el cuerpo del modal se reestructura como un ticket de compra (papel, monoespaciado, cabecera centrada, líneas discontinuas, total, código de barras decorativo, bordes dentados), sin cambios de comportamiento ni de tests (mismos `data-testid`).
- **Modificado**: `css/style.css` — nuevas clases `.receipt`/`.receipt-*` (color de papel fijo, independiente del tema claro/oscuro de la app, a propósito).
- Verificado visualmente con una página de prueba temporal (Browser pane), luego eliminada.

## Verificación
`npm test`: 216/216 tests pasan. `npm run build`: verificado con variables de entorno de prueba (`SUPABASE_URL`/`SUPABASE_ANON_KEY`).
