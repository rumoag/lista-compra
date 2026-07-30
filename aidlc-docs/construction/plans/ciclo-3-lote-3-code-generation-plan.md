# Code Generation Plan — Ciclo 3, Lote 3: Modales e historial

## Contexto de la unidad
- Requisitos: FR-28, FR-29 a FR-32 (revisión M3)
- Depende de los Lotes 0-1 v2 y 2 (tokens M3 ya en uso)
- Alcance: overlay/panel/cabecera/cierre de modal (genérico, usado por confirmaciones, ticket, wizard), `.form-label`, variante fullscreen, segmento de progreso del wizard
- Fuera de alcance (decisión explícita, ver "Exclusiones"): el "receipt" (ticket de compra con aspecto de recibo físico) y `.ticket-row-*`

## Decisiones de mapeo (componente M3 de referencia)
- **`.modal-overlay`** (Scrim): `background: color-mix(in srgb, var(--md-sys-color-scrim) 32%, transparent)` — 32% es la opacidad de scrim estándar de M3, en vez del `rgba(0,0,0,0.5)` fijo actual
- **`.modal-panel`** (Dialog): fondo `surface-container-high` (uso real del sistema de elevación por superficie, FR-32), radio `corner-extra-large` (28px, esquina de diálogos en M3)
- **`.modal-header h2`**: tipografía `title-large`
- **`.modal-close-button`**: radio `corner-full` (icon-button)
- **`.form-label`**: tipografía `label-large`
- **`.modal-panel--fullscreen`**: mismo fondo/radio que `.modal-panel` (el radio no se ve al cubrir el 100%, pero se tokeniza igual por consistencia); borde superior del footer → `outline-variant`
- **`.wizard-progress-segment`**: pista inactiva → `surface-container-highest`; segmento activo → `primary` (termina de migrar `var(--color-primary)`, el último uso del token legacy de la app)

## Exclusiones (documentadas, no son deuda pendiente)
- **`.receipt` y clases `.receipt-*`**: es un componente deliberadamente "skeuomórfico" (imita un ticket de compra físico: papel crema, tinta oscura, tipografía monoespaciada, zigzag de recibo). Aplicar los roles de superficie M3 aquí destruiría la referencia visual buscada. Se mantiene tal cual, con sus variables locales `--receipt-paper`/`--receipt-ink` ya aisladas.
- **`.ticket-row-open-area`/`.ticket-row-icon`**: solo layout/tamaño, sin color hardcodeado que migrar (heredan de `.product-item`, ya tokenizado)

## Pasos

### Step 1: Overlay y panel del modal
- [x] `.modal-overlay`: `background: color-mix(in srgb, var(--md-sys-color-scrim) 32%, transparent)`
- [x] `.modal-panel`: `background: var(--md-sys-color-surface-container-high)`, `border-radius: var(--md-sys-shape-corner-extra-large)`
- [x] `.modal-panel--fullscreen`: `background: var(--md-sys-color-surface-container-high)`, `border-radius: var(--md-sys-shape-corner-extra-large)` (hereda el fondo de `.modal-panel`, solo se ajustó el radio explícitamente)

### Step 2: Cabecera y controles del modal
- [x] `.modal-header h2`: `font-size: var(--md-sys-typescale-title-large-size)`, `line-height: var(--md-sys-typescale-title-large-line-height)`
- [x] `.modal-close-button`: `border-radius: var(--md-sys-shape-corner-full)`
- [x] `.form-label`: `font-size: var(--md-sys-typescale-label-large-size)`, `font-weight: var(--md-sys-typescale-label-large-weight)`
- [x] `.modal-panel--fullscreen .modal-footer`: `border-top-color: var(--md-sys-color-outline-variant)`

### Step 3: Progreso del wizard
- [x] `.wizard-progress-segment`: `background: var(--md-sys-color-surface-container-highest)`
- [x] `.wizard-progress-segment[data-active="true"]`: `background: var(--md-sys-color-primary)` (sustituye `var(--color-primary)`; se eliminó de `:root` en `style.css` junto con `--radius`/`--color-secondary`, ya sin ningún uso)

### Step 4: Documentación del lote
- [x] Crear `aidlc-docs/construction/ciclo-3-design-system/code/lote-3-modales-historial-summary.md`, documentando también la exclusión intencional del receipt/ticket-row

## Criterio de verificación de este lote
- `npm test` en verde (230/230)
- Verificación visual del usuario: modales (confirmación, formulario de producto, wizard) con scrim más sutil y esquinas más redondeadas, ticket de compra (receipt) sin cambios visuales
