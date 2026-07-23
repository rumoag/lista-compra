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

## Nota post-despliegue: import map externo en vez de inline (SECURITY-04, sin excepciones)
Al desplegar en Vercel, la app cargaba pero quedaba en blanco: la CSP (`script-src 'self' https://esm.sh`) bloqueaba el `<script type="importmap">` inline de `index.html` — los navegadores tratan el import map como un script inline normal a efectos de CSP. Sin el import map registrado, las importaciones `bare specifier` de `@supabase/supabase-js` y `qrcode` fallaban y detenían toda la app silenciosamente.

Se probó primero añadir `'unsafe-inline'` a `script-src` como excepción documentada, pero no resolvió el problema de forma fiable. **Corrección definitiva**: el import map se movió a un archivo externo servido desde el propio origen — `importmap.json` en la raíz, referenciado como `<script type="importmap" src="/importmap.json"></script>` — de modo que se carga como cualquier otro recurso `'self'`, sin necesitar ninguna relajación de la CSP. Esta solución es más estricta que la excepción con `'unsafe-inline'` (que se revirtió) y evita por completo la ambigüedad de si el navegador aplica `'unsafe-inline'` a los import maps.

## Nota post-despliegue #2: `esm.sh` también en `connect-src`
Tras corregir el import map, la consola mostró bloqueos de CSP adicionales: `@supabase/supabase-js` servido desde esm.sh se descompone en varios sub-paquetes (`@supabase/auth-js`, `realtime-js`, `postgrest-js`, `functions-js`, `storage-js`, `phoenix`, `tslib`, etc.) que esm.sh resuelve con peticiones adicionales bajo `connect-src`, no solo `script-src`. La CSP original solo permitía `'self'` y `*.supabase.co` en `connect-src`. **Corrección**: añadido `https://esm.sh` también a `connect-src`.
