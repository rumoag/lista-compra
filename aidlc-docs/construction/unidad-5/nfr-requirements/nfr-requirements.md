# NFR Requirements — Unidad 5: Listado de listas activas

## Scalability / Performance
**Decisión (Question 1 = B)**: los participantes de todas las listas se calculan con una única consulta agregada (`select household_id, added_by, bought_by from products`), agrupando por `household_id` en JavaScript, en vez de una consulta por lista. Evita el patrón N+1 desde el diseño inicial, sin coste adicional de complejidad relevante dado que ya se hace una única pasada sobre el resultado.

## Security
- **SECURITY-08 (autorización a nivel de aplicación)**: excepción ya documentada en `requirements.md` (NFR-2) y `business-rules.md` (BR-34) — la pantalla de inicio muestra deliberadamente todas las listas de todos los hogares sin ningún filtro, decisión de producto explícita y temporal del usuario. Se traslada aquí como restricción de diseño confirmada, no bloqueante.
- **RLS (Question 2 = A)**: confirmado sin cambios — las políticas permisivas (`using (true)`) ya existentes en `households` desde la Unidad 1 cubren automáticamente las nuevas columnas `title`/`image_icon`, coherente con BR-34.
- **SECURITY-05 (validación de inputs)**: aplica a `title` (BR-24) e `image_icon` (BR-25) igual que al resto de campos de texto del proyecto — validación en cliente + constraints `CHECK` en base de datos.
- **SECURITY-11 (defensa en profundidad)**: los límites de longitud/pertenencia al set de iconos se aplican tanto en cliente como en constraints de base de datos (igual patrón que BR-1/BR-2 de la Unidad 1).
- Resto de reglas SECURITY-*: sin cambios respecto a lo ya evaluado en la Unidad 1 (N/A o ya cubierto), esta unidad no introduce superficie de ataque nueva más allá de la ya aceptada en BR-34.

## Reliability
- Se reutiliza el patrón ya establecido en el proyecto: fail-fast sin reintentos automáticos, mensajes de error genéricos al usuario en caso de fallo de red/servidor (crear, editar, eliminar lista) — mismo patrón que NFR Design de la Unidad 1.

## Maintainability
- Reutilización de `common/modal.js` como componente genérico evita duplicar lógica de apertura/cierre entre los 3 modales de esta unidad (crear/editar, QR, confirmación de borrado).
- `onboarding/create-household.js` queda obsoleto y se elimina (su lógica se sustituye por `home/households-api.js` y `home/list-form-modal.js`), evitando dos caminos de creación de household coexistiendo.

## Tech Stack
- Sin dependencias nuevas: se reutiliza `@supabase/supabase-js` ya presente, y el generador de QR ya usado en la Unidad 4 (`qrcode` vía esm.sh).
- Vanilla JS/CSS, consistente con NFR-4 de requirements.md (Ciclo 2).

## Scalability Patterns
N/A — mismo criterio que unidades anteriores: capa gratuita de Supabase/Vercel, sin requisitos de escalado horizontal para una app personal.

## Resilience Patterns
N/A — Extensión de Resiliencia desactivada desde Requirements Analysis original (aidlc-state.md).
