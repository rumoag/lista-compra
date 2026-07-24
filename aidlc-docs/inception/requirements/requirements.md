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
