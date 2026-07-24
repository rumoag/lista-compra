# Tech Stack Decisions — Unidad 6: Vista de lista de la compra

| Decisión | Elección | Justificación |
|---|---|---|
| Migración de `quantity` | `drop column` tras migrar (no `rename`) | Riesgo aceptado explícitamente por el usuario (Question 1 = A) |
| Límite de productos sugeridos | 2000 filas más recientes | Mismo criterio ya usado en Unidad 3 (Question 2 = A) |
| Teclado numérico | `input type="number" inputmode="numeric"` | Nativo del navegador, sin dependencia nueva |
| Scroll infinito | `IntersectionObserver` nativo | Sin dependencia ni polyfill, soportado en navegadores móviles modernos |
| Menús de 3 puntos / confirmación / QR | Generalizados a `common/` (`dropdown-menu.js`, `confirm-modal.js`, `qr-modal.js`) | Evita triplicar lógica ya existente de la Unidad 5 |

Sin nuevas dependencias de `package.json`.
