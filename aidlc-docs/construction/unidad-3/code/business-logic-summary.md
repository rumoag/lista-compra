# Business Logic Summary — Unidad 3: Historial y estadísticas

## Archivos generados

- **Created**: `src/history/filters.js` — `filterByDateRange`, `filterByName` (BR-16).
- **Created**: `src/stats/calculations.js` — `normalizeProductKey`, `groupByNormalizedName`, `computeAverageCadenceDays`, `computeRanking`, `computeDistributionByWeekday`, `computeDistributionByPerson` (BR-13, BR-14).

## Tests generados

- **Created**: `tests/history/filters.test.js` — PBT (invariantes de rango de fechas y coincidencia de nombre, ambas bloqueantes bajo PBT-03) + tests de ejemplo.
- **Created**: `tests/stats/calculations.test.js` — PBT (invariante de conservación de conteo en `groupByNormalizedName`, invariante de rango en `computeAverageCadenceDays`, independencia de orden) + tests de ejemplo (agrupación de variantes de mayúsculas, caso concreto de cadencia "cada 6 y 8 días → media 7", ranking, distribución por día/persona).

## Trazabilidad
- BR-13 → `computeAverageCadenceDays`
- BR-14 → `normalizeProductKey`, `groupByNormalizedName`
- BR-16 → `filterByDateRange`, `filterByName`
