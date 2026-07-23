# Business Logic Summary — Unidad 2: Tiempo real y acciones en lote

## Archivos generados

- **Modified**: `supabase/schema.sql` — añadida `alter publication supabase_realtime add table products;`.
- **Created**: `src/bulk-actions/selection-state.js` — `toggleSelection`, `selectAllIds`, `clearSelectionSet`, `removeFromSelectionSet` (funciones puras) + `createSelectionState()` (wrapper con estado).
- **Created**: `src/bulk-actions/realtime-subscription.js` — `createRealtimeSubscription({ householdId })` con `subscribe`/`unsubscribe`.

## Tests generados

- **Created**: `tests/bulk-actions/selection-state.test.js` — PBT (`toggleSelection` como round-trip/auto-inversa, invariantes de tamaño en `selectAllIds`/`clearSelectionSet`) + tests de ejemplo del wrapper con estado.
- **Created**: `tests/bulk-actions/realtime-subscription.test.js` — mock de `common/supabase-client.js`, verifica nombre de canal, eventos suscritos (INSERT/UPDATE/DELETE), invocación de callbacks, y desuscripción.

## Trazabilidad
- BR-8, BR-9 → `realtime-subscription.js`
- BR-10 → `selection-state.js`
