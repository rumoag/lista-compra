# Code Generation Plan — Ciclo 5: Estadísticas de calidad con gráficas

**Unit**: `ciclo5-stats-graficas` (sin unidad formal — cambio de un único componente existente `src/stats/`)
**Workspace root**: `C:/Users/rumoa/Documents/proyectos/lista-compra` (ver `aidlc-docs/aidlc-state.md`)
**Trazabilidad**: FR-33 a FR-37 (`requirements.md`), BR-67 a BR-71 (`functional-design/business-rules.md`), Chart.js 4.4.4 vía esm.sh (`nfr-requirements/tech-stack-decisions.md`), patrones de resiliencia/tema (`nfr-design/nfr-design-patterns.md`)

## Step 1: Business Logic Generation
- [x] `src/stats/calculations.js`: añadir `computeTimeSeries(products, granularity)` + helpers internos de agregación mensual/semanal (ISO week), sin modificar las funciones existentes (BR-67, BR-68, FR-36)

## Step 2: Business Logic Unit Testing
- [x] `tests/stats/calculations.test.js`: añadir tests de `computeTimeSeries` — casos base (mes/semana), relleno de periodos vacíos con `count: 0` (BR-68), formato de `label` (FR-36.4) — y propiedades PBT-03 (bloqueantes) vía `fast-check`: conservación del conteo total, orden ascendente sin huecos, no-negatividad, independencia del orden de entrada (19/19 tests pasan)

## Step 3: Shared Chart Helpers (nuevos)
- [x] `src/stats/chart-loader.js`: `loadChart()` — importa `https://esm.sh/chart.js@4.4.4/auto` una sola vez (promesa cacheada), reintenta si la carga anterior falló (patrón de resiliencia, `nfr-design-patterns.md`)
- [x] `src/stats/chart-theme.js`: `getChartColors()` — lee los tokens M3 (`--md-sys-color-primary/secondary/tertiary/on-surface/outline-variant`) vía `getComputedStyle`, una vez por gráfico creado (sin listener de tema, NFR Design Question 2 = A)
- [x] `tests/stats/chart-loader.test.js`, `tests/stats/chart-theme.test.js`: tests unitarios (mock de la importación esm.sh, cacheo, reintento tras fallo; lectura de colores) — 4/4 tests pasan

## Step 4: CSS — utilidad de accesibilidad
- [x] `css/style.css`: añadir clase de utilidad `.sr-only` (oculta visualmente, accesible a lectores de pantalla) — no existe hoy en el proyecto

## Step 5: Frontend Components Generation
- [x] `src/stats/stats-ranking.js` (modificado): pasa a `async`; aplica `computeRanking(groups).slice(0, 10)` (BR-69); renderiza `<canvas>` (barras horizontales) + lista `sr-only` con los mismos datos (FR-33)
- [x] `src/stats/stats-distribution.js` (modificado): pasa a `async`; renderiza `<canvas>` de barras (día de la semana, FR-35) y `<canvas>` donut (persona, FR-34), cada uno con su lista `sr-only` correspondiente
- [x] `src/stats/stats-timeseries.js` (nuevo): componente de evolución temporal (FR-36) — chips Mes/Semana reutilizando `.chip[aria-pressed]` ya existente (BR-70, sin refetch), gráfico de líneas, lista `sr-only`, estado vacío (`stats-timeseries-empty`)
- [x] `src/stats/stats-page.js` (modificado): añade el contenedor y skeleton de `stats-timeseries`; `await` las llamadas a los renderers que ahora son async

## Step 6: Frontend Components Unit Testing
- [x] `tests/stats/stats-ranking.test.js`: actualizar a `await`; añadir tests de límite Top 10 (BR-69) y de fallback visible si Chart.js falla (mock de `loadChart` rechazando) — 4/4 tests pasan
- [x] `tests/stats/stats-distribution.test.js`: actualizar a `await`; añadir test de fallback visible ante fallo de carga — 3/3 tests pasan
- [x] `tests/stats/stats-timeseries.test.js` (nuevo): estado vacío, agregación por defecto mensual, cambio de granularidad recalcula en memoria, fallback ante fallo de Chart.js — 4/4 tests pasan
- [x] `tests/stats/stats-cadence.test.js`: sin cambios (BR-71, componente no modificado) — 3/3 tests siguen pasando

## Step 7: Frontend Components Summary
- [x] `aidlc-docs/construction/ciclo5-stats-graficas/code/frontend-summary.md`: resumen de archivos modificados/creados y trazabilidad a FR/BR

## Step 8: Database Migration Scripts
- [x] N/A — sin cambios de esquema (NFR-19)

## Step 9: Deployment Artifacts
- [x] N/A — sin cambios de infraestructura (Infrastructure Design SKIP)

## Verificación final
- [x] `npm test`: 40/40 archivos, 270/270 tests pasan
- [x] `npm run build`: falla solo por falta de variables de entorno Supabase locales (mismo patrón no relacionado que ciclos anteriores)

---
**Nota**: este plan es la fuente única de verdad para la generación. Cada paso se marcará `[x]` inmediatamente al completarse.
