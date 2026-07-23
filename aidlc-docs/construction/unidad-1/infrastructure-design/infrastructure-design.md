# Infrastructure Design — Unidad 1: Fundaciones

## Servicios de infraestructura

| Componente lógico | Servicio de infraestructura | Notas |
|---|---|---|
| Hosting del frontend (estático) | **Vercel** | Producción + previews automáticos por rama (Question 1 = B) |
| Base de datos + API autogenerada + Realtime (Unidad 2+) | **Supabase** (un único proyecto) | Question 2 = A — el mismo proyecto sirve producción y previews |
| Control de versiones / CI de despliegue | Git (GitHub u otro) conectado a Vercel | Deploy automático en cada push a `main`; previews automáticos en otras ramas/PRs (Question 3 = A) |
| Dominio | Subdominio `*.vercel.app` (Question 4 = A) | No se requiere dominio propio |
| Configuración/secretos | Variables de entorno de Vercel: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (Question 5 = A) | Inyectadas en build time, no commiteadas al repositorio |

## Implicación de diseño: previews comparten datos de producción
Al combinar Question 1 = B (previews automáticos) con Question 2 = A (un único proyecto Supabase), **los despliegues de preview usan la misma base de datos que producción**. Esto significa:
- Cualquier prueba manual hecha en un preview afecta a los datos reales de la pareja (altas/borrados de prueba aparecerían en su lista real).
- **Recomendación operativa** (no bloqueante): usar los previews solo para verificar que el build/UI carga correctamente, evitando escribir datos de prueba reales; o usar un `household_id` de prueba dedicado si se necesita probar el CRUD end-to-end sin afectar el hogar real.

## Configuración de Supabase (Unidad 1)
- Tabla `households` y `products` con RLS habilitado (políticas permisivas, ver `nfr-design-patterns.md`).
- `anon key` y URL del proyecto expuestos vía variables de entorno de Vercel al build del cliente (son públicos por diseño de Supabase, protegidos por RLS + obscuridad del UUID, no por secreto de la key).

## Configuración de Vercel
- `vercel.json` con sección `headers` aplicando CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy (SECURITY-04) a todas las rutas HTML.
- Build estático simple (sin funciones serverless en esta unidad).
