# Lista de la Compra Compartida

App web móvil para que una pareja gestione una lista de la compra compartida, con acceso por QR, tiempo real, historial y estadísticas. Ver el contexto completo de diseño en [aidlc-docs/](aidlc-docs/).

**Estado actual**: MVP completo (Unidades 1-4) + ciclo de mejora de usabilidad (Unidad 5: pantalla de inicio con listado de listas; Unidad 6: pantalla de lista de la compra rediseñada) — CRUD de productos pendientes vía asistente de 3 pasos, tiempo real, selección múltiple/marcar en lote/eliminar en lote, historial con filtros/corrección, estadísticas, onboarding de nombre local, generación de QR, PWA instalable (sin icono personalizado todavía, ver más abajo).

⚠️ **Nota de seguridad/privacidad (Unidad 5, temporal y aceptada)**: la pantalla de inicio muestra **todas** las listas de **todos** los hogares a cualquiera que abra la app, sin ningún filtro por dispositivo ni login. Es una decisión de producto explícita, no un descuido — ver `aidlc-docs/construction/unidad-5/functional-design/business-rules.md` (BR-34). Está previsto sustituirla por un sistema de credenciales en un ciclo futuro.

⚠️ **Nota de migración (Unidades 5 y 6)**: si tu proyecto Supabase ya estaba desplegado antes de estas unidades, **no reejecutes `supabase/schema.sql` completo** (falla porque las políticas RLS de Unidad 1/2 ya existen y `create policy` no soporta `IF NOT EXISTS`). Ejecuta solo los bloques nuevos del archivo: el que empieza en `-- Unidad 5 — título e icono de lista` y, tras ese, el que empieza en `-- Unidad 6 — cantidad numérica en productos`. Este último es **destructivo** (elimina la columna `quantity`) — revisa el bloque antes de ejecutarlo si tienes datos reales.

## Stack
- Frontend: vanilla JS/HTML (sin bundler), `@supabase/supabase-js` y `qrcode` importados directamente por URL desde esm.sh (`import ... from 'https://esm.sh/...'`) — sin import map, sin instalar estos paquetes vía npm
- Backend/datos: [Supabase](https://supabase.com) (Postgres + RLS + API autogenerada)
- Hosting: [Vercel](https://vercel.com)
- Testing: [Vitest](https://vitest.dev) + [fast-check](https://fast-check.dev) (property-based testing)

## Setup local

1. Crea un proyecto en [Supabase](https://supabase.com) y ejecuta `supabase/schema.sql` en el SQL Editor (incluye el esquema, RLS, y la activación de Realtime sobre `products`).
2. Copia `.env.example` a `.env` y rellena `SUPABASE_URL` y `SUPABASE_ANON_KEY` con los valores de tu proyecto (Settings → API).
3. Instala dependencias:
   ```bash
   npm install
   ```
4. Genera la configuración del cliente (lee `.env` si existe, o las variables de entorno reales si no — así funciona igual en local que en Vercel — y crea `src/common/config.generated.js`):
   ```bash
   npm run build
   ```
5. Sirve la carpeta con cualquier servidor estático, por ejemplo:
   ```bash
   npx serve .
   ```

## Tests

```bash
npm test
```

Incluye tests de ejemplo y property-based testing (fast-check) para las funciones de validación, actualización optimista, paginación, selección múltiple (`src/bulk-actions/selection-state.js`) y suscripción Realtime (mockeada), además de los componentes de formulario/lista/onboarding.

También incluye PBT para el cálculo de estadísticas (`src/stats/calculations.js`) y los filtros de historial (`src/history/filters.js`), bloqueantes bajo PBT-03 en esta unidad.

Ver el detalle de verificación en `aidlc-docs/construction/unidad-{1,2,3,4,5,6}/code/frontend-summary.md`.

## Despliegue (Vercel)

1. Conecta el repositorio a Vercel.
2. Configura las variables de entorno `SUPABASE_URL` y `SUPABASE_ANON_KEY` en el proyecto de Vercel (Settings → Environment Variables), para producción y previews.
3. Vercel ejecutará `npm run build` (ver `vercel.json`) antes de servir el sitio estático.

## Estructura del proyecto

```
index.html
src/
  common/         # cliente Supabase, validación, optimistic update, paginación, modal genérico,
                  # menú de 3 puntos y modal de confirmación genéricos (Unidad 6), modal de QR
  list/           # Unidad 6: cabecera, saludo, tabs, lista de pendientes (scroll infinito),
                  # asistente de 3 pasos crear/editar producto, categorías con icono, sugeridos
  bulk-actions/   # selección múltiple, barra de acción en lote, suscripción Realtime
  history/        # filtros, lista de historial, corrección
  stats/          # cálculo y visualización de estadísticas
  onboarding/     # identidad local (name-prompt), vista de QR
  home/           # Unidad 5: pantalla de inicio, tarjetas de lista, modal crear/editar
css/
manifest.json     # PWA (sin icono todavía)
supabase/
  schema.sql    # esquema de datos + RLS + Realtime
tests/
```

## PWA

La app es instalable ("Añadir a pantalla de inicio") vía `manifest.json`, sin service worker (offline queda fuera del MVP, ver `requirements.md`). **Pendiente**: el manifest no incluye icono todavía (decisión documentada en `aidlc-docs/construction/unidad-4/nfr-requirements/nfr-requirements.md`) — añade uno o más iconos (`"icons": [...]`) cuando tengas un diseño real.

Ver el desglose completo de unidades de trabajo en [aidlc-docs/inception/application-design/unit-of-work.md](aidlc-docs/inception/application-design/unit-of-work.md).
