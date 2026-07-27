# Plan de Functional Design — Unidad 7 (Historial en Tickets)

## Pasos

- [x] Resolver preguntas de aclaración (abajo)
- [x] Crear `domain-entities.md` (entidad `Purchase`, relación con `Product`)
- [x] Crear `business-rules.md` (BR-50 a BR-58)
- [x] Crear `business-logic-model.md` (flujos: crear ticket al marcar comprados, deshacer ticket, eliminar ticket, acción individual dentro del ticket con limpieza de huérfanos, filtrado, paginación) + Testable Properties
- [x] Crear `frontend-components.md` (jerarquía: `history-list.js` → `ticket-row.js` → `ticket-modal.js` → `ticket-product-row.js`; reutilización de `history-filters.js`/`filters.js` sin cambios)

## Preguntas de Aclaración

### Question 1 — Paginador genérico y campo de cursor
`common/pagination.js` (`createPaginator`) hoy usa el campo `created_at` del ítem, hardcodeado, como cursor (`page[page.length - 1].created_at`). Los tickets (`purchases`) no tienen `created_at` de negocio relevante para ordenar — se ordenan por `bought_at`. ¿Cómo lo resolvemos?

A) Generalizar `createPaginator({ pageSize, cursorField })` con `cursorField` opcional (por defecto `'created_at'`, retrocompatible con los usos actuales en `product-list.js`), y usar `cursorField: 'bought_at'` para los tickets.

B) Dejar `createPaginator` intacto y, al construir cada `purchase` en el frontend, copiar `bought_at` también a una propiedad `created_at` antes de pasarlo al paginador (hack de compatibilidad, sin tocar el paginador).

C) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 2 — Confirmación antes de deshacer/eliminar un ticket completo
Hoy, en el historial plano, "Desmarcar" y "Eliminar" por producto individual **no** piden confirmación (acción optimista directa). "Eliminar seleccionados" en la lista de pendientes sí pide confirmación (`confirm-modal.js`, FR-14) porque afecta a varios productos a la vez. Deshacer/eliminar un ticket completo también afecta a varios productos a la vez. ¿Debe pedir confirmación?

A) Sí — "Deshacer ticket" y "Eliminar ticket" (dentro del modal) abren `openConfirmModal` antes de ejecutar, igual que "Eliminar seleccionados".

B) No — mismo comportamiento que las acciones individuales de hoy: optimista y directo, sin confirmación adicional (el modal del ticket ya es, en sí, un paso de revisión antes de actuar).

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3 — Carga de datos: lista de tickets vs. detalle del modal
Para pintar la lista de tickets (FR-19.2: fecha, quién, número de productos) sin cargar el detalle completo de productos hasta que se abre el modal, ¿cómo lo resolvemos?

A) La lista de tickets consulta `purchases` (con un `count` de productos vía `select('*, products(count)')` de Supabase) — ligero. El modal, al abrirse, hace una consulta aparte a `products` filtrando por `purchase_id` para el detalle completo.

B) La lista de tickets consulta `purchases` + todos sus `products` de una vez (join completo) para tener todo en memoria de entrada, y el modal solo lee de ese estado ya cargado (sin segunda consulta).

C) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 4 — Filtro por nombre: alcance del conteo mostrado en la lista
FR-19.2 dice que la lista muestra "número de productos" del ticket. Cuando hay un filtro de nombre activo (FR-22.2: ticket aparece si al menos un producto coincide, pero se muestra completo), ¿el número mostrado en la lista es el total de productos del ticket, o solo los que coinciden con el filtro?

A) Siempre el total de productos del ticket (con o sin filtro activo) — el filtro decide qué tickets aparecen, no qué se cuenta dentro de cada uno.

B) Con filtro activo, se muestra el número de productos que coinciden con el filtro (no el total).

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5 — Implementación del filtro por nombre sobre tickets
Hoy `filterByName`/`filterByDateRange` (`history/filters.js`) son funciones puras que filtran un array de productos ya cargado en memoria (hasta 2000, `FILTERED_FETCH_LIMIT`). Para tickets, el filtro por nombre debe decidir "¿algún producto de este ticket coincide?". ¿Cómo lo resolvemos?

A) Cargar hasta 2000 `products` con `status = 'bought'` (como hoy) + sus `purchase_id`, aplicar `filterByName`/`filterByDateRange` en memoria sobre esos productos, derivar el conjunto de `purchase_id` que coinciden, y luego cargar/mostrar esos tickets completos (con el detalle de todos sus productos, no solo los que matchean). El filtro de fecha se aplica sobre `bought_at` del producto (que es el mismo que el de su ticket, por construcción).

B) Cargar hasta 2000 `purchases` (tickets) y, para cada uno, hacer una subconsulta de sus productos para comprobar el filtro — más consultas, pero evita cargar productos "de más".

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6 — Reutilización de `filters.js`
Dado Q5=A, las funciones puras `filterByName`/`filterByDateRange` (`history/filters.js`) pueden seguir operando sobre productos sin cambios; el resultado (productos filtrados) se usa solo para derivar qué tickets mostrar. ¿Confirmas que no hace falta tocar `filters.js`, solo añadir la lógica de "productos filtrados → tickets a mostrar" en `history-list.js`?

A) Confirmado, `filters.js` no cambia.

B) No, también quiero cambiar algo en `filters.js` (descríbelo en "Other").

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7 — Esquema: borrado en cascada de `purchases` → `products`
NFR-9 propone `on delete cascade` desde `purchases` hacia `products.purchase_id`, para que "Eliminar ticket" borre sus productos en una sola operación (`delete from purchases where id = ...`) en vez de dos pasos desde el cliente. ¿Confirmas ese diseño?

A) Sí — FK `products.purchase_id references purchases(id) on delete cascade`. "Eliminar ticket" hace un único `delete` sobre `purchases`; Supabase se encarga de borrar los productos asociados.

B) No — prefiero que el cliente borre explícitamente los productos primero y el ticket después (dos operaciones), sin cascade.

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8 — "Deshacer ticket": operación en el cliente
FR-20.1 dice que "Deshacer ticket" revierte todos los productos a `pending` (`purchase_id = null`, `bought_by = null`, `bought_at = null`) y borra el registro de `purchases`. Como no hay cascade para este caso (los productos no se borran, se actualizan), ¿confirmas que son dos operaciones desde el cliente: (1) `update products set ... where purchase_id = X`, (2) `delete from purchases where id = X`, en ese orden?

A) Sí, confirmado, en ese orden (actualizar productos primero, borrar el ticket después).

B) Prefiero otro orden o enfoque (descríbelo en "Other").

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9 — Ticket huérfano por acciones individuales (FR-21.2)
Cuando dentro del modal se desmarca/elimina el último producto de un ticket uno a uno, hay que borrar el registro de `purchases` huérfano y cerrar el modal. ¿Quién decide que el ticket quedó vacío?

A) El cliente, tras cada acción individual dentro del modal, recalcula localmente cuántos productos le quedan al ticket (a partir de la lista ya cargada en el modal); si llega a 0, dispara `delete from purchases where id = X` y cierra el modal.

B) Se implementa como trigger/función en Supabase (a nivel de base de datos) que borra automáticamente el ticket cuando su último producto se desvincula/borra.

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10 — Reutilización del componente de fila de producto dentro del modal
Dentro del modal del ticket, cada producto individual necesita nombre, cantidad y botones "Desmarcar"/"Eliminar" (FR-21.1) — muy similar a `renderEntry` que ya existe en `history-list.js` hoy (aunque esa versión también muestra fecha/quién, que a nivel de producto individual dentro de un ticket ya no hace falta repetir, porque está a nivel de ticket). ¿Cómo lo resolvemos?

A) Nueva función de render específica para "producto dentro del modal de ticket" (sin fecha/quién, solo nombre+cantidad+acciones), vive en el nuevo módulo del modal.

B) Reutilizar/generalizar `renderEntry` de `history-list.js` con una opción para ocultar fecha/quién.

C) Other (please describe after [Answer]: tag below)

[Answer]: A
