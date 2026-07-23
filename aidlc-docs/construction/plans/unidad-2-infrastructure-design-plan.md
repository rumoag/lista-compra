# Infrastructure Design Plan — Unidad 2: Tiempo real y acciones en lote

## Categorías N/A (justificadas)
- **Compute/Networking/Messaging/Storage Infrastructure**: N/A — sin cambios respecto a la Unidad 1 (mismo Vercel + Supabase, sin nuevos servicios). Realtime es una capacidad ya incluida en el proyecto Supabase existente, no un servicio adicional que aprovisionar.
- **Deployment Environment**: N/A — mismos entornos (producción + previews) ya definidos en la Unidad 1.

## Checklist de ejecución
- [ ] Confirmar respuesta a la pregunta de contexto
- [ ] Generar `aidlc-docs/construction/unidad-2/infrastructure-design/infrastructure-design.md`
- [ ] Generar `aidlc-docs/construction/unidad-2/infrastructure-design/deployment-architecture.md`

## Pregunta de contexto

### Question 1 — Dónde se declara la habilitación de Realtime
¿Cómo prefieres declarar la incorporación de `products` a la publicación `supabase_realtime`?

A) Como sentencia SQL añadida a `supabase/schema.sql` (mismo archivo que la Unidad 1), para que todo el esquema + configuración de Realtime esté versionado en un solo lugar

B) Como paso manual documentado (activar el toggle "Realtime" en el dashboard de Supabase para la tabla `products`), sin SQL

X) Other (please describe after [Answer]: tag below)

[Answer]: A
