# Ciclo 3 — Lote 0-1 v2: Fundaciones M3 + Componentes base (reemplaza Lotes 0-1 con Radix)

## Archivos modificados
- `css/tokens.css` — reescrito por completo: 35 roles de color M3 (claro + oscuro), escala de forma (`--md-sys-shape-corner-*`), escala tipográfica de 15 roles (`--md-sys-typescale-*`) con Inter
- `css/style.css` — `body`, `.app-header h1`, `.card`/`.card--flush`, botones (`button`/`.secondary`/`.danger`), `.error-message`, chips y variantes, `.option-item`/`.icon-picker-option` y variantes, inputs (`.product-form input/select`, `.text-input`, `.custom-date-range input[date]`) migrados de tokens Radix (`--accent-*`/`--sand-*`/`--radius-*`) a tokens M3 (`--md-sys-color-*`/`--md-sys-shape-*`/`--md-sys-typescale-*`)

## Fuente de los valores
- **Color**: `@material/material-color-utilities` v0.4.0 (paquete oficial de Google), script Node de un solo uso (`scratchpad/gen-m3-full.mjs`, no forma parte del repo). Semilla `#bdee63` (Lime-9, mismo verde ya aprobado), esquema `SchemeTonalSpot`, `specVersion: '2025'`, `contrastLevel: 0`.
- **Forma y tipografía**: tokens oficiales de `material-web` v0.192, obtenidos vía `curl` de `raw.githubusercontent.com/material-components/material-web`.

## Cambios de comportamiento respecto al plan anterior (Radix)
- El botón "danger" **ya no es una excepción**: usa el rol `error`/`on-error` real de M3 (antes mantenía un rojo hardcodeado porque no se había pedido una escala roja de Radix)
- Los botones pasan a forma píldora (`corner-full`), siguiendo el patrón M3 "expressive"
- Los chips/opciones pasan de forma píldora/8px mixta a esquina única de 8px (`corner-small`), consistente con el spec de Chips de M3
- El estado "seleccionado" de chips/opciones pasa de un color de acento sólido a los roles `secondary-container`/`on-secondary-container` (patrón "Filter Chip" de M3)
- El foco de inputs usa `color-mix()` para el halo en vez de una variable de color con alfa fijo (Radix no define pasos con alfa reutilizables aquí; técnica equivalente a la ya usada antes con `rgba()`)

## Verificación
- `npm test`: 230/230 pasan
- Visual: pendiente de confirmación del usuario — paleta verde más apagada/terrosa que el Lime puro de Radix (por diseño: M3 reduce saturación en roles de texto/fondo para accesibilidad), botones tipo píldora, chips/tarjetas con esquinas redondeadas moderadas
