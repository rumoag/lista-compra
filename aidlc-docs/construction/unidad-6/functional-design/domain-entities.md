# Domain Entities — Unidad 6: Vista de lista de la compra

## Entidad: Product (extendida)
`quantity` (texto libre único) se sustituye por dos campos:

| Campo | Tipo | Restricciones |
|---|---|---|
| `quantity_number` | integer | **Nuevo**. Obligatorio, entre 1 y 999, por defecto 1 |
| `quantity_unit` | text, nullable | **Nuevo**. Opcional, máx. 20 caracteres (ej. "litros", "paquete") |
| ~~`quantity`~~ | — | **Eliminado** tras la migración (BR-37) |

Resto de campos de `Product` (Unidad 1) sin cambios: `name`, `category`, `status`, `added_by`, `bought_by`, `created_at`, `bought_at`.

## Concepto (estático, no persistido): Iconos de categoría
Mapa fijo categoría → icono (BR-38), con icono genérico de fallback:

```
Lácteos   → 🥛
Limpieza  → 🧴
Fruta     → 🍎
Verdura   → 🥦
Panadería → 🍞
(cualquier otra / sin categoría) → 📦
```

## Concepto (derivado, no persistido): Productos sugeridos
| Campo | Tipo | Origen |
|---|---|---|
| `suggestedProducts` | string[] (máx. 5) | Los nombres de producto más frecuentes en todo el histórico de `products` de ese household (BR-39), excluyendo los que ya están `status = pending` actualmente |

## Concepto (transversal): Selección múltiple ampliada
Reutiliza `bulk-actions/selection-state.js` (Unidad 2) sin cambios de estructura — se añade únicamente la orquestación de "seleccionar todos" forzando la carga completa de páginas restantes (BR-43) antes de invocar `selectAll(ids)`.
