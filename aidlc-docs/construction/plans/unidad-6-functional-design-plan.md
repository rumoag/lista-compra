# Plan de Functional Design — Unidad 6: Vista de lista de la compra (Pantalla 2)

## Pasos del plan

- [ ] Definir migración de `products.quantity` (texto libre) a `quantity_number`/`quantity_unit`
- [ ] Definir reglas de negocio: sugerencias de producto, categorías con icono, selección múltiple ampliada, borrado con confirmación (individual y lote)
- [ ] Definir jerarquía de componentes: cabecera, saludo/modal de nombre, tabs, lista con scroll infinito, menú de 3 puntos por item, wizard de 3 pasos, barra de selección ampliada
- [ ] Resolver preguntas de clarificación abiertas (abajo)
- [ ] Generar domain-entities.md, business-rules.md, business-logic-model.md, frontend-components.md

## Preguntas de clarificación

### Question 1 — Migración de `quantity` existente
Los productos ya creados tienen `quantity` como texto libre (ej. "2 litros", "1 paquete", o vacío). Al añadir `quantity_number`/`quantity_unit`, ¿qué hacemos con esos datos existentes?

A) Migración best-effort: si `quantity` empieza por un número, se extrae como `quantity_number` y el resto del texto (si queda algo) pasa a `quantity_unit`; si no hay número al principio o está vacío, `quantity_number` queda en 1 y todo el texto original pasa a `quantity_unit` (recomendado, no se pierde información visible)

B) No migrar automáticamente: `quantity_number` se pone a 1 y `quantity_unit` queda vacía para todos los productos existentes; el texto original de `quantity` se pierde (se puede reintroducir manualmente editando)

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Cerrar el wizard con progreso ya avanzado
El asistente de crear/editar producto tiene 3 pasos. Si el usuario ya avanzó al paso 2 o 3 y pulsa la "X" para cerrar, ¿pedimos confirmación antes de descartar el progreso, o cerramos directo (igual que el resto de modales del proyecto)?

A) Cerrar directo sin confirmación, igual que todos los demás modales del proyecto — consistencia por encima de proteger este caso concreto (recomendado)

B) Pedir confirmación ("¿Descartar los cambios?") solo si ya se avanzó del paso 1

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3 — Alcance de "Seleccionar todos" con scroll infinito
Con scroll infinito, no todos los productos pendientes están necesariamente cargados en el DOM en un momento dado. Al pulsar "Seleccionar todos", ¿qué se selecciona?

A) Solo los productos ya cargados/visibles hasta ese momento (más simple, más predecible; si el usuario quiere más, hace scroll y puede volver a pulsar "Seleccionar todos")

B) Fuerza la carga de todas las páginas restantes antes de seleccionar, para que "todos" sea realmente todos los pendientes

C) Other (please describe after [Answer]: tag below)

[Answer]: B
