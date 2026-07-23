# Business Rules — Unidad 3: Historial y estadísticas

## BR-13: Cálculo de cadencia media (Question 1 = A)
- **Regla**: para un producto con N ≥ 2 compras ordenadas por `bought_at` ascendente, la cadencia media en días es la media aritmética de los N-1 intervalos consecutivos: `promedio((t_i+1 - t_i) en días)`.
- Si N < 2, no hay cadencia calculable — se muestra explícitamente "sin datos suficientes" (US-4.2), nunca un `0` o valor engañoso.

## BR-14: Normalización para agrupación estadística (Question 2 = A)
- **Regla**: dos productos con el mismo nombre salvo mayúsculas/espacios extra se consideran el mismo producto a efectos de ranking (US-4.1), cadencia (US-4.2) y distribución (US-4.3). La clave de agrupación es `name.trim().toLowerCase()` tras aplicar `normalizeWhitespace` (reutilizado de `common/validation.js`).
- El nombre mostrado en la UI para el grupo es el de la aparición más reciente (evita mostrar una variante de capitalización antigua).

## BR-15: Ventana temporal de estadísticas (Question 3 = A)
- **Regla**: todas las estadísticas se calculan sobre el histórico completo de compras del household, sin ventana temporal limitada.

## BR-16: Filtro de historial (Question 4 = A)
- **Regla**: el filtro por rango de fechas de US-3.2 opera exclusivamente sobre `bought_at`. El filtro por nombre de producto es una coincidencia parcial insensible a mayúsculas sobre `name`.

## BR-17: Corrección del historial (heredado de US-3.3, sin cambios de diseño adicionales)
- Desmarcar un producto (volver a `pending`) o eliminarlo del historial son las dos acciones ya definidas en `stories.md`; en términos de datos, "desmarcar" es un `update` a `status='pending', bought_by=null, bought_at=null`, y "eliminar del historial" es un `delete` sobre esa fila.

## BR-18: Paginación del historial (Question 5 = A)
- **Regla**: el historial reutiliza `common/pagination.js` (Unidad 1), paginando por cursor sobre `bought_at` en vez de `created_at`, filtrando `status = 'bought'`.
