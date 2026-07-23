# Tech Stack Decisions — Unidad 1: Fundaciones

| Decisión | Elección | Justificación |
|---|---|---|
| Frontend | Vanilla JS/HTML + `@supabase/supabase-js` | Ya decidido en Requirements Analysis; sin framework para minimizar mantenimiento |
| Backend/datos | Supabase (Postgres + Realtime + API autogenerada), capa gratuita | Ya decidido en Requirements Analysis |
| Hosting | **Vercel** (Question 1 = A) | Despliegue simple desde Git, capa gratuita, soporta `vercel.json` para cabeceras |
| Framework de testing | **Vitest** (Question 3 = A) | Rápido, buena integración con proyectos JS modernos, soporta ESM nativo |
| Framework de PBT | **fast-check** (Question 2 = A) | Estándar de facto para PBT en JS/TS, se integra con Vitest, shrinking automático (cumple PBT-08) |
| Cabeceras de seguridad | Configuración nativa de Vercel (`vercel.json` → `headers`) (Question 4 = A) | Sin necesidad de servidor/middleware propio; cumple SECURITY-04 |
| Control de acceso a datos | RLS habilitado en Supabase sobre `households` y `products` (Question 5 = A) | Obligatorio para no dejar tablas sin políticas; ver nota de alcance real en `nfr-requirements.md` (SECURITY-08) |
| Observabilidad | Ninguna herramienta adicional; se usan los dashboards nativos de Supabase y Vercel (Question 6 = A) | Proporcional al tamaño y riesgo del proyecto (Resiliencia desactivada) |
| Gestión de dependencias | `package-lock.json` committeado, sin dependencias no usadas | Cumple SECURITY-10 |

## Dependencias de proyecto (Unidad 1)
- `vitest` (dev dependency, testing)
- `fast-check` (dev dependency, PBT)

**Actualización post-despliegue**: `@supabase/supabase-js` originalmente se resolvía en el navegador vía import map (bare specifier + `<script type="importmap">`), con la librería añadida como `dependency` de npm solo para referencia de versión. Al desplegar en Vercel, el import map (tanto inline como en un archivo externo `/importmap.json`) nunca llegó a registrarse en el navegador y la app se quedaba en blanco. Se sustituyó por un **import directo por URL completa** (`import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.110.8'`) en `src/common/supabase-client.js`, que no depende de import maps. Como consecuencia, `@supabase/supabase-js` ya **no** aparece en `package.json` — se referencia únicamente por URL en el código fuente, y ya no es analizada por `npm audit` (ver nota en `security-test-instructions.md` sobre la vulnerabilidad de `@supabase/auth-js` que motivó originalmente su actualización de versión).
