# Business Logic Model — Unidad 4: Onboarding y acceso

## Flujo: Pulir captura de nombre local (US-5.1)
1. Si no existe `localName`, mostrar la misma pantalla stopgap de la Unidad 1 (ya es funcional) — sin cambios en la lógica, ya cumple el criterio de aceptación.
2. Añadir un botón "Cambiar nombre" accesible desde la navegación principal (BR-20), que reabre el mismo formulario de captura pre-relleno con el nombre actual.

## Flujo: Pulir creación de hogar (US-5.2)
1. Mejorar la copy/estética de la pantalla inicial (`create-household.js`), sin cambiar la función `createHousehold()` ya existente (BR-21).
2. Tras crear el hogar y redirigir a `/{householdId}`, el usuario entra directamente al flujo normal (nombre local + lista).

## Flujo: Ver y compartir el QR (US-5.3, BR-19)
1. Nueva vista "Tu código QR" accesible desde la navegación, dentro del contexto de un household ya existente.
2. Genera el QR client-side a partir de `window.location.origin + '/' + householdId` usando una librería ligera de generación de QR (ver `frontend-components.md`).
3. No requiere llamada de red — la URL ya se conoce en el cliente.

## Flujo: PWA mínima (BR-22)
1. `manifest.json` con nombre, iconos y `display: standalone`, enlazado vía `<link rel="manifest">` en `index.html`.
2. Sin lógica de aplicación adicional — es puramente configuración estática.

## Testable Properties (PBT-01)
Esta unidad no introduce funciones puras de negocio nuevas más allá de las ya cubiertas (generación de URL del QR es una simple concatenación de string, sin invariantes no triviales que ameriten PBT). Se marca **N/A** para PBT-02/03 en esta unidad, con la lógica reutilizada de unidades anteriores ya cubierta por sus propios tests.
