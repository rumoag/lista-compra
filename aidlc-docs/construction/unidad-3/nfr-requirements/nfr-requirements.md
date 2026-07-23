# NFR Requirements — Unidad 3: Historial y estadísticas

## Performance
- El cálculo de estadísticas carga como máximo las **últimas 2000 compras** (`bought_at` descendente) del household (Question 1 = A) — límite de seguridad para evitar que el cliente procese un dataset ilimitado tras años de uso. Para 2 usuarios, esto cubre años de uso real sin alcanzar el límite en la práctica.
- El historial (vista paginada, no el cálculo de estadísticas) sigue el patrón de paginación por cursor ya establecido (BR-18), independiente de este límite.

## Security
- Sin reglas SECURITY-* nuevas respecto a la Unidad 1/2 — las mismas políticas RLS de `SELECT` sobre `products` cubren la lectura para historial y estadísticas.

## Reliability
- BR-13/BR-14 deben manejar de forma segura datos vacíos o con una sola compra (ver Testable Properties) — sin excepciones no controladas.

## Maintainability / Testing
- PBT-03 (invariantes) es **bloqueante** en esta unidad para `groupByNormalizedName`, `computeAverageCadenceDays` y los filtros de historial (ver `business-logic-model.md`). Se reutiliza fast-check + Vitest, sin nuevas dependencias.

## Usability
- Estadísticas mostradas como listas/tablas numéricas (ya decidido en Requirements Analysis); gráficos quedan fuera de esta unidad (nice-to-have no bloqueante, ver `requirements.md`).
