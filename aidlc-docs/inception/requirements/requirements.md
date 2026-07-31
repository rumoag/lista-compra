# Requirements — Lista de la Compra Compartida

## Intent Analysis Summary

- **User Request**: Aplicación web móvil para que una pareja gestione una lista de la compra compartida, accesible vía QR, con selección múltiple para marcar productos como comprados, historial y estadísticas de consumo.
- **Request Type**: New Project (Greenfield)
- **Scope Estimate**: Multiple Components (frontend + backend/datos + tiempo real + estadísticas)
- **Complexity Estimate**: Simple-a-Moderate (dominio sencillo, pero con tiempo real, múltiples pantallas y cálculos estadísticos)
- **Depth Applied**: Standard

## 1. Alcance funcional (Functional Requirements)

### FR-1: Lista de pendientes
- FR-1.1: Cualquier usuario puede añadir un producto con nombre libre (obligatorio), y opcionalmente cantidad (texto libre, ej. "2", "1 paquete") y categoría.
- FR-1.2: La categoría se introduce mediante **chips rápidos** de categorías frecuentes (lácteos, limpieza, fruta, etc.) más opción de escribir una categoría nueva de texto libre.
- FR-1.3: La lista de pendientes se actualiza en tiempo real en ambos móviles sin necesidad de refrescar (Supabase Realtime).
- FR-1.4: Un producto pendiente puede editarse (nombre/cantidad/categoría) o eliminarse por cualquier usuario.

### FR-2: Marcar como comprado
- FR-2.1: La UI permite selección múltiple (checkboxes) de varios productos pendientes.
- FR-2.2: La acción "Marcar como comprados" mueve los productos seleccionados a estado `bought`, registrando `bought_at` (fecha/hora) y `bought_by` (nombre local del usuario).
- FR-2.3: Concurrencia: si dos usuarios intentan actuar sobre el mismo producto casi simultáneamente, se aplica **last-write-wins** — no se requiere lógica de bloqueo o resolución de conflictos adicional.

### FR-3: Historial
- FR-3.1: Vista cronológica (más reciente primero) de productos con `status = bought`.
- FR-3.2: Filtro por nombre de producto y por rango de fechas.
- FR-3.3: El historial **es corregible**: un producto marcado como comprado por error puede desmarcarse (volver a `pending`) o eliminarse directamente del historial. No es un log inmutable de auditoría de negocio — es un dato operacional que la pareja puede corregir.

### FR-4: Estadísticas
- FR-4.1: Producto más comprado / ranking de frecuencia por producto — mostrado como **lista numérica simple** (tabla/ranking).
- FR-4.2: Cadencia media entre compras del mismo producto (días entre `bought_at` consecutivos para el mismo `name`) — lista simple en el MVP; **gráfico (barras/líneas) es nice-to-have, no bloqueante** si el tiempo lo permite.
- FR-4.3: Distribución de compras por día de la semana y por persona (`bought_by`) — lista simple en el MVP, gráfico opcional.

### FR-5: Identidad local y acceso
- FR-5.1: En el primer uso, cada móvil pide un nombre corto (ej. "Yo"/"Mi pareja") guardado en `localStorage`. No es autenticación; es solo una etiqueta para atribuir `added_by`/`bought_by`.
- FR-5.2: Creación de un "hogar" (household): una pantalla inicial genérica (sin UUID en la URL) con un botón "Crear nueva lista" que crea el registro `household`, genera su UUID, y redirige a la URL `/{household_uuid}` lista para generar/imprimir el QR.
- FR-5.3: Cualquier persona con el enlace/QR puede ver y editar la lista de ese hogar (sin login) — ver NFR de seguridad para las salvaguardas mínimas aplicables dado este modelo.

## 2. Requisitos no funcionales (Non-Functional Requirements)

### NFR-1: Plataforma y stack
- Mobile-first, apto como PWA instalable (icono en el móvil); PWA completa (service worker, offline) queda fuera del MVP.
- **Frontend**: HTML/JS simple (vanilla) + Supabase JS client — sin framework de componentes, para minimizar el mantenimiento y el tiempo de arranque.
- **Backend/datos**: Supabase (Postgres + Realtime + API autogenerada), capa gratuita.
- **Hosting**: Vercel o Netlify, capa gratuita, despliegue desde repositorio Git.

### NFR-2: Tiempo real
- Los cambios realizados en un móvil deben reflejarse en el otro en segundos, usando Supabase Realtime sobre Postgres (sin polling manual).

### NFR-3: Seguridad — Extensión Security Baseline ACTIVADA
El usuario optó por activar la línea base de seguridad de AI-DLC (ver `aidlc-state.md`). Estas reglas son restricciones **bloqueantes** en las siguientes fases de diseño y generación de código. Dado el modelo sin autenticación (acceso por URL no adivinable), las reglas más relevantes para este proyecto son:
- SECURITY-01 (cifrado en tránsito/reposo): cubierto por defecto por Supabase/Vercel/Netlify (TLS + cifrado en reposo gestionado) — a verificar en diseño de infraestructura.
- SECURITY-05 (validación de inputs): todo alta/edición de producto debe validar tipo, longitud máxima y sanear HTML/script para evitar XSS, incluso sin backend propio (validar en el cliente y vía Row Level Security/constraints en Supabase).
- SECURITY-08 (autorización a nivel de aplicación): como no hay autenticación real, el control de acceso es "cualquiera con el UUID del hogar" — esto debe documentarse explícitamente como excepción aceptada (ver Supuesto de seguridad por oscuridad), y las políticas de Supabase (RLS) deben restringir el acceso por `household_id`, no dejar las tablas abiertas sin ningún filtro.
- SECURITY-09 (hardening): sin credenciales por defecto, mensajes de error genéricos al usuario.
- SECURITY-10 (cadena de suministro): lockfile de dependencias, sin dependencias no usadas.
- El resto de reglas SECURITY-* se evaluarán como N/A cuando no apliquen (ej. SECURITY-12 sobre autenticación de usuarios, dado que el MVP no tiene login) y se documentará el porqué en cada fase.

### NFR-4: Resiliencia — Extensión Resiliency Baseline DESACTIVADA
El usuario reconsideró y desactivó esta extensión: el alcance completo (multi-región, DR formal, runbooks, gestión de cambios) es desproporcionado para una app personal de 2 usuarios en capa gratuita. No se aplican restricciones bloqueantes de resiliencia; se confía en las garantías por defecto de Supabase/Vercel/Netlify en su capa gratuita.

### NFR-5: Testing basado en propiedades (PBT) — Modo PARCIAL
El usuario activó PBT en modo parcial: solo se aplican como restricciones bloqueantes las reglas PBT-02 (round-trip), PBT-03 (invariantes), PBT-07 (calidad de generadores), PBT-08 (shrinking/reproducibilidad) y PBT-09 (selección de framework). El resto de reglas PBT son solo orientativas. Esto aplica principalmente a funciones puras como el cálculo de cadencia media entre compras y a transformaciones de datos para las estadísticas.

### NFR-6: Sin autenticación de usuario
Confirmado por el brief original — no hay gestión de cuentas ni backoffice.

### NFR-7: Offline
No es requisito del MVP. Puede añadirse en una iteración futura con service worker.

## 3. Modelo de datos (heredado del brief, sin cambios)

```
tabla: households
  id (uuid, pk)
  created_at

tabla: products
  id (uuid, pk)
  household_id (fk -> households)
  name (text)
  category (text, nullable)
  quantity (text, nullable)
  status (enum: pending | bought)
  added_by (text)
  created_at
  bought_by (text, nullable)
  bought_at (timestamptz, nullable)
```

## 4. Fuera de alcance (sin cambios respecto al brief)
- Autenticación real / cuentas de usuario.
- Precios, presupuesto o control de gasto.
- Compartir con más de 2 personas / múltiples hogares.
- Notificaciones push.
- App nativa (solo web móvil).

## 5. Criterios de éxito (heredados del brief)
- Escanear el QR abre la lista al instante, sin login.
- Añadir un producto desde un móvil aparece en el otro en segundos.
- Se pueden seleccionar 3+ productos y marcarlos comprados en una sola acción.
- El historial muestra correctamente fecha y quién compró cada producto, y permite corregir errores.
- Las estadísticas reflejan datos reales tras varias semanas de uso.

## 6. Resumen de decisiones clave
- Stack: vanilla JS/HTML + Supabase JS client (no React).
- Categorías: chips frecuentes + texto libre.
- Estadísticas: listas numéricas simples en el MVP; gráficos son mejora opcional.
- Historial: corregible (no inmutable).
- Concurrencia: last-write-wins, sin lógica adicional.
- Alta de hogar: vía botón "Crear nueva lista" en pantalla inicial.
- Extensiones AI-DLC: Seguridad ACTIVADA (bloqueante), Resiliencia DESACTIVADA, PBT en modo PARCIAL.

---

# Ciclo 2 — Mejora de Usabilidad: Pantalla 1 (Listado de listas activas)

**Fecha**: 2026-07-24

## Intent Analysis Summary
- **User Request**: Rediseño de la pantalla inicial para mostrar un listado de listas de la compra activas (título, imagen, participantes, menú de 3 puntos con eliminar/editar/QR en modales), con botón "Crear nueva lista" que abre un modal compartido con "Editar".
- **Request Type**: Enhancement — extiende el modelo existente: household pasa de ser un concepto implícito "1 QR = 1 lista" a una entidad "Lista" con título e imagen, navegable desde una pantalla índice.
- **Scope Estimate**: Multiple Components (nueva pantalla de inicio, sistema de modales reutilizable, cambio de esquema en `households`, nueva navegación).
- **Complexity Estimate**: Moderate.
- **Nota de alcance**: este apartado cubre **solo la Pantalla 1**. El resto de pantallas del rediseño se especificarán en documentos/ciclos posteriores, a petición explícita del usuario ("vamos a ir 1 a 1").
- **Nota importante**: esta funcionalidad amplía el alcance original ("Fuera de alcance" del brief decía "Compartir con más de 2 personas / múltiples hogares" refiriéndose a *compartir un mismo hogar entre más gente*; esto es distinto — es "un dispositivo puede ver/crear varias listas/hogares"). Se documenta el cambio de alcance explícitamente, decidido por el usuario en la clarificación de esta pantalla.

## Decisiones tomadas (rondas de clarificación)
| Tema | Decisión |
|---|---|
| Alcance | Se amplía más allá de "solo UI/UX": esta pantalla requiere cambios de modelo de datos y navegación, no solo visuales |
| Origen de las listas mostradas | **Todas** las listas de la tabla `households`, visibles para cualquiera (sin filtro por dispositivo/usuario) |
| Imagen de la lista | Set cerrado de iconos/emojis predefinidos (sin subida de archivos) |
| Participantes mostrados | Histórico completo: cualquiera que haya añadido o comprado algo alguna vez en esa lista |
| QR | Sigue llevando directo a la lista concreta (comportamiento sin cambios); la pantalla de inicio es un índice adicional, no sustituye el acceso directo |
| Eliminar lista | Borrado en cascada real (la lista y todos sus productos/historial desaparecen permanentemente) |

## Functional Requirements

**FR-1 — Listado de listas activas**
La pantalla inicial (`/` o ruta raíz sin UUID de household) muestra todas las listas existentes como tarjetas, cada una con:
- Título de la lista
- Imagen (icono/emoji del set predefinido)
- Listado de participantes (nombres locales de quienes han añadido o comprado algo alguna vez en esa lista)
- Botón de "3 puntos" con menú: Eliminar, Editar, Ver QR

**FR-2 — Crear nueva lista**
Botón "Crear nueva lista" visible en la parte superior del listado. Abre un modal para introducir título e imagen. Al confirmar, crea una nueva fila en `households` y la nueva tarjeta aparece en el listado.

**FR-3 — Editar lista**
Desde el menú de 3 puntos, "Editar" abre el **mismo modal** que "Crear nueva lista" (mismo componente, distinto modo/valores iniciales), permitiendo modificar título e imagen de una lista existente.

**FR-4 — Ver QR**
Desde el menú de 3 puntos, "Acceder al QR" abre un modal mostrando el QR de acceso directo a esa lista (reutiliza la generación de QR ya existente de la Unidad 4).

**FR-5 — Eliminar lista (acción restrictiva)**
Desde el menú de 3 puntos, "Eliminar" requiere una confirmación explícita del usuario (modal/diálogo de confirmación) antes de borrar. Al confirmar, se elimina la lista (`household`) y, en cascada, todos sus productos e historial asociados, de forma permanente.

**FR-6 — Modales**
Todos los modales (crear/editar, QR, confirmación de borrado) se cierran mediante un botón "X" en la esquina superior derecha del modal.

## Non-Functional Requirements

**NFR-1 — Cambio de esquema**: la tabla `households` necesita nuevas columnas `title` (text) e `image_icon` (text, referencia a un valor del set cerrado de iconos). Se define un valor por defecto para listas creadas antes de este cambio.

**NFR-2 (Excepción de seguridad aceptada)**: esta pantalla consulta y muestra **todas** las filas de `households` sin ningún filtro por dispositivo o identidad. Esto es una decisión explícita y temporal del usuario — hoy el modelo ya tiene RLS permisivo (`select using (true)`) sobre `households`, por lo que esto no introduce una vulnerabilidad nueva a nivel de base de datos, pero sí cambia el impacto práctico: antes hacía falta conocer la URL con UUID para ver una lista, ahora **cualquier visitante de la app ve título, imagen y participantes de todas las listas de todos los hogares** desde la pantalla de inicio. Se documenta como excepción aceptada, con la intención declarada del usuario de sustituirla por un sistema de credenciales en un ciclo futuro.

**NFR-3**: el set de iconos/emojis para las listas debe ser cerrado y predefinido en el frontend (sin subida de archivos ni Supabase Storage).

**NFR-4**: reutilizar el enfoque ya existente del proyecto: vanilla JS/CSS, sin librerías de UI externas, mismo patrón de componentes que Unidades 1-4.

## Alcance de esta iteración
Se procede directamente a Functional Design y Code Generation para esta pantalla, sin pasar por User Stories (justificación: el propio usuario ya describió el comportamiento con precisión funcional suficiente, sin ambigüedad de personas/journeys que una historia de usuario resolvería mejor que esta especificación directa).

---

# Ciclo 2 — Mejora de Usabilidad: Pantalla 2 (Vista de lista de la compra)

**Fecha**: 2026-07-24

## Intent Analysis Summary
- **User Request**: Rediseño completo de la pantalla de lista de la compra (antes "Lista" dentro de la navegación): cabecera con emoji+título+menú de 3 puntos, saludo con nombre local editable, tabs Lista/Historial/Estadísticas, eliminación de la paginación por botón, edición/borrado por menú de 3 puntos por item, creación/edición de producto mediante un asistente de 3 pasos en modal de pantalla completa, categorías con icono, selección múltiple ampliada (seleccionar/deseleccionar todos, eliminar en lote) y selección por click en el item.
- **Request Type**: Enhancement — cambia una regla de negocio ya implementada (BR-2, tipo de `quantity`) y añade funcionalidad nueva (sugerencias de producto por frecuencia, selección/deselección global, borrado en lote).
- **Scope Estimate**: Multiple Components (navegación, formulario de producto rehecho como wizard, selección múltiple, categorías, esquema de datos).
- **Complexity Estimate**: Complex (la pantalla con más superficie de cambio del ciclo hasta ahora).

## Decisiones tomadas (ronda de clarificación)
| Tema | Decisión |
|---|---|
| Cantidad | El stepper numérico controla un campo `quantity_number` (entero); se añade un campo de texto opcional `quantity_unit` para la unidad (ej. "litros") — **BR-2 se reemplaza**, `quantity` (texto libre único) queda obsoleto |
| Límites del stepper | Mínimo 1, sin máximo explícito (tope técnico alto, ej. 999), valor inicial 1 |
| Productos sugeridos (chips paso 1) | Los 5 nombres más frecuentes en todo el histórico de la lista, **excluyendo** los que ya están pendientes actualmente |
| Icono por categoría | Set fijo: 🥛 Lácteos, 🧴 Limpieza, 🍎 Fruta, 🥦 Verdura, 🍞 Panadería, 📦 (genérico, para categorías personalizadas o sin categoría) |
| Paginación de pendientes | Se sustituye por scroll infinito (sin botón "Cargar más") |
| "Cambiar nombre" | Accesible tanto desde el menú de 3 puntos como desde el saludo "Hola, (Nombre)" — redundancia intencional |
| Confirmación de borrado en lote | Mismo modal de confirmación que el borrado individual, indicando cuántos productos se eliminarán |
| Navegación del wizard | Pasos 2 y 3 tienen botón "Atrás"; cerrar con "X" en cualquier paso descarta el progreso (igual que el resto de modales del proyecto) |

## Functional Requirements

**FR-7 — Cabecera de la lista**
Sustituye el `<h1>` fijo "🛒 Lista de la Compra" por el icono + título de la lista actual (`households.image_icon` + `households.title`). A la derecha, un menú de 3 puntos con: Cambiar nombre, Ver QR, Volver al listado de listas.

**FR-8 — Saludo editable**
Debajo de la cabecera, "Hola, {nombre local}". Al pulsarlo, abre el mismo modal de cambiar nombre que la opción del menú de 3 puntos (FR-7).

**FR-9 — Tabs de navegación**
Debajo del saludo: tabs "Lista", "Historial", "Estadísticas" (sustituyen la barra de navegación de botones actual; el QR deja de ser un tab y pasa al menú de 3 puntos, FR-7).

**FR-10 — Lista de pendientes sin paginación por botón**
El tab "Lista" carga productos pendientes con scroll infinito (siguiente página se carga automáticamente al acercarse al final, sin botón "Cargar más").

**FR-11 — Menú de 3 puntos por item**
Cada producto pendiente muestra un icono de 3 puntos (en vez de los botones "Editar"/"Eliminar" visibles hoy) con un dropdown: Editar, Eliminar.

**FR-12 — Selección por click en el item**
Al pulsar sobre el cuerpo de un item (fuera del menú de 3 puntos), se alterna su checkbox de selección (equivalente a pulsar el checkbox directamente).

**FR-13 — Asistente de 3 pasos para crear/editar producto**
Botón flotante (FAB) centrado en la parte inferior de la pantalla abre un modal de pantalla completa, título "Añadir producto" (o "Editar producto" en modo edición), con 3 pasos:
1. **Producto**: label "Selecciona tu producto" + chips de los 5 productos más repetidos históricamente en esta lista que no estén ya pendientes (Question 3 = B), más un chip "Otros" que revela un input de texto libre (validación igual que hoy, BR-1). Botón "Siguiente".
2. **Cantidad**: stepper `-` / número / `+`; pulsar el número abre el teclado numérico del dispositivo para edición manual directa. Límites: mínimo 1, sin máximo explícito, valor inicial 1 (Question 2 = A). Campo de texto opcional para la unidad. Botones "Atrás" / "Siguiente".
3. **Categoría**: chips de las 5 categorías frecuentes (con icono, ver FR-15) + "Otra…" de texto libre (igual que hoy, BR-2 heredado solo para categoría). Botones "Atrás" / "Guardar".
El mismo modal/componente se usa para crear y para editar (precargado con los valores actuales del producto en modo edición, empezando en el paso 1).

**FR-14 — Confirmación de borrado (individual y en lote)**
Eliminar un producto (individual o selección múltiple) requiere confirmar en un modal ("¿Estás seguro de que quieres eliminar?"), indicando cuántos productos se eliminarán si es más de uno.

**FR-15 — Categorías con icono**
Cada categoría frecuente tiene un icono fijo (tabla de decisiones); las categorías personalizadas o ausentes usan un icono genérico. Cada item de la lista muestra el icono de su categoría.

**FR-16 — Estado vacío de la cesta**
Si no hay productos pendientes, se muestra un mensaje del tipo "No hay nada en tu cesta de la compra todavía. ¿Te gustaría añadir el primero?" en vez del genérico actual.

**FR-17 — Selección múltiple ampliada**
La barra de selección (visible solo cuando hay ≥1 producto seleccionado) añade: botón "Seleccionar todos" / "Deseleccionar todos" (alterna según el estado), y botón "Eliminar seleccionados" (con confirmación, FR-14) junto al ya existente "Marcar como comprados". Al deseleccionar todos (o quedar la selección vacía), la barra completa desaparece (comportamiento ya existente, reutilizado).

## Non-Functional Requirements

**NFR-5 (cambio de esquema, sustituye conceptualmente el uso de BR-2)**: la tabla `products` sustituye `quantity` (texto libre único) por `quantity_number` (integer, nullable) y `quantity_unit` (text, nullable, máx. 20 caracteres). Se migra el dato existente de `quantity` a estas nuevas columnas de forma best-effort (ver Functional Design) o se acepta período de convivencia — a definir en Functional Design.

**NFR-6**: el ranking de "5 productos más repetidos" se calcula sobre el histórico completo de `products` de ese household (pendientes + comprados), agrupando por nombre exacto (mismo criterio de agrupación ya usado en estadísticas, Unidad 3).

**NFR-7**: scroll infinito reutiliza `common/pagination.js` ya existente (mismo cursor por `created_at`), cambiando el disparador de "click en botón" a "IntersectionObserver cerca del final de la lista".

**NFR-8**: reutilización de patrones ya establecidos: fail-fast sin reintentos, mensajes de error genéricos, vanilla JS/CSS sin librerías de UI externas, modal genérico (`common/modal.js`) para el asistente de 3 pasos (con variante "pantalla completa").

## Alcance de esta iteración
Se procede directamente a Functional Design (definir el detalle de migración de `quantity`, jerarquía de componentes del wizard, y reglas de negocio de sugerencias/categorías con icono) sin pasar por User Stories, por el mismo criterio que la Pantalla 1.

---

## CICLO 2 — Historial en Tickets (Unidad 7)

### Intent Analysis Summary
- **User Request**: Agrupar las compras marcadas como "bought" en tickets (una compra = un ticket), cada uno con su propio modal de detalle, que se puede deshacer o eliminar como unidad. Los filtros actuales (nombre, rango de fechas) deben seguir funcionando igual, pero operando sobre tickets.
- **Request Type**: Enhancement (rediseño del modelo de datos e interfaz de FR-3/Historial, Unidad 3)
- **Scope Estimate**: Multiple Components (esquema de datos, flujo de "Marcar como comprados", vista de historial, nuevo modal de ticket)
- **Complexity Estimate**: Moderate (cambio de esquema con tabla nueva y FK, sin lógica de negocio compleja)
- **Depth Applied**: Standard

### Contexto técnico relevante
Todas las acciones de "marcar como comprado" pasan hoy por la barra de selección en lote (`selection-bar.js` → `product-list.js`), que actualiza todos los productos seleccionados con el **mismo** `bought_at`, en una sola operación `.update(...).in('id', ids)`. No existe ningún otro punto de la app donde un producto pase a `status = 'bought'`. Por tanto, cada acción de "Comprados" ya equivale, uno a uno, a una compra completa.

### FR-18: Modelo de datos — tabla `purchases`
- FR-18.1: Nueva tabla `purchases` (`id`, `household_id`, `bought_by`, `bought_at`) + columna `purchase_id` (FK) en `products`.
- FR-18.2: La acción "Marcar como comprados" (selección en lote) crea un único registro en `purchases` y asigna su `id` como `purchase_id` a todos los productos seleccionados, en la misma operación.
- FR-18.3: No hay migración retroactiva de compras anteriores a este cambio — se asume que no hay datos reales de historial que preservar (decisión explícita del usuario). El historial existente puede limpiarse como parte de la migración de esquema.

### FR-19: Vista de historial — lista de tickets
- FR-19.1: La vista de historial (antes lista plana de productos) pasa a mostrar una **lista de tickets**, orden cronológico (más reciente primero) por `bought_at` del ticket.
- FR-19.2: Cada entrada de la lista principal muestra: fecha y hora de la compra, quién la marcó como comprada (`bought_by`) y el número de productos del ticket. El detalle de productos solo se ve al abrir el modal (no hay preview de nombres en la lista).
- FR-19.3: Al pulsar un ticket se abre un modal (reutilizando `common/modal.js`) con el detalle: nombre y cantidad de cada producto del ticket.

### FR-20: Acciones sobre el ticket completo
- FR-20.1: Desde el modal, "Deshacer ticket" revierte **todos** los productos del ticket a `status = 'pending'` (`bought_by = null`, `bought_at = null`, `purchase_id = null`) y elimina el registro de `purchases`.
- FR-20.2: Desde el modal, "Eliminar ticket" elimina **todos** los productos del ticket y el propio registro de `purchases`.
- FR-20.3: Ambas acciones son optimistas (mismo patrón `applyOptimistic` ya usado en el historial actual), con reversión visual y mensaje de error genérico si falla la operación remota.

### FR-21: Acciones sobre un producto individual dentro del ticket
- FR-21.1: Dentro del modal, cada producto individual tiene también sus propios botones "Desmarcar" y "Eliminar" (mismo comportamiento que hoy en el historial plano), independientes de las acciones de ticket completo.
- FR-21.2: Si estas acciones dejan el ticket sin productos (se desmarcan/eliminan todos individualmente), el registro de `purchases` correspondiente se elimina también (un ticket vacío no debe quedar huérfano en la base de datos), y el modal se cierra.

### FR-22: Filtros (mismo comportamiento, ahora sobre tickets)
- FR-22.1: Mismo UI de filtros que hoy (`history-filters.js`, sin cambios): búsqueda por nombre + rango de fechas + "Limpiar filtros".
- FR-22.2: Filtro por nombre: un ticket aparece en los resultados si **al menos uno** de sus productos coincide con el nombre buscado; el ticket se muestra completo (con todos sus productos) en el modal, no solo el que coincide.
- FR-22.3: Filtro por fecha: se aplica sobre la fecha del ticket (`bought_at` de `purchases`), mismo rango que hoy.
- FR-22.4: Paginación/límite: la unidad pasa a ser el ticket en vez del producto — 20 tickets por página sin filtro activo (reutilizando `common/pagination.js`), hasta 2000 tickets cargados sin paginar cuando hay un filtro activo (mismo patrón que hoy, límite `FILTERED_FETCH_LIMIT`).

### FR-23: Estadísticas — sin cambios
- FR-23.1: Las estadísticas (Unidad 3, `stats-page.js` / `calculations.js`) no cambian: siguen calculando el ranking de productos más comprados directamente sobre `products` con `status = 'bought'`, por producto individual, sin relación con el número de tickets.

### Non-Functional Requirements

**NFR-9 (esquema)**: la migración de esquema (`supabase/schema.sql`) añade la tabla `purchases` y la columna `products.purchase_id` (FK con `on delete cascade` desde `purchases` hacia `products`, para que eliminar un ticket elimine sus productos sin necesitar dos operaciones separadas desde el cliente — a confirmar en NFR Design). Reutiliza el patrón aditivo ya usado en Unidad 5/6 (bloques `alter table ... add column if not exists`).

**NFR-10**: reutilización de patrones ya establecidos: `applyOptimistic` para las acciones sobre ticket y sobre producto individual, `common/modal.js` para el modal de detalle, fail-fast sin reintentos, mensajes de error genéricos, vanilla JS/CSS sin librerías de UI externas.

**NFR-11**: seguridad (Security Baseline activada, ver NFR-3 global) — RLS sobre `purchases` sigue el mismo modelo permisivo ya usado en `products` (acceso por `household_id`, sin autenticación propia), consistente con la excepción SECURITY-08 ya aceptada para el proyecto.

## Alcance de esta iteración (Ciclo 2 — Unidad 7)
Se procede directamente a Functional Design (definir el detalle de la migración de esquema, ciclo de vida del ticket huérfano, y componentes del modal) sin pasar por User Stories, por el mismo criterio que las Pantallas 1 y 2.

---

## CICLO 3 — Design System basado en Radix UI

### Intent Analysis Summary
- **User Request**: "me gustaria generar un design system basado en https://www.radix-ui.com/"
- **Request Type**: Enhancement (fundamentos visuales + remaquetado de componentes existentes)
- **Scope Estimate**: System-wide (afecta a `css/style.css` completo y a todos los componentes de `src/`)
- **Complexity Estimate**: Moderate (sin lógica de negocio nueva; el riesgo está en no romper comportamiento/tests existentes al remaquetar)
- **Depth Applied**: Standard

### Contexto técnico relevante
La app es HTML/CSS/JS vanilla (sin React ni bundler de UI), con un único `css/style.css` (753 líneas) y variables CSS mínimas (`--spacing`, `--radius`, `--color-primary`, `--color-secondary`). Radix UI (los primitivos React) no es aplicable sin React; el design system adopta en su lugar el **lenguaje visual de Radix**: escalas de color de [Radix Colors](https://www.radix-ui.com/colors) (12 pasos por color, claro y oscuro), escala de radios, escala tipográfica y espaciado de [Radix Themes](https://www.radix-ui.com/themes/docs/theme/overview), traducidos a variables CSS propias del proyecto.

### FR-24: Tokens de color (Radix Colors)
- FR-24.1: Color de acento: **Lime** (escala completa de 12 pasos, claro y oscuro).
- FR-24.2: Color neutro: **Sand** (escala completa de 12 pasos, claro y oscuro).
- FR-24.3: Los 12 pasos de cada escala se exponen como variables CSS (`--accent-1` … `--accent-12`, `--sand-1` … `--sand-12`) con los valores oficiales publicados por Radix Colors, siguiendo el uso previsto por paso (1-2 fondo, 3-5 componentes interactivos, 6-8 bordes, 9-10 sólidos/acento, 11-12 texto).
- FR-24.4: Colores semánticos existentes hoy con valores hardcodeados sueltos (estados de error, éxito, etc., si los hay) se migran a la escala Radix correspondiente donde exista una equivalencia clara; si no la hay, se documenta como excepción.

### FR-25: Modo oscuro
- FR-25.1: Se implementa modo oscuro completo con la escala oscura de Radix Colors para `accent` y `sand`.
- FR-25.2: El modo se activa automáticamente por preferencia del sistema (`prefers-color-scheme: dark`), sin selector manual en esta iteración (no solicitado).
- FR-25.3: `color-scheme` en `:root` se ajusta dinámicamente (`light dark`) para que los controles nativos del navegador (inputs, scrollbars) reflejen el tema correcto.

### FR-26: Tipografía
- FR-26.1: Se adopta **Inter** como fuente principal, cargada vía Google Fonts (`<link>` en `index.html`), con `system-ui`/`sans-serif` como fallback de la pila de fuentes.
- FR-26.2: Se adopta la escala tipográfica de tamaños de Radix Themes (9 pasos) como variables CSS (`--font-size-1` … `--font-size-9`), aplicada a título de app, títulos de sección, texto de cuerpo, texto secundario/metadatos y labels.

### FR-27: Radios
- FR-27.1: Se adopta la escala de radios de Radix (`--radius-1` … `--radius-6`, más un radio "full"/999px para elementos tipo píldora).
- FR-27.2: Cada tipo de elemento usa el paso de radio que le corresponda por convención Radix (ej.: inputs/botones pequeños → radio bajo, tarjetas/modales → radio medio-alto, chips/badges → full).

### FR-28: Remaquetado de componentes existentes
- FR-28.1: Se remaquetan **todos** los componentes visuales existentes en `css/style.css` para usar los tokens de FR-24 a FR-27, incluyendo (no limitado a): tarjetas (`.card`), formulario de producto, chips, botones/acciones, barra de selección en lote, modales, filas de historial/tickets, vista de estadísticas, tarjetas de lista (`list-card`), onboarding/QR.
- FR-28.2: El remaquetado es solo visual (color, tipografía, radio, espaciado); no cambia estructura HTML, `data-testid`, comportamiento JS ni lógica de negocio, salvo ajustes mínimos de marcado inevitables para aplicar un token (a valorar caso por caso en Functional/NFR Design).
- FR-28.3: Se prioriza mantener los 228 tests existentes en verde; cualquier test que dependa de un valor de estilo hardcodeado que cambie de intención se actualiza como parte de esta iteración.

### Non-Functional Requirements

**NFR-12 (verificación)**: la validación de que el resultado "se ve como Radix" es manual: el usuario revisará visualmente en el navegador tras cada componente/tanda remaquetada. No se exige pixel-perfect frente a Radix Themes, pero los valores de los tokens (colores, radios, tamaños tipográficos) deben coincidir con los oficiales de Radix Colors/Themes para el color Lime/Sand.

**NFR-13**: sin dependencias nuevas de build ni frameworks de UI — los tokens se definen como variables CSS puras en `css/style.css` (o un archivo de tokens separado importado desde ahí), consistente con el enfoque vanilla ya establecido (NFR-8).

**NFR-14**: accesibilidad de contraste — al aplicar los pasos de texto (11-12) de las escalas Radix sobre los pasos de fondo (1-2), se preserva el contraste AA ya garantizado por el diseño de Radix Colors; no se introducen combinaciones de color fuera de las parejas fondo/texto recomendadas por Radix.

## Alcance de esta iteración (Ciclo 3)
Dado que es un cambio transversal (afecta a todos los componentes visuales) pero sin ambigüedad de negocio ni nuevos flujos de usuario, se procede sin User Stories, directamente a Workflow Planning para definir cómo secuenciar el remaquetado (tokens primero, luego componentes por lotes, con puntos de verificación visual del usuario).

---

## REVISIÓN Ciclo 3 — Sistema de color y forma basado en Material Design 3

### Contexto del cambio
Tras generar y aprobar los Lotes 0-1 con Radix Colors (Lime/Sand planos), el usuario indicó preferir el **sistema de color de Material Design 3** (`https://m3.material.io/styles/color/system/how-the-system-works`). Se detectó y resolvió una ambigüedad (ver `m3-color-system-questions.md` y `m3-color-system-clarification-questions.md`): el cambio no se limita al color, sino que **sustituye la base del design system** por Material Design 3 para color y forma, manteniendo Inter como tipografía (con la escala de tamaños/pesos de M3, no la de Roboto).

Esta revisión **supersede** las decisiones de color/radios de FR-24, FR-26.2 y FR-27 (mantiene FR-25 modo oscuro automático y FR-26.1 Inter como fuente).

### FR-29: Paleta de color M3 (paletas tonales + roles semánticos)
- FR-29.1: Color semilla: el mismo verde ya aprobado, Lime-9 de Radix (`#bdee63`), usado como `sourceColor` del algoritmo HCT de Material Color Utilities (`@material/material-color-utilities`, paquete oficial de Google).
- FR-29.2: Se genera el esquema completo `SchemeTonalSpot` (variante por defecto de Material You), spec `2025`, `contrastLevel: 0`, para claro y oscuro, incluyendo: `primary`/`on-primary`/`primary-container`/`on-primary-container`, `secondary`/`on-secondary`/`secondary-container`/`on-secondary-container` (derivado automáticamente por armonía tonal), `tertiary`/`on-tertiary`/`tertiary-container`/`on-tertiary-container` (ídem), `error`/`on-error`/`error-container`/`on-error-container` (paleta de error fija de M3, ya no hardcodeada), `surface`/`on-surface`/`surface-variant`/`on-surface-variant`, niveles de superficie `surface-dim`/`surface-bright`/`surface-container-lowest`/`surface-container-low`/`surface-container`/`surface-container-high`/`surface-container-highest`, `outline`/`outline-variant`, `background`/`on-background`, `inverse-surface`/`inverse-on-surface`/`inverse-primary`, `shadow`/`scrim`.
- FR-29.3: Los valores hex se calculan una vez (no en runtime — sin dependencia nueva de build/JS, consistente con NFR-13) y se hardcodean como variables CSS en `css/tokens.css`, documentando la fuente (script Node de un solo uso con el paquete oficial, valores verificables reproduciendo el cálculo).
- FR-29.4: El botón "danger" (antes excepción con rojo hardcodeado) pasa a usar el rol `error`/`on-error` de M3 — ya no es una excepción.

### FR-30: Forma (shape) — sustituye la escala de radios de Radix
- FR-30.1: Se adopta la escala de "shape" de M3 (fuente: tokens oficiales de `material-web`, versión v0.192): `corner-none` (0px), `corner-extra-small` (4px), `corner-small` (8px), `corner-medium` (12px), `corner-large` (16px), `corner-extra-large` (28px), `corner-full` (9999px).
- FR-30.2: Cada componente usa el corner que le corresponde por convención M3 (a definir por componente en Code Generation): botones → `corner-full` (pill, patrón de M3 desde su rediseño "expressive"), chips → `corner-small`, tarjetas → `corner-medium`, inputs de texto (outlined) → `corner-extra-small`, modales/hojas → `corner-large`/`corner-extra-large`.

### FR-31: Tipografía — escala de M3 con Inter
- FR-31.1: Se mantiene Inter (FR-26.1, sin cambios) como fuente, pero se sustituye la escala de tamaños/line-height de Radix Themes (FR-26.2) por la **escala tipográfica oficial de M3** (15 roles: `display-large/medium/small`, `headline-large/medium/small`, `title-large/medium/small`, `body-large/medium/small`, `label-large/medium/small`), con tamaño, line-height, tracking (letter-spacing) y peso (regular 400 / medium 500 / bold 700) oficiales por rol (fuente: tokens de `material-web` v0.192).
- FR-31.2: Se mapea cada uso tipográfico ya existente en la app (título de app, títulos de sección, texto de cuerpo, metadatos, labels) al rol de M3 más adecuado, en Code Generation.

### FR-32: Elevación mediante superficies con tinte de color
- FR-32.1: Se sustituye el uso de `box-shadow` para elementos flotantes (modales, barra de tabs, FAB) por el sistema de elevación de M3 basado en variaciones de `surface-container-*` (superficie con más tinte de color = más elevada), en los lotes que toquen esos componentes (Lotes 2-4, aún no generados).
- FR-32.2: Los Lotes 0-1 ya generados con Radix se **reharán** con esta arquitectura antes de continuar con el resto de componentes (decisión explícita del usuario), evitando dejar la app con dos sistemas de color mezclados.

### Non-Functional Requirements (revisión)

**NFR-15**: los valores de color/forma/tipografía de M3 deben ser trazables a una fuente oficial verificable (paquete npm `@material/material-color-utilities` para color, tokens de `material-web` para forma/tipografía) — mismo criterio de NFR-12/13 ya aplicado a Radix.

**NFR-16**: el cambio de FR-29 a FR-32 no reintroduce dependencias de runtime nuevas (NFR-13 se mantiene): los valores se calculan una vez fuera de la app y se hardcodean como CSS.

## Alcance de esta iteración (Revisión Ciclo 3)
Se rehacen los Lotes 0 y 1 en un único lote combinado ("Lote 0-1 v2") con la nueva arquitectura M3, y se continúa después con los Lotes 2-4 ya planificados (ahora aplicando M3 en vez de Radix). Sin User Stories ni Functional/NFR/Infrastructure Design adicionales — mismo criterio que el resto del Ciclo 3 (cambio puramente visual, sin lógica de negocio).

---

## Ciclo 5 — Estadísticas de calidad con gráficas

### Intent Analysis
- **User Request**: "lee el proyecto y ten el contexto para mejorar y añadir estadisticas de calidad con sus graficas correspondientes."
- **Request Type**: Enhancement (de la pantalla de estadísticas existente, Unidad 3) + New Feature (evolución temporal, estadística no existente hasta ahora)
- **Scope Estimate**: Single Component (`src/stats/` y sus tests; sin cambios de esquema salvo, potencialmente, ninguno — toda la información necesaria ya existe en `products`)
- **Complexity Estimate**: Moderate (introduce una dependencia de gráficos nueva, criterio distinto al resto de la app que es 100% vanilla JS)

### Contexto (hallazgo de la lectura del código)
La pantalla de estadísticas actual tiene 3 secciones, todas renderizadas como listas de texto (`<ol>`/`<ul>`), sin ningún gráfico:
- `stats-ranking.js`: ranking de productos más comprados (lista numerada).
- `stats-cadence.js`: cadencia media de recompra (no leído en detalle, mismo patrón de lista).
- `stats-distribution.js`: distribución por día de la semana y por persona (dos listas).

Los cálculos ya existen y son funciones puras en `calculations.js` (`groupByNormalizedName`, `computeRanking`, `computeAverageCadenceDays`, `computeDistributionByWeekday`, `computeDistributionByPerson`), reutilizables sin cambios para alimentar las nuevas gráficas.

### Functional Requirements

#### FR-33: Gráfica de ranking de productos más comprados
- FR-33.1: La sección "Más comprados" (`stats-ranking.js`) se sustituye por un gráfico de **barras horizontales**, una barra por producto, longitud proporcional al número de compras (`purchaseCount`).
- FR-33.2: Se mantiene la información ya visible hoy (nombre del producto, número de compras) como texto asociado a cada barra.

#### FR-34: Gráfica de distribución por persona
- FR-34.1: La sub-sección "Compras por persona" (`stats-distribution.js`) se sustituye por un **gráfico circular/donut**, un segmento por persona, tamaño proporcional al número de compras.

#### FR-35: Gráfica de distribución por día de la semana
- FR-35.1: La sub-sección "Compras por día de la semana" se sustituye por un **gráfico de barras** (una barra por día, Domingo a Sábado).

#### FR-36: Nueva estadística — evolución temporal de compras
- FR-36.1: Se añade una sección nueva que muestra la evolución del número de compras a lo largo del tiempo, agregando por **mes** o por **semana**, con un control (selector) para alternar entre ambas granularidades.
- FR-36.2: Se representa como **gráfico de líneas**, eje X = periodo (mes o semana), eje Y = número de compras en ese periodo.
- FR-36.3: La agregación se calcula a partir de `bought_at` de los productos comprados ya cargados (mismo dataset que el resto de `stats-page.js`, límite de 2000 compras ya existente — sin cambios de fetch).
- FR-36.4: Formato de periodo: mes como "MMM AAAA" (ej. "jul 2026"); semana como fecha de inicio de semana (ISO, lunes) en formato "dd/mm".

#### FR-37: Cadencia de recompra
- FR-37.1: La sección de cadencia media de recompra se mantiene con su cálculo actual (`computeAverageCadenceDays`); no se especificó un tipo de gráfica distinto para ella, por lo que se mantiene su presentación actual (fuera de alcance salvo ajuste visual menor de coherencia con el resto de tarjetas, a definir en Functional Design si aplica).

### Non-Functional Requirements

**NFR-17**: Se introduce una librería de gráficos ligera (ej. Chart.js) como nueva dependencia npm — decisión explícita del usuario (Q4=B), que rompe el criterio previamente establecido de "sin dependencias nuevas de UI" (NFR-8/NFR-13). Se documenta como excepción aceptada para esta iteración; el resto de componentes de la app no adoptan la librería salvo en `src/stats/`.

**NFR-18**: Las gráficas deben leer sus colores de los tokens CSS M3 ya definidos en `css/tokens.css` (roles semánticos `primary`, `secondary`, `tertiary`, superficies) y funcionar correctamente tanto en modo claro como oscuro (`prefers-color-scheme`), consistente con NFR-14/FR-25.

**NFR-19**: Sin cambios de esquema de base de datos — todos los datos necesarios (nombre, `bought_at`, `bought_by`) ya existen en la tabla `products`; no se requiere el dato de precio (descartado en Q5, opción A no elegida).

**NFR-20**: Se reutilizan las funciones de cálculo puras ya existentes en `calculations.js` sin modificarlas, salvo la función nueva de agregación temporal (mes/semana) que se añade siguiendo el mismo patrón (función pura, testeada con Vitest, coherente con PBT-03 si aplica a esta unidad).

## Alcance de esta iteración (Ciclo 5)
Cambio acotado a `src/stats/` (sin tocar Unidades 1-7 ni esquema de base de datos). Dado que introduce una nueva dependencia (decisión NFR relevante) y un tipo de dato agregado nuevo (evolución temporal), se ejecuta con Functional Design y NFR Requirements/Design antes de Code Generation (no se salta como los cambios puramente visuales del Ciclo 3/4) — ver Workflow Planning.
