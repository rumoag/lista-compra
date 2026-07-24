# Domain Entities — Unidad 5: Listado de listas activas

## Entidad: Household (extendida)
Se amplía la entidad `Household` ya existente (Unidad 1) con presentación propia: pasa de ser un simple contenedor de aislamiento a una "Lista" con identidad visual.

| Campo | Tipo | Restricciones |
|---|---|---|
| `id` | uuid | PK, sin cambios (Unidad 1) |
| `created_at` | timestamptz | Sin cambios (Unidad 1) |
| `title` | text | **Nuevo**. Obligatorio, máx. 50 caracteres, cualquier carácter (Question 2 = B) |
| `image_icon` | text | **Nuevo**. Obligatorio, debe ser uno de los valores del set cerrado de iconos (ver Business Rules) |

**Relaciones**: sin cambios — un `Household` tiene muchos `Product` (1:N vía `household_id`, `on delete cascade` ya existente en el esquema).

**Migración**: las filas existentes de `households` no tienen `title` ni `image_icon`. Se aplica un valor por defecto (ver BR-26) en la migración de esquema, no bloqueante para el resto de la app.

---

## Concepto (derivado, no persistido): Participantes de una Lista
No es una entidad ni tabla nueva — es un valor calculado a partir de `products` para mostrarse en la tarjeta de cada lista.

| Campo | Tipo | Origen |
|---|---|---|
| `participants` | string[] | Unión de valores distintos de `added_by` y `bought_by` (no nulos) de todos los `products` de ese `household_id`, histórico completo (Question de clarificación CQ4 = B) |

**Nota de rendimiento**: se calcula por consulta (no se cachea ni se persiste), consistente con el patrón "recálculo sin caché" ya usado en la Unidad 3 para estadísticas.

---

## Concepto (estático, no persistido): Set de iconos de lista
Lista cerrada y predefinida en el frontend, sin backend propio:

```
🛒 🥦 🧴 🍞 🥛 🧻 🍎 🧀 🍗 🧃 🏠 📦
```

(Question 1 = A — set propuesto aceptado tal cual)
