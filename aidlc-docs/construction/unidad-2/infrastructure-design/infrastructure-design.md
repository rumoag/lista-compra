# Infrastructure Design — Unidad 2: Tiempo real y acciones en lote

## Cambios de infraestructura respecto a la Unidad 1
- **Ninguno** en Vercel (mismo hosting, mismos entornos de producción/preview, mismas variables de entorno).
- **Supabase**: habilitar Realtime (Postgres Changes) para la tabla `products`, añadiéndola a la publicación `supabase_realtime`.

## Declaración de Realtime (Question 1 = A)
Se añade a `supabase/schema.sql` (mismo archivo versionado de la Unidad 1) la sentencia:
```sql
alter publication supabase_realtime add table products;
```
Esto mantiene todo el esquema + configuración de datos en un único artefacto versionado en el repositorio, en vez de un paso manual no versionado en el dashboard.

## WebSocket / Realtime
- El cliente se conecta al endpoint Realtime de Supabase (incluido en el mismo proyecto, sin infraestructura adicional que aprovisionar).
- Reconexión gestionada automáticamente por `@supabase/supabase-js` (sin componentes de infraestructura propios).
