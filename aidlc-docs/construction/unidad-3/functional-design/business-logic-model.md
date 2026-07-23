# Business Logic Model — Unidad 3: Historial y estadísticas

## Flujo: Cargar historial
1. Consultar `products` con `household_id` actual, `status = 'bought'`, ordenado por `bought_at` descendente, paginado por cursor (BR-18).
2. Renderizar cada entrada con nombre, cantidad, categoría, `bought_by`, `bought_at`.

## Flujo: Filtrar historial (US-3.2)
1. Filtro por nombre: coincidencia parcial insensible a mayúsculas sobre `name` (BR-16).
2. Filtro por rango de fechas: sobre `bought_at`, inclusive en ambos extremos (BR-16).
3. Si no hay resultados, mostrar mensaje explícito de "sin resultados" (US-3.2, criterio de aceptación ya definido en `stories.md`).

## Flujo: Corregir historial (US-3.3)
1. Desmarcar: `update` a `pending` limpiando `bought_by`/`bought_at` (BR-17) — usa el mismo patrón `applyOptimistic` de la Unidad 1.
2. Eliminar del historial: `delete` de la fila (BR-17) — optimista con reversión ante fallo.

## Flujo: Calcular estadísticas (US-4.1, US-4.2, US-4.3)
1. Cargar **todos** los productos `bought` del household (histórico completo, BR-15) — no solo la página visible del historial (las estadísticas necesitan el conjunto completo para ser correctas).
2. Agrupar por nombre normalizado (BR-14).
3. Por grupo: `purchaseCount`, `averageCadenceDays` (BR-13), `lastBoughtAt`.
4. Ranking (US-4.1): ordenar grupos por `purchaseCount` descendente.
5. Distribución por día de la semana (US-4.3): contar `bought_at` por día de la semana (0-6) sobre el conjunto completo, sin agrupar por producto.
6. Distribución por persona (US-4.3): contar por `bought_by` sobre el conjunto completo.

## Testable Properties (PBT-01 — modo parcial, pero esta unidad concentra la lógica de negocio más relevante para PBT)

| Función | Categoría | Propiedad |
|---|---|---|
| `normalizeProductKey(name)` | Idempotencia (PBT-04, orientativo) | `normalizeProductKey(normalizeProductKey(x)) === normalizeProductKey(x)` |
| `groupByNormalizedName(products)` | Invariante (PBT-03, **bloqueante**) | La suma de `purchaseCount` de todos los grupos es igual al número total de productos de entrada. Ningún producto de entrada queda sin asignar a un grupo. |
| `computeAverageCadenceDays(sortedDates)` | Invariante (PBT-03, **bloqueante**) | Si `sortedDates.length < 2`, el resultado es `null`. Si `length >= 2`, el resultado está entre el intervalo mínimo y máximo observado (`min(intervalos) <= promedio <= max(intervalos)`). |
| `computeAverageCadenceDays(dates)` vs `computeAverageCadenceDays(shuffle(dates))` | Oracle / invariante de orden (PBT-05, orientativo) | El resultado no depende del orden de entrada, ya que la función ordena internamente antes de calcular — `computeAverageCadenceDays(dates) === computeAverageCadenceDays(shuffled)` para cualquier permutación. |
| `filterByDateRange(products, start, end)` | Invariante (PBT-03, **bloqueante**) | Todo producto en el resultado tiene `bought_at` dentro de `[start, end]`; ningún producto fuera de rango aparece en el resultado. |
| `filterByName(products, query)` | Invariante (PBT-03, **bloqueante**) | Todo producto en el resultado tiene `name` conteniendo `query` (insensible a mayúsculas); el filtro con `query = ''` devuelve todos los productos sin cambios. |

**Nota**: al ser PBT-03 una regla bloqueante en modo parcial, estas invariantes de `groupByNormalizedName`, `computeAverageCadenceDays` y los filtros SÍ deben implementarse como property-based tests reales en Code Generation (no solo documentadas).
