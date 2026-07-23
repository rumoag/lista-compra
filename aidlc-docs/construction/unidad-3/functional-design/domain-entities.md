# Domain Entities — Unidad 3: Historial y estadísticas

No hay entidades de base de datos nuevas — se reutiliza `Product` (`status = 'bought'`).

## Concepto de dominio nuevo: Clave de agrupación estadística
- Derivada de `Product.name`, normalizada (minúsculas + `normalizeWhitespace` de `common/validation.js`) para agrupar consistentemente (Question 2 = A).
- No se persiste — se calcula en memoria a partir de los productos comprados cargados.

## Concepto de dominio nuevo: Estadística de producto (calculada, no persistida)
| Campo (calculado) | Descripción |
|---|---|
| `normalizedName` | Nombre normalizado usado como clave de agrupación |
| `purchaseCount` | Número de compras del producto |
| `averageCadenceDays` | Media aritmética de los intervalos en días entre compras consecutivas (Question 1 = A); `null` si `purchaseCount < 2` |
| `lastBoughtAt` | Fecha de la compra más reciente de ese producto |
