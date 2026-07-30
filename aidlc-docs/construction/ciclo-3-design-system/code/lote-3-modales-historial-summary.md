# Ciclo 3 — Lote 3: Modales e historial

## Archivo modificado
- `css/style.css` — `.modal-overlay`, `.modal-panel`/`.modal-panel--fullscreen`, `.modal-header h2`, `.modal-close-button`, `.form-label`, `.modal-panel--fullscreen .modal-footer`, `.wizard-progress-segment` y variante activa

## Cambios clave
- **Scrim real de M3**: `.modal-overlay` pasa de `rgba(0,0,0,0.5)` fijo a `color-mix(in srgb, var(--md-sys-color-scrim) 32%, transparent)` (32% es la opacidad estándar de scrim en M3)
- **Elevación por superficie real (FR-32)**: `.modal-panel` pasa de `canvas` a `surface-container-high`, con esquina `corner-extra-large` (28px)
- `.wizard-progress-segment[data-active="true"]` migra de `var(--color-primary)` a `var(--md-sys-color-primary)` — **último uso del token legacy de Radix/pre-M3**
- Limpieza: se eliminan `--radius`, `--color-primary`, `--color-secondary` de `:root` en `style.css` (ya no los usa ningún selector, confirmado por búsqueda en el archivo)

## Exclusiones documentadas
- `.receipt` y `.receipt-*`: componente deliberadamente skeuomórfico (ticket de compra físico); no se tokeniza a M3, mantiene sus variables locales `--receipt-paper`/`--receipt-ink`
- `.ticket-row-open-area`/`.ticket-row-icon`: sin color hardcodeado, heredan de `.product-item` ya tokenizado — nada que migrar

## Verificación
- `npm test`: 230/230 pasan
- Visual: pendiente de confirmación del usuario — modales con scrim más sutil y esquinas más redondeadas; receipt sin cambios
