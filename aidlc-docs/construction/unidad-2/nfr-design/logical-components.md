# Logical Components — Unidad 2: Tiempo real y acciones en lote

## `bulk-actions/selection-state.js`
- **Responsabilidad**: gestiona el `Set` de ids seleccionados. Expone `toggleSelection(id)`, `selectAll(ids)`, `clearSelection()`, `getSelection()`, `removeFromSelection(id)` (usado cuando un producto desaparece por Realtime).
- **Funciones puras identificadas para PBT** (ver `business-logic-model.md`): `toggleSelection` (round-trip/auto-inversa), invariantes de tamaño en `selectAll`/`clearSelection`.

## `bulk-actions/selection-bar.js`
- **Responsabilidad**: UI de la barra de acción en lote (contador + botón "Marcar como comprados").
- **Depende de**: `selection-state.js` (lee el conteo), `common/optimistic.js` (para la operación en lote, BR-11).

## `bulk-actions/realtime-subscription.js`
- **Responsabilidad**: encapsula la suscripción a `postgres_changes` de Supabase sobre `products` filtrado por `household_id`. Expone `subscribe({ onInsert, onUpdate, onDelete })` y `unsubscribe()`.
- **Consumido por**: `list/product-list.js`, que lo desuscribe en su ciclo de desmontaje (Question 3 = A).

## Actualización de `list/product-list.js`
- Instancia `selection-state.js` y `realtime-subscription.js`.
- Pasa `selected`/`onToggleSelect` a cada `product-item`.
- Renderiza `selection-bar.js` cuando la selección no está vacía.
- Implementa el flujo "Marcar como comprados" (BR-11) usando `applyOptimistic` (de la Unidad 1) sobre una operación en lote (`update(...).in('id', ids)`).

## Diagrama de dependencias (texto)
```
list/product-list.js
  --> bulk-actions/selection-state.js
  --> bulk-actions/selection-bar.js
  --> bulk-actions/realtime-subscription.js
  --> common/optimistic.js, common/pagination.js, common/supabase-client.js (de la Unidad 1)

bulk-actions/selection-bar.js --> bulk-actions/selection-state.js (lectura del conteo)
```
