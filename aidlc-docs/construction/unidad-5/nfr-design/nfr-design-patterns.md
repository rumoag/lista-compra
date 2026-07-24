# NFR Design Patterns — Unidad 5: Listado de listas activas

## Performance Pattern
Agregación en memoria en vez de N+1: `households-api.js` ejecuta dos consultas independientes (`households` completa, `products` con solo `household_id/added_by/bought_by`) y las combina en JavaScript agrupando por `household_id`, en vez de una consulta de participantes por cada household. Consistente con la decisión de NFR Requirements (Question 1 = B).

## Security Pattern
- Sin política RLS nueva: se reutilizan las políticas permisivas existentes de `households` (Unidad 1), extendidas automáticamente a `title`/`image_icon`.
- La consulta de `households-api.js` que trae todas las listas **no debe** añadir ningún filtro (por dispositivo, `localStorage`, etc.) — sería contradecir BR-34. Se documenta con un comentario explícito en el código, igual que se hizo con SECURITY-08 en Unidad 1.
- Validación de `title` (BR-24) e `image_icon` (BR-25) en el cliente antes de cualquier `insert`/`update`, más los `CHECK` constraints correspondientes en `schema.sql` como defensa en profundidad.

## Reliability Pattern
Fail-fast sin reintentos automáticos (mismo patrón que Unidad 1 NFR Design): cualquier operación de `households-api.js` que falle propaga el error hacia el componente que la invocó, que lo traduce en un mensaje genérico dentro del modal correspondiente, sin cerrarlo, permitiendo reintentar manualmente.

## Scalability Patterns
N/A — app personal en capa gratuita, sin requisitos de escalado horizontal (mismo criterio que unidades anteriores).

## Resilience Patterns
N/A — Extensión de Resiliencia desactivada desde Requirements Analysis original.
