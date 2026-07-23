# Frontend Components — Unidad 2: Tiempo real y acciones en lote

## Cambios sobre componentes existentes (módulo `list/`)

### `product-item` (extendido)
- **Nuevo prop**: `selected` (boolean) y `onToggleSelect(id)`.
- Añade un checkbox antes del nombre del producto (`data-testid="product-item-select-checkbox"`).

### `product-list` (extendido)
- Se suscribe al canal Realtime al montar, se desuscribe al desmontar.
- Mantiene el `Set` de selección en memoria (BR-10).
- Renderiza la barra de acción en lote cuando la selección no está vacía.

## Componente nuevo: `bulk-actions/selection-bar.js`
- **Props/estado**: `selectedCount` (number), `onMarkAsBought()`.
- **Interacción**: muestra "N seleccionados" y un botón "Marcar como comprados" (`data-testid="selection-bar-mark-bought-button"`), oculto/deshabilitado si `selectedCount === 0` (US-2.1).
- **Integración**: al confirmar, invoca el flujo "Marcar como comprados" (ver `business-logic-model.md`).

## Componente nuevo: `bulk-actions/realtime-subscription.js`
- **Responsabilidad**: encapsula `supabase.channel(...).on('postgres_changes', ...)` para INSERT/UPDATE/DELETE sobre `products` filtrado por `household_id`, exponiendo callbacks simples (`onInsert`, `onUpdate`, `onDelete`) para que `product-list.js` no dependa directamente de la API de Realtime de Supabase (facilita testear `product-list.js` con un mock de este módulo).
