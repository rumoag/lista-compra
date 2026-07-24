# Plan de Code Generation — Unidad 6: Vista de lista de la compra

## Contexto de la unidad
- **Cubre**: Pantalla 2 del ciclo de mejora de usabilidad — cabecera, saludo, tabs, lista con scroll infinito, wizard de 3 pasos crear/editar producto, selección múltiple ampliada.
- **Dependencias**: Unidad 1 (products/supabase-client), Unidad 2 (selection-state, realtime), Unidad 4 (qr-view), Unidad 5 (modal.js, households, componentes a generalizar)
- **Entidades propias**: `products.quantity_number`/`quantity_unit` (sustituyen `quantity`)
- **Fuera de esta unidad**: cualquier otra pantalla del rediseño (se especificarán en ciclos posteriores)

## Pasos

1. [x] **Migración de esquema** — `supabase/schema.sql`: `quantity_number`/`quantity_unit` + migración best-effort de `quantity` (BR-37) + `drop column quantity` + constraints `CHECK` (BR-35, BR-36)
2. [x] **`common/modal.js`** — añadir soporte `fullScreen: true` (BR-44)
3. [x] **`common/dropdown-menu.js`** (nuevo, generaliza `home/list-actions-menu.js`) + tests
4. [x] **`common/confirm-modal.js`** (nuevo, generaliza `home/delete-confirm-modal.js`) + tests
5. [x] **`common/qr-modal.js`** (movido desde `home/qr-modal.js`) + test movido
6. [x] **Actualizar Unidad 5** — `home/list-card.js` y `home/home-screen.js` pasan a usar los 3 componentes generalizados; eliminados `home/list-actions-menu.js`, `home/delete-confirm-modal.js`, `home/qr-modal.js` y sus tests antiguos
7. [x] **`common/validation.js`** — `validateQuantityNumber`/`validateQuantityUnit` (BR-35, BR-36), eliminada `validateQuantity` + tests
8. [x] **`list/categories.js`** — mapa de iconos por categoría (BR-38) + tests (bug real de objeto plano detectado y corregido con `Map`)
9. [x] **`list/suggested-products.js`** — cálculo de sugeridos (BR-39, límite 2000) + tests
10. [x] **Modal de cambiar nombre** — `onboarding/name-prompt.js` exporta `renderNameForm`, elimina `renderChangeNameButton`; nuevo `list/change-name-modal.js` (BR-45) + tests
11. [x] **Cabecera/saludo/tabs** — `list/list-header.js`, `list/greeting.js`, `list/tabs.js` (BR-46, BR-47) + tests
12. [x] **Wizard de producto** — `list/product-wizard-modal.js`, 3 pasos (BR-44) + tests
13. [x] **`list/product-item.js`** reescrito — menú de 3 puntos, icono de categoría, selección por click (BR-40, BR-41) + tests
14. [x] **`list/product-list.js`** reescrito — scroll infinito (BR-48), integración de sugeridos, selección ampliada (BR-42, BR-43), estado vacío (BR-49) + tests (bug real de re-render tras insertar detectado y corregido)
15. [x] **`bulk-actions/selection-bar.js`** extendido — seleccionar/deseleccionar todos, eliminar seleccionados + tests
16. [x] **Eliminar `list/product-form.js`** y su test (sustituido por el wizard)
17. [x] **`src/main.js`** — integración de cabecera/saludo/tabs, `VIEWS` sin `qr` (también se añadió `home/households-api.js#fetchHousehold`, necesaria para la cabecera)
18. [x] **`css/style.css`** — cabecera, tabs, FAB, wizard pantalla completa, dropdown genérico, icono de categoría, estado vacío
19. [x] **Documentación** — `README.md` (nota de migración destructiva, estructura) y resumen en `aidlc-docs/construction/unidad-6/code/`

## Trazabilidad
Todos los pasos cubren FR-7 a FR-17 y NFR-5 a NFR-8 de `requirements.md` (Ciclo 2, Pantalla 2), y BR-35 a BR-49 de `business-rules.md` (Unidad 6).

## Verificación
`npm test`: 174/174 tests pasan (48 nuevos). `npm run build`: verificado con variables de prueba.
