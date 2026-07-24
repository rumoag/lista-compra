# Clarificación — Pantalla 2: Vista de lista de la compra (rediseño)

Es una pantalla mucho más grande que la 1: toca navegación, selección múltiple, y sobre todo cambia cómo se captura la "cantidad" de un producto. Antes de diseñar necesito resolver 8 puntos.

## 1. Cambio de tipo de dato: "cantidad" pasa de texto libre a número (afecta BR-2 ya implementada)
Hoy `quantity` es texto libre (ej. "2 litros", "1 paquete", hasta 50 caracteres). Tu wizard describe un stepper `+`/`-` con un número en el medio (y teclado numérico al tocarlo), lo cual es un campo **numérico puro**, no texto libre con unidades.

### Clarification Question 1
¿Cómo debe quedar el campo cantidad?

A) Pasa a ser un número entero puro (ej. "3"), sin unidades — se pierde la posibilidad de escribir "2 litros" o "1 paquete" tal como existe hoy

B) El stepper controla solo la parte numérica, pero se mantiene un campo de texto aparte (opcional) para la unidad (ej. "3" + "litros")

C) Other (please describe after [Answer]: tag below)

[Answer]: B

## 2. Límites del stepper de cantidad
### Clarification Question 2
¿Qué valores mínimo/máximo y valor inicial debe tener el stepper?

A) Mínimo 1, sin máximo explícito (o un máximo alto tipo 999), valor inicial 1

B) Mínimo 0 (permite "sin cantidad especificada"), valor inicial 1

C) Other (please describe after [Answer]: tag below)

[Answer]: A

## 3. "5 productos más repetidos" para las chips del paso 1
### Clarification Question 3
¿De dónde sale el ranking de los 5 productos sugeridos?

A) Los 5 nombres de producto más frecuentes en **todo el histórico** de esa lista (pendientes + comprados alguna vez), sin importar si ya están pendientes ahora mismo

B) Igual que A, pero **excluyendo** los que ya están actualmente pendientes (para no sugerir duplicados)

C) Other (please describe after [Answer]: tag below)

[Answer]: B

## 4. Icono por categoría
Hoy las categorías frecuentes son texto plano: Lácteos, Limpieza, Fruta, Verdura, Panadería (+ "Otra…" de texto libre). Quieres que cada categoría tenga icono y que el item listado se represente con ese icono.

### Clarification Question 4
¿Cómo se asigna el icono?

A) Icono fijo por cada una de las 5 categorías frecuentes (propongo 🥛 Lácteos, 🧴 Limpieza, 🍎 Fruta, 🥦 Verdura, 🍞 Panadería) + un icono genérico fijo (📦) para categorías personalizadas escritas a mano o sin categoría

B) Quiero definir yo los iconos exactos por categoría (indícalo en Other)

C) Other (please describe after [Answer]: tag below)

[Answer]: A

## 5. Quitar "Cargar más" — ¿qué lo sustituye?
### Clarification Question 5
Al quitar el botón de paginar la lista de pendientes, ¿qué comportamiento quieres?

A) Cargar **todos** los productos pendientes de una vez al entrar a la pantalla (sin paginación) — razonable porque una lista de la compra activa no debería tener cientos de pendientes

B) Scroll infinito: seguir cargando páginas automáticamente al hacer scroll, sin botón visible

C) Other (please describe after [Answer]: tag below)

[Answer]: B

## 6. Redundancia entre "Cambiar nombre" (menú 3 puntos) y "Hola, (Nombre)" clicable
Pides que el menú de 3 puntos del título tenga "cambiar nombre" **y** que tocar el saludo "Hola, (Nombre)" también abra la edición de nombre. Son dos accesos distintos a la misma acción.

### Clarification Question 6
¿Confirmas que quieres ambos accesos (redundantes a propósito, por comodidad), o prefieres quitar "cambiar nombre" del menú de 3 puntos ya que el saludo cumple esa función?

A) Sí, quiero ambos — el menú de 3 puntos y el saludo abren el mismo modal de cambiar nombre

B) Quitar "cambiar nombre" del menú de 3 puntos (queda solo QR y volver al listado); el saludo es el único acceso a cambiar nombre

C) Other (please describe after [Answer]: tag below)

[Answer]: A

## 7. Confirmación al eliminar en lote (BR-31 aplicado a selección múltiple)
### Clarification Question 7
Al pulsar "Eliminar todos los marcados" con varios productos seleccionados, ¿pides confirmación como en el borrado individual?

A) Sí, mismo modal de confirmación que el borrado individual ("¿Estás seguro de que quieres eliminar?"), indicando cuántos productos se van a borrar

B) No, se borran directamente sin confirmación (ya hay un paso previo de selección explícita que actúa como confirmación)

C) Other (please describe after [Answer]: tag below)

[Answer]: A

## 8. Navegación dentro del wizard de 3 pasos
### Clarification Question 8
Dentro del modal de pantalla completa (Producto → Cantidad → Categoría), ¿se puede volver al paso anterior?

A) Sí, cada paso (2 y 3) tiene un botón "Atrás" además de "Siguiente"/"Guardar"

B) No, solo se avanza; para corregir algo hay que cerrar el modal (X) y empezar de nuevo

C) Other (please describe after [Answer]: tag below)

[Answer]: A
