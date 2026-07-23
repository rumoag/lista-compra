# NFR Design Patterns — Unidad 2: Tiempo real y acciones en lote

## Patrón de componente: estado de selección aislado
- El estado de selección múltiple vive en un módulo dedicado `bulk-actions/selection-state.js` (Question 1 = A), no acoplado a `product-list.js`. Esto permite testear `toggleSelection`, `selectAll`, `clearSelection` (identificadas como Testable Properties en Functional Design) de forma aislada, sin montar la lista completa.

## Patrón de resiliencia: sin deduplicación explícita de ecos Realtime
- Se acepta que un evento Realtime `UPDATE` que es "eco" de la propia escritura del dispositivo llegue después de que la UI ya haya aplicado el cambio optimista (Question 2 = A). Como el producto ya fue removido de la vista de pendientes de forma optimista, el eco no tiene ningún elemento que actualizar — es una operación naturalmente idempotente (`paginator.removeItem` sobre un id que ya no está presente es una no-operación seguridad, ver `pagination.js` de la Unidad 1, que usa `filter`).
- **No se añade** lógica de comparación de `bought_by`/timestamps para distinguir "mi propio eco" de "un cambio real de mi pareja" — se simplifica deliberadamente, consistente con el resto de decisiones de bajo overhead del proyecto.

## Patrón de ciclo de vida: desuscripción del canal Realtime
- El canal Realtime se desuscribe (Question 3 = A) cuando `product-list.js` se desmonta (navegación a otra vista) o mediante el evento `beforeunload`/`pagehide` del navegador al cerrar/recargar la pestaña, evitando fugas de conexiones WebSocket abiertas innecesariamente.

## Logical Components
Ver detalle completo en `logical-components.md`.
