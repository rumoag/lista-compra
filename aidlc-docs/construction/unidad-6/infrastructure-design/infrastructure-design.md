# Infrastructure Design — Unidad 6: Vista de lista de la compra

## Deployment Environment
Sin cambios: Vercel (producción + previews), mismo proyecto Supabase único.

## Compute Infrastructure
N/A — sin backend propio.

## Storage Infrastructure
Migración de esquema sobre `products` ya existente: añadir `quantity_number`/`quantity_unit`, migrar datos de `quantity` (BR-37) y eliminar la columna `quantity`, vía SQL versionado en `supabase/schema.sql` (mismo patrón que Unidades 2 y 5). **Importante para el usuario**: al ser una migración destructiva sobre una columna existente, en el despliegue ya en producción debe ejecutarse **solo el bloque nuevo** del archivo (no el `schema.sql` completo), igual que se corrigió para la Unidad 5.

## Messaging Infrastructure
N/A — Realtime ya cubre `products` desde la Unidad 2; los nuevos campos no requieren cambios de suscripción.

## Networking Infrastructure
N/A — sin nuevos orígenes externos (sin dependencias nuevas), CSP existente sigue siendo válida.

## Monitoring Infrastructure
N/A — mismo criterio que unidades anteriores.

## Shared Infrastructure
N/A — mismo proyecto Supabase/Vercel único ya compartido.
