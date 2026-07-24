# NFR Design Patterns — Unidad 6: Vista de lista de la compra

## Performance Pattern
- Productos sugeridos: una única consulta (`products` limitada a 2000 filas más recientes, `select name, status, created_at`), agregación por nombre en memoria — mismo patrón de "agregación en memoria en vez de N+1" ya usado en `home/households-api.js` (Unidad 5).
- Scroll infinito: reutiliza `common/pagination.js` sin cambios de cursor; el disparador pasa de "click" a "IntersectionObserver visible", sin cambiar la forma de las consultas a Supabase.

## Security Pattern
- Sin política RLS nueva: las políticas permisivas de `products` ya cubren `quantity_number`/`quantity_unit`.
- Validación de `quantity_number` (rango 1-999) y `quantity_unit` (máx. 20) en cliente + constraints `CHECK` en `schema.sql`, mismo patrón de defensa en profundidad que el resto de campos.

## Reliability Pattern
- Fail-fast sin reintentos automáticos (mismo patrón ya establecido) para: guardar producto (wizard), borrado individual/lote, carga de página adicional por scroll infinito.
- Migración de `quantity` (BR-37): operación única e irreversible, ejecutada explícitamente por el usuario en el SQL Editor de Supabase (mismo flujo manual que Unidad 5), no automatizada en el pipeline de despliegue.

## Maintainability Pattern
- Generalización de `dropdown-menu.js`, `confirm-modal.js`, `qr-modal.js` a `common/`: una sola implementación para los 3 usos existentes tras esta unidad (cabecera, item de producto, tarjeta de lista de Unidad 5).

## Scalability Patterns
N/A — mismo criterio que unidades anteriores.

## Resilience Patterns
N/A — Extensión de Resiliencia desactivada.
