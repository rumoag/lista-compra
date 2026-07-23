# Code Generation Plan — Unidad 3: Historial y estadísticas

## Contexto de la unidad
- **Historias**: US-3.1, US-3.2, US-3.3, US-4.1, US-4.2, US-4.3
- **Dependencias**: Unidad 1 (`common/`, esquema), Unidad 2 (datos reales `bought_at`/`bought_by`)

## Pasos de generación

- [ ] **Step 1 — Business Logic Generation**: crear `src/history/filters.js` (`filterByDateRange`, `filterByName`), `src/stats/calculations.js` (`normalizeProductKey`, `groupByNormalizedName`, `computeAverageCadenceDays`, `computeRanking`, `computeDistributionByWeekday`, `computeDistributionByPerson`).
- [ ] **Step 2 — Business Logic Unit Testing**: crear `tests/history/filters.test.js`, `tests/stats/calculations.test.js` (PBT con fast-check para las invariantes bloqueantes de PBT-03 identificadas en Functional Design, + tests de ejemplo).
- [ ] **Step 3 — Business Logic Summary**: `aidlc-docs/construction/unidad-3/code/business-logic-summary.md`.
- [ ] **Step 4 — Frontend Components Generation**: crear `src/history/history-filters.js`, `src/history/history-list.js`, `src/stats/stats-ranking.js`, `src/stats/stats-cadence.js`, `src/stats/stats-distribution.js`, `src/stats/stats-page.js`; añadir navegación simple en `src/main.js` entre Lista/Historial/Estadísticas.
- [ ] **Step 5 — Frontend Components Unit Testing**: tests de los componentes de historial/estadísticas que no dependan de Supabase directamente (usando datos de ejemplo inyectados).
- [ ] **Step 6 — Frontend Components Summary**: `aidlc-docs/construction/unidad-3/code/frontend-summary.md`.
- [ ] **Step 7 — Documentation Generation**: actualizar `README.md` con las nuevas vistas.

## Trazabilidad de historias
| Historia | Steps |
|---|---|
| US-3.1, US-3.2 | 1, 2, 4, 5 |
| US-3.3 | 4 |
| US-4.1, US-4.2, US-4.3 | 1, 2, 4, 5 |
