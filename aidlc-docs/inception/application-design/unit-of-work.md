# Unit of Work — Lista de la Compra Compartida

**Tipo de proyecto**: Monolito de un único servicio desplegable (app web vanilla JS + Supabase gestionado). Las unidades son agrupaciones lógicas de historias para desarrollo secuencial-flexible, no microservicios independientes.

**Estrategia de esquema de datos**: El esquema de datos completo (`households`, `products` con todos sus campos) se define íntegramente en la Unidad 1, aunque solo se usen parcialmente en Unidad 1. Esto permite que las Unidades 2, 3 y 4 se desarrollen con más flexibilidad/paralelismo una vez exista el esquema completo, en vez de ir migrando la base de datos unidad a unidad.

**Organización de código**: Por módulo/feature (Question 3 = B).

```
lista-compra/
  index.html
  src/
    common/          # cliente Supabase, utilidades compartidas, identidad local (localStorage)
    onboarding/       # nombre local, creación de hogar, acceso vía QR/UUID
    list/             # lista de pendientes: alta, edición, borrado, vista realtime
    bulk-actions/     # selección múltiple y marcar como comprados
    history/          # vista de historial, filtros, corrección
    stats/            # cálculo y visualización de estadísticas
  css/
  supabase/
    schema.sql        # definición de tablas, RLS, índices
    migrations/       # si se necesitan cambios incrementales
  aidlc-docs/          # (ya existente, documentación AI-DLC)
```

---

## Unidad 1 — Fundaciones (Setup + esquema + CRUD básico)

**Responsabilidades**:
- Configurar el proyecto Supabase (tablas, políticas RLS por `household_id`, cliente JS).
- Definir el **esquema de datos completo** (`households`, `products` con todos los campos, incluidos los que usarán las unidades 2-4: `status`, `bought_by`, `bought_at`).
- Implementar el módulo `common/` (cliente Supabase, gestión de identidad local).
- Implementar el módulo `list/`: alta, edición, borrado de productos pendientes (sin Realtime todavía).

**Historias cubiertas**: US-1.1, US-1.2 (parcial, sin Realtime), US-1.3, US-1.4

**Módulos de código**: `common/`, `list/` (versión inicial), `supabase/schema.sql`

---

## Unidad 2 — Tiempo real y acciones en lote

**Responsabilidades**:
- Activar Supabase Realtime sobre la tabla `products` e integrarlo en `list/` (completa US-1.2).
- Implementar el módulo `bulk-actions/`: selección múltiple (checkboxes) y acción "marcar como comprados".

**Historias cubiertas**: US-1.2 (completa), US-2.1, US-2.2

**Módulos de código**: `list/` (actualización con Realtime), `bulk-actions/`

**Dependencia**: requiere el esquema de datos completo de la Unidad 1 (campos `status`, `bought_by`, `bought_at` ya definidos, aunque no usados hasta ahora).

---

## Unidad 3 — Historial y estadísticas

**Responsabilidades**:
- Implementar el módulo `history/`: vista cronológica, filtros por producto/fecha, corrección (desmarcar/eliminar).
- Implementar el módulo `stats/`: ranking de productos, cálculo de cadencia media entre compras, distribución por día/persona.

**Historias cubiertas**: US-3.1, US-3.2, US-3.3, US-4.1, US-4.2, US-4.3

**Módulos de código**: `history/`, `stats/`

**Dependencia**: requiere datos reales con `bought_at`/`bought_by` poblados por la Unidad 2 para poder probarse con datos representativos (aunque el esquema ya existe desde la Unidad 1).

---

## Unidad 4 — Onboarding y acceso

**Responsabilidades**:
- Implementar el módulo `onboarding/`: elección de nombre local al primer uso, creación de un nuevo hogar (botón "Crear nueva lista"), flujo de acceso vía QR/UUID.
- Pulido UI/UX mobile-first.
- PWA opcional (manifest + icono instalable; sin service worker offline en el MVP).

**Historias cubiertas**: US-5.1, US-5.2, US-5.3

**Módulos de código**: `onboarding/`, ajustes transversales de `css/` y `index.html`

**Dependencia**: requiere el esquema de datos de la Unidad 1 (`households`). Puede desarrollarse en paralelo a las Unidades 2 y 3 una vez completada la Unidad 1, según lo confirmado en Question 2 (esquema completo definido desde el principio permite flexibilidad).

---

## Despliegue

Confirmado (Question 4 = A): **un único despliegue** de todo el sitio en Vercel/Netlify — no hay funciones serverless ni servicios independientes por unidad. Cada unidad añade módulos al mismo repositorio/sitio.
