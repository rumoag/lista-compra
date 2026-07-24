# Business Logic Model — Unidad 5: Listado de listas activas

## Flujo 1: Cargar pantalla de inicio
1. Se consultan todas las filas de `households` (BR-34), ordenadas por `created_at` desc (BR-29).
2. Para cada household, se consultan sus `products` y se calcula la lista de participantes (BR-27).
3. Si el resultado está vacío → estado vacío (BR-30).
4. Si no, se renderiza una tarjeta por household con: icono, título, participantes truncados (BR-28), y botón de 3 puntos.

## Flujo 2: Crear nueva lista
1. Click en "Crear nueva lista" → abre modal en modo `create` (BR-32), icono preseleccionado al primero del set.
2. Usuario introduce título (BR-24) y elige icono (BR-25).
3. Al confirmar: valida en cliente → inserta fila en `households` con `title`/`image_icon` → cierra modal → refresca el listado (la nueva tarjeta aparece, por orden BR-29 aparecerá primera).
4. Al fallar la inserción (red/servidor): se muestra mensaje de error genérico dentro del modal, sin cerrarlo, permitiendo reintentar (mismo patrón de fail-fast con mensaje ya usado en el resto del proyecto).

## Flujo 3: Editar lista existente
1. Click en menú de 3 puntos de una tarjeta → "Editar" → abre el mismo modal, en modo `edit`, precargado con `title`/`image_icon` actuales de esa lista (BR-32).
2. Usuario modifica título y/o icono.
3. Al confirmar: valida en cliente → `update` de la fila `households` correspondiente → cierra modal → refresca el listado (la tarjeta editada refleja los nuevos valores).

## Flujo 4: Ver QR de una lista
1. Click en menú de 3 puntos → "Ver QR" → abre modal que reutiliza `renderQrView` (Unidad 4) pasándole el `householdId` de esa tarjeta.
2. Sin lógica nueva de generación de QR — solo el envoltorio de modal.

## Flujo 5: Eliminar lista
1. Click en menú de 3 puntos → "Eliminar" → abre modal de confirmación (BR-31).
2. Si el usuario cancela o cierra con "X" → no ocurre nada, ambos modales se cierran.
3. Si confirma "Eliminar" → `delete` de la fila `households` → el `on delete cascade` en `products.household_id` borra automáticamente todos sus productos/historial → cierra modal → refresca el listado (la tarjeta desaparece).
4. Al fallar el borrado (red/servidor): mensaje de error genérico dentro del modal de confirmación, sin cerrarlo, permitiendo reintentar.

## Flujo 6: Navegar a una lista
1. Click en la tarjeta (fuera del menú de 3 puntos) → navega a `/{householdId}`, comportamiento ya existente desde la Unidad 1 (sin cambios en `main.js` más allá de qué se renderiza cuando no hay `householdId` en la URL).

## Testable Properties (candidatas a PBT si aplica PBT-03)
- **Invariante de participantes**: para cualquier conjunto de productos de un household, `participants` calculado nunca contiene duplicados y siempre es un subconjunto de los valores de `added_by`/`bought_by` presentes en esos productos.
- **Invariante de truncado**: para cualquier lista de participantes de longitud N, la representación mostrada siempre tiene como máximo 3 nombres explícitos, y muestra el contador "y N más" si y solo si N > 3.
- **Invariante de orden**: el listado de households siempre está ordenado de forma no creciente por `created_at`.
