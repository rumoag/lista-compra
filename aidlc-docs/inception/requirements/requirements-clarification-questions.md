# Clarificación — Pantalla 1: Listado de listas de la compra activas

Detecté una contradicción y varios vacíos funcionales antes de poder especificar esta pantalla con precisión.

## Contradicción 1: "Solo UI/UX" vs. concepto nuevo de "múltiples listas"
En la ronda anterior (Q5) dijiste: **A) No cambiar el modelo de datos ni las reglas de negocio ya implementadas, solo UI/UX**.

Pero lo que describes ahora es un cambio funcional real, no solo visual:
- Hoy el modelo es: 1 `household` = 1 lista de la compra, accedida directamente vía QR (URL con UUID). No existe ningún concepto de "varias listas" ni una pantalla de inicio que las enumere.
- Lo que pides — una pantalla de inicio con **varias** listas activas, cada una con título e **imagen** (campos que no existen hoy en la tabla `households`) — requiere: (a) nuevas columnas en la base de datos, (b) una forma de saber qué listas mostrar en esa pantalla de inicio, y (c) lógica nueva de eliminar/crear listas desde una pantalla índice en vez de vía QR directo.

Esto es más que "solo UI/UX": es una funcionalidad nueva sobre el modelo de datos.

### Clarification Question 1
¿Cómo quieres resolver esto?

A) Ampliamos el alcance: sí quiero esta función de "múltiples listas" aunque implique cambios de modelo de datos y lógica de negocio (no solo UI/UX)

B) Prefiero mantenerme en solo-UI/UX por ahora: en vez de una pantalla de inicio con varias listas, rediseñamos solo la pantalla de la lista actual (la única que existe por household) con mejor UI, y dejamos "múltiples listas" para un ciclo futuro

C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Ambigüedad 1: ¿De dónde salen las "listas activas" a mostrar?
Hoy no hay login ni cuentas. El acceso a una lista es solo por conocer su URL con UUID (seguridad por oscuridad). Si esta pantalla de inicio muestra "listas activas", necesito saber de dónde vienen esas listas para ese dispositivo/navegador concreto — si viene de una consulta abierta a la base de datos, cualquiera vería **todas** las listas de **todos los hogares**, lo cual sería una fuga de privacidad grave.

### Clarification Question 2
¿De dónde deben salir las listas mostradas en esta pantalla de inicio?

A) De un historial local del dispositivo (`localStorage`): solo se listan las listas que ese navegador ha creado o visitado antes (vía QR o creación)

B) De una cuenta de usuario real (esto implicaría añadir autenticación, fuera del alcance actual)

C) Other (please describe after [Answer]: tag below)

[Answer]: Que se muestren todas las listas para todos por ahora, luego lo arreglo dandome credenciales para esa pagina

---

## Ambigüedad 2: Campo "imagen" de la lista
No existe hoy ningún campo de imagen en el modelo. Necesito saber cómo se define.

### Clarification Question 3
¿Cómo se elige la imagen de una lista?

A) El usuario sube una foto/imagen propia (requiere almacenamiento de archivos, ej. Supabase Storage)

B) Se elige entre un set cerrado de iconos/emojis predefinidos (sin subida de archivos, más simple)

C) Es una URL de imagen que el usuario pega a mano

D) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Ambigüedad 3: "Participantes que han añadido algo"
### Clarification Question 4
¿A qué participantes te refieres exactamente?

A) Todas las personas (nombres locales) que han añadido al menos un producto pendiente actualmente en esa lista

B) Todas las personas que han interactuado alguna vez con esa lista (añadido o comprado, histórico completo)

C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Ambigüedad 4: Navegación desde el QR
### Clarification Question 5
Hoy el QR lleva directo a la lista (household). Con esta nueva pantalla de inicio, ¿qué pasa cuando alguien escanea un QR?

A) El QR sigue llevando directo a esa lista concreta (se salta la pantalla de inicio); la pantalla de inicio es solo para navegar entre listas ya conocidas por ese dispositivo

B) El QR ahora es solo para "unirse"/registrar esa lista en el dispositivo, y siempre se pasa primero por la pantalla de inicio

C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Ambigüedad 5: Eliminar una lista
### Clarification Question 6
Al eliminar una lista desde el menú de 3 puntos, ¿qué ocurre con sus productos/historial?

A) Se borra todo en cascada (productos pendientes, comprados e historial de esa lista desaparecen para siempre)

B) Solo se borra de "mis listas" en ese dispositivo (deja de aparecer en el índice local), pero los datos siguen existiendo en la base de datos por si otro dispositivo aún la tiene

C) Other (please describe after [Answer]: tag below)

[Answer]: A
