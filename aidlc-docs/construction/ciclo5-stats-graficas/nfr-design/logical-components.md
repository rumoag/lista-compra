# Logical Components — Ciclo 5: Estadísticas de calidad con gráficas

**N/A** — no se introducen componentes de infraestructura lógicos (colas, cachés, circuit breakers, rate limiters, etc.). La pantalla de estadísticas es de solo lectura sobre datos ya cargados en memoria desde un único fetch a Supabase (sin cambios respecto a la Unidad 3 original), y el único componente externo nuevo es la librería de presentación Chart.js (cliente puro, sin estado de infraestructura), ya cubierta en `nfr-design-patterns.md` (Resilience) y `tech-stack-decisions.md`.

## Componentes de código (no de infraestructura) afectados
Para referencia cruzada con `functional-design/frontend-components.md`:
- `stats-ranking.js`, `stats-distribution.js` (modificados)
- `stats-timeseries.js` (nuevo)
- `stats-cadence.js` (sin cambios)
- `calculations.js` (añade `computeTimeSeries`, resto sin cambios)
