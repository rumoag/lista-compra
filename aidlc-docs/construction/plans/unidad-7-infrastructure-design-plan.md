# Plan de Infrastructure Design — Unidad 7 (Historial en Tickets)

## Pasos

- [ ] Resolver preguntas de aclaración (abajo)
- [ ] Crear `infrastructure-design.md`
- [ ] Crear `deployment-architecture.md`

## Preguntas de Aclaración

### Question 1 — Entorno de despliegue
Sin cambios respecto a las unidades anteriores: Vercel (producción + previews) + mismo proyecto Supabase único. ¿Confirmas que no hace falta ningún cambio de entorno/proveedor?

A) Confirmado, mismo entorno (Vercel + Supabase único).

B) Quiero cambiar algo del entorno (descríbelo en "Other").

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Aplicación de la migración de esquema en producción
La migración (`purchases` + `products.purchase_id`) es aditiva (Q1=A de NFR Requirements): no requiere aplicar solo un bloque nuevo con cuidado especial como la migración destructiva de Unidad 6, pero sigue siendo SQL manual que el usuario debe ejecutar en el SQL Editor de Supabase del proyecto ya desplegado (mismo flujo manual que unidades anteriores, sin pipeline de migraciones automatizado). ¿Confirmas ese flujo?

A) Confirmado — el usuario ejecuta manualmente el bloque nuevo de `supabase/schema.sql` en el proyecto Supabase ya desplegado, después de este cambio.

B) Quiero automatizar las migraciones de algún modo (descríbelo en "Other").

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3 — Realtime sobre `purchases`
`products` ya tiene Realtime habilitado desde Unidad 2 (para reflejar cambios de `status`/`purchase_id` en ambos móviles). La nueva tabla `purchases` no está enlazada a ningún flujo de tiempo real descrito en Functional Design (el historial no se especificó como una vista con actualización en vivo entre los dos usuarios, a diferencia de la lista de pendientes). ¿Confirmas que `purchases` NO necesita habilitarse en `supabase_realtime` para esta unidad?

A) Confirmado, sin Realtime en `purchases` — el historial se recarga al entrar/filtrar/paginar, no en vivo.

B) Sí quiero Realtime también en `purchases` (descríbelo el motivo en "Other").

C) Other (please describe after [Answer]: tag below)

[Answer]: B
