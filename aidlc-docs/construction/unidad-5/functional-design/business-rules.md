# Business Rules — Unidad 5: Listado de listas activas

## BR-24: Validación de título de lista
- **Regla**: `title` es obligatorio, máximo 50 caracteres, cualquier carácter permitido (Question 2 = B — a diferencia de BR-1 de nombre de producto, aquí no se restringe el conjunto de caracteres).
- **Sanitización**: pese a permitir cualquier carácter, el valor se renderiza siempre como texto plano (no HTML) para prevenir XSS (SECURITY-05), igual que el resto de campos de texto del proyecto.
- **Rechazo**: título vacío o mayor a 50 caracteres se rechaza en el cliente antes de enviarse, y se protege también con un constraint `CHECK` en base de datos como defensa en profundidad (SECURITY-11).

## BR-25: Validación de icono de lista
- **Regla**: `image_icon` es obligatorio y debe pertenecer al set cerrado de 12 valores definido en `domain-entities.md`.
- **Rechazo**: cualquier valor fuera del set se rechaza en el cliente; se protege también con un constraint `CHECK` en base de datos.
- **UI**: el modal de crear/editar presenta el set como selector visual (no campo de texto libre), por lo que en la práctica el usuario no puede introducir un valor inválido desde la UI normal.

## BR-26: Migración de listas existentes sin título/icono
- **Regla** (Question 3 = A): al añadir las columnas `title`/`image_icon`, las filas existentes reciben por defecto `title = 'Lista sin nombre'` e `image_icon = '🛒'`. Son editables después desde "Editar" como cualquier otra lista.

## BR-27: Cálculo de participantes
- **Regla** (CQ4 = B, ronda de requisitos): los participantes mostrados en una tarjeta son la unión de todos los valores distintos, no nulos, de `added_by` y `bought_by` de los productos de ese household — histórico completo, no solo el estado actual.
- **Normalización**: se reutiliza el mismo criterio de comparación de nombres ya usado en Unidad 3 (comparación exacta de `localName`, sin normalización adicional de mayúsculas/acentos — dos nombres distintos en capitalización cuentan como participantes distintos, igual que ya ocurre con nombres de producto en estadísticas).

## BR-28: Visualización de participantes con muchos nombres
- **Regla** (Question 6 = B): se muestran como máximo 3 nombres en la tarjeta; si hay más, se añade un contador "y N más" al final (ej. "Ana, Luis, Mar y 2 más").

## BR-29: Orden del listado de listas
- **Regla** (Question 5 = A): las tarjetas se ordenan por `created_at` descendente (las listas más recientemente creadas aparecen primero).

## BR-30: Pantalla vacía
- **Regla** (Question 4 = A): si no existe ninguna lista, se muestra únicamente el botón "Crear nueva lista" junto con el mensaje "Aún no hay listas, crea la primera".

## BR-31: Eliminar lista (acción restrictiva)
- **Regla** (Question 7 = A, FR-5): eliminar una lista requiere confirmación explícita mediante un modal con el texto "¿Eliminar esta lista? Se borrarán todos sus productos e historial." y botones Cancelar/Eliminar. No se requiere reescribir el título (confirmación simple, no reforzada).
- **Efecto**: al confirmar, se borra la fila `household`; el borrado en cascada de sus `products` ya está garantizado a nivel de base de datos por el `on delete cascade` existente desde la Unidad 1 — no se requiere lógica adicional de borrado manual de productos.
- **Irreversibilidad**: no hay papelera ni deshacer; el mensaje de confirmación debe dejarlo claro.

## BR-32: Modal compartido crear/editar
- **Regla** (FR-3): el mismo componente de modal se usa para crear y editar una lista, distinguido por un modo (`create` | `edit`). En modo `edit`, los campos se inicializan con los valores actuales de la lista; en modo `create`, vacíos con el primer icono del set preseleccionado.
- **Persistencia**: "Crear" inserta una fila nueva en `households`; "Editar" actualiza `title`/`image_icon` de la fila existente. Ninguno de los dos modos toca `products`.

## BR-33: Cierre de modales
- **Regla** (FR-6): todo modal (crear/editar, QR, confirmación de borrado) incluye un botón "X" en la esquina superior derecha que lo cierra sin aplicar cambios. Cerrar el modal de crear/editar sin guardar no persiste ningún cambio.

## BR-34: Visibilidad sin filtro (excepción de seguridad aceptada)
- **Regla** (NFR-2 de requirements.md): la consulta que alimenta el listado de la pantalla de inicio trae **todas** las filas de `households`, sin filtrar por dispositivo ni identidad. Esta es una decisión de producto explícita y temporal, no un descuido — debe implementarse literalmente así (sin añadir un filtro "de más" por `localStorage` que el usuario no ha pedido), documentando el riesgo donde corresponda (comentario en el código de la consulta, igual que se hizo con SECURITY-08 en la Unidad 1).
