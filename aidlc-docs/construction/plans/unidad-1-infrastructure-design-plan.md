# Infrastructure Design Plan — Unidad 1: Fundaciones

## Checklist de ejecución

- [ ] Confirmar respuestas a las preguntas de contexto (abajo)
- [ ] Generar `aidlc-docs/construction/unidad-1/infrastructure-design/infrastructure-design.md`
- [ ] Generar `aidlc-docs/construction/unidad-1/infrastructure-design/deployment-architecture.md`

## Categorías N/A (justificadas)
- **Messaging Infrastructure**: N/A — no hay colas ni procesamiento asíncrono; Supabase Realtime (Unidad 2) usa WebSockets gestionados, no infraestructura de mensajería propia.
- **Networking Infrastructure**: N/A — Vercel gestiona el CDN/edge network y TLS automáticamente; no hay load balancer ni API gateway propios que configurar.
- **Compute Infrastructure**: N/A más allá de "sitio estático + funciones edge de Vercel si se necesitaran" — no se prevén funciones serverless propias en esta unidad (todo el acceso a datos es directo desde el cliente al API autogenerada de Supabase).

## Preguntas de contexto

### Question 1 — Entornos de despliegue
Vercel ofrece despliegues de "preview" automáticos por rama/PR además de producción. ¿Qué entornos quieres?

A) Solo producción (un único entorno, despliegue directo desde la rama principal) — más simple para un proyecto personal

B) Producción + previews automáticos por rama (útil si se quiere probar cambios antes de fusionar a producción)

X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 2 — Proyecto Supabase
¿Un único proyecto Supabase (sin separación dev/staging/prod) o prefieres separar entornos?

A) Un único proyecto Supabase para todo (desarrollo y producción comparten la misma base de datos) — adecuado para un proyecto personal de 2 usuarios

B) Proyectos Supabase separados para desarrollo y producción

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3 — Repositorio y despliegue automático
¿Confirmas que el repositorio Git se conecta a Vercel para despliegue automático en cada push a la rama principal?

A) Sí, GitHub (o el proveedor Git que uses) conectado a Vercel, deploy automático en cada push a `main`

B) No, prefiero despliegue manual (`vercel deploy` desde CLI)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4 — Dominio
¿Usamos el subdominio gratuito de Vercel (`*.vercel.app`) o tienes un dominio propio para la app?

A) Subdominio gratuito de Vercel — suficiente para un proyecto personal (el acceso real es vía QR, no importa que la URL sea larga/técnica)

B) Dominio propio (indícalo)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5 — Gestión de variables de entorno
La URL y `anon key` de Supabase deben configurarse como variables de entorno. ¿Cómo las gestionamos?

A) Variables de entorno de Vercel (`SUPABASE_URL`, `SUPABASE_ANON_KEY`), inyectadas en build time ya que es una app estática sin servidor — no se commitean al repositorio

B) Hardcodeadas en el código fuente (más simple, pero la `anon key` de Supabase está diseñada para ser pública de todas formas)

X) Other (please describe after [Answer]: tag below)

[Answer]: A
