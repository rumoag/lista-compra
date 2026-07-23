# Unit of Work Dependency Matrix — Lista de la Compra Compartida

## Matriz de dependencias

| Unidad | Depende de | Tipo de dependencia | Bloqueante para empezar código |
|---|---|---|---|
| Unidad 1 — Fundaciones | Ninguna | — | No aplica (primera unidad) |
| Unidad 2 — Tiempo real y acciones en lote | Unidad 1 | Esquema de datos completo (`status`, `bought_by`, `bought_at`) y cliente Supabase (`common/`) | Sí, parcialmente — el esquema completo debe existir, pero según Question 2 (flexible) no es necesario que la Unidad 1 esté 100% "probada" para empezar a codificar la Unidad 2, solo que el esquema esté definido |
| Unidad 3 — Historial y estadísticas | Unidad 1 (esquema), Unidad 2 (datos reales de `bought_at`/`bought_by` para probar con datos representativos) | Esquema de datos + datos de prueba generados por la acción de marcar comprados | Sí para pruebas con datos reales; el desarrollo del módulo `stats/` en sí (lógica de cálculo) puede empezar en paralelo con datos sintéticos |
| Unidad 4 — Onboarding y acceso | Unidad 1 (tabla `households`) | Esquema de datos | No — puede desarrollarse en paralelo a las Unidades 2 y 3 una vez completada la Unidad 1 |

## Estrategia de desarrollo (según Question 2 = Flexible)

- El esquema de datos **completo** (todas las tablas y campos de las 4 unidades) se define y despliega en Supabase durante la Unidad 1, aunque varios campos no se usen todavía.
- Esto desacopla a las Unidades 2, 3 y 4 de tener que esperar a migraciones de esquema incrementales — solo dependen de que el esquema ya exista.
- Orden de codificación recomendado: **Unidad 1 → Unidad 2 → Unidad 3**, con la **Unidad 4 en paralelo** a partir de que la Unidad 1 esté lista (no bloquea ni es bloqueada por las Unidades 2/3, salvo por compartir el mismo repositorio/sitio de despliegue).
- Todas las unidades comparten el mismo despliegue único (Question 4 = A) — no hay coordinación de despliegue independiente entre unidades, solo coordinación de merge en el repositorio.

## Puntos de integración compartidos

- **`common/`** (cliente Supabase, identidad local): creado en Unidad 1, consumido por todas las demás unidades. Cualquier cambio en `common/` durante Unidades posteriores debe revisarse por su impacto en Unidad 1 (ej. si Unidad 4 necesita extender la gestión de identidad local para el flujo de creación de hogar).
- **Tabla `products`**: escrita por Unidad 1 (alta/edición/borrado) y Unidad 2 (marcar comprados), leída por Unidad 3 (historial/estadísticas).
- **Tabla `households`**: escrita/leída por Unidad 4 (creación/acceso), referenciada como `household_id` por todas las filas de `products` desde la Unidad 1.
