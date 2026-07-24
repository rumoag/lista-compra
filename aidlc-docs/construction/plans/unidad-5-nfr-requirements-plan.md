# Plan de NFR Requirements — Unidad 5: Listado de listas activas

## Pasos del plan

- [ ] Evaluar estrategia de consulta para calcular participantes por lista (rendimiento vs simplicidad)
- [ ] Confirmar que no se requieren cambios de RLS sobre `households` (ya permisivo desde Unidad 1) ni sobre las nuevas columnas
- [ ] Confirmar reutilización de patrones ya establecidos (fail-fast sin reintentos, mensajes de error genéricos, sin nuevas dependencias más allá de las ya usadas)
- [ ] Generar nfr-requirements.md y tech-stack-decisions.md

## Preguntas de clarificación

### Question 1 — Estrategia de consulta para participantes
Calcular los participantes de cada lista requiere leer sus `products`. Con N listas visibles a la vez, hay dos formas de hacerlo:

A) Una consulta por lista (N+1): más simple de implementar y de leer, aceptable dado el volumen esperado (pocas listas, uso personal) (recomendado para este proyecto)

B) Una única consulta agregada (ej. `select household_id, added_by, bought_by from products`, agrupando en JS) que evita el patrón N+1 desde el principio

C) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 2 — Alcance de RLS para esta unidad
Las políticas RLS actuales de `households` ya son permisivas (`using (true)` en select/insert/update/delete desde la Unidad 1), lo cual ya es coherente con la decisión de mostrar todas las listas sin filtro (NFR-2/BR-34). Las nuevas columnas `title`/`image_icon` quedan cubiertas automáticamente por esas mismas políticas, sin necesidad de política nueva.

¿Confirmas que no quieres ninguna restricción de RLS adicional para esta unidad?

A) Confirmado — sin cambios de RLS, se mantiene el modelo permisivo actual (recomendado, coherente con BR-34)

B) Quiero reconsiderar el modelo de RLS ahora (indica qué restricción quieres)

C) Other (please describe after [Answer]: tag below)

[Answer]: A
