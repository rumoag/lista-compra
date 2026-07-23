# NFR Requirements Plan — Unidad 2: Tiempo real y acciones en lote

## Contexto ya decidido (heredado, no se repite)
- Hosting Vercel, Supabase, testing Vitest, PBT fast-check (modo parcial), RLS permisivo, sin observabilidad adicional.

## Checklist de ejecución
- [ ] Confirmar respuestas a las preguntas de contexto
- [ ] Generar `aidlc-docs/construction/unidad-2/nfr-requirements/nfr-requirements.md`
- [ ] Generar `aidlc-docs/construction/unidad-2/nfr-requirements/tech-stack-decisions.md`

## Preguntas de contexto

### Question 1 — Indicador de conexión Realtime
El cliente de Supabase reintenta reconectar automáticamente el WebSocket si se pierde la conexión. ¿Quieres mostrar algún indicador visual de "desconectado/reconectando" al usuario?

A) No, mantenerlo transparente — si se reconecta en segundos no aporta valor mostrar un indicador para un uso tan simple

B) Sí, mostrar un pequeño indicador (ej. un punto de color) cuando el canal Realtime esté desconectado

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — RLS para Realtime (SECURITY-08)
Supabase Realtime respeta las políticas RLS de `SELECT` ya definidas en la Unidad 1 para decidir qué cambios se notifican al cliente. ¿Confirmas que no hace falta ninguna política adicional específica de Realtime?

A) Confirmo — las políticas RLS de `SELECT` ya creadas en `schema.sql` (Unidad 1) son suficientes para Realtime

B) Quiero revisar/ajustar las políticas específicamente para Realtime

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3 — Habilitar Realtime en la tabla
Por defecto, una tabla de Supabase no emite eventos Realtime hasta añadirla a la publicación `supabase_realtime`. ¿Confirmas que se debe habilitar explícitamente para `products` como parte de esta unidad?

A) Sí, añadir `products` a la publicación `supabase_realtime` (necesario para que funcione cualquier suscripción)

B) No aplica / ya está habierto de otra forma (descríbelo)

X) Other (please describe after [Answer]: tag below)

[Answer]: A
