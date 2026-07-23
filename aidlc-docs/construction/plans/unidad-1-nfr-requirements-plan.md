# NFR Requirements Plan — Unidad 1: Fundaciones

## Checklist de ejecución

- [ ] Confirmar respuestas a las preguntas de contexto (abajo)
- [ ] Generar `aidlc-docs/construction/unidad-1/nfr-requirements/nfr-requirements.md`
- [ ] Generar `aidlc-docs/construction/unidad-1/nfr-requirements/tech-stack-decisions.md`

## Contexto ya conocido (heredado de Requirements Analysis, no se vuelve a preguntar)
- Frontend: vanilla JS/HTML + Supabase JS client
- Backend/datos: Supabase (Postgres + Realtime + API autogenerada), capa gratuita
- Hosting: Vercel o Netlify, capa gratuita
- Extensión Seguridad: ACTIVADA (bloqueante)
- Extensión Resiliencia: DESACTIVADA
- Extensión PBT: Modo PARCIAL (PBT-02, 03, 07, 08, 09 bloqueantes)

## Preguntas de contexto

### Question 1 — Selección de hosting concreto
El brief deja abierto "Vercel o Netlify". ¿Cuál usamos?

A) Vercel

B) Netlify

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Framework de Property-Based Testing (PBT-09, bloqueante)
Para JavaScript, ¿qué framework de PBT usamos para las funciones identificadas en `business-logic-model.md` (validadores de nombre/cantidad/categoría)?

A) fast-check (recomendado — se integra bien con Vitest/Jest/Mocha, buen shrinking)

B) Otro framework (indícalo)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3 — Test runner / framework de testing general
¿Qué framework de testing usamos para los tests de ejemplo (example-based) que complementan los PBT (PBT-10)?

A) Vitest (rápido, integración nativa con Vite si se usa; funciona igual de bien con vanilla JS)

B) Jest

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4 — Implementación de cabeceras de seguridad (SECURITY-04)
Las cabeceras HTTP de seguridad (CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy) deben aplicarse a las respuestas HTML. ¿Cómo las configuramos?

A) Configuración nativa del hosting (`vercel.json` con sección `headers`, o `_headers` de Netlify) — sin código de servidor propio

B) Vía un middleware/función serverless propia

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5 — Enforcement de políticas RLS (SECURITY-08)
¿Confirmas que el control de acceso por `household_id` se implementa como políticas RLS de Postgres en Supabase (en vez de solo confiar en que el cliente filtre por `household_id`)?

A) Sí, RLS obligatorio en las tablas `households` y `products`, filtrando por `household_id` presente en la query/sesión (recomendado — es la única capa real de control de acceso dado que no hay autenticación)

B) No, confiar solo en que el cliente siempre pase el `household_id` correcto

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6 — Monitorización y logging (dado que Resiliencia está desactivada)
Con la extensión de Resiliencia desactivada, ¿qué nivel de observabilidad quieres para esta unidad?

A) Ninguno más allá de lo que Supabase/Vercel/Netlify ofrecen por defecto en su dashboard (logs de requests, logs de base de datos) — suficiente para un proyecto personal

B) Añadir logging estructurado propio en el cliente (ej. enviar errores a un servicio externo)

X) Other (please describe after [Answer]: tag below)

[Answer]: A
