# NFR Requirements — Unidad 2: Tiempo real y acciones en lote

## Scalability / Performance
- Un único canal Realtime por household, sin cambios respecto a la carga esperada (2 usuarios). Reconexión automática gestionada por `@supabase/supabase-js`, sin indicador visual (Question 1 = A).

## Security (Security Baseline — bloqueante)
- **SECURITY-08**: confirmado (Question 2 = A) que las políticas RLS de `SELECT` ya definidas en `schema.sql` (Unidad 1) son las que Supabase Realtime evalúa para decidir qué cambios reenviar a cada cliente suscrito — no se requieren políticas adicionales. Se mantiene la misma nota de alcance documentada en la Unidad 1 (obscuridad del UUID como control real, RLS evita el estado inseguro por defecto).
- Sin cambios en el resto de reglas SECURITY-* respecto a la Unidad 1.

## Reliability
- Fallo parcial en "Marcar como comprados": tratado como transacción lógica única (BR-11) — revert total, sin estados intermedios expuestos al usuario.
- Reconexión de Realtime: delegada al comportamiento por defecto de `supabase-js` (reintentos automáticos con backoff interno de la librería), sin lógica propia adicional.

## Maintainability
- Reutiliza Vitest + fast-check ya decididos en la Unidad 1. El módulo `realtime-subscription.js` se diseña como wrapper aislado (ver `frontend-components.md`) específicamente para poder mockearlo en tests sin necesitar una conexión real a Supabase.

## Infraestructura de datos
- **Habilitar Realtime en `products`** (Question 3 = A): añadir la tabla a la publicación `supabase_realtime` — paso de configuración de base de datos, se documenta en Infrastructure Design y se incluye en `schema.sql` (Code Generation).
