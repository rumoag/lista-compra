# Business Rules — Unidad 4: Onboarding y acceso

## BR-19: Generación del QR (Question 1 = A)
- **Regla**: la pantalla de la lista incluye acceso a una vista "Tu código QR" que genera, client-side, un QR a partir de la URL completa del household (`window.location.origin + '/' + householdId`). El usuario lo imprime/hace captura desde ahí para pegarlo en la nevera.

## BR-20: Cambio de nombre local accesible (Question 2 = A)
- **Regla**: un botón "Cambiar nombre" está siempre visible (ej. en la barra de navegación) y permite reasignar `localStorage.localName` en cualquier momento, sin afectar a registros ya creados con el nombre anterior (BR-4 de la Unidad 1 ya establece que el nombre no reescribe historial pasado).

## BR-21: Reutilización de lógica existente (Question 3 = A)
- **Regla**: no se duplica lógica — `name-prompt.js` y `create-household.js` de la Unidad 1 se **extienden** (mismas funciones `getLocalName`/`setLocalName`/`createHousehold`), añadiendo la UI pulida sobre la misma base.

## BR-22: PWA mínima (Question 4 = A)
- **Regla**: se añade `manifest.json` (nombre, icono, `display: standalone`) enlazado desde `index.html`, permitiendo "Añadir a pantalla de inicio". No se implementa service worker ni caché offline (fuera de alcance, confirmado en `requirements.md`).

## BR-23: Sin pulido visual adicional fuera de onboarding/acceso (Question 5 = A)
- **Regla**: el trabajo de esta unidad se limita a los componentes de onboarding/acceso; el resto de la UI (lista, historial, estadísticas) no se modifica.
