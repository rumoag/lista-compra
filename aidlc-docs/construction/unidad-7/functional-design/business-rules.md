# Business Rules — Unidad 7: Historial en Tickets

## BR-50: Creación de ticket al marcar como comprados
- **Regla**: la acción "Marcar como comprados" (selección en lote, sin cambios en `selection-bar.js`/`product-list.js` más allá de lo descrito aquí) crea un único registro en `purchases` (`bought_by`, `bought_at` = mismo timestamp usado hoy para los productos) y asigna su `id` como `purchase_id` a todos los productos seleccionados, en la misma operación optimista.
- **Alcance**: cada acción de "Comprados" genera exactamente un ticket, sin excepción — no existe otro punto de la app donde un producto pase a `status = 'bought'`.

## BR-51: Deshacer ticket completo (FR-20.1)
- **Regla**: desde el modal, "Deshacer ticket" revierte todos los productos del ticket a `status = 'pending'`, `bought_by = null`, `bought_at = null`, `purchase_id = null`, y borra el registro de `purchases`.
- **Orden de operaciones** (Q8=A): (1) `update products` de todos los productos del ticket, (2) `delete` del registro de `purchases`.
- **Confirmación** (Q2=A): requiere `openConfirmModal` antes de ejecutar (mismo patrón que "Eliminar seleccionados", BR-42 de Unidad 6).

## BR-52: Eliminar ticket completo (FR-20.2)
- **Regla**: desde el modal, "Eliminar ticket" borra el registro de `purchases`; el `on delete cascade` de `products.purchase_id` (Q7=A) borra automáticamente todos los productos del ticket en la misma operación de base de datos.
- **Confirmación** (Q2=A): requiere `openConfirmModal` antes de ejecutar.

## BR-53: Acciones individuales dentro del modal (FR-21.1)
- **Regla**: dentro del modal, cada producto tiene sus propios botones "Desmarcar" (→ `pending`, `bought_by = null`, `bought_at = null`, `purchase_id = null`) y "Eliminar" (→ `delete` del producto), sin confirmación adicional (mismo comportamiento optimista directo que el historial plano de hoy).
- **Independencia**: estas acciones no afectan a los demás productos del mismo ticket ni requieren tocar el registro de `purchases` directamente (ver BR-54 para el caso de vaciado completo).

## BR-54: Limpieza de ticket huérfano (FR-21.2, Q9=A)
- **Regla**: tras cada acción individual dentro del modal (BR-53), el cliente recalcula localmente cuántos productos le quedan al ticket a partir de la lista ya cargada en el modal. Si llega a 0, se dispara `delete from purchases where id = X` y se cierra el modal.
- **Motivo**: un ticket sin productos no debe quedar visible en la lista de historial ni persistir en la base de datos.

## BR-55: Contenido de la lista de tickets (FR-19.2, Q4=A)
- **Regla**: cada entrada de la lista de historial muestra fecha/hora (`bought_at`), quién compró (`bought_by`) y el número **total** de productos del ticket — siempre el total, tenga o no un filtro de nombre activo (el filtro decide qué tickets aparecen, no qué se cuenta dentro de cada uno).

## BR-56: Filtro por nombre sobre tickets (FR-22.2, Q5=A, Q6=A)
- **Regla**: se reutilizan sin cambios `filterByName`/`filterByDateRange` (`history/filters.js`), aplicadas sobre el array de hasta 2000 `products` con `status = 'bought'` (mismo `FILTERED_FETCH_LIMIT` ya existente). El resultado filtrado se usa solo para derivar el conjunto de `purchase_id` a mostrar — el ticket se muestra siempre completo (con todos sus productos), no solo los que coinciden con el nombre buscado.
- **Filtro de fecha**: se aplica sobre `bought_at` del producto, que es idéntico al `bought_at` de su ticket por construcción (BR-50), así que el resultado es equivalente a filtrar por fecha del ticket.

## BR-57: Paginación/límite por ticket (FR-22.4, Q1=B)
- **Regla**: sin filtro activo, la lista de historial pagina por ticket (20 por página) reutilizando `common/pagination.js` sin modificarlo — cada objeto `purchase` construido en el frontend incluye una copia de `bought_at` en una propiedad `created_at` (alias local, solo para que el paginador existente funcione sin tocar su contrato), de forma análoga a como ya ordena por cursor en el resto de listas paginadas del proyecto.
- **Con filtro activo**: se cargan hasta 2000 productos (BR-56) sin paginar, igual que hoy.

## BR-58: Estadísticas sin cambios (FR-23.1)
- **Regla**: `stats-page.js`/`calculations.js` siguen leyendo directamente de `products` con `status = 'bought'`, por producto individual. La existencia de `purchases`/tickets no afecta al cálculo del ranking.

## BR-60: Scroll infinito en el historial (petición de seguimiento del usuario, post-aprobación)
- **Regla**: se sustituye el botón "Cargar más" por una carga automática de la siguiente página cuando un elemento centinela al final de la lista entra en el viewport (`IntersectionObserver`), mismo patrón exacto que BR-48 (Unidad 6, `list/product-list.js`). Solo aplica en modo paginado (sin filtro activo, BR-56/BR-57); mientras hay un filtro activo no se dispara ninguna carga adicional, ya que ese modo no pagina.

## BR-59: Historial en vivo (decidido en Infrastructure Design, Q1 de clarificación = A)
- **Regla**: mientras la vista de historial está abierta, se refleja en vivo cualquier cambio remoto sobre `purchases` del household — ticket nuevo (INSERT), o ticket deshecho/eliminado por el otro usuario desde su propio móvil (DELETE; no hay UPDATE de `purchases` en el diseño actual, solo INSERT/DELETE). Mismo criterio de sincronización en vivo entre los dos móviles ya aplicado a la lista de pendientes (BR-8/BR-9, Unidad 2).
- **Alcance**: solo aplica mientras el filtro está inactivo (modo paginado); con un filtro de nombre/fecha activo, el resultado ya es una instantánea recalculada en memoria (BR-56) y no se mantiene en vivo — evita reconciliar inserciones/borrados en vivo contra un filtro complejo, consistente con la ausencia de scroll infinito/paginación durante el filtrado (BR-57).
- **Idempotencia frente a ecos propios**: igual que BR-8/BR-9, insertar/quitar de la vista según el evento es una operación idempotente (un ticket ya presente no se duplica; quitar un ticket ya ausente es una no-operación).
