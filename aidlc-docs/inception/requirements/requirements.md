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
