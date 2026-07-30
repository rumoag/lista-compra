# Code Generation Plan — Ciclo 3, Lote 1: Componentes base

## Contexto de la unidad
- Requisitos: FR-24 a FR-28, NFR-12 a NFR-14
- Depende del Lote 0 (tokens ya definidos en `css/tokens.css`, cargados desde `style.css`)
- Alcance: tipografía/fondo globales + tarjetas (`.card`), botones, chips, inputs de texto/select/fecha, `.option-item`
- Fuera de alcance de este lote: `list-card`, filas de producto/historial, barra de selección, modales, tabs/FAB, receipt (llegan en Lotes 2-4)

## Decisiones de mapeo (a validar visualmente por el usuario tras generar)
- **Radio de botones/inputs/option-item**: `var(--radius-3)` (6px) — más próximo al `8px` actual que el resto de pasos de la escala
- **Radio de tarjetas**: `var(--radius-4)` (8px)
- **Radio de chips/píldoras**: `var(--radius-full)` (ya era 999px, se sustituye el literal por el token)
- **Botón primario (`button` por defecto)**: fondo `var(--accent-9)`, texto `var(--accent-12)`. Nota: Lime-9 es un verde muy claro; Radix Themes usa texto oscuro (no blanco) sobre los acentos claros como lime/amber/mint/sky por contraste — se aplica el mismo criterio aquí
- **Botón secundario**: borde `var(--sand-7)`, fondo transparente, texto `var(--sand-12)`
- **Botón danger**: se mantiene el rojo actual (`#dc2626`) sin token — no se pidió adoptar una escala roja de Radix en este ciclo (fuera del alcance de Requirements Analysis); se documenta como excepción (FR-24.4)
- **Selección (`chip[aria-pressed]`, `option-item[aria-pressed]`)**: fondo `var(--accent-9)`/`var(--accent-3)` según el patrón de "sólido" vs "suave" de Radix
- **Fondo de página**: `var(--sand-1)`, texto `var(--sand-12)`
- **Tarjetas**: fondo `var(--sand-2)`, borde `var(--sand-6)` (antes `rgba(127,127,127,0.3)`)
- **Inputs/selects**: fondo `var(--sand-1)`, borde `var(--sand-7)`, texto `var(--sand-12)`

## Pasos

### Step 1: Tipografía y fondo globales
- [x] `body`: `font-family: var(--font-family-base)`, `background: var(--sand-1)`, `color: var(--sand-12)`, `font-size: var(--font-size-3)`, `line-height: var(--line-height-3)`
- [x] `.app-header h1`: `font-size: var(--font-size-6)`

### Step 2: Tarjetas
- [x] `.card`: `border-color: var(--sand-6)`, `border-radius: var(--radius-4)`, `background: var(--sand-2)`
- [x] `.card--flush`: sin cambios (ya anula borde/padding/fondo heredado no aplica porque no define `background`; se añade `background: transparent` explícito para que no herede el de `.card`)

### Step 3: Botones
- [x] `button` (primario): `background: var(--accent-9)`, `color: var(--accent-12)`, `border-radius: var(--radius-3)`
- [x] `button.secondary`: `border-color: var(--sand-7)`, `color: var(--sand-12)`
- [x] `button.danger`: `border-radius: var(--radius-3)` (color se mantiene, documentado como excepción)
- [x] `.error-message`: `font-size: var(--font-size-1)` (color se mantiene)

### Step 4: Chips
- [x] `.chip`: `border-color: var(--sand-7)`, `border-radius: var(--radius-full)`, `font-size: var(--font-size-1)`
- [x] `.chip[aria-pressed="true"]`: `background: var(--accent-9)`, `color: var(--accent-12)`, `border-color: var(--accent-9)`
- [x] `.chip-search-input`: `border-radius: var(--radius-full)`, `border-color: var(--sand-7)`, `font-size: var(--font-size-1)`
- [x] `.chip-remove`: `background: var(--sand-5)`

### Step 5: Inputs y option-item
- [x] `.product-form input[type="text"]`, `.product-form select`: `border-color: var(--sand-7)`, `border-radius: var(--radius-3)`, `background: var(--sand-1)`, `color: var(--sand-12)`, `font-size: var(--font-size-3)`
- [x] `.text-input`: mismo tratamiento que arriba; `:focus` usa `border-color: var(--accent-9)` y `box-shadow` con `var(--accent-7)` en vez del azul hardcodeado
- [x] `.option-item`: `border-color: var(--sand-6)`, `border-radius: var(--radius-3)`
- [x] `.option-item[aria-pressed="true"]`: `border-color: var(--accent-9)`, `background: var(--accent-3)`
- [x] `.custom-date-range input[type="date"]`: `border-radius: var(--radius-3)`, `border-color: var(--sand-7)`
- [x] `.icon-picker-option` y `.icon-picker-option[aria-pressed="true"]`: mismo tratamiento que `.option-item`

### Step 6: Documentación del lote
- [x] Crear `aidlc-docs/construction/ciclo-3-design-system/code/lote-1-componentes-base-summary.md` con el detalle de cambios y la excepción del color danger

## Criterio de verificación de este lote
- `npm test` en verde (230/230) — cambios puramente de estilo, sin tocar estructura/`data-testid`
- Verificación visual del usuario: fondo, tarjetas, botones, chips e inputs deben verse con el nuevo lenguaje visual (verde lima + neutros cálidos); el resto de la app (listas, modales, tabs) sigue con el estilo antiguo hasta los lotes siguientes
