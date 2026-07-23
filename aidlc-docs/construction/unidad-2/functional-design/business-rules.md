# Business Rules — Unidad 2: Tiempo real y acciones en lote

## BR-8: Integración de Realtime con la lista paginada
- **Regla** (Question 1 = A): al recibir un evento Realtime `INSERT` de un producto `pending` que no está ya en la vista, se inserta al principio de la lista visible vía `paginator.prependItem`, igual que una alta local.
- Al recibir `UPDATE` que cambia `status` a `bought`, el producto se elimina de la vista de pendientes (vía `paginator.removeItem`).
- Al recibir `DELETE` de un producto presente en la vista, se elimina de la vista (`paginator.removeItem`).

## BR-9: Eventos de Realtime suscritos (Question 2 = A)
- Se suscribe a Postgres Changes sobre `products` filtrando por `household_id = <el de la URL actual>`, escuchando `INSERT`, `UPDATE` y `DELETE`.
- Los eventos originados por el propio dispositivo (ya reflejados vía optimistic update) deben ser idempotentes al aplicarse de nuevo por Realtime (ej. si el id ya está en la lista, no duplicar).

## BR-10: Selección múltiple
- **Regla**: la selección de productos (checkboxes) es un estado puramente de UI, en memoria, no persistido (BR extendida del concepto en `domain-entities.md`, Question 3 = A).
- Un producto que desaparece de la lista de pendientes (por Realtime, ej. porque el otro usuario lo marcó como comprado) debe eliminarse también de la selección local si estaba seleccionado.

## BR-11: Marcar como comprados — atomicidad lógica (Question 4 = A)
- **Regla**: la acción "Marcar como comprados" sobre N productos seleccionados se trata como una única operación optimista: se aplican todos los cambios a la vista de golpe, se ejecuta una única llamada de actualización en lote (`update` con `.in('id', [...])`), y si falla, se revierten **todos** los productos afectados (no una reversión parcial) y se muestra un único mensaje de error.
- **Justificación**: consistente con el patrón fail-fast sin reintentos ya establecido (BR-6, Unidad 1); evitar estados intermedios confusos (algunos comprados, otros no, tras un fallo parcial) en una acción que el usuario percibe como una sola.

## BR-12: Concurrencia — last-write-wins sin locking (Question 5 = A, confirmación de Requirements)
- **Regla**: no se implementa optimistic locking ni comprobación de versión/timestamp antes de actualizar `products`. Si dos dispositivos marcan el mismo producto casi simultáneamente, la última escritura de Postgres prevalece sin generar error visible a ninguno de los dos usuarios.
- **Efecto derivado**: por RLS permisivo (Unidad 1), cualquier UPDATE concurrente sobre el mismo `id` es aceptado por Postgres sin conflicto (no hay columnas de versión que provoquen fallos de escritura).
