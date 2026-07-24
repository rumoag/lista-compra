# NFR Requirements — Unidad 6: Vista de lista de la compra

## Reliability
**Decisión (Question 1 = A)**: se elimina `quantity` directamente tras la migración best-effort (BR-37), tal como estaba diseñado en Functional Design. El usuario asume el riesgo explícitamente, dado el volumen de datos reales controlado (app personal de 2 usuarios).

## Performance
**Decisión (Question 2 = A)**: el cálculo de productos sugeridos (BR-39) aplica el mismo límite defensivo de 2000 filas más recientes que ya usa Unidad 3 para estadísticas — mismo criterio, mismo límite, sin necesidad de una constante nueva (se reutiliza si es practico, o se documenta el mismo valor en `list/suggested-products.js`).

## Security
- Sin cambios de RLS: las políticas permisivas de `products` (Unidad 1) ya cubren `quantity_number`/`quantity_unit`.
- Validación de `quantity_number`/`quantity_unit` en cliente + constraints `CHECK` en base de datos (SECURITY-05, SECURITY-11), mismo patrón que el resto de campos del proyecto.
- Sin superficie de ataque nueva: no se añade almacenamiento de archivos, ni endpoints propios.

## Scalability
N/A — mismo criterio que unidades anteriores, app personal en capa gratuita.

## Resilience Patterns
N/A — Extensión de Resiliencia desactivada desde Requirements Analysis original.

## Maintainability
- Generalizar `dropdown-menu.js`, `confirm-modal.js` y `qr-modal.js` a `common/` (ya decidido en Functional Design) evita triplicar lógica de menús/confirmaciones/QR entre Unidad 5 y Unidad 6.
- Eliminar `list/product-form.js` y `validateQuantity` en el mismo cambio evita mantener dos formularios de producto coexistiendo (uno obsoleto).

## Tech Stack
- Teclado numérico del dispositivo: `<input type="number" inputmode="numeric">` en el campo de cantidad del wizard — sin librería nueva.
- Scroll infinito: `IntersectionObserver` nativo del navegador — sin librería ni polyfill (target: navegadores móviles modernos de los 2 usuarios).
- Sin dependencias nuevas de `package.json`.
