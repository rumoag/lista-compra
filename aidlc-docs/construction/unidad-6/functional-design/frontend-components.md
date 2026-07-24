# Frontend Components — Unidad 6: Vista de lista de la compra

## Refactors de componentes de la Unidad 5 (generalización, no duplicación)

### `common/dropdown-menu.js` (nuevo, generaliza `home/list-actions-menu.js`)
- **Motivo**: la Unidad 6 necesita menús de 3 puntos con distintas acciones (cabecera: 3 opciones; item de producto: 2 opciones) — mismo comportamiento de apertura/cierre/click-fuera que ya existe en `list-actions-menu.js`, pero con acciones fijas por diseño. Se generaliza a `renderDropdownMenu(container, { actions: [{ testid, label, onClick }] })`.
- **`home/list-actions-menu.js` se elimina**; `home/list-card.js` pasa a usar `common/dropdown-menu.js` con sus 3 acciones (Editar/Ver QR/Eliminar), sin cambio de comportamiento visible.

### `common/confirm-modal.js` (nuevo, generaliza `home/delete-confirm-modal.js`)
- **Motivo**: la Unidad 6 necesita confirmación de borrado tanto para un producto individual como en lote (BR-42), con mensaje variable — mismo patrón que ya existe para borrar una lista. Se generaliza a `openConfirmModal({ title, message, confirmLabel, onConfirm })`.
- **`home/delete-confirm-modal.js` se elimina**; `home-screen.js` pasa a usar `common/confirm-modal.js` con el mensaje de borrado de lista ya existente, sin cambio de comportamiento visible.

### `common/qr-modal.js` (movido desde `home/qr-modal.js`)
- **Motivo**: la cabecera de la Unidad 6 también necesita abrir el QR en modal (BR-46); se traslada tal cual a `common/` para que ambos contextos (home y lista) lo reutilicen sin duplicar. `home-screen.js` actualiza su import.

### `common/modal.js` (extendido)
- **Nuevo**: parámetro opcional `fullScreen: true` en `openModal(...)` — aplica una clase adicional (`modal-panel--fullscreen`) que ocupa todo el viewport en vez del panel centrado habitual. Usado únicamente por el wizard de producto (BR-44). Sin cambios de comportamiento para los usos existentes (parámetro por defecto `false`).

## Componentes nuevos de la Unidad 6

### `list/list-header.js`
- **Responsabilidad**: icono+título de la lista actual + `common/dropdown-menu.js` con Cambiar nombre / Ver QR / Volver al listado (BR-46).
- **Props**: `household` (`{ id, title, image_icon }`), callback `onChangeName`.

### `list/greeting.js`
- **Responsabilidad**: "Hola, {nombre local}" clicable, invoca el mismo callback `onChangeName` que la cabecera (BR-45).
- **Props**: callback `onChangeName`.

### `list/change-name-modal.js`
- **Responsabilidad**: envuelve el formulario de nombre (reutiliza la lógica de `onboarding/name-prompt.js`, que se refactoriza para exportar `renderNameForm`) dentro de `common/modal.js`.
- **Props**: `onSaved` (callback tras guardar, para refrescar el saludo).

### `list/tabs.js`
- **Responsabilidad**: sustituye la navegación de botones por tabs Lista/Historial/Estadísticas (BR-47). Misma API que la navegación actual de `main.js` (activeView + render).

### `list/categories.js`
- **Responsabilidad**: `CATEGORY_ICON_MAP`, `FREQUENT_CATEGORIES` (con icono), `getCategoryIcon(category)` (BR-38).

### `list/suggested-products.js`
- **Responsabilidad**: `fetchSuggestedProducts(householdId, pendingNames)` — implementa BR-39.

### `list/product-wizard-modal.js`
- **Responsabilidad**: modal de pantalla completa (BR-44) con los 3 pasos (Flujo 8). Sustituye a `list/product-form.js` (que se elimina) tanto para crear como para editar.
- **Props**: `mode` (`'create' | 'edit'`), `product` (solo en modo edición), `householdId`, `onSaved`.

### `list/product-item.js` (reescrito)
- Quita los botones inline "Editar"/"Eliminar" y el formulario de edición inline; añade `common/dropdown-menu.js` (Editar/Eliminar, BR-40) e icono de categoría (BR-38). Click en el cuerpo del item alterna selección (BR-41, mismo patrón `stopPropagation` en el área del menú que `list-card.js`).

### `list/product-list.js` (reescrito)
- Sustituye el botón "Cargar más" por un elemento centinela + `IntersectionObserver` (BR-48, Flujo 4).
- Integra productos sugeridos (Flujo 7) para pasarlos al wizard.
- Nuevo mensaje de estado vacío (BR-49).
- Orquesta "Seleccionar todos" (BR-43, fuerza carga completa) y "Eliminar seleccionados" (BR-42/Flujo 9) delegando en `common/confirm-modal.js`.

### `bulk-actions/selection-bar.js` (extendido)
- Añade botón toggle "Seleccionar todos" / "Deseleccionar todos" y botón "Eliminar seleccionados", junto al ya existente "Marcar como comprados".

## Cambios en `src/main.js`
- La vista por household ya no renderiza una barra de navegación de botones + "Cambiar nombre" suelto: renderiza `list-header.js` + `greeting.js` + `tabs.js` + contenedor de vista activa.
- `VIEWS` pierde la entrada `qr` (se mueve al menú de cabecera, BR-46); quedan `list`, `history`, `stats`.

## Cambios en `src/common/validation.js`
- Añade `validateQuantityNumber` (entero 1-999, BR-35) y `validateQuantityUnit` (opcional, máx. 20, BR-36).
- `validateQuantity` (texto libre único) queda obsoleta y se elimina junto con `list/product-form.js`.

## Cambios en `supabase/schema.sql`
- Migración BR-37: añadir `quantity_number`/`quantity_unit`, poblarlas con parseo best-effort de `quantity`, y eliminar la columna `quantity`.
