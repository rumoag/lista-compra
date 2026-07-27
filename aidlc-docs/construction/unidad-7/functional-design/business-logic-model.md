# Business Logic Model — Unidad 7: Historial en Tickets

## Flujo 1: Marcar como comprados → crear ticket (BR-50)
1. Usuario selecciona uno o varios productos pendientes y pulsa "Comprados" (`selection-bar.js`, sin cambios de UI).
2. `product-list.js` construye el timestamp único (`new Date().toISOString()`) como hoy.
3. Operación optimista: (a) `insert` en `purchases` (`household_id`, `bought_by`, `bought_at`) devolviendo el `id` generado; (b) `update products set status='bought', bought_by=..., bought_at=..., purchase_id=<id del paso a>` `.in('id', ids)`.
4. Si (a) o (b) falla, se revierte la vista local (mismo patrón `applyOptimistic` ya existente) y se muestra el error genérico.

## Flujo 2: Cargar la lista de historial (sin filtro activo)
1. Se consulta `purchases` del household, orden `bought_at desc`, página de 20, con sus `products` asociados vía join completo (Q3=B) — cada `purchase` cargado ya trae el array de sus productos.
2. Antes de pasar cada `purchase` al paginador, se le copia `bought_at` a una propiedad local `created_at` (BR-57) para reutilizar `common/pagination.js` sin modificarlo.
3. Cada fila de la lista se pinta con: fecha/hora, `bought_by`, número de productos (`purchase.products.length`, BR-55).
4. Scroll/botón "Cargar más" reutiliza `paginator.loadNextPage` (mismo patrón que hoy).

## Flujo 3: Abrir el modal de un ticket
1. Click en una fila de la lista → `openModal({ title: fecha formateada })`, cuerpo poblado con los productos ya cargados en memoria para ese `purchase` (Q3=B, sin segunda consulta).
2. Se pinta cada producto con nombre + cantidad + botones "Desmarcar"/"Eliminar" (BR-53), y en el pie del modal los botones "Deshacer ticket" / "Eliminar ticket" (BR-51/BR-52).

## Flujo 4: Deshacer ticket completo (BR-51)
1. Click en "Deshacer ticket" → `openConfirmModal` (Q2=A) con mensaje "¿Deshacer esta compra? Los N productos volverán a la lista de pendientes.".
2. Al confirmar: optimista → (a) `update products` de todos los productos del ticket a `pending`/`bought_by=null`/`bought_at=null`/`purchase_id=null`; (b) `delete from purchases where id = ticket.id`.
3. Se retira el ticket de la lista de historial y se cierra el modal de detalle; si falla, se revierte y se muestra error genérico.

## Flujo 5: Eliminar ticket completo (BR-52)
1. Click en "Eliminar ticket" → `openConfirmModal` con mensaje "¿Eliminar esta compra? Se eliminarán permanentemente los N productos.".
2. Al confirmar: optimista → `delete from purchases where id = ticket.id` (cascade elimina los productos, BR-52).
3. Se retira el ticket de la lista de historial y se cierra el modal; si falla, se revierte y se muestra error genérico.

## Flujo 6: Acción individual dentro del modal + limpieza de huérfano (BR-53/BR-54)
1. Click en "Desmarcar" o "Eliminar" de un producto dentro del modal → operación optimista directa (mismo `handleUnmark`/`handleDeleteFromHistory` de hoy, adaptados para incluir `purchase_id = null` en el caso de desmarcar).
2. Tras la operación, el cliente recalcula la lista de productos restantes del ticket abierto en el modal.
3. Si quedan 0 productos: se dispara `delete from purchases where id = ticket.id` y se cierra el modal automáticamente.
4. Si quedan ≥1: el modal se re-renderiza con la lista actualizada, y la fila del ticket en la lista de historial (fondo) actualiza su conteo de productos.

## Flujo 7: Filtrar el historial (BR-56)
1. Al cambiar cualquier filtro (nombre y/o fecha), se consultan hasta 2000 `products` con `status = 'bought'` del household (mismo `FILTERED_FETCH_LIMIT`).
2. Se aplican `filterByName`/`filterByDateRange` sin cambios sobre ese array.
3. Se deriva el conjunto de `purchase_id` distintos presentes en el resultado filtrado.
4. Se muestran los tickets correspondientes a esos `purchase_id`, completos (todos sus productos, no solo los que matchean), ordenados por `bought_at desc`, sin paginar (BR-57).
5. "Limpiar filtros" vuelve al modo paginado del Flujo 2.

## Flujo 8: Historial en vivo (BR-59)
1. Al entrar en la vista de historial (modo paginado, sin filtro activo), se suscribe un canal Realtime a `purchases` del household (misma mecánica que `bulk-actions/realtime-subscription.js`, generalizada para aceptar la tabla como parámetro).
2. Evento INSERT remoto (el otro usuario marcó productos como comprados): si el ticket no está ya en la lista local, se antepone (`paginator.prependItem`) con sus productos (se incluyen en el propio payload del evento vía los datos ya insertados, o se completan con una consulta puntual a `products` filtrando por ese `purchase_id` si el payload no trae el detalle).
3. Evento DELETE remoto (el otro usuario deshizo o eliminó un ticket): si el ticket está en la lista local, se retira (`paginator.removeItem`); si el modal de ese ticket está abierto en este dispositivo, se cierra automáticamente y se muestra el mensaje "Esta compra fue modificada desde otro dispositivo.".
4. Al activar un filtro, la suscripción se mantiene pero sus eventos se ignoran mientras el modo filtrado está activo (BR-59); al limpiar el filtro, se vuelve a aplicar sobre la lista paginada normalmente.
5. Al salir de la vista de historial, se desuscribe el canal (mismo patrón `cleanup()` que Unidad 2).

## Testable Properties (candidatas a PBT si aplica PBT-03)
- **Invariante de creación de ticket (BR-50)**: para cualquier selección no vacía de productos marcados como comprados, se crea exactamente un `purchase` y todos los productos de esa selección terminan con el mismo `purchase_id` no nulo.
- **Invariante de huérfano (BR-54)**: después de cualquier secuencia de acciones individuales dentro de un modal de ticket, si el número de productos restantes del ticket es 0, el registro de `purchases` correspondiente no existe.
- **Invariante de filtro por nombre (BR-56)**: para cualquier `nameQuery`, todo ticket mostrado en el resultado filtrado tiene al menos un producto cuyo nombre coincide con `nameQuery`; ningún ticket mostrado en el resultado filtrado tiene 0 productos coincidentes.
- **Invariante de conteo (BR-55)**: el número de productos mostrado en la lista para un ticket es siempre igual a `purchase.products.length`, independientemente de si hay un filtro activo.
