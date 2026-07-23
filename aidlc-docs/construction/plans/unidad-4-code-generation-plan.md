# Code Generation Plan — Unidad 4: Onboarding y acceso

## Pasos de generación

- [ ] **Step 1 — Frontend Components Generation**: crear `src/onboarding/qr-view.js`; modificar `src/onboarding/name-prompt.js` (añadir `renderChangeNameButton`), `src/onboarding/create-household.js` (pulido de copy); modificar `src/main.js` (nav "QR" + botón "Cambiar nombre"); crear `manifest.json`; modificar `index.html` (link manifest + meta theme-color).
- [ ] **Step 2 — Frontend Components Unit Testing**: crear `tests/onboarding/qr-view.test.js` (mock de `qrcode`); actualizar `tests/onboarding/name-prompt.test.js` con el nuevo botón.
- [ ] **Step 3 — Frontend Components Summary**: `aidlc-docs/construction/unidad-4/code/frontend-summary.md`.
- [ ] **Step 4 — Documentation Generation**: actualizar `README.md` (mención de PWA/QR, nota de icono pendiente).

## Trazabilidad de historias
| Historia | Steps |
|---|---|
| US-5.1 (completa) | 1, 2 |
| US-5.2 (completa) | 1 |
| US-5.3 (completa) | 1, 2 |
