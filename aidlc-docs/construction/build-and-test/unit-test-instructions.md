# Unit Test Execution

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
npm test
```

### 2. Review Test Results
- **Expected**: 174 tests pass, 0 failures, en 32 archivos de test (Unidades 1-6)
- **Test Coverage**: no se mide cobertura formal (sin herramienta de coverage configurada); la cobertura funcional se rastrea vía trazabilidad manual a historias de usuario (ver cada `frontend-summary.md`/`business-logic-summary.md` por unidad)
- **Test Report Location**: salida de consola de Vitest (no se genera reporte HTML en esta configuración)

### 3. Resultado real verificado en este entorno
174/174 tests pasan. Desglose por archivo:

| Archivo | Tests |
|---|---|
| tests/common/validation.test.js | 23 |
| tests/common/optimistic.test.js | 3 |
| tests/common/pagination.test.js | 5 |
| tests/common/modal.test.js | 6 |
| tests/common/dropdown-menu.test.js | 4 |
| tests/common/confirm-modal.test.js | 5 |
| tests/common/qr-modal.test.js | 1 |
| tests/list/product-item.test.js | 8 |
| tests/list/product-wizard-modal.test.js | 11 |
| tests/list/product-list.test.js | 9 |
| tests/list/categories.test.js | 4 |
| tests/list/suggested-products.test.js | 7 |
| tests/list/change-name-modal.test.js | 2 |
| tests/list/list-header.test.js | 3 |
| tests/list/greeting.test.js | 2 |
| tests/list/tabs.test.js | 3 |
| tests/onboarding/name-prompt.test.js | 5 |
| tests/onboarding/qr-view.test.js | 3 |
| tests/bulk-actions/selection-state.test.js | 9 |
| tests/bulk-actions/selection-bar.test.js | 6 |
| tests/bulk-actions/realtime-subscription.test.js | 5 |
| tests/history/filters.test.js | 5 |
| tests/history/history-filters.test.js | 2 |
| tests/stats/calculations.test.js | 11 |
| tests/stats/stats-ranking.test.js | 2 |
| tests/stats/stats-cadence.test.js | 3 |
| tests/stats/stats-distribution.test.js | 2 |
| tests/home/households-api.test.js | 8 |
| tests/home/participants.test.js | 4 |
| tests/home/list-card.test.js | 4 |
| tests/home/list-form-modal.test.js | 4 |
| tests/home/home-screen.test.js | 5 |
| **Total** | **174** |

### 4. Fix Failing Tests
Si un test falla:
1. Revisar la salida de Vitest en consola (incluye diff esperado/recibido y, para PBT con fast-check, el caso mínimo reproducible tras shrinking).
2. Determinar si el fallo es un bug de producción o un bug del propio test. Durante la Unidad 6, los tests nuevos encontraron **2 bugs reales de producción** (no de los tests): `getCategoryIcon` con un objeto plano vulnerable a nombres de propiedad heredados (`"valueOf"`), y una falta de re-render tras insertar un producto — ver `build-and-test-summary.md`.
3. Corregir y volver a ejecutar `npm test` hasta que todo pase.

## Property-Based Testing (PBT) — notas de ejecución
- Framework: `fast-check`, integrado con Vitest.
- Reproducibilidad (PBT-08): fast-check registra una semilla en la salida cuando una propiedad falla, permitiendo reproducir el caso exacto.
- Reglas bloqueantes en modo parcial: PBT-02, PBT-03, PBT-07, PBT-08, PBT-09 — todas verificadas como cumplidas en las unidades donde aplican (ver `nfr-requirements.md` de cada unidad). La Unidad 6 añade PBT a `getCategoryIcon` (invariante de icono siempre no vacío) y `validateQuantityNumber` (determinismo).
