# Business Rules — Unidad 6: Vista de lista de la compra

## BR-35: Validación de quantity_number
- **Regla**: entero obligatorio entre 1 y 999. El stepper del wizard no permite bajar de 1 ni superar 999; tocar el número abre el teclado numérico del dispositivo para edición manual, con el mismo rango aplicado a la entrada manual.
- **Rechazo**: valores fuera de rango o no numéricos se rechazan en el cliente antes de enviarse, con constraint `CHECK` en base de datos como defensa en profundidad.

## BR-36: Validación de quantity_unit
- **Regla**: opcional, máximo 20 caracteres, texto libre (sin restricción de alfabeto, igual criterio que BR-24 de título de lista).

## BR-37: Migración de `quantity` existente (Question 1 = A)
- **Regla**: migración best-effort ejecutada una sola vez en `schema.sql`: si `quantity` empieza por dígitos, se extraen como `quantity_number` (con tope 999) y el resto del texto (recortado) pasa a `quantity_unit`; en cualquier otro caso (sin número al principio, vacío o nulo), `quantity_number = 1` y todo el texto original (si lo había) pasa a `quantity_unit`. Tras la migración, la columna `quantity` se elimina.

## BR-38: Icono por categoría
- **Regla**: cada producto muestra el icono de su categoría según el mapa fijo (`domain-entities.md`); si la categoría no está en el mapa (personalizada) o es nula, se usa el icono genérico 📦.

## BR-39: Cálculo de productos sugeridos
- **Regla** (Question 3 = B del ciclo de requisitos): se agrupan todos los `products` del household por `name` (comparación exacta, mismo criterio que Unidad 3), se ordenan por frecuencia descendente, se excluyen los nombres que tengan al menos un producto en `status = pending` actualmente, y se toman los primeros 5.
- **Empate**: en caso de empate de frecuencia, se prioriza por `created_at` más reciente del último uso (determinista).

## BR-40: Menú de 3 puntos por item de producto
- **Regla**: cada producto pendiente muestra un botón de 3 puntos con dos opciones: Editar (abre el wizard en modo edición) y Eliminar (abre confirmación, BR-42).

## BR-41: Selección por click en el item
- **Regla**: pulsar sobre el cuerpo de un item (fuera del área del menú de 3 puntos) alterna su estado de selección, equivalente a pulsar su checkbox.

## BR-42: Confirmación de borrado (individual y en lote)
- **Regla** (Question 7 del ciclo de requisitos = A): eliminar uno o varios productos requiere confirmar en un modal. El mensaje indica la cantidad si es más de uno (ej. "¿Eliminar 3 productos?"); si es uno solo, mensaje singular ("¿Eliminar este producto?").
- **Efecto**: borrado real e inmediato al confirmar, sin papelera.

## BR-43: "Seleccionar todos" con scroll infinito (Question 3 de Functional Design = B)
- **Regla**: al pulsar "Seleccionar todos", se cargan primero todas las páginas restantes de productos pendientes (repitiendo `loadNextPage` hasta que no queden más), y solo entonces se seleccionan todos los ids resultantes. Muestra un estado de carga breve mientras tanto si la operación no es instantánea.

## BR-44: Wizard de 3 pasos — navegación
- **Regla**: pasos 2 y 3 tienen botón "Atrás" que vuelve al paso anterior conservando los valores ya introducidos. Cerrar con "X" en cualquier paso descarta todo el progreso sin confirmación (Question 2 de Functional Design = A, consistente con el resto de modales del proyecto).
- **Validación por paso**: el paso 1 no permite avanzar sin producto seleccionado/introducido (reutiliza BR-1); el paso 3 no permite guardar sin categoría válida (reutiliza validación de categoría existente). El paso 2 siempre tiene un valor válido por defecto (quantity_number=1), por lo que "Siguiente" nunca se bloquea en ese paso.

## BR-45: Modal de cambiar nombre (dos accesos)
- **Regla** (Question 6 del ciclo de requisitos = A): tanto el menú de 3 puntos de la cabecera como el saludo "Hola, (Nombre)" abren el mismo modal de cambiar nombre, precargado con el nombre actual. Reutiliza la validación ya existente (nombre no vacío).

## BR-46: Menú de 3 puntos de la cabecera
- **Regla**: contiene Cambiar nombre (BR-45), Ver QR (reutiliza `qr-view.js` de Unidad 4 en modal) y Volver al listado de listas (navega a `/`).

## BR-47: Tabs de navegación
- **Regla**: sustituyen la barra de botones de navegación actual por 3 tabs (Lista, Historial, Estadísticas). El QR deja de ser una opción de navegación de nivel superior (se mueve al menú de la cabecera, BR-46).

## BR-48: Scroll infinito
- **Regla**: se sustituye el botón "Cargar más" por una carga automática de la siguiente página cuando un elemento centinela al final de la lista entra en el viewport (IntersectionObserver). Mismo `PAGE_SIZE`/cursor que la implementación actual.

## BR-49: Estado vacío de la cesta
- **Regla**: si no hay productos pendientes, se muestra "No hay nada en tu cesta de la compra todavía. ¿Te gustaría añadir el primero?" en vez del mensaje genérico actual.
