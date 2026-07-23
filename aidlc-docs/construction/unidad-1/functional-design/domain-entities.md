# Domain Entities — Unidad 1: Fundaciones

## Entidad: Household
Representa el "hogar" compartido — la unidad de aislamiento de datos entre parejas distintas usando la app.

| Campo | Tipo | Restricciones |
|---|---|---|
| `id` | uuid | PK, generado automáticamente, no adivinable (usado en la URL/QR) |
| `created_at` | timestamptz | Generado automáticamente al crear |

**Relaciones**: Un `Household` tiene muchos `Product` (1:N vía `household_id`).

**Ciclo de vida en Unidad 1**: se implementa una versión mínima de creación (Question 2 = B) — sin la UI pulida de la Unidad 4, pero funcionalmente capaz de crear un nuevo household y navegar a su URL.

---

## Entidad: Product
Representa un producto en la lista compartida, ya sea pendiente o comprado (unificado en una sola tabla, según diseño original del brief).

| Campo | Tipo | Restricciones |
|---|---|---|
| `id` | uuid | PK, generado automáticamente |
| `household_id` | uuid | FK → Household, obligatorio |
| `name` | text | Obligatorio, máx. 50 caracteres, solo letras/números/espacios/acentos (Question 3 = B) |
| `category` | text, nullable | Opcional, máx. 40 caracteres (Question 4 = A) |
| `quantity` | text, nullable | Opcional, máx. 50 caracteres (Question 4 = A) |
| `status` | enum: `pending` \| `bought` | Obligatorio, por defecto `pending` |
| `added_by` | text | Obligatorio, nombre local de quien lo creó |
| `created_at` | timestamptz | Generado automáticamente |
| `bought_by` | text, nullable | Solo se rellena al marcar como comprado (Unidad 2) |
| `bought_at` | timestamptz, nullable | Solo se rellena al marcar como comprado (Unidad 2) |

**Relaciones**: Un `Product` pertenece a un único `Household`.

**Nota de alcance**: en la Unidad 1 solo se ejercitan `status = pending` (alta, edición, borrado). Las transiciones a `status = bought` y el uso de `bought_by`/`bought_at` se implementan en la Unidad 2, pero el esquema ya existe completo desde la Unidad 1 (decisión de Question 2 del plan de unidades).

---

## Entidad (transversal): Identidad Local
No es una tabla de base de datos — es un concepto de dominio representado en `localStorage` del navegador.

| Campo | Tipo | Restricciones |
|---|---|---|
| `localName` | string | Nombre corto elegido por el usuario en este dispositivo; usado como valor de `added_by`/`bought_by` |

**Ciclo de vida en Unidad 1**: se implementa una versión mínima (stopgap) de captura — un simple prompt/input la primera vez que no existe `localName` en `localStorage` (Question 1 = A). La Unidad 4 sustituye este stopgap por la pantalla de onboarding completa (US-5.1), reutilizando la misma clave de `localStorage` para no perder continuidad de datos ya atribuidos.
