# Frontend Summary — Unidad 2: Tiempo real y acciones en lote

## Archivos generados/modificados

- **Created**: `src/bulk-actions/selection-bar.js` — barra de acción en lote (contador + botón).
- **Modified**: `src/list/product-item.js` — añadido checkbox de selección opcional (`onToggleSelect`, `selected`), retrocompatible (sin checkbox si no se pasa `onToggleSelect`, como en la Unidad 1).
- **Modified**: `src/list/product-list.js` — integra `selection-state.js`, `selection-bar.js` y `realtime-subscription.js`; implementa "Marcar como comprados" en lote (BR-11) y el manejo de eventos Realtime (BR-8, BR-9); desuscribe el canal en `pagehide`.

## Tests generados/modificados

- **Created**: `tests/bulk-actions/selection-bar.test.js` — oculto sin selección, contador, click en el botón.
- **Modified**: `tests/list/product-item.test.js` — añadidos 3 tests: sin checkbox por defecto (retrocompatibilidad con Unidad 1), checkbox dispara `onToggleSelect`, `selected` inicializa el checkbox marcado.

**Nota de cobertura**: igual que en la Unidad 1, `product-list.js` no tiene test unitario dedicado (orquestador con muchas dependencias externas) — se verifica manualmente en Build and Test. Los componentes puros (`selection-state.js`, `selection-bar.js`, `realtime-subscription.js` con mock) sí están cubiertos.
