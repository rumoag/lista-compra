# NFR Design Patterns — Unidad 3: Historial y estadísticas

## Patrón de componente: lógica pura separada de la UI
- `groupByNormalizedName`, `computeAverageCadenceDays` y las funciones de ranking/distribución viven en `stats/calculations.js`; los filtros de historial viven en `history/filters.js` (Question 1 = A). Ambos módulos son independientes de la UI y del cliente Supabase, testeables con PBT sin montar DOM ni mockear red.

## Patrón de rendimiento: recálculo simple sin caché
- Las estadísticas se recalculan por completo cada vez que se abre la pantalla de estadísticas (Question 2 = A): un `fetch` de hasta 2000 compras + cálculo síncrono en memoria. No se implementa caché ni invalidación — con ese volumen el cálculo es del orden de milisegundos, y añadir caché introduciría complejidad de invalidación sin beneficio perceptible para 2 usuarios.

## Logical Components
Ver detalle en `logical-components.md`.
