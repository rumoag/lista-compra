# Logical Components — Unidad 4: Onboarding y acceso

## `onboarding/qr-view.js`
- **Responsabilidad**: genera y muestra el QR de la URL del household actual usando `qrcode` (vía import map).
- **Depende de**: ninguna dependencia interna más allá del `householdId` recibido como prop.

## `onboarding/name-prompt.js` (extendido)
- Añade `renderChangeNameButton(container)`, reutilizando el mismo formulario/lógica de `ensureLocalName`.

## `onboarding/create-household.js` (extendido)
- Sin nuevas dependencias lógicas; solo cambios de presentación en `renderCreateHousehold`.

## `main.js`
- Añade la entrada de navegación "QR" y el botón "Cambiar nombre", sin introducir nuevos módulos de estado.

## Diagrama de dependencias (texto)
```
main.js --> onboarding/qr-view.js, onboarding/name-prompt.js (renderChangeNameButton), onboarding/create-household.js
onboarding/qr-view.js --> qrcode (esm.sh)
```
