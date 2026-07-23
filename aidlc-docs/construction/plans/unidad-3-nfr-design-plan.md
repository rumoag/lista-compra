# NFR Design Plan — Unidad 3: Historial y estadísticas

## Categorías N/A (justificadas)
- **Security Patterns**: N/A — sin cambios respecto a Unidad 1/2 (RLS de SELECT ya suficiente).
- **Resilience Patterns**: N/A — mismas operaciones CRUD ya cubiertas por `applyOptimistic` (Unidad 1), sin patrones nuevos.

## Checklist de ejecución
- [ ] Confirmar respuestas a las preguntas de contexto
- [ ] Generar `aidlc-docs/construction/unidad-3/nfr-design/nfr-design-patterns.md`
- [ ] Generar `aidlc-docs/construction/unidad-3/nfr-design/logical-components.md`

## Preguntas de contexto

### Question 1 — Ubicación de las funciones puras de estadísticas
Las funciones `groupByNormalizedName`, `computeAverageCadenceDays`, `filterByDateRange`, `filterByName` (identificadas como Testable Properties) ¿dónde deben vivir?

A) Módulo dedicado `stats/calculations.js` (y `history/filters.js` para los filtros), separado de los componentes de UI — más fácil de testear con PBT de forma aislada, consistente con el patrón de `common/validation.js` de la Unidad 1

B) Mezcladas dentro de `stats-page.js` / `history-list.js` directamente

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Recálculo de estadísticas
¿Las estadísticas se recalculan cada vez que se abre la pantalla (fetch + cálculo fresco), o se cachean en memoria durante la sesión?

A) Recalcular siempre al abrir la pantalla — más simple, y con ≤2000 compras el cálculo es prácticamente instantáneo, sin necesidad de caché

B) Cachear en memoria durante la sesión y solo recalcular si hay cambios (más complejo, requiere invalidación)

X) Other (please describe after [Answer]: tag below)

[Answer]: A
