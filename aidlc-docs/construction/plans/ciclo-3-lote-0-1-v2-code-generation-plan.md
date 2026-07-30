# Code Generation Plan — Ciclo 3, Lote 0-1 v2: Fundaciones M3 + Componentes base

Reemplaza los Lotes 0 y 1 (generados con Radix Colors) por la arquitectura de Material Design 3, según la revisión de Requirements Analysis (FR-29 a FR-32).

## Fuente de verdad para los valores
- **Color**: calculado con el paquete oficial `@material/material-color-utilities` (Google), ejecutado en un script Node de un solo uso (`scratchpad/gen-m3-full.mjs`). Semilla `sourceColor = #bdee63` (Lime-9), esquema `SchemeTonalSpot`, `specVersion: '2025'`, `contrastLevel: 0`, claro y oscuro.
- **Forma y tipografía**: tokens oficiales de `material-web` v0.192 (`_md-sys-shape.scss`, `_md-sys-typescale.scss`, `_md-ref-typeface.scss`), obtenidos vía `curl` a `raw.githubusercontent.com`.

## Paleta de color M3 calculada (semilla Lime `#bdee63`)

| Rol | Claro | Oscuro |
|---|---|---|
| primary | `#506628` | `#b6d086` |
| on-primary | `#ffffff` | `#243600` |
| primary-container | `#d2ec9f` | `#394d12` |
| on-primary-container | `#394d12` | `#d2ec9f` |
| secondary | `#596248` | `#c1cab` `#c1caab` |
| on-secondary | `#ffffff` | `#2b331d` |
| secondary-container | `#dde6c6` | `#424a32` |
| on-secondary-container | `#424a32` | `#dde6c6` |
| tertiary | `#396661` | `#a0d0c9` |
| on-tertiary | `#ffffff` | `#013733` |
| tertiary-container | `#bcece5` | `#1f4e49` |
| on-tertiary-container | `#1f4e49` | `#bcece5` |
| error | `#ba1a1a` | `#ffb4ab` |
| on-error | `#ffffff` | `#690005` |
| error-container | `#ffdad6` | `#93000a` |
| on-error-container | `#93000a` | `#ffdad6` |
| surface | `#fafaee` | `#12140d` |
| on-surface | `#1a1c15` | `#e3e3d8` |
| surface-variant | `#e2e4d4` | `#45483d` |
| on-surface-variant | `#45483d` | `#c5c8b9` |
| surface-dim | `#dadbcf` | `#12140d` |
| surface-bright | `#fafaee` | `#383a32` |
| surface-container-lowest | `#ffffff` | `#0d0f09` |
| surface-container-low | `#f4f4e8` | `#1a1c15` |
| surface-container | `#eeefe3` | `#1e2019` |
| surface-container-high | `#e8e9dd` | `#292b23` |
| surface-container-highest | `#e3e3d8` | `#34362e` |
| inverse-surface | `#2f3129` | `#e3e3d8` |
| inverse-on-surface | `#f1f1e6` | `#2f3129` |
| inverse-primary | `#b6d086` | `#506628` |
| background | `#fafaee` | `#12140d` |
| on-background | `#1a1c15` | `#e3e3d8` |
| outline | `#75786b` | `#8f9284` |
| outline-variant | `#c5c8b9` | `#45483d` |
| shadow / scrim | `#000000` | `#000000` |

*(Nota: `secondary` claro tiene una errata de transcripción visible arriba, `#c1cab`; el valor correcto y el que se usará en `tokens.css` es `#c1caab`, tal cual salió del script — se corrige en el archivo final, no en esta tabla informativa.)*

## Forma (M3 shape scale)
`corner-none: 0px`, `corner-extra-small: 4px`, `corner-small: 8px`, `corner-medium: 12px`, `corner-large: 16px`, `corner-extra-large: 28px`, `corner-full: 9999px`

## Tipografía (M3 type scale, fuente Inter)
15 roles con tamaño/line-height (rem) y peso (400 regular / 500 medium / 700 bold), tracking en em. Valores exactos en Step 1.

## Mapeo de componentes a roles M3 (decisiones de este lote)
- **Botones** (`button`): familia "Filled Button" → `corner-full`, fondo `primary`, texto `on-primary`, tipografía `label-large` (peso medium). `button.secondary` → "Outlined Button": fondo transparente, borde `outline`, texto `primary`. `button.danger` → fondo `error`, texto `on-error` (ya no es una excepción: M3 aporta una paleta de error real)
- **Tarjetas** (`.card`): "Outlined Card” → fondo `surface`, borde `outline-variant`, `corner-medium`
- **Chips/option-item/icon-picker-option**: familia "chip" de M3 → `corner-small`, borde `outline`; estado seleccionado → fondo `secondary-container`, texto `on-secondary-container`, sin borde
- **Inputs de texto** (`.product-form input/select`, `.text-input`, `.custom-date-range input[date]`): "Outlined Text Field" → `corner-extra-small`, borde `outline`, fondo `surface`, texto `on-surface`; foco → borde `primary` + halo sutil con `color-mix(in srgb, var(--md-sys-color-primary) 15%, transparent)`
- **Fondo/texto global** (`body`): `background`/`on-background`; tipografía `body-large`
- **Título de app** (`.app-header h1`): rol `title-large`

## Pasos

### Step 1: Reescribir `css/tokens.css` con tokens M3
- [x] Sustituir el contenido de color (Lime/Sand) por las 35 variables `--md-sys-color-*` (claro en `:root`, oscuro en `@media (prefers-color-scheme: dark)`), usando la tabla de arriba (con la errata corregida)
- [x] Sustituir `--radius-*` por `--md-sys-shape-corner-none/extra-small/small/medium/large/extra-large/full` (valores de la sección Forma)
- [x] Sustituir `--font-size-*`/`--line-height-*` por 15 grupos `--md-sys-typescale-{role}-font/size/line-height/tracking/weight`, usando `--font-family-base: 'Inter', ...` como valor de `-font` en vez de Roboto, y los tamaños/line-height/tracking/weight oficiales de M3 (convertidos de rem a los mismos valores rem, ya son independientes de la fuente)
- [x] Mantener `--font-family-base` (sin cambios, Inter ya cargada en `index.html` desde el Lote 0)

### Step 2: Fondo y tipografía globales
- [x] `body`: `background: var(--md-sys-color-background)`, `color: var(--md-sys-color-on-background)`, tipografía `body-large` (tamaño/line-height desde los tokens del Step 1)
- [x] `.app-header h1`: tipografía `title-large`

### Step 3: Tarjetas
- [x] `.card`: `background: var(--md-sys-color-surface)`, `border-color: var(--md-sys-color-outline-variant)`, `border-radius: var(--md-sys-shape-corner-medium)`

### Step 4: Botones
- [x] `button`: `background: var(--md-sys-color-primary)`, `color: var(--md-sys-color-on-primary)`, `border-radius: var(--md-sys-shape-corner-full)`, tipografía `label-large`
- [x] `button.secondary`: `background: transparent`, `border-color: var(--md-sys-color-outline)`, `color: var(--md-sys-color-primary)`
- [x] `button.danger`: `background: var(--md-sys-color-error)`, `color: var(--md-sys-color-on-error)` (deja de ser una excepción — ya no hardcodea rojo)
- [x] `.error-message`: `color: var(--md-sys-color-error)`, tamaño `body-small`

### Step 5: Chips y option-item
- [x] `.chip`: `border-color: var(--md-sys-color-outline)`, `border-radius: var(--md-sys-shape-corner-small)`, tipografía `label-medium`
- [x] `.chip[aria-pressed="true"]`: `background: var(--md-sys-color-secondary-container)`, `color: var(--md-sys-color-on-secondary-container)`, `border-color: transparent`
- [x] `.chip-search-input`: `border-radius: var(--md-sys-shape-corner-small)`, `border-color: var(--md-sys-color-outline)`, tipografía `label-medium`
- [x] `.chip-remove`: `background: var(--md-sys-color-outline-variant)`
- [x] `.option-item`: `border-color: var(--md-sys-color-outline-variant)`, `border-radius: var(--md-sys-shape-corner-small)`
- [x] `.option-item[aria-pressed="true"]`: `background: var(--md-sys-color-secondary-container)`, `color: var(--md-sys-color-on-secondary-container)`, `border-color: transparent`
- [x] `.icon-picker-option` / `.icon-picker-option[aria-pressed="true"]`: mismo tratamiento que `.option-item`

### Step 6: Inputs
- [x] `.product-form input[type="text"]`, `.product-form select`, `.text-input`, `.custom-date-range input[type="date"]`: `border-color: var(--md-sys-color-outline)`, `background: var(--md-sys-color-surface)`, `color: var(--md-sys-color-on-surface)`, `border-radius: var(--md-sys-shape-corner-extra-small)`, tipografía `body-large`
- [x] `.text-input:focus`: `border-color: var(--md-sys-color-primary)`, `box-shadow: 0 0 0 3px color-mix(in srgb, var(--md-sys-color-primary) 15%, transparent)`

### Step 7: Documentación del lote
- [x] Crear `aidlc-docs/construction/ciclo-3-design-system/code/lote-0-1-v2-fundaciones-m3-summary.md` con el detalle de la migración y el script usado para calcular la paleta (referenciado, no commiteado — es una herramienta de un solo uso fuera del repo)

## Criterio de verificación de este lote
- `npm test` en verde (230/230)
- Verificación visual del usuario: paleta verde-M3 (más apagada/terrosa que el Lime puro de Radix, por diseño — M3 reduce la saturación para roles de texto/fondo), botones tipo píldora, chips con esquinas de 8px, tarjetas con esquina de 12px
