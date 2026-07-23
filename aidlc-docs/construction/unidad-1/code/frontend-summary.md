# Frontend Summary — Unidad 1: Fundaciones

## Archivos generados

- **Created**: `index.html` — shell de la app, import map para `@supabase/supabase-js` vía CDN (esm.sh), sin bundler.
- **Created**: `css/style.css` — estilos mobile-first (formulario, chips, lista, estados vacíos/error).
- **Created**: `src/main.js` — enrutado mínimo por `household_id` en la URL: `/` → crear hogar, `/{id}` → nombre local + lista.
- **Created**: `src/onboarding/name-prompt.js` — stopgap de identidad local (US-5.1).
- **Created**: `src/onboarding/create-household.js` — creación mínima de household (US-5.2), reutilizada por la Unidad 4.
- **Created**: `src/list/product-form.js` — alta de producto con chips de categoría + texto libre (US-1.1).
- **Created**: `src/list/product-item.js` — vista y edición inline de un producto pendiente (US-1.3, US-1.4).
- **Created**: `src/list/product-list.js` — orquestación: paginación, alta/edición/borrado optimistas (US-1.1 a US-1.4, base de US-1.2 sin Realtime).

## Tests generados

- **Created**: `tests/list/product-form.test.js` — validación inline, selección de chip, categoría libre.
- **Created**: `tests/list/product-item.test.js` — render, editar, cancelar, eliminar, validación en edición.
- **Created**: `tests/onboarding/name-prompt.test.js` — flujo de captura y persistencia del nombre local.

**Nota de cobertura**: `product-list.js` (orquestador que integra Supabase, paginación y optimistic update) no tiene un test unitario dedicado en esta unidad — mockear el cliente Supabase para probarlo de forma aislada se ha considerado desproporcionado para el tamaño del proyecto. Se verifica mediante prueba manual end-to-end en la etapa de Build and Test. Los componentes puros que sí tiene (`product-form.js`, `product-item.js`, `validation.js`, `optimistic.js`, `pagination.js`) están cubiertos.

## ✅ Tests ejecutados y verificados
Tras instalar Node.js, se ejecutó `npm install && npm test`: **37/37 tests pasan** (6 archivos de test). Se detectó y corrigió un bug en `tests/list/product-item.test.js`: jsdom solo dispara el evento `submit` de un formulario cuando el elemento está conectado al `document` — los tests creaban el `<div>` del item sin montarlo con `appendChild`. Se añadió un helper `mount()` en el test para adjuntarlo antes de interactuar. No fue necesario tocar el código de producción (`product-item.js`).

## data-testid
Todos los elementos interactivos incluyen `data-testid` estable siguiendo el patrón `{componente}-{elemento}` (ej. `product-form-name-input`, `product-item-delete-button`), para facilitar automatización de pruebas futuras.
