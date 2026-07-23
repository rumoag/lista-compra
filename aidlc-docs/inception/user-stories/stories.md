# User Stories — Lista de la Compra Compartida

**Persona aplicable a todas las historias**: Miembro del hogar (ver `personas.md`)

Orden de prioridad: 1) Lista de pendientes, 2) Selección múltiple/marcar comprados, 3) Historial y estadísticas, 4) Onboarding/acceso — alineado con los Bolts 1-4 del brief.

---

## Feature 1: Lista de pendientes

### US-1.1: Añadir producto a la lista
**Como** miembro del hogar, **quiero** añadir un producto a la lista de pendientes con nombre, y opcionalmente cantidad y categoría, **para** que mi pareja sepa qué hace falta comprar.

**Criterios de aceptación**:
- Given la lista de pendientes abierta, When escribo un nombre de producto y confirmo sin indicar cantidad ni categoría, Then el producto se añade con `status = pending` y aparece inmediatamente en la lista.
- Given el formulario de alta, When intento confirmar sin escribir ningún nombre, Then la app no crea el producto y muestra que el nombre es obligatorio.
- Given quiero indicar categoría, When abro el selector de categoría, Then veo chips de categorías frecuentes y puedo elegir uno o escribir una categoría nueva de texto libre.
- Given añado un producto desde mi móvil, When mi pareja tiene la lista abierta en el suyo, Then el producto aparece en su pantalla en segundos sin que tenga que refrescar (Realtime).

### US-1.2: Ver la lista de pendientes en tiempo real
**Como** miembro del hogar, **quiero** ver la lista de pendientes actualizada automáticamente, **para** no tener que preguntar a mi pareja qué ha añadido.

**Criterios de aceptación**:
- Given la lista de pendientes está vacía (household recién creado o todo comprado), When abro la app, Then veo un estado vacío claro (ej. "No hay productos pendientes") en vez de una lista en blanco sin contexto.
- Given hay productos pendientes, When mi pareja añade, edita o elimina un producto desde su móvil, Then mi vista se actualiza sin recargar la página.

### US-1.3: Editar un producto pendiente
**Como** miembro del hogar, **quiero** editar el nombre, cantidad o categoría de un producto pendiente, **para** corregir errores o añadir detalle después de crearlo.

**Criterios de aceptación**:
- Given un producto pendiente en la lista, When edito su nombre/cantidad/categoría y guardo, Then los cambios se reflejan inmediatamente para ambos usuarios.
- Given estoy editando un producto, When dejo el nombre vacío e intento guardar, Then la app no permite guardar y me indica que el nombre es obligatorio.

### US-1.4: Eliminar un producto pendiente
**Como** miembro del hogar, **quiero** eliminar un producto pendiente, **para** quitar algo que ya no hace falta comprar (ej. añadido por error o ya no se necesita).

**Criterios de aceptación**:
- Given un producto pendiente, When lo elimino, Then desaparece de la lista de ambos usuarios inmediatamente y no queda registro en el historial (no llegó a comprarse).

---

## Feature 2: Selección múltiple y marcar comprados

### US-2.1: Seleccionar varios productos pendientes
**Como** miembro del hogar, **quiero** seleccionar varios productos pendientes con checkboxes, **para** marcarlos todos como comprados en una sola acción tras salir de la compra.

**Criterios de aceptación**:
- Given la lista de pendientes con varios productos, When marco 3 o más checkboxes, Then la app muestra cuántos productos tengo seleccionados y habilita la acción "Marcar como comprados".
- Given no tengo ningún producto seleccionado, When miro la pantalla, Then la acción "Marcar como comprados" está deshabilitada o no visible.

### US-2.2: Marcar productos seleccionados como comprados
**Como** miembro del hogar, **quiero** marcar los productos seleccionados como comprados de una vez, **para** que queden registrados en el historial con fecha y quién los compró.

**Criterios de aceptación**:
- Given tengo productos seleccionados, When confirmo "Marcar como comprados", Then esos productos cambian a `status = bought`, se registra `bought_at` (fecha/hora actual) y `bought_by` (mi nombre local), y desaparecen de la lista de pendientes.
- Given acabo de marcar productos como comprados, When mi pareja tiene la app abierta, Then ve la lista de pendientes actualizada (sin esos productos) en segundos.
- Given dos personas intentan marcar el mismo producto casi a la vez, When ambas acciones llegan al servidor, Then se aplica last-write-wins (la última escritura prevalece) sin mostrar error a ninguno de los dos usuarios.

---

## Feature 3: Historial

### US-3.1: Ver historial cronológico de compras
**Como** miembro del hogar, **quiero** ver un listado cronológico de lo que se ha comprado y cuándo, **para** recordar qué se compró recientemente.

**Criterios de aceptación**:
- Given hay productos con `status = bought`, When abro el historial, Then veo los productos ordenados del más reciente al más antiguo, con nombre, fecha/hora y quién lo compró.
- Given todavía no se ha marcado ningún producto como comprado, When abro el historial, Then veo un estado vacío claro (ej. "Aún no hay compras registradas").

### US-3.2: Filtrar historial por producto o rango de fechas
**Como** miembro del hogar, **quiero** filtrar el historial por nombre de producto o por rango de fechas, **para** encontrar rápidamente cuándo se compró algo concreto.

**Criterios de aceptación**:
- Given el historial con varias entradas, When filtro por un nombre de producto, Then solo veo las entradas cuyo nombre coincide (búsqueda parcial insensible a mayúsculas).
- Given el historial con varias entradas, When aplico un rango de fechas, Then solo veo las entradas con `bought_at` dentro de ese rango.
- Given aplico un filtro que no tiene resultados, When se muestra el historial filtrado, Then veo un mensaje indicando que no hay resultados para ese filtro (no una lista vacía sin explicación).

### US-3.3: Corregir el historial
**Como** miembro del hogar, **quiero** poder desmarcar o eliminar una entrada del historial marcada por error, **para** corregir equivocaciones sin dejar datos incorrectos en las estadísticas.

**Criterios de aceptación**:
- Given un producto marcado como comprado por error, When lo desmarco desde el historial, Then vuelve a `status = pending` en la lista y desaparece del historial.
- Given una entrada del historial que quiero eliminar directamente (no quiero que vuelva a pendientes), When la elimino desde el historial, Then desaparece del historial y no afecta a la lista de pendientes.

---

## Feature 4: Estadísticas

### US-4.1: Ver el ranking de productos más comprados
**Como** miembro del hogar, **quiero** ver qué productos se compran con más frecuencia, **para** entender los patrones de consumo del hogar.

**Criterios de aceptación**:
- Given hay suficiente historial de compras, When abro la pantalla de estadísticas, Then veo una lista numérica (ranking) de productos ordenados por frecuencia de compra, agrupando por nombre.
- Given no hay historial suficiente (household nuevo o pocas compras), When abro estadísticas, Then veo un mensaje indicando que aún no hay datos suficientes, en vez de una tabla vacía o con errores.

### US-4.2: Ver la cadencia media de compra por producto
**Como** miembro del hogar, **quiero** ver cada cuántos días se compra normalmente un producto, **para** anticipar cuándo tocará volver a comprarlo (ej. "la leche se compra cada 6 días").
​
**Criterios de aceptación**:
- Given un producto con 2 o más compras registradas, When lo veo en estadísticas, Then se muestra la cadencia media en días entre compras consecutivas de ese producto (como lista/tabla, no gráfico, en el MVP).
- Given un producto con una sola compra registrada, When lo veo en estadísticas, Then se indica que no hay suficientes datos para calcular una cadencia (no se muestra un número engañoso).

### US-4.3: Ver la distribución de compras por día de la semana y por persona
**Como** miembro del hogar, **quiero** ver cuándo y quién compra más, **para** entender los hábitos de compra del hogar.

**Criterios de aceptación**:
- Given hay historial de compras, When abro estadísticas, Then veo una distribución (lista simple) de compras por día de la semana y otra por persona (`bought_by`).
- Given ambas visualizaciones, When se muestran, Then dejan claro que son datos acumulados desde el inicio del uso de la app (no un periodo arbitrario no explicado).

---

## Feature 5: Onboarding y acceso

### US-5.1: Elegir nombre local al primer uso
**Como** miembro del hogar, **quiero** elegir un nombre corto la primera vez que uso la app en mi móvil, **para** que mis altas y compras queden atribuidas a mí en el historial y las estadísticas.

**Criterios de aceptación**:
- Given es la primera vez que abro la app en este móvil (no hay nombre en `localStorage`), When accedo a la lista, Then se me pide un nombre corto antes de poder añadir o marcar productos.
- Given ya elegí mi nombre anteriormente en este móvil, When vuelvo a abrir la app, Then no se me vuelve a pedir (se recupera de `localStorage`) y puedo usar la app directamente.
- Given quiero cambiar mi nombre más adelante, When busco esa opción, Then puedo editarlo (ej. desde un ajuste simple), y los registros pasados conservan el nombre con el que se crearon.

### US-5.2: Crear un nuevo hogar (household)
**Como** miembro del hogar, **quiero** crear una nueva lista compartida la primera vez, **para** obtener la URL/QR único que pegaré en la nevera.

**Criterios de aceptación**:
- Given entro a la app sin un UUID de hogar en la URL (pantalla inicial genérica), When pulso "Crear nueva lista", Then se crea un nuevo `household` y soy redirigido a la URL `/{household_uuid}` correspondiente.
- Given tengo la URL de mi hogar, When la comparto o genero un QR con ella y mi pareja la escanea, Then accede directamente a la misma lista compartida, sin pasar por login.

### US-5.3: Acceder a la lista escaneando el QR
**Como** miembro del hogar, **quiero** escanear el QR pegado en la nevera y entrar directamente a la lista, **para** no tener que recordar ninguna URL ni credenciales.

**Criterios de aceptación**:
- Given el QR apunta a `/{household_uuid}`, When lo escaneo con la cámara del móvil, Then se abre la app directamente en la lista de ese hogar, sin pantallas de login intermedias.
- Given es la primera vez que este móvil accede a ese `household_uuid`, When entro, Then se dispara el flujo de US-5.1 (elegir nombre local) antes de poder interactuar con la lista.
