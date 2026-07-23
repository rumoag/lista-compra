# NFR Requirements Plan — Unidad 4: Onboarding y acceso

## Checklist de ejecución
- [ ] Confirmar respuestas a las preguntas de contexto
- [ ] Generar `nfr-requirements.md`, `tech-stack-decisions.md`

## Preguntas de contexto

### Question 1 — Librería de generación de QR
¿Qué usamos para generar el QR client-side (BR-19)?

A) Librería `qrcode` (npm) cargada vía import map desde esm.sh, igual que `@supabase/supabase-js` — mismo patrón ya establecido, sin bundler

B) Implementación propia mínima sin dependencias (más código propio que mantener, pero cero dependencias externas)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Icono de la PWA
Para el `manifest.json` (BR-22) se necesita al menos un icono. ¿Cómo lo resolvemos en este entorno (sin editor de imágenes)?

A) Generar un icono simple con un `<canvas>`/SVG embebido (ej. un emoji de carrito 🛒 sobre fondo de color) convertido a un PNG mínimo válido, como placeholder — documentar en el README que se puede sustituir por un icono real más adelante

B) Dejar el manifest sin icono por ahora y documentar como pendiente (algunos navegadores lo aceptan igualmente para "añadir a inicio", con un icono genérico por defecto)

X) Other (please describe after [Answer]: tag below)

[Answer]: B
