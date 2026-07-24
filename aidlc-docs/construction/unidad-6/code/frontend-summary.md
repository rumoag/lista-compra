# Frontend Summary — Unidad 6: Vista de lista de la compra

## Archivos creados
- `src/common/dropdown-menu.js` (generaliza `home/list-actions-menu.js`, Unidad 5)
- `src/common/confirm-modal.js` (generaliza `home/delete-confirm-modal.js`, Unidad 5)
- `src/common/qr-modal.js` (movido desde `home/qr-modal.js`, Unidad 5)
- `src/list/categories.js` — mapa de iconos por categoría (BR-38)
- `src/list/suggested-products.js` — cálculo de productos sugeridos (BR-39)
- `src/list/change-name-modal.js` — modal de cambiar nombre (BR-45)
- `src/list/list-header.js` — cabecera icono+título+menú (BR-46)
- `src/list/greeting.js` — saludo clicable (FR-8)
- `src/list/tabs.js` — tabs Lista/Historial/Estadísticas (BR-47)
- `src/list/product-wizard-modal.js` — asistente de 3 pasos crear/editar producto (BR-44)

## Archivos modificados
- `src/list/product-item.js` — reescrito: menú de 3 puntos, icono de categoría, selección por click (BR-40, BR-41)
- `src/list/product-list.js` — reescrito: scroll infinito (BR-48), wizard, confirmación de borrado individual/lote (BR-42), seleccionar/deseleccionar todos forzando carga completa (BR-43)
- `src/bulk-actions/selection-bar.js` — añadidos botones "Seleccionar/Deseleccionar todos" y "Eliminar seleccionados" (FR-17)
- `src/common/modal.js` — soporte `fullScreen: true`
- `src/common/validation.js` — `validateQuantityNumber`/`validateQuantityUnit` (BR-35, BR-36); eliminada `validateQuantity`
- `src/onboarding/name-prompt.js` — exporta `renderNameForm`; eliminado `renderChangeNameButton` (sustituido por `list/change-name-modal.js`)
- `src/home/households-api.js` — añadida `fetchHousehold(id)` (necesaria para la cabecera)
- `src/home/list-card.js`, `src/home/home-screen.js` — actualizados para usar los 3 componentes generalizados a `common/`
- `src/main.js` — integración completa de cabecera/saludo/tabs; `VIEWS` sin `qr`
- `supabase/schema.sql` — migración de `quantity` a `quantity_number`/`quantity_unit` (BR-37, destructiva)
- `css/style.css` — cabecera, saludo, tabs, FAB, stepper de cantidad, modal de pantalla completa, icono de categoría; renombradas las clases del menú de 3 puntos (`.dropdown-menu*`) y del modal de confirmación (`.confirm-modal-actions`)

## Archivos eliminados
- `src/home/list-actions-menu.js`, `src/home/delete-confirm-modal.js`, `src/home/qr-modal.js` (generalizados a `common/`)
- `src/list/product-form.js` (sustituido por el wizard de 3 pasos)
- Tests correspondientes movidos/renombrados: `tests/home/qr-modal.test.js` → `tests/common/qr-modal.test.js`; `tests/home/list-actions-menu.test.js` y `tests/home/delete-confirm-modal.test.js` eliminados (cubiertos por `tests/common/dropdown-menu.test.js` y `tests/common/confirm-modal.test.js`); `tests/list/product-form.test.js` eliminado

## Bugs reales detectados y corregidos durante Code Generation
1. **`getCategoryIcon` con objeto plano**: un test de propiedades (fast-check) encontró que la categoría `"valueOf"` devolvía la función `Object.prototype.valueOf` en vez de `undefined`/icono genérico, porque `CATEGORY_ICON_MAP` era un objeto literal. Corregido usando un `Map` en vez de un objeto plano.
2. **Falta de re-render tras insertar en el servidor**: en `handleAdd` de `product-list.js` (patrón heredado de la Unidad 1), tras sustituir el item optimista por el real (`paginator.removeItem` + `paginator.prependItem`) nunca se llamaba a `renderList()`, dejando el DOM desincronizado del estado interno del paginador. Detectado por un test de integración nuevo; corregido añadiendo el `renderList()` que faltaba.

## Tests
`npm test`: **174/174 tests pasan** (48 nuevos respecto a la Unidad 5: `common/dropdown-menu.test.js`, `common/confirm-modal.test.js`, `common/qr-modal.test.js` (movido), `list/categories.test.js`, `list/suggested-products.test.js`, `list/change-name-modal.test.js`, `list/list-header.test.js`, `list/greeting.test.js`, `list/tabs.test.js`, `list/product-wizard-modal.test.js`, `list/product-list.test.js` (nuevo, no existía antes), reescritos `list/product-item.test.js` y `bulk-actions/selection-bar.test.js`, ampliado `common/validation.test.js` y `home/households-api.test.js`).

`npm run build`: verificado con variables de entorno de prueba.
