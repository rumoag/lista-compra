# NFR Requirements — Unidad 7: Historial en Tickets

## Reliability
**Decisión (Question 1 = A)**: la migración de esquema es puramente aditiva (tabla `purchases` + columna `products.purchase_id`, ambas nuevas), sin eliminar ni transformar datos existentes — a diferencia de la migración destructiva de `quantity` en Unidad 6, aquí no hay riesgo de pérdida de datos.

## Performance
**Decisión (Question 2 = A)**: sin límite adicional a nivel de productos por ticket — el volumen esperado (app personal de 2 usuarios) hace que un ticket con cientos de productos sea un caso extremo no realista. Se mantienen los límites ya existentes: 20 tickets por página sin filtro, hasta 2000 productos (`FILTERED_FETCH_LIMIT`) al filtrar.

## Security
**Decisión (Question 3 = A)**: `purchases` reutiliza el mismo modelo RLS permisivo ya establecido para `products`/`households` (NFR-11 de Requirements Analysis) — sin autenticación propia, aislamiento por UUID no adivinable del household, consistente con la excepción SECURITY-08 ya aceptada para el proyecto. Sin superficie de ataque nueva: no se añade almacenamiento de archivos, ni endpoints propios, ni input de usuario nuevo (todos los campos de `purchases` se derivan de datos ya validados en `products`).

## Scalability
N/A — mismo criterio que unidades anteriores, app personal en capa gratuita.

## Resilience Patterns
N/A — Extensión de Resiliencia desactivada desde Requirements Analysis original.

## Maintainability
- El hack de copiar `bought_at` a `created_at` (BR-57) se documenta inline en el código como decisión deliberada de compatibilidad con `common/pagination.js`, para que no se confunda con un bug en revisiones futuras.
- Reutilización íntegra de `common/modal.js`, `common/confirm-modal.js`, `common/pagination.js`, `common/optimistic.js` sin modificarlos, evitando duplicar lógica ya probada.
