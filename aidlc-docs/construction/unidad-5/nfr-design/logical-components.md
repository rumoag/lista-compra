# Logical Components — Unidad 5: Listado de listas activas

## `common/modal.js`
Componente genérico de UI (overlay + panel + botón "X"). Sin dependencias de datos. Usado como base por `list-form-modal.js`, `qr-modal.js`, `delete-confirm-modal.js`.

## `home/participants.js`
Funciones puras (`buildParticipantsMap`, `formatParticipants`), sin dependencias de red. Separado de `households-api.js` para que los componentes de presentación puedan usarlas sin arrastrar el cliente de Supabase.

## `home/households-api.js`
Capa de acceso a datos de esta unidad. Responsable de:
- `fetchAllHouseholdsWithParticipants()` — combina `households` + `products` (agregación en memoria vía `participants.js`, ver `nfr-design-patterns.md`)
- `createHousehold({ title, image_icon })`
- `updateHousehold(id, { title, image_icon })`
- `deleteHousehold(id)`

Depende de `common/supabase-client.js` (sin cambios). Sustituye a la función `createHousehold` de `onboarding/create-household.js` (Unidad 1/4), que queda eliminada.

## `home/home-screen.js`, `home/list-card.js`, `home/list-actions-menu.js`
Componentes de presentación puros, sin acceso directo a datos — reciben los households ya cargados y callbacks. `list-card.js` depende de `participants.js` (no de `households-api.js`) para formatear participantes. `households-api.js` solo se usa desde `home-screen.js` (orquestador).

## `home/list-form-modal.js`, `home/qr-modal.js`, `home/delete-confirm-modal.js`
Construidos sobre `common/modal.js`. `list-form-modal.js` y `delete-confirm-modal.js` invocan `households-api.js` directamente al confirmar la acción; `qr-modal.js` no accede a datos (delega en `renderQrView` de la Unidad 4).

## Diagrama de dependencias

```
main.js
  └─ home/home-screen.js
       ├─ home/households-api.js ──> common/supabase-client.js
       ├─ home/list-card.js
       │    └─ home/list-actions-menu.js
       ├─ home/list-form-modal.js ──> common/modal.js, home/households-api.js
       ├─ home/qr-modal.js ──> common/modal.js, onboarding/qr-view.js
       └─ home/delete-confirm-modal.js ──> common/modal.js, home/households-api.js
```
