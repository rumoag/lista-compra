# Business Logic Model — Ciclo 5: Estadísticas de calidad con gráficas

## Flujo 1: Agregación temporal de compras (BR-67, BR-68, BR-70)

**Nueva función pura en `calculations.js`**: `computeTimeSeries(products, granularity)`

1. Filtrar `products` con `status = 'bought'` (ya filtrados en `stats-page.js` antes de llegar aquí, igual que el resto de funciones de `calculations.js`).
2. Si `products` está vacío → devolver `[]` (estado vacío, igual que las secciones existentes).
3. Para cada producto, calcular `periodKey`:
   - `granularity = 'month'`: `periodKey = "YYYY-MM"` de `bought_at`.
   - `granularity = 'week'`: `periodKey` = ISO week del lunes de esa semana, formato `"YYYY-Www"`.
4. Agrupar y contar por `periodKey` (Map).
5. **BR-68**: generar la secuencia completa de periodos entre el primer y el último `periodKey` con datos (inclusive), rellenando con `count = 0` los que no tengan compras.
6. Ordenar por `periodKey` ascendente.
7. Devolver array de `TimeBucket` `{ periodKey, label, count }` (label formateado según FR-36.4).

**BR-70**: `stats-page.js` pasa el array completo de `products` ya cargados al componente de evolución temporal; el cambio de pestaña Mes/Semana llama a `computeTimeSeries` de nuevo con la otra granularidad, sin refetch.

### Testable Properties (PBT-03 — bloqueante, mismo criterio que Unidad 3)
- **Invariante de conteo total**: la suma de `count` de todos los `TimeBucket` devueltos por `computeTimeSeries` es igual al número de productos de entrada (ningún producto se pierde ni se duplica al agregar).
- **Invariante de orden**: el array devuelto está ordenado por `periodKey` ascendente sin huecos (cada periodo consecutivo al anterior según la granularidad, ver BR-68).
- **Invariante de no-negatividad**: todo `count` es `>= 0`.
- **Propiedad de independencia de orden de entrada**: el resultado de `computeTimeSeries` no depende del orden de `products` en el array de entrada (mismo criterio que `computeAverageCadenceDays`, que ya ordena internamente).

## Flujo 2: Ranking limitado a Top 10 (BR-69)

`stats-ranking.js` sigue usando `computeRanking(groups)` (sin cambios en `calculations.js`, ya devuelve orden descendente) y aplica `.slice(0, 10)` **en el componente de presentación**, no en la función de cálculo — `computeRanking` se mantiene genérica y reutilizable (ej. si en el futuro se quisiera un ranking sin límite en otro sitio).

### Testable Property
- El array pasado al componente de gráfico nunca tiene más de 10 elementos, y son exactamente los 10 de mayor `purchaseCount` del resultado de `computeRanking` (sin reordenar).

## Flujo 3: Renderizado de gráficas (FR-33, FR-34, FR-35, FR-36)

Sin lógica de negocio nueva — es responsabilidad de los componentes de presentación (ver `frontend-components.md`) pasar los datos ya calculados (por las funciones puras de `calculations.js`) a la librería de gráficos, que se decide en NFR Requirements.
