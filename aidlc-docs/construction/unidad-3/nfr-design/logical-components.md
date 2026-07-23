# Logical Components — Unidad 3: Historial y estadísticas

## `history/filters.js`
- **Responsabilidad**: `filterByDateRange(products, start, end)`, `filterByName(products, query)` — funciones puras (BR-16).

## `history/history-list.js`, `history/history-filters.js`
- **Responsabilidad**: UI del historial (paginación por cursor sobre `bought_at`, corrección vía `applyOptimistic`).
- **Depende de**: `history/filters.js`, `common/pagination.js`, `common/optimistic.js`, `common/supabase-client.js`.

## `stats/calculations.js`
- **Responsabilidad**: `normalizeProductKey(name)`, `groupByNormalizedName(products)`, `computeAverageCadenceDays(dates)`, `computeRanking(groups)`, `computeDistributionByWeekday(products)`, `computeDistributionByPerson(products)` — todas funciones puras (BR-13, BR-14).

## `stats/stats-ranking.js`, `stats/stats-cadence.js`, `stats/stats-distribution.js`, `stats/stats-page.js`
- **Responsabilidad**: UI de estadísticas, consumen `stats/calculations.js` sobre los datos ya cargados por `stats-page.js` (fetch único de hasta 2000 compras, sin caché).

## Diagrama de dependencias (texto)
```
history/history-filters.js --> history/filters.js
history/history-list.js    --> history/filters.js, common/pagination.js, common/optimistic.js, common/supabase-client.js

stats/stats-page.js         --> common/supabase-client.js, stats/calculations.js
stats/stats-ranking.js      --> stats/calculations.js
stats/stats-cadence.js      --> stats/calculations.js
stats/stats-distribution.js --> stats/calculations.js
```
