# Frontend Components — Unidad 3: Historial y estadísticas

## Módulo `history/`

### `history-filters.js`
- **Props/estado**: `nameQuery` (string), `dateFrom`/`dateTo` (date).
- **Interacción**: input de texto (nombre) + dos inputs de fecha; emite `onChange({ nameQuery, dateFrom, dateTo })` (BR-16).

### `history-list.js`
- **Props/estado**: lista paginada de productos `bought` (vía `common/pagination.js` sobre `bought_at`, BR-18).
- **Interacción**: cada entrada muestra nombre, cantidad/categoría, `bought_by`, `bought_at`; botones "Desmarcar" y "Eliminar" (US-3.3, BR-17).
- **Estado vacío**: mensaje distinto si "sin compras todavía" vs "sin resultados para el filtro aplicado" (criterios de aceptación de US-3.1/US-3.2).

## Módulo `stats/`

### `stats-ranking.js`
- Lista numérica (no gráfico, MVP) del ranking de productos por frecuencia (US-4.1), usando `groupByNormalizedName` + orden descendente por `purchaseCount`.

### `stats-cadence.js`
- Lista/tabla de cadencia media por producto (US-4.2), mostrando "sin datos suficientes" para productos con 1 sola compra (BR-13).

### `stats-distribution.js`
- Dos listas simples: distribución por día de la semana y por persona (US-4.3).

### `stats-page.js`
- Orquesta los tres componentes anteriores; carga el histórico completo (BR-15) una sola vez y lo pasa a cada uno.
