# Infrastructure Design — Unidad 4: Onboarding y acceso

## Cambios de infraestructura respecto a las Unidades 1-3
**Ninguno relevante.** Se añade `manifest.json` como archivo estático más al sitio (servido directamente por Vercel, sin configuración adicional). La librería `qrcode` se carga desde `https://esm.sh`, ya permitida en la CSP de `vercel.json` (`script-src 'self' https://esm.sh`, definida en la Unidad 1).

## Verificación de CSP
La política `Content-Security-Policy` ya incluye `https://esm.sh` en `script-src` (Unidad 1), por lo que no requiere modificación para cargar `qrcode` desde el mismo origen CDN que `@supabase/supabase-js`.
