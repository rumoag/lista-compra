# Business Logic Model — Unidad 1: Fundaciones

## Flujos de negocio

### Flujo: Añadir producto
1. Verificar que existe `localName` en `localStorage`; si no, solicitarlo (BR-4).
2. Validar `name` (BR-1), `quantity`/`category` (BR-2) en el cliente.
3. Aplicar el producto de forma optimista a la lista visible (BR-6).
4. Insertar en Supabase con `household_id` (de la URL actual), `added_by = localName`, `status = 'pending'`.
5. Si falla la inserción, revertir el cambio optimista y mostrar error genérico (BR-6).

### Flujo: Editar producto pendiente
1. Validar los nuevos valores de `name`/`quantity`/`category` (BR-1, BR-2).
2. Aplicar el cambio de forma optimista.
3. Actualizar en Supabase (solo si `status = pending`, no se editan productos comprados desde este flujo).
4. Si falla, revertir y mostrar error.

### Flujo: Eliminar producto pendiente
1. Aplicar la eliminación de forma optimista (quitar de la lista visible).
2. Eliminar en Supabase.
3. Si falla, revertir (volver a mostrar el producto) y mostrar error.

### Flujo: Crear household (mínimo, Unidad 1)
1. Insertar una nueva fila en `households` (sin campos adicionales más allá de `id`/`created_at`).
2. Navegar a la URL `/{household_id}` generada.
3. Esta función es reutilizada por la Unidad 4, que la envuelve con la UI de "Crear nueva lista".

### Flujo: Capturar identidad local (stopgap, Unidad 1)
1. Al cargar la app, comprobar si existe `localName` en `localStorage`.
2. Si no existe, mostrar un prompt/input simple pidiendo un nombre corto.
3. Guardar el valor en `localStorage` bajo una clave estable (ej. `localName`) que la Unidad 4 reutilizará para su onboarding pulido.

## Testable Properties (PBT-01 — orientativo, modo parcial)

Dado que PBT está en modo parcial (solo PBT-02, 03, 07, 08, 09 son bloqueantes), esta sección identifica las propiedades relevantes para esas reglas donde aplican en la Unidad 1:

| Función | Categoría | Propiedad |
|---|---|---|
| `validateProductName(name)` | Invariante (PBT-03) | Para cualquier `name` de longitud 1-50 compuesto solo de letras/números/espacios/acentos, la validación debe aceptar; para cualquier `name` vacío, >50 caracteres, o con caracteres fuera del conjunto permitido, debe rechazar. La validación es determinista: la misma entrada siempre produce el mismo resultado (aceptar/rechazar). |
| `validateQuantity(quantity)` / `validateCategory(category)` | Invariante (PBT-03) | El resultado de validación depende únicamente de la longitud (≤50 / ≤40) y de si el valor es `null`/vacío (permitido, campos opcionales). |
| `normalizeProductName(name)` (si se implementa trim/normalización de espacios) | Idempotencia | `normalize(normalize(x)) == normalize(x)` — aplicar la normalización dos veces no cambia el resultado respecto a aplicarla una vez. |

**Componentes sin propiedades PBT identificadas**: las operaciones CRUD contra Supabase (`insert`, `update`, `delete`) son I/O directo sin transformación de datos propia — no se identifican propiedades de round-trip ni invariantes más allá de la validación ya cubierta. Se marcan como **N/A** para PBT-02 (round-trip) y PBT-06 (stateful) en esta unidad, dado que no hay estado en memoria gestionado por la aplicación (el estado vive en Supabase).

**Generador de dominio (PBT-07)**: para las pruebas de `validateProductName`, se requiere un generador que produzca: (a) cadenas válidas dentro del alfabeto permitido y longitud 1-50, (b) cadenas con caracteres fuera del alfabeto permitido, (c) cadenas vacías, (d) cadenas de longitud exactamente 50 y 51 (casos límite), (e) cadenas con acentos/ñ (caso de dominio real en español).
