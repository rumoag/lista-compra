# Frontend Summary — Ciclo 5: Estadísticas de calidad con gráficas

## Archivos modificados
- `src/stats/calculations.js`: añade `computeTimeSeries(products, granularity)` + helpers de agregación mensual/semanal ISO (BR-67, BR-68, FR-36); resto de funciones sin cambios.
- `src/stats/stats-ranking.js`: pasa a `async`; gráfico de barras horizontales (Chart.js) limitado a Top 10 (BR-69, FR-33); mantiene lista `sr-only` accesible con los mismos datos; fallback a texto visible si Chart.js no carga.
- `src/stats/stats-distribution.js`: pasa a `async`; gráfico de barras (día de la semana, FR-35) y gráfico donut (persona, FR-34); mismo patrón de lista `sr-only` + fallback.
- `src/stats/stats-page.js`: añade el contenedor/skeleton de `stats-timeseries` y `await` a los renderers ahora asíncronos.
- `css/style.css`: añade la utilidad `.sr-only`.
- `tests/stats/calculations.test.js`, `tests/stats/stats-ranking.test.js`, `tests/stats/stats-distribution.test.js`: actualizados.

## Archivos nuevos
- `src/stats/chart-loader.js`: `loadChart()` — import cacheado de Chart.js vía esm.sh, con reintento tras fallo (`nfr-design-patterns.md`).
- `src/stats/chart-theme.js`: `getChartColors()` — lee los tokens de color M3 una vez por gráfico.
- `src/stats/stats-timeseries.js`: evolución de compras (FR-36) — selector Mes/Semana (chips reutilizados de `css/style.css`), gráfico de líneas, recálculo en memoria sin refetch (BR-70).
- `tests/stats/chart-loader.test.js`, `tests/stats/chart-theme.test.js`, `tests/stats/stats-timeseries.test.js`.

## Trazabilidad
| Requisito | Implementación |
|---|---|
| FR-33 (ranking → barras horizontales) | `stats-ranking.js` |
| FR-34 (distribución por persona → donut) | `stats-distribution.js` |
| FR-35 (distribución por día → barras) | `stats-distribution.js` |
| FR-36 (evolución temporal → líneas) | `stats-timeseries.js`, `calculations.js::computeTimeSeries` |
| FR-37 (cadencia sin cambios) | `stats-cadence.js` (no tocado) |
| BR-67 (ventana temporal completa) | `computeTimeSeries` no recorta el rango |
| BR-68 (periodos vacíos = 0) | `fillMonthRange`/`fillWeekRange` en `calculations.js` |
| BR-69 (Top 10 en ranking) | `stats-ranking.js::RANKING_LIMIT` |
| BR-70 (selector sin refetch) | `stats-timeseries.js::renderGranularity` recalcula sobre `products` ya recibidos |
| BR-71 (cadencia sin gráfica) | Sin cambios en `stats-cadence.js` |
| NFR-17/18 (Chart.js, tokens M3) | `chart-loader.js`, `chart-theme.js` |
| NFR Design (fallback, sin listener de tema) | `try/catch` por componente + lectura de color una sola vez |

## Resultado de tests
`npx vitest run tests/stats/` → 7 archivos, 37/37 tests pasan.
