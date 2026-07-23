# Deployment Architecture — Unidad 1: Fundaciones

## Diagrama (texto)

```
[Móvil pareja] --HTTPS--> [Vercel: sitio estático (*.vercel.app)]
                                 |
                                 | fetch (API autogenerada REST, anon key)
                                 v
                        [Supabase: Postgres + RLS]
                        (households, products)
```

## Flujo de despliegue
1. Push a `main` → Vercel construye y despliega a producción automáticamente.
2. Push a cualquier otra rama / apertura de PR → Vercel genera un despliegue de preview con su propia URL temporal, usando el **mismo** proyecto Supabase que producción (ver nota en `infrastructure-design.md`).
3. Variables de entorno (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) configuradas una vez en el dashboard de Vercel, heredadas por producción y previews.

## Entornos
- **Producción**: `main` → dominio `*.vercel.app` de producción.
- **Preview**: cualquier otra rama/PR → dominio `*.vercel.app` temporal por despliegue.
- **Datos**: un único proyecto Supabase para ambos entornos (sin separación dev/prod).

## Fuera de alcance en Unidad 1
- Configuración de Realtime (Unidad 2).
- Cualquier función serverless propia (no se prevé necesidad en ninguna unidad; toda la lógica de datos pasa por la API autogenerada de Supabase desde el cliente).
