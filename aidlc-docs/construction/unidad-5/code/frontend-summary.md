# Frontend Summary — Unidad 5: Listado de listas activas

## Archivos creados
- `src/common/modal.js` — modal genérico reutilizable (BR-33)
- `src/home/participants.js` — funciones puras de participantes (BR-27, BR-28)
- `src/home/households-api.js` — capa de datos (fetch/create/update/delete de listas)
- `src/home/list-actions-menu.js` — menú de 3 puntos
- `src/home/list-card.js` — tarjeta de lista
- `src/home/list-form-modal.js` — modal compartido crear/editar (BR-32)
- `src/home/qr-modal.js` — modal de QR (envuelve `renderQrView` de Unidad 4)
- `src/home/delete-confirm-modal.js` — modal de confirmación de borrado (BR-31)
- `src/home/home-screen.js` — orquestador de la pantalla de inicio

## Archivos modificados
- `src/main.js` — cuando no hay `householdId` en la URL, renderiza `home-screen.js` en vez de `create-household.js`
- `src/common/validation.js` — añadidas `validateHouseholdTitle`, `validateHouseholdIcon`, `HOUSEHOLD_ICON_SET` (BR-24, BR-25)
- `supabase/schema.sql` — columnas `title`/`image_icon` en `households`, backfill (BR-26), constraints `CHECK`
- `css/style.css` — estilos de pantalla de inicio, tarjetas, menú de 3 puntos, modal genérico y selector de iconos
- `README.md` — estado actual, nota de seguridad (BR-34), estructura del proyecto

## Archivos eliminados
- `src/onboarding/create-household.js` — sustituido por `home/households-api.js` + `home/list-form-modal.js` (sin test previo que actualizar, no existía `tests/onboarding/create-household.test.js`)

## Desviación de diseño detectada durante generación
`buildParticipantsMap`/`formatParticipants` se especificaron inicialmente dentro de `households-api.js` (functional-design), pero se extrajeron a `home/participants.js` durante Code Generation: `list-card.js` es un componente de presentación puro y no debía arrastrar una dependencia transitiva de `common/supabase-client.js` (que requiere `config.generated.js`, generado solo por `npm run build`) solo para formatear texto. Documentado también en `functional-design/frontend-components.md` y `nfr-design/logical-components.md`.

## Tests
`npm test`: **126/126 tests pasan** (24 nuevos respecto a las 4 unidades anteriores: `common/modal.test.js`, `home/households-api.test.js`, `home/participants.test.js`, `home/list-actions-menu.test.js`, `home/list-card.test.js`, `home/list-form-modal.test.js`, `home/qr-modal.test.js`, `home/delete-confirm-modal.test.js`, `home/home-screen.test.js`).

`npm run build`: verificado con variables de entorno de prueba, genera `src/common/config.generated.js` correctamente.
