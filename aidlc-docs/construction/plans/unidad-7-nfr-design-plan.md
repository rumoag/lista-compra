# Plan de NFR Design — Unidad 7 (Historial en Tickets)

## Pasos

- [ ] Resolver preguntas de aclaración (abajo)
- [ ] Crear `nfr-design-patterns.md`
- [ ] Crear `logical-components.md`

## Preguntas de Aclaración

### Question 1 — Patrón de fiabilidad para las operaciones multi-paso del ticket
Deshacer ticket (BR-51) y la limpieza de huérfano (BR-54) requieren dos operaciones secuenciales contra Supabase (update/delete). Si la primera operación tiene éxito pero la segunda falla (ej. se actualizan los productos pero no se borra el `purchase`), queda un ticket "fantasma" (registro en `purchases` sin productos, o con productos ya revertidos a `pending` pero aún enlazados). Dado que la Extensión de Resiliencia está desactivada para este proyecto (sin retries/circuit breakers) y el patrón ya establecido es fail-fast con mensaje de error genérico, ¿cómo lo tratamos?

A) Fail-fast simple, mismo patrón que el resto del proyecto: si la segunda operación falla, se muestra el error genérico y el estado queda como haya quedado en Supabase (posible inconsistencia temporal, corregible manualmente reabriendo el ticket o reintentando la acción); no se implementa lógica de compensación/rollback.

B) Añadir lógica de compensación: si la segunda operación falla tras el éxito de la primera, revertir automáticamente la primera (ej. volver a enlazar los productos al `purchase_id` si el delete de `purchases` falla).

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Componentes lógicos nuevos (colas, caché, circuit breakers)
Esta unidad no introduce ningún componente de infraestructura nuevo (sin colas, sin caché, sin circuit breakers) — mismo criterio que el resto del proyecto (llamadas directas a Supabase). ¿Confirmas que `logical-components.md` solo debe documentar los componentes de frontend nuevos/reutilizados (ya descritos en `functional-design/frontend-components.md`) y sus dependencias, sin infraestructura adicional?

A) Confirmado, sin componentes de infraestructura nuevos.

B) Quiero considerar algo adicional (descríbelo en "Other").

C) Other (please describe after [Answer]: tag below)

[Answer]: A
