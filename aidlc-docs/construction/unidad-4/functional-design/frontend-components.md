# Frontend Components — Unidad 4: Onboarding y acceso

## `onboarding/name-prompt.js` (extendido)
- Se mantiene `ensureLocalName`, `getLocalName`, `setLocalName` tal cual (Unidad 1).
- **Nuevo**: `renderChangeNameButton(container)` — botón que reabre el formulario de nombre (reutilizando el mismo markup/lógica de `ensureLocalName`, pero invocable en cualquier momento, no solo cuando falta el nombre).

## `onboarding/create-household.js` (extendido)
- Se mantiene `createHousehold()` sin cambios (Unidad 1).
- **Modificado**: `renderCreateHousehold(container)` — copy/estética pulida (sin cambios de lógica).

## Componente nuevo: `onboarding/qr-view.js`
- **Responsabilidad**: renderiza la URL del household como texto y como QR (librería ligera de generación de QR client-side, ej. una implementación minimalista sin dependencias de red).
- **Props**: `householdId`.

## Cambios en `src/main.js`
- Añadir una entrada más a la navegación (`VIEWS`): "QR" → `qr-view.js`.
- Añadir el botón "Cambiar nombre" (BR-20) junto a la navegación principal.

## PWA
- **Nuevo**: `manifest.json` (nombre "Lista de la Compra Compartida", `display: standalone`, icono).
- **Modificado**: `index.html` — añadir `<link rel="manifest" href="/manifest.json">` y meta `theme-color`.
