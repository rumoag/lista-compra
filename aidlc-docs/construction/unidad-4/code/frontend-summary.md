# Frontend Summary — Unidad 4: Onboarding y acceso

## Archivos generados/modificados

- **Created**: `src/onboarding/qr-view.js` — genera y muestra el QR (librería `qrcode` vía import map).
- **Created**: `manifest.json` — PWA mínima, sin icono (pendiente, ver Question 2 de NFR Requirements).
- **Modified**: `src/onboarding/name-prompt.js` — refactorizado para compartir el formulario entre `ensureLocalName` y el nuevo `renderChangeNameButton` (BR-20/BR-21), sin duplicar lógica de `localStorage`.
- **Modified**: `src/onboarding/create-household.js` — copy pulida (sin cambios en `createHousehold()`).
- **Modified**: `src/main.js` — nueva vista "QR" en la navegación, botón "Cambiar nombre" siempre visible.
- **Modified**: `index.html` — import map con `qrcode`, `<link rel="manifest">`, meta `theme-color`.

## Tests generados/modificados

- **Created**: `tests/onboarding/qr-view.test.js` — mock de `qrcode`, verifica URL mostrada, generación del QR, y manejo de error.
- **Modified**: `tests/onboarding/name-prompt.test.js` — añadidos 3 tests para `renderChangeNameButton` (mostrar botón, pre-rellenar con nombre actual, guardar y volver a mostrar el botón).
