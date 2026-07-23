# Tech Stack Decisions — Unidad 4: Onboarding y acceso

| Decisión | Elección | Justificación |
|---|---|---|
| Generación de QR | `qrcode` importado por URL desde esm.sh (Question 1 = A) | Consistente con el patrón sin-bundler usado para Supabase |
| Icono PWA | Ninguno por ahora (Question 2 = B) | Sin herramientas de edición de imágenes disponibles; documentado como pendiente |
| Manifest | `manifest.json` estático, `display: standalone` | Suficiente para instalar en pantalla de inicio |

**Actualización post-despliegue**: se probó primero un import map (`"qrcode": "https://esm.sh/qrcode@1.5.4"`) tanto inline como en un archivo externo `/importmap.json`, pero en el entorno de producción real de Vercel el import map nunca llegó a registrarse en ninguna de las dos variantes (la app se quedaba en blanco). Se sustituyó por un **import directo por URL completa** en el código fuente (`import QRCode from 'https://esm.sh/qrcode@1.5.4'`), que no depende de la característica de import maps del navegador. Como consecuencia, `qrcode` ya **no** se instala como devDependency de npm — los tests mockean directamente el especificador de URL (`vi.mock('https://esm.sh/qrcode@1.5.4', ...)`). Ver la misma nota en `aidlc-docs/construction/unidad-1/nfr-requirements/tech-stack-decisions.md` para `@supabase/supabase-js`, que siguió el mismo cambio.
