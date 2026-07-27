# Historial en Tickets — Preguntas de Aclaración

Contexto: hoy el historial (Unidad 3) muestra una lista plana de productos con `status = 'bought'`. Todas las acciones de "marcar como comprado" ya pasan por la barra de selección en lote (`selection-bar.js`), que actualiza todos los productos seleccionados con el **mismo** `bought_at` en una sola operación — así que cada acción de "Comprados" ya representa, de forma implícita, una única compra.

Quieres agrupar esas compras en **tickets**: cada ticket es una compra completa, con su propio modal de detalle, y se puede deshacer o eliminar como unidad.

Por favor responde cada pregunta rellenando la letra tras `[Answer]:`.

## Question 1
¿Cómo debe modelarse un "ticket" a nivel de datos?

A) Nueva tabla `purchases` (id, household_id, bought_by, bought_at) + columna `purchase_id` en `products`. Es un cambio de esquema real, pero da integridad sólida: deshacer/eliminar el ticket es una operación clara sobre un id concreto, sin depender de que los timestamps coincidan exactamente.

B) Sin nueva tabla: agrupar en el frontend los productos comprados que comparten exactamente el mismo `bought_at`. Cero migración de esquema, pero es frágil (si en el futuro dos acciones distintas coinciden al milisegundo, o si algún flujo cambia el timestamp, se romperían los grupos).

C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 2
Ya existen compras en el historial de antes de este cambio (productos con `status = 'bought'` pero sin ningún ticket asociado). ¿Qué hacemos con ellas?

A) Migración retroactiva: agrupar los productos existentes por `household_id` + `bought_at` exacto y crear un ticket por cada grupo, para que también aparezcan como tickets en el nuevo historial.

B) Dejarlos fuera del nuevo modelo de tickets: seguirían siendo visibles en el historial como entradas sueltas (no agrupadas), y solo las compras nuevas a partir de ahora generan tickets.

C) No importa / no hay datos reales que preservar todavía (puedo borrar el historial actual sin problema).

D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 3
Dentro del modal de un ticket, además de "deshacer todo el ticket" y "eliminar todo el ticket", ¿quieres poder actuar sobre un producto individual del ticket (por ejemplo, desmarcar o eliminar solo ese producto, dejando el resto del ticket intacto)?

A) No — el ticket se trata siempre como unidad. Deshacer/eliminar afecta a todos sus productos a la vez. Dentro del modal solo se lista el detalle (nombre, cantidad) de cada producto, sin acciones por producto.

B) Sí — dentro del modal, cada producto individual también tiene sus propios botones de "desmarcar" y "eliminar", igual que hoy en el historial plano, además de las acciones a nivel de ticket completo.

C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 4
¿Qué debe mostrar cada ticket en la lista principal del historial (antes de abrir el modal)?

A) Fecha y hora de la compra + quién la marcó como comprada + número de productos (ej. "27/07/2026 18:30 · María · 5 productos"). El detalle de productos solo se ve al abrir el modal.

B) Lo mismo que A, más una vista previa de los primeros 2-3 nombres de producto (ej. "Leche, Pan, Huevos y 2 más").

C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 5
Los filtros actuales son por nombre de producto y por rango de fechas, aplicados sobre productos individuales. Al pasar a tickets, ¿cómo debe comportarse el filtro por nombre?

A) Un ticket aparece en los resultados si **al menos uno** de sus productos coincide con el nombre buscado (el ticket se muestra completo, con todos sus productos, no solo el que coincide).

B) Un ticket aparece solo si **todos** sus productos coinciden con el nombre buscado.

C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 6
El filtro por rango de fechas se aplicaría sobre la fecha del ticket (`bought_at` de la compra). ¿Confirmas que el comportamiento debe seguir siendo el mismo que hoy (mismo rango, mismos inputs de fecha, "Limpiar filtros"), solo que ahora filtra tickets en vez de productos sueltos?

A) Sí, confirmado — misma UI de filtros, mismo comportamiento, solo cambia que ahora filtra/devuelve tickets.

B) No, quiero cambiar algo en los filtros (describe qué en "Other").

C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 7
La vista de historial pagina de 20 en 20 cuando no hay filtro activo, y carga hasta 2000 resultados sin paginar cuando hay un filtro activo (igual que hoy). Al pasar a tickets, ¿la unidad de paginación/límite pasa a ser el ticket (20 tickets por página, hasta 2000 tickets al filtrar) en vez del producto?

A) Sí — pagina/limita por ticket, no por producto individual.

B) No — quiero que siga limitando por número de productos, no de tickets (describe el motivo en "Other" si lo eliges).

C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 8
Las estadísticas (Unidad 3, `stats-page.js`/`calculations.js`) calculan el ranking de productos más comprados directamente sobre la tabla `products` con `status = 'bought'`. Al introducir la tabla `purchases`, ¿confirmas que las estadísticas NO deben cambiar (siguen contando por producto individual, no por ticket)?

A) Confirmado, las estadísticas se quedan igual (por producto), sin relación con el número de tickets.

B) No, también quiero cambiar algo en estadísticas (descríbelo en "Other").

C) Other (please describe after [Answer]: tag below)

[Answer]: A
