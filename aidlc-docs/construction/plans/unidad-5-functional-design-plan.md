# Plan de Functional Design — Unidad 5: Listado de listas activas (Pantalla 1)

## Pasos del plan

- [ ] Definir entidad "Lista" (extensión de `households`: `title`, `image_icon`) y su relación con `products`
- [ ] Definir reglas de negocio: validación de título, set de iconos, cálculo de participantes, borrado en cascada, migración de listas existentes sin título
- [ ] Definir jerarquía de componentes frontend: pantalla de inicio, tarjeta de lista, menú de 3 puntos, modal genérico reutilizable (crear/editar, QR, confirmación de borrado)
- [ ] Resolver preguntas de clarificación abiertas (abajo)
- [ ] Generar domain-entities.md, business-rules.md, business-logic-model.md, frontend-components.md

## Preguntas de clarificación

### Question 1 — Set de iconos/emojis
Propongo un set cerrado inicial de 12 iconos/emojis genéricos de compra/hogar (🛒 🥦 🧴 🍞 🥛 🧻 🍎 🧀 🍗 🧃 🏠 📦). ¿Te vale este set o prefieres otro?

A) Vale el set propuesto (12 iconos genéricos de compra/hogar)

B) Quiero definir yo el set exacto (indícalo en el campo Other)

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Longitud y validación del título
¿Qué límites aplican al título de la lista?

A) Igual que el nombre de producto ya existente: obligatorio, máx. 50 caracteres, solo letras/números/espacios/acentos

B) Más permisivo: obligatorio, máx. 50 caracteres, cualquier carácter (incluye emojis/símbolos en el título)

C) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 3 — Listas existentes sin título (migración)
Las listas (`households`) creadas antes de este cambio no tienen `title` ni `image_icon`. ¿Qué les asignamos por defecto?

A) Título por defecto genérico ("Lista sin nombre") + primer icono del set (🛒), editable después desde "Editar"

B) Migración manual: tú les pones nombre a mano en Supabase antes de desplegar

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4 — Pantalla vacía (sin listas todavía)
Si no existe ninguna lista aún (ej. primer uso de la app en un proyecto Supabase nuevo), ¿qué se muestra?

A) Solo el botón "Crear nueva lista" con un mensaje breve tipo "Aún no hay listas, crea la primera"

B) El botón "Crear nueva lista" sin mensaje adicional

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5 — Orden del listado
¿En qué orden se muestran las tarjetas de listas?

A) Más recientes primero (por `created_at` descendente)

B) Alfabético por título

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6 — Visualización de participantes con muchos nombres
Si una lista tiene muchos participantes históricos (ej. 8 nombres distintos a lo largo del tiempo), ¿cómo se muestran en la tarjeta?

A) Todos los nombres, separados por coma, sin límite

B) Máximo 3 nombres visibles + contador "y N más"

C) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 7 — Confirmación de borrado
Para el diálogo de confirmación de "Eliminar lista", ¿qué nivel de fricción quieres?

A) Confirmación simple: modal con texto "¿Eliminar esta lista? Se borrarán todos sus productos e historial." + botones Cancelar/Eliminar

B) Confirmación reforzada: además, el usuario debe escribir el título de la lista para confirmar (como GitHub al borrar un repo)

C) Other (please describe after [Answer]: tag below)

[Answer]: A 
