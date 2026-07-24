# Logical Components — Unidad 6: Vista de lista de la compra

## `common/dropdown-menu.js`, `common/confirm-modal.js`, `common/qr-modal.js`
Generalizados desde sus equivalentes de la Unidad 5 (ver `functional-design/frontend-components.md`). Sin dependencias de datos propias — reciben acciones/callbacks del llamante.

## `list/categories.js`, `list/suggested-products.js`
Módulos de datos/lógica pura y de acceso de solo lectura respectivamente. `suggested-products.js` depende de `common/supabase-client.js`.

## `list/list-header.js`, `list/greeting.js`, `list/tabs.js`
Componentes de presentación, sin acceso a datos propio — reciben el household/nombre ya cargados y callbacks. `list-header.js` usa `common/dropdown-menu.js` y `common/qr-modal.js`.

## `list/change-name-modal.js`
Envuelve `onboarding/name-prompt.js` (refactorizado para exportar `renderNameForm`) en `common/modal.js`.

## `list/product-wizard-modal.js`
Usa `common/modal.js` (variante `fullScreen`), `list/categories.js`, `list/suggested-products.js`, `common/validation.js` (nuevas validaciones de cantidad), y las funciones de escritura ya existentes en `list/product-list.js` (inserción/edición optimista).

## `list/product-item.js`, `list/product-list.js`
`product-item.js` usa `common/dropdown-menu.js` y `list/categories.js` (icono). `product-list.js` orquesta todo: paginación con scroll infinito, selección múltiple ampliada (`common/confirm-modal.js` para borrado en lote), y el wizard.

## Diagrama de dependencias (nuevas relaciones de esta unidad)

```
list/product-list.js
  ├─ common/pagination.js (sin cambios)
  ├─ list/suggested-products.js ──> common/supabase-client.js
  ├─ list/product-item.js
  │    ├─ common/dropdown-menu.js
  │    └─ list/categories.js
  ├─ list/product-wizard-modal.js
  │    ├─ common/modal.js (fullScreen)
  │    ├─ list/categories.js
  │    └─ list/suggested-products.js
  └─ common/confirm-modal.js (borrado individual/lote)

main.js
  ├─ list/list-header.js ──> common/dropdown-menu.js, common/qr-modal.js
  ├─ list/greeting.js
  ├─ list/change-name-modal.js ──> common/modal.js, onboarding/name-prompt.js
  └─ list/tabs.js
```
