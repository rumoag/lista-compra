# Tech Stack Decisions — Unidad 4: Onboarding y acceso

| Decisión | Elección | Justificación |
|---|---|---|
| Generación de QR | `qrcode` vía import map (esm.sh) (Question 1 = A) | Consistente con el patrón sin-bundler ya usado para Supabase |
| Icono PWA | Ninguno por ahora (Question 2 = B) | Sin herramientas de edición de imágenes disponibles; documentado como pendiente |
| Manifest | `manifest.json` estático, `display: standalone` | Suficiente para instalar en pantalla de inicio |

`qrcode` se resuelve en el navegador vía import map (CDN esm.sh), igual que `@supabase/supabase-js`, pero se añadió también como **devDependency** (`package.json`) porque Vitest/Vite necesitan poder resolver el paquete real en `node_modules` para ejecutar y mockear los tests — sin ella, `npm test` fallaba con "Failed to resolve import qrcode".
