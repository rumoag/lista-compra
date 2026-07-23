# Logical Components — Unidad 1: Fundaciones

Estructura de `common/` confirmada como submódulos separados (Question 4 = B):

## `common/supabase-client.js`
- **Responsabilidad**: crear y exportar una única instancia del cliente Supabase (`createClient(url, anonKey)`).
- **Consumido por**: todos los demás módulos (`list/`, y en unidades futuras `bulk-actions/`, `history/`, `stats/`, `onboarding/`).

## `common/validation.js`
- **Responsabilidad**: `validateProductName(name)`, `validateQuantity(quantity)`, `validateCategory(category)` — funciones puras (ver `business-logic-model.md` para sus propiedades PBT).
- **Consumido por**: `list/product-form.js`.

## `common/optimistic.js`
- **Responsabilidad**: helper genérico para aplicar un cambio a un estado local de forma optimista, con función de reversión si la operación remota falla (BR-6). Firma conceptual: `applyOptimistic(localState, change, remoteOperation, onError)`.
- **Consumido por**: los tres flujos de `list/` (añadir, editar, eliminar) y, en unidades futuras, por `bulk-actions/`.

## `common/pagination.js`
- **Responsabilidad**: helper para paginación por cursor sobre `created_at` — mantiene el cursor actual, expone `loadNextPage()` y una función para insertar nuevos elementos al principio sin invalidar las páginas ya cargadas (necesario de cara a Realtime en Unidad 2).
- **Consumido por**: `list/product-list.js`.

## Diagrama de dependencias (texto)
```
list/product-form.js   --> common/validation.js, common/optimistic.js, common/supabase-client.js
list/product-item.js   --> common/optimistic.js, common/supabase-client.js
list/product-list.js   --> common/pagination.js, common/supabase-client.js
onboarding (stopgap)   --> (usa localStorage directamente, sin dependencia de Supabase)
```
