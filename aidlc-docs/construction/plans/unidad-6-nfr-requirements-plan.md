# Plan de NFR Requirements — Unidad 6: Vista de lista de la compra

## Pasos del plan

- [ ] Evaluar seguridad de la migración destructiva de `quantity` (BR-37) sobre datos ya en producción
- [ ] Confirmar límite defensivo de rendimiento para el cálculo de productos sugeridos (reutilizar el mismo criterio que estadísticas, Unidad 3)
- [ ] Confirmar que no se requieren cambios de RLS ni dependencias nuevas
- [ ] Generar nfr-requirements.md y tech-stack-decisions.md

## Preguntas de clarificación

### Question 1 — Seguridad de la migración destructiva de `quantity`
BR-37 propone eliminar la columna `quantity` tras migrar sus datos a `quantity_number`/`quantity_unit`. Ya tuvisteis un problema real al aplicar la migración de la Unidad 5 (reejecutar el archivo entero falló). Eliminar una columna es **irreversible**: si el parseo best-effort tiene algún caso mal cubierto sobre tus datos reales, se pierde el texto original sin posibilidad de recuperarlo.

¿Cómo prefieres proceder?

A) Eliminar `quantity` directamente tras migrar, tal como describe BR-37 (más simple, coherente con "sustituye" del requirements.md; asumes el riesgo de una migración con datos reales pocos/controlados)

B) Más seguro: en vez de `drop column`, renombrar `quantity` a `quantity_legacy` (dejar de usarla en la app, pero conservar el dato original por si hay que revisar/corregir algo manualmente más adelante); se podría eliminar de verdad en un ciclo futuro una vez confirmado que la migración fue correcta

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Límite defensivo para productos sugeridos
El cálculo de "5 más repetidos" (BR-39) lee todo el histórico de `products` del household. La Unidad 3 aplicó un límite de seguridad de 2000 compras para las estadísticas por la misma razón (evitar traer una tabla sin límite).

¿Aplicamos el mismo límite aquí?

A) Sí, mismo límite de 2000 filas más recientes (consistente con Unidad 3, recomendado)

B) Sin límite — traer todo el histórico sin restricción

C) Other (please describe after [Answer]: tag below)

[Answer]: A
