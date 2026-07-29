# Ciclo 3 — Lote 1: Componentes base

## Archivo modificado
- `css/style.css` — sustitución de valores hardcodeados por tokens de `tokens.css` en: `body`, `.app-header h1`, `.card`, `.card--flush`, `.product-form input[type="text"]`/`select`, `.chip` y variantes, `.option-item` y variante, `.custom-date-range input[type="date"]`, `button` y variantes, `.error-message`, `.text-input` y `:focus`, `.icon-picker-option` y variante

## Cambios clave
- Fondo/texto global: `var(--sand-1)` / `var(--sand-12)`, tipografía `var(--font-family-base)` (Inter) y escala de tamaños Radix
- Tarjetas: borde `var(--sand-6)`, fondo `var(--sand-2)`, radio `var(--radius-4)`
- Botón primario: fondo `var(--accent-9)` (Lime), **texto oscuro** `var(--accent-12)` — Lime-9 es un verde muy claro, texto oscuro da mejor contraste (mismo criterio que usa Radix Themes para acentos claros como lime/amber/mint/sky)
- Botón secundario: borde `var(--sand-7)`, texto `var(--sand-12)`
- Botón danger: **excepción documentada** — mantiene `#dc2626` hardcodeado; no se pidió adoptar una escala roja de Radix en Requirements Analysis (Ciclo 3)
- Chips/inputs/option-item: bordes `var(--sand-6)`/`var(--sand-7)`, radios `var(--radius-3)` (inputs/option-item) o `var(--radius-full)` (chips), estado seleccionado con `var(--accent-9)`/`var(--accent-3)`/`var(--accent-12)`

## Verificación
- `npm test`: 230/230 pasan
- Visual: pendiente de confirmación del usuario (fondo, tarjetas, botones, chips e inputs con el nuevo lenguaje visual; el resto de la app —listas, modales, tabs, historial— sigue con el estilo antiguo hasta los lotes siguientes)
