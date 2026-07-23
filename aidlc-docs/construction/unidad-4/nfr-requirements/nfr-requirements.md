# NFR Requirements — Unidad 4: Onboarding y acceso

## Tech Stack
- **QR**: librería `qrcode` cargada vía import map desde esm.sh (Question 1 = A), mismo patrón que `@supabase/supabase-js`, sin bundler ni instalación adicional para el runtime del navegador (sí se añade como devDependency para tests si aplica).
- **PWA**: `manifest.json` **sin icono** por ahora (Question 2 = B) — documentado en el README como pendiente de sustituir por un icono real; algunos navegadores permiten "Añadir a pantalla de inicio" igualmente con un icono genérico.

## Security
- Sin reglas SECURITY-* nuevas. El QR solo codifica una URL ya pública por diseño (el propio supuesto de "seguridad por oscuridad" del proyecto); no se codifica ningún dato sensible adicional.

## Usability
- El botón "Cambiar nombre" y el acceso al QR deben ser descubribles pero no intrusivos (no bloquear el flujo principal de la lista).

## Reliability
- La generación del QR es una operación local (sin red); un fallo de la librería debe mostrar un mensaje de error simple y no bloquear el resto de la app.
