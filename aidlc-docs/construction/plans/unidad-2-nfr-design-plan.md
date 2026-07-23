# NFR Design Plan — Unidad 2: Tiempo real y acciones en lote

## Categorías N/A (justificadas)
- **Security Patterns**: N/A — ya resuelto en NFR Requirements (RLS de SELECT reutilizado, sin políticas nuevas).
- **Scalability Patterns**: N/A — carga trivial, sin cambios respecto a la Unidad 1.

## Checklist de ejecución
- [ ] Confirmar respuestas a las preguntas de contexto
- [ ] Generar `aidlc-docs/construction/unidad-2/nfr-design/nfr-design-patterns.md`
- [ ] Generar `aidlc-docs/construction/unidad-2/nfr-design/logical-components.md`

## Preguntas de contexto

### Question 1 — Dónde vive el estado de selección
`business-logic-model.md` define la selección como un `Set` en memoria. ¿Prefieres que viva dentro del propio `product-list.js` (como hasta ahora se ha asumido implícitamente), o en un módulo dedicado `bulk-actions/selection-state.js` reutilizable?

A) Módulo dedicado `bulk-actions/selection-state.js` (más testable de forma aislada, consistente con separar `common/` en submódulos en la Unidad 1)

B) Dentro de `product-list.js` directamente (menos archivos, para una unidad pequeña)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Colisión entre evento Realtime y acción optimista propia
Si marco productos como comprados y, antes de que confirme el servidor, llega un evento Realtime `UPDATE` para uno de esos mismos productos (eco de mi propia escritura), ¿qué comportamiento esperas?

A) Aceptar que puede haber una re-aplicación idempotente sin efecto visible perceptible (el producto ya no está en la vista de pendientes, así que el evento de eco no tiene nada que hacer) — no se necesita lógica de deduplicación explícita

B) Añadir una comprobación explícita para ignorar ecos de la propia escritura (ej. comparar `bought_by` con el nombre local)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3 — Desuscripción del canal Realtime
¿Cuándo se debe desuscribir el canal Realtime?

A) Al navegar fuera de la vista de lista (ej. a historial/estadísticas en unidades futuras) o al cerrar/recargar la pestaña — usar el ciclo de vida estándar del módulo `product-list.js`

B) Nunca desuscribir explícitamente, dejar que el navegador limpie al cerrar la pestaña

X) Other (please describe after [Answer]: tag below)

[Answer]: A
