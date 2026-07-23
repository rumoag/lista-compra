# Functional Design Plan — Unidad 1: Fundaciones

## Contexto de la unidad
- **Responsabilidades**: setup Supabase, esquema de datos completo (`households`, `products`), módulo `common/` (cliente Supabase + identidad local), módulo `list/` (alta, edición, borrado de pendientes, sin Realtime todavía).
- **Historias cubiertas**: US-1.1, US-1.2 (parcial), US-1.3, US-1.4

## Checklist de ejecución

- [ ] Confirmar respuestas a las preguntas de contexto (abajo)
- [ ] Generar `aidlc-docs/construction/unidad-1/functional-design/domain-entities.md`
- [ ] Generar `aidlc-docs/construction/unidad-1/functional-design/business-rules.md`
- [ ] Generar `aidlc-docs/construction/unidad-1/functional-design/business-logic-model.md` (incluye sección "Testable Properties" para PBT-01, orientativo en modo parcial)
- [ ] Generar `aidlc-docs/construction/unidad-1/functional-design/frontend-components.md` (la unidad incluye UI)

## Preguntas de contexto

### Question 1 — Dependencia de identidad local (Unidad 1 vs Unidad 4)
US-1.1 requiere que cada producto se registre con `added_by` (nombre local), pero el flujo completo de "elegir nombre la primera vez" (US-5.1) pertenece a la Unidad 4. ¿Cómo resolvemos esto en la Unidad 1?

A) La Unidad 1 implementa ya una versión mínima de captura de nombre local (un simple prompt/input la primera vez, guardado en `localStorage`), que la Unidad 4 luego pulirá con la pantalla de onboarding completa y la creación de hogar

B) La Unidad 1 usa un valor hardcodeado temporal (ej. "Usuario") para `added_by` hasta que la Unidad 4 implemente la captura real

C) La Unidad 1 no se prueba de forma aislada por un usuario real hasta que la Unidad 4 esté lista; se acepta que quede incompleta funcionalmente hasta entonces

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Creación del household en Unidad 1
De forma similar, US-1.1 a US-1.4 (CRUD de productos) requieren un `household_id` existente, pero la creación de household completa (botón "Crear nueva lista") es US-5.2, de la Unidad 4. ¿Cómo lo resolvemos?

A) La Unidad 1 crea el household de forma manual/script para poder probar el CRUD (sin UI todavía), y la Unidad 4 añade la UI real de creación

B) La Unidad 1 ya implementa una versión mínima de "crear hogar" (sin pulir) para poder probar de extremo a extremo, y la Unidad 4 la pule

X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 3 — Validación de campos (Business Rules)
Para `name` (nombre del producto), ¿qué límites de longitud y formato quieres aplicar (relevante para SECURITY-05: validación de inputs)?

A) Nombre obligatorio, máximo 100 caracteres, sin restricción de caracteres especiales más allá de sanear HTML/script

B) Nombre obligatorio, máximo 50 caracteres, solo letras/números/espacios/acentos (más restrictivo)

X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 4 — Cantidad y categoría: ¿algún límite?
`quantity` y `category` son texto libre nullable. ¿Aplicamos algún límite de longitud?

A) Sí, máximo 50 caracteres para `quantity` y máximo 40 caracteres para `category` (evita abuso/inputs desproporcionados, alineado con SECURITY-05)

B) No, sin límite explícito más allá del límite general de tamaño de fila de Postgres

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5 — Comportamiento ante fallo de red al añadir/editar/borrar
¿Qué debe pasar si falla la escritura a Supabase (ej. sin conexión momentánea) al añadir/editar/borrar un producto?

A) Mostrar un mensaje de error genérico y no aplicar el cambio localmente hasta confirmar éxito (no optimistic UI)

B) Aplicar el cambio de forma optimista en la UI y revertirlo si falla, mostrando un error

X) Other (please describe after [Answer]: tag below)

[Answer]: B
