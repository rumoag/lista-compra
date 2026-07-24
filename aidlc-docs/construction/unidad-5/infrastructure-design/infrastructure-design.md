# Infrastructure Design — Unidad 5: Listado de listas activas

## Deployment Environment
Sin cambios respecto a Unidad 1: Vercel (producción + previews), mismo proyecto Supabase único.

## Compute Infrastructure
N/A — sin backend propio, misma arquitectura estática + Supabase gestionado.

## Storage Infrastructure
Migración de esquema sobre la tabla `households` ya existente (mismo proyecto Supabase, sin tabla nueva): `alter table households add column title text, add column image_icon text`, backfill de filas existentes (BR-26), y constraints `CHECK` para `title`/`image_icon` (BR-24, BR-25), aplicada vía SQL versionado en `supabase/schema.sql` (mismo patrón que la migración de Realtime en Unidad 2).

## Messaging Infrastructure
N/A — sin cambios sobre Realtime; esta unidad no depende de suscripciones en tiempo real (el listado se recarga tras cada acción del propio usuario, no por eventos de otros dispositivos).

## Networking Infrastructure
N/A — sin cambios sobre CSP/cabeceras; se reutiliza la configuración existente de Vercel (`vercel.json`), no se añaden orígenes externos nuevos (sin dependencias nuevas).

## Monitoring Infrastructure
N/A — mismo criterio que unidades anteriores, sin observabilidad adicional.

## Shared Infrastructure
N/A — no se comparte infraestructura nueva entre unidades más allá del proyecto Supabase/Vercel único ya compartido desde la Unidad 1.
