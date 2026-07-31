# Domain Entities — Ciclo 5: Estadísticas de calidad con gráficas

No se introducen entidades de persistencia nuevas (NFR-19 — sin cambios de esquema). Se añade un concepto de dominio puramente derivado, calculado en memoria a partir de `products` ya cargados.

## TimeBucket (nuevo, derivado — no persistido)
Representa un periodo agregado (mes o semana) para la evolución temporal (FR-36).

| Campo | Tipo | Descripción |
|---|---|---|
| `periodKey` | string | Clave de ordenación/agrupación, ISO: `"YYYY-MM"` para mes, `"YYYY-Www"` (ISO week) para semana |
| `label` | string | Etiqueta para mostrar: `"jul 2026"` (mes, FR-36.4) o `"dd/mm"` = fecha del lunes de esa semana (FR-36.4) |
| `count` | number | Número de compras (`bought_at`) que caen en ese periodo |

Relación: se deriva de `products` (ya existente), filtrando `status = 'bought'`, agrupando por `periodKey` calculado a partir de `bought_at`.

## Entidades existentes reutilizadas sin cambios
- `products` (Supabase) — sin cambios de esquema.
- `ProductGroup` (`groupByNormalizedName` en `calculations.js`) — reutilizado sin cambios para el ranking.
