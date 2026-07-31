# NFR Design Plan — Ciclo 5: Estadísticas de calidad con gráficas

## Evaluación por categoría

- **Resilience Patterns**: Aplicable — la carga de Chart.js desde `esm.sh` puede fallar (sin conexión, CDN caído). Se pregunta el comportamiento esperado (Question 1).
- **Scalability Patterns**: N/A — no hay mecanismo de escalado nuevo; el volumen de datos ya está acotado por `STATS_FETCH_LIMIT` = 2000 (decidido en NFR Requirements de la Unidad 3, sin cambios en este ciclo).
- **Performance Patterns**: Aplicable — los colores de los gráficos (Chart.js dibuja en `<canvas>`, valores leídos una vez al crear el gráfico) no se actualizan solos si el usuario cambia el modo claro/oscuro del sistema operativo mientras la pantalla de estadísticas está abierta (el resto de la app es CSS puro vía `prefers-color-scheme`, sin JS que escuche cambios de tema). Se pregunta el comportamiento esperado (Question 2).
- **Security Patterns**: Ya cubierto en NFR Requirements (versión fijada, CSP ya permite esm.sh) — sin patrón de diseño adicional necesario.
- **Logical Components**: N/A — sin colas, cachés, circuit breakers ni componentes de infraestructura nuevos; es una pantalla de solo lectura sobre datos ya cargados en memoria.

## Preguntas de aclaración

### Question 1: Comportamiento si Chart.js no carga (sin conexión / CDN caído)
Si `import('https://esm.sh/chart.js@4.4.4/auto')` falla (usuario sin conexión, esm.sh caído), ¿qué debe pasar en la pantalla de estadísticas?

A) Mostrar un mensaje de error genérico en cada sección afectada (ej. "No se pudo cargar el gráfico"), sin bloquear el resto de la pantalla

B) Hacer fallback automático a la alternativa textual accesible ya prevista (Question 2 de NFR Requirements) como contenido principal visible, en vez de solo como texto oculto para lectores de pantalla

C) Other (please describe after [Answer]: tag below)

[Answer]: b

### Question 2: Actualización de colores si cambia el tema del sistema en caliente
Si el usuario cambia el modo claro/oscuro del sistema operativo mientras tiene la pantalla de estadísticas abierta, los gráficos ya dibujados (Chart.js) mantendrían los colores del tema anterior hasta recargar la página o volver a entrar en Estadísticas.

¿Es necesario que los gráficos reaccionen en caliente al cambio de tema?

A) No es necesario — es aceptable que los colores del gráfico se actualicen al volver a entrar en la pantalla de Estadísticas (recarga/re-render), igual que pasaría con cualquier `<canvas>`; no se añade un listener de `matchMedia` nuevo

B) Sí, añadir un listener de `matchMedia('(prefers-color-scheme: dark)')` que reconstruya los gráficos con los colores nuevos en caliente

C) Other (please describe after [Answer]: tag below)

[Answer]: a
