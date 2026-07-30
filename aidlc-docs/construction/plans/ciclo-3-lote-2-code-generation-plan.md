# Code Generation Plan — Ciclo 3, Lote 2: Componentes de listas

## Contexto de la unidad
- Requisitos: FR-28, FR-29 a FR-32 (revisión M3)
- Depende del Lote 0-1 v2 (tokens M3 ya definidos en `css/tokens.css`)
- Alcance: `list-card` y variantes, menú desplegable, filas de producto (incluyendo estado seleccionado), barra de tabs flotante + FAB, avatar/topbar, stepper de cantidad, barra de selección en lote, botones de icono, texto secundario/metadatos
- Fuera de alcance: modales, historial en tickets, receipt, estadísticas (Lote 3); onboarding/QR (Lote 4)

## Decisiones de mapeo (componente M3 de referencia entre paréntesis)
- **`.list-card-icon--create` y `.avatar-button`** (Avatar): fondo `primary-container`, texto `on-primary-container` — mismo tratamiento para ambos por ser "contenedores de icono/inicial" circulares o redondeados
- **`.list-card-title`**: tipografía `title-medium` (en vez de solo `font-weight: 600` suelto)
- **`.dropdown-menu-list`** (Menu): fondo `surface-container`, radio `corner-extra-small` (4px, tamaño de esquina de menús en M3, no `corner-medium`)
- **`.product-item.selected`** (List item seleccionado): fondo `secondary-container`, radio `corner-small`
- **`.tab[aria-current="true"]`** (Navigation activa): fondo `secondary-container`, texto `on-secondary-container` (mismo patrón que chips/option-item seleccionados)
- **`.tabs-nav`**: fondo `surface-container-high` con transparencia (mantiene `backdrop-filter: blur()`), radio `corner-full` (barra de navegación tipo píldora se mantiene, es un contenedor no un botón)
- **`.fab`** (FAB): radio `corner-large` (16px) — **cambio de forma respecto al `50%` circular actual**: M3 rediseñó el FAB por defecto como cuadrado redondeado, no circular
- **`.quantity-stepper button`**: circular (`corner-full`) se mantiene — es un icon-button, no un FAB; borde `outline`
- **`.quantity-stepper input`**: radio `corner-extra-small`, borde `outline`, fondo `surface`
- **`.selection-header`** (barra elevada): fondo `surface-container`, borde inferior `outline-variant`
- **`.icon-button`**: radio `corner-full` (en vez de 8px) — patrón de icon-button circular de M3
- **Texto secundario/metadatos** (`.product-item .meta`, `.empty-state`): se sustituye `opacity: 0.7` por `color: var(--md-sys-color-on-surface-variant)` — más correcto en modo oscuro (contraste garantizado por el propio rol, no depende de opacidad sobre un fondo variable)

## Pasos

### Step 1: Texto secundario y estado vacío
- [x] `.product-item .meta`: quitar `opacity: 0.7`, añadir `color: var(--md-sys-color-on-surface-variant)`
- [x] `.empty-state`: quitar `opacity: 0.7`, añadir `color: var(--md-sys-color-on-surface-variant)`

### Step 2: List-card y menú desplegable
- [x] `.list-card-icon--create`: `background: var(--md-sys-color-primary-container)`, `color: var(--md-sys-color-on-primary-container)`, `border-radius: var(--md-sys-shape-corner-medium)`
- [x] `.list-card-title`: `font-size: var(--md-sys-typescale-title-medium-size)`, `line-height: var(--md-sys-typescale-title-medium-line-height)`, `font-weight: var(--md-sys-typescale-title-medium-weight)`
- [x] `.dropdown-menu-list`: `background: var(--md-sys-color-surface-container)`, `border-radius: var(--md-sys-shape-corner-extra-small)` (se mantiene el `box-shadow` tal cual — la elevación por superficie llega en un lote posterior, junto con modales)

### Step 3: Cabecera, avatar y tabs
- [x] `.list-header-title`: tipografía `title-large`
- [x] `.avatar-button`: `background: var(--md-sys-color-primary-container)`, `color: var(--md-sys-color-on-primary-container)`
- [x] `.tabs-nav`: `background: color-mix(in srgb, var(--md-sys-color-surface-container-high) 85%, transparent)`, `border-radius: var(--md-sys-shape-corner-full)`
- [x] `.tab[aria-current="true"]`: `background: var(--md-sys-color-secondary-container)`, `color: var(--md-sys-color-on-secondary-container)`

### Step 4: Filas de producto y FAB
- [x] `.product-item.selected`: `background: var(--md-sys-color-secondary-container)`, `border-radius: var(--md-sys-shape-corner-small)`
- [x] `.fab`: `border-radius: var(--md-sys-shape-corner-large)` (deja de ser circular, pasa a cuadrado redondeado — forma FAB oficial de M3)

### Step 5: Stepper de cantidad
- [x] `.quantity-stepper button`: `border-color: var(--md-sys-color-outline)`
- [x] `.quantity-stepper input`: `border-radius: var(--md-sys-shape-corner-extra-small)`, `border-color: var(--md-sys-color-outline)`, `background: var(--md-sys-color-surface)`, `color: var(--md-sys-color-on-surface)`

### Step 6: Barra de selección en lote e icon-buttons
- [x] `.selection-header`: `background: var(--md-sys-color-surface-container)`, `border-bottom-color: var(--md-sys-color-outline-variant)`
- [x] `.icon-button`: `border-radius: var(--md-sys-shape-corner-full)`

### Step 7: Documentación del lote
- [x] Crear `aidlc-docs/construction/ciclo-3-design-system/code/lote-2-componentes-listas-summary.md`

## Criterio de verificación de este lote
- `npm test` en verde (230/230)
- Verificación visual del usuario: tarjetas de lista, menú desplegable, cabecera con avatar, tabs flotantes, filas de producto seleccionadas, FAB (ahora cuadrado redondeado en vez de circular), stepper y barra de selección con los roles M3
