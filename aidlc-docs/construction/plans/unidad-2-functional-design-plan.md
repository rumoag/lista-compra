# Functional Design Plan — Unidad 2: Tiempo real y acciones en lote

## Contexto de la unidad
- **Responsabilidades**: activar Supabase Realtime sobre `products` (completa US-1.2), módulo `bulk-actions/` (selección múltiple + marcar comprados).
- **Historias cubiertas**: US-1.2 (completa), US-2.1, US-2.2
- **Depende de**: Unidad 1 (esquema completo, `common/`, `list/`)

## Checklist de ejecución

- [ ] Confirmar respuestas a las preguntas de contexto (abajo)
- [ ] Generar `aidlc-docs/construction/unidad-2/functional-design/domain-entities.md` (delta sobre Unidad 1, si aplica)
- [ ] Generar `aidlc-docs/construction/unidad-2/functional-design/business-rules.md`
- [ ] Generar `aidlc-docs/construction/unidad-2/functional-design/business-logic-model.md` (con Testable Properties, PBT-01)
- [ ] Generar `aidlc-docs/construction/unidad-2/functional-design/frontend-components.md`

## Preguntas de contexto

### Question 1 — Integración de Realtime con la paginación existente
La Unidad 1 ya implementó paginación por cursor (`pagination.js`). Al activar Realtime, ¿qué debe pasar cuando llega un evento de un producto **nuevo** insertado por el otro móvil?

A) Insertarlo al principio de la lista visible (vía `paginator.prependItem`), igual que hace la propia alta local — mantiene consistencia visual (recomendado, ya previsto en el diseño de `pagination.js` de la Unidad 1)

B) Ignorar el evento y esperar a que el usuario pulse "Cargar más" o recargue

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Eventos de Realtime a escuchar
¿Qué eventos de Postgres Changes de Supabase necesitamos escuchar sobre `products`?

A) INSERT (nuevos pendientes) y UPDATE (ediciones y transición a `bought`, que hace que el producto deba desaparecer de la vista de pendientes) — DELETE no es necesario porque la Unidad 1 ya borra localmente sin depender de Realtime para el propio dispositivo, pero si el borrado lo hace el otro móvil sí hace falta escuchar DELETE también

B) Solo INSERT — suficiente para el caso de uso principal

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3 — Selección múltiple: ¿persiste entre sesiones?
Si cierro la app con productos seleccionados y la vuelvo a abrir, ¿debe recordar la selección?

A) No, la selección es efímera — se resetea siempre al cargar la app (más simple, comportamiento esperado por el usuario)

B) Sí, persistir la selección en `localStorage`

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4 — Comportamiento de "Marcar como comprados" ante fallo parcial
Al marcar varios productos a la vez, ¿qué pasa si la actualización falla para algunos productos pero no para otros (ej. error de red a mitad de la operación)?

A) Tratar la acción como una única transacción lógica: si falla cualquier producto, revertir todos los que sí se hayan aplicado optimísticamente y mostrar un único error (más simple, consistente con el patrón fail-fast de la Unidad 1)

B) Aplicar los que tengan éxito y reportar solo los que fallaron individualmente

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5 — Concurrencia (last-write-wins, ya decidido en Requirements)
Ya se decidió que ante una colisión (dos personas marcando el mismo producto casi a la vez) se aplica last-write-wins sin lógica adicional. ¿Confirmas que esto significa simplemente "no comprobar versión/timestamp antes de actualizar, dejar que la última escritura de Postgres gane"?

A) Sí, confirmo — sin optimistic locking ni comprobación de versión

B) No, quiero algún control adicional (descríbelo)

X) Other (please describe after [Answer]: tag below)

[Answer]: A
