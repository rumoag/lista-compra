# Code Generation Plan — Unidad 2: Tiempo real y acciones en lote

## Contexto de la unidad
- **Historias**: US-1.2 (completa), US-2.1, US-2.2
- **Dependencias**: Unidad 1 (`common/`, `list/`, `schema.sql`)

## Pasos de generación

- [ ] **Step 1 — Database Migration Script**: añadir a `supabase/schema.sql` la sentencia `alter publication supabase_realtime add table products;`.
- [ ] **Step 2 — Business Logic Generation**: crear `src/bulk-actions/selection-state.js`, `src/bulk-actions/realtime-subscription.js`.
- [ ] **Step 3 — Business Logic Unit Testing**: crear `tests/bulk-actions/selection-state.test.js` (PBT con fast-check para las propiedades de `toggleSelection`/`selectAll`/`clearSelection`), `tests/bulk-actions/realtime-subscription.test.js` (mock del canal Supabase).
- [ ] **Step 4 — Business Logic Summary**: `aidlc-docs/construction/unidad-2/code/business-logic-summary.md`.
- [ ] **Step 5 — Frontend Components Generation**: crear `src/bulk-actions/selection-bar.js`; modificar `src/list/product-item.js` (checkbox de selección), `src/list/product-list.js` (integrar selección, Realtime, marcar en lote).
- [ ] **Step 6 — Frontend Components Unit Testing**: actualizar/crear tests para `product-item.js` (checkbox) y `selection-bar.js`.
- [ ] **Step 7 — Frontend Components Summary**: `aidlc-docs/construction/unidad-2/code/frontend-summary.md`.
- [ ] **Step 8 — Documentation Generation**: actualizar `README.md` con el nuevo comando de habilitar Realtime (ya incluido en `schema.sql`, así que solo nota informativa).

## Trazabilidad de historias
| Historia | Steps |
|---|---|
| US-1.2 (completa) | 1, 2, 5 |
| US-2.1 | 2, 5, 6 |
| US-2.2 | 2, 3, 5, 6 |
