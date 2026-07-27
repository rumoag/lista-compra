# NFR Design Patterns — Unidad 7: Historial en Tickets

## Reliability Pattern
**Decisión (Question 1 = A)**: fail-fast sin compensación/rollback, mismo patrón que el resto del proyecto. Las operaciones multi-paso (deshacer ticket BR-51, limpieza de huérfano BR-54) no implementan lógica de compensación si el segundo paso falla tras el éxito del primero — se muestra el mensaje de error genérico y una posible inconsistencia temporal queda corregible manualmente (reabrir el ticket, reintentar la acción). Migración de esquema puramente aditiva (NFR-9), sin pasos manuales de riesgo como en Unidad 6.

## Performance Pattern
- Lista de historial: join completo `purchases` + `products` en una sola consulta por página (20 tickets), sin N+1 — mismo criterio de "agregación en memoria en vez de N+1" ya usado en `home/households-api.js` (Unidad 5) y `list/suggested-products.js` (Unidad 6).
- Filtrado: reutiliza el límite defensivo ya existente (`FILTERED_FETCH_LIMIT = 2000`) sobre `products`, sin ninguna consulta adicional por ticket.

## Security Pattern
- Sin política RLS nueva más allá de la ya decidida para `purchases` (mismo patrón permisivo que `products`/`households`, NFR-11).
- Sin input de usuario nuevo que validar: todos los campos de `purchases` (`bought_by`, `bought_at`) se derivan de datos ya validados/generados en el flujo existente de "Marcar como comprados".

## Maintainability Pattern
- El alias `bought_at` → `created_at` (BR-57) se documenta con un comentario inline en el código, para dejar explícita la razón (compatibilidad con `common/pagination.js` sin modificarlo) y evitar que se lea como un bug en revisiones futuras.
- Ningún componente común (`modal.js`, `confirm-modal.js`, `pagination.js`, `optimistic.js`) se modifica — se usan tal cual, evitando introducir regresiones en las unidades que ya los usan.

## Scalability Patterns
N/A — mismo criterio que unidades anteriores, app personal en capa gratuita.

## Resilience Patterns
N/A — Extensión de Resiliencia desactivada desde Requirements Analysis original.
