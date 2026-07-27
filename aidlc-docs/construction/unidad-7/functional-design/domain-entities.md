# Domain Entities — Unidad 7: Historial en Tickets

## Entidad nueva: `Purchase` (tabla `purchases`)

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid, PK | `gen_random_uuid()` |
| `household_id` | uuid, FK → `households(id)`, `on delete cascade` | Mismo patrón de aislamiento por household que `products` |
| `bought_by` | text, not null | Nombre local de quien ejecutó "Marcar como comprados" |
| `bought_at` | timestamptz, not null | Fecha/hora de la compra completa (ticket) |

## Cambio en entidad existente: `Product` (tabla `products`)

| Campo nuevo | Tipo | Notas |
|---|---|---|
| `purchase_id` | uuid, nullable, FK → `purchases(id)`, `on delete cascade` (Q7=A) | `null` mientras el producto está `pending`; se asigna al ticket creado por "Marcar como comprados"; vuelve a `null` si el producto se desmarca individualmente (BR-53) |

`bought_by` y `bought_at` se mantienen en `products` sin cambios (se siguen escribiendo por producto, en paralelo al registro de `purchases`, para no romper Estadísticas ni el resto de consultas existentes que ya dependen de esos campos — FR-23).

## Relación

`Purchase 1 ──< N Product` vía `products.purchase_id`. Un ticket sin productos (huérfano) no debe persistir — ver BR-53/BR-54.

## Concepto de dominio nuevo: Ticket (vista de UI, no persistida aparte)

Es la combinación de una fila de `purchases` con la lista de sus `products` asociados (`purchase_id = purchases.id`). No es una entidad de base de datos adicional — es el objeto que arma el frontend al combinar ambas tablas (Q3=B: join completo al cargar la lista).
