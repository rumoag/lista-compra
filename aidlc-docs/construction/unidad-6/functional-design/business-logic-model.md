# Business Logic Model — Unidad 6: Vista de lista de la compra

## Flujo 1: Cargar la pantalla
1. Se obtiene el household actual (ya disponible por `householdId` de la URL); se renderiza cabecera (icono+título, BR-46), saludo (BR-45), tabs (BR-47).
2. Tab "Lista" activo por defecto: carga la primera página de pendientes (igual que hoy) y calcula productos sugeridos (BR-39) para tenerlos listos cuando se abra el wizard.

## Flujo 2: Cambiar nombre (dos entradas, mismo destino)
1. Click en "Cambiar nombre" (menú cabecera) o en el saludo → abre modal con el formulario de nombre precargado (BR-45).
2. Guardar → actualiza `localStorage`, cierra modal, refresca el saludo mostrado.

## Flujo 3: Ver QR / Volver al listado
1. Click en "Ver QR" (menú cabecera) → modal con `renderQrView` (sin cambios de lógica, Unidad 4).
2. Click en "Volver al listado de listas" → `window.location.href = '/'`.

## Flujo 4: Scroll infinito (BR-48)
1. Un elemento centinela vacío se coloca al final de la lista de items.
2. Un `IntersectionObserver` dispara `loadNextPage` cuando el centinela es visible, igual que el click del botón "Cargar más" existente, pero automático.
3. Si no quedan más páginas (última página con menos de `PAGE_SIZE` items), se deja de observar.

## Flujo 5: Selección por click en el item (BR-41)
1. Click en el cuerpo del item (fuera del menú de 3 puntos) → `onToggleSelect(id)`, mismo efecto que el checkbox.
2. Click en el menú de 3 puntos no dispara la selección (mismo patrón `stopPropagation` que `list-card.js` de Unidad 5).

## Flujo 6: Editar / Eliminar un item vía menú de 3 puntos (BR-40)
1. "Editar" → abre el wizard (Flujo 8) en modo edición, precargado con name/quantity_number/quantity_unit/category del producto.
2. "Eliminar" → abre modal de confirmación singular (BR-42) → al confirmar, borra el producto (mismo `handleDelete` optimista ya existente).

## Flujo 7: Cálculo de productos sugeridos (BR-39)
1. Se consultan todos los `products` del household (nombre + estado).
2. Se agrupan por `name`, se cuenta frecuencia, se excluyen nombres con al menos un producto `pending` actual.
3. Se ordenan por frecuencia desc (empate → uso más reciente desc) y se toman los primeros 5.

## Flujo 8: Wizard de 3 pasos — crear o editar producto (BR-44)
1. **Paso 1 — Producto**: chips de sugeridos (Flujo 7) + chip "Otros" → input de texto libre (validación BR-1). En modo edición, si el nombre actual no está entre los sugeridos, se preselecciona "Otros" con el input relleno.
2. **Paso 2 — Cantidad**: stepper `quantity_number` (1-999, BR-35) + input opcional `quantity_unit` (BR-36). Botones Atrás/Siguiente.
3. **Paso 3 — Categoría**: chips con icono (BR-38) + "Otra…" de texto libre. Botones Atrás/Guardar.
4. Al guardar: modo crear → `insert`; modo editar → `update` del producto existente. Ambos casos con UI optimista (mismo patrón `applyOptimistic` ya existente).
5. Cerrar con "X" en cualquier paso → descarta todo sin confirmación (BR-44).

## Flujo 9: Selección múltiple ampliada
1. **Seleccionar todos** (BR-43): fuerza `loadNextPage` en bucle hasta agotar páginas, luego `selectAll(allIds)`.
2. **Deseleccionar todos**: `clearSelection()` — la barra de selección desaparece (comportamiento ya existente cuando `selectedCount === 0`).
3. **Eliminar seleccionados**: abre modal de confirmación plural (BR-42) con el conteo → al confirmar, borrado en lote optimista (mismo patrón de "marcar como comprados" de Unidad 2, pero con `delete` en vez de `update`).
4. **Marcar como comprados**: sin cambios (Unidad 2).

## Testable Properties (candidatas a PBT si aplica PBT-03)
- **Invariante de migración (BR-37)**: para cualquier `quantity` de entrada, `quantity_number` resultante está siempre en [1, 999], y ningún carácter del texto original se pierde sin aparecer en `quantity_unit` cuando la entrada no era puramente numérica.
- **Invariante de sugeridos (BR-39)**: el resultado nunca contiene un nombre que tenga algún producto `pending` actual, y su longitud es siempre ≤ 5.
- **Invariante de icono de categoría (BR-38)**: para cualquier valor de categoría (incluida cadena vacía o no reconocida), siempre se devuelve exactamente un icono no vacío.
