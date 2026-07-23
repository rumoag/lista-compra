# Functional Design Plan — Unidad 3: Historial y estadísticas

## Contexto de la unidad
- **Responsabilidades**: módulo `history/` (vista cronológica, filtros, corrección) y módulo `stats/` (ranking, cadencia media, distribución).
- **Historias cubiertas**: US-3.1, US-3.2, US-3.3, US-4.1, US-4.2, US-4.3
- **Depende de**: Unidad 1 (esquema), Unidad 2 (datos reales con `bought_at`/`bought_by`)

## Checklist de ejecución
- [ ] Confirmar respuestas a las preguntas de contexto
- [ ] Generar `domain-entities.md`, `business-rules.md`, `business-logic-model.md` (con Testable Properties — aquí sí hay lógica de negocio no trivial: cálculo de cadencia media), `frontend-components.md`

## Preguntas de contexto

### Question 1 — Cálculo de "cadencia media entre compras" (US-4.2)
Para un producto con 3+ compras en fechas `t1 < t2 < t3`, ¿cómo se calcula la cadencia media?

A) Media aritmética simple de los intervalos consecutivos: `((t2-t1) + (t3-t2)) / 2` días — sencillo y suficiente para detectar patrones aproximados

B) Mediana de los intervalos (más robusta ante compras atípicas puntuales, ej. una compra excepcional de más cantidad)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Agrupación por nombre para estadísticas
Las estadísticas se agrupan "por producto" (US-4.1, US-4.2). Dos productos con el mismo `name` escrito de forma ligeramente distinta (ej. "Leche" vs "leche" vs " Leche") ¿deben considerarse el mismo producto a efectos estadísticos?

A) Sí, normalizar el nombre (minúsculas + trim, usando la misma normalización de `common/validation.js`) antes de agrupar, para evitar fragmentar las estadísticas por diferencias triviales de mayúsculas/espacios

B) No, agrupar por el valor exacto de `name` tal como está guardado (más simple, pero puede fragmentar innecesariamente)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3 — Ventana temporal de las estadísticas
¿Las estadísticas (ranking, cadencia, distribución) se calculan sobre todo el historial acumulado desde el inicio, o sobre una ventana reciente (ej. últimos 90 días)?

A) Todo el historial acumulado desde el inicio — más simple, y con un uso de meses/años el propio dato de "todo el histórico" sigue siendo útil para detectar patrones

B) Ventana de tiempo configurable (ej. últimos 90 días) para reflejar hábitos de consumo recientes

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4 — Filtro de historial por rango de fechas: ¿sobre qué campo?
El filtro de US-3.2 por "rango de fechas", ¿es sobre `bought_at` (cuándo se compró) o también permite filtrar por `created_at` (cuándo se añadió a la lista)?

A) Solo por `bought_at` — es lo relevante para el historial de compras (más simple y alineado con el propósito de la pantalla)

B) Ambos campos, con un selector de cuál usar

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5 — Paginación del historial
¿El historial usa el mismo patrón de paginación por cursor que la lista de pendientes (Unidad 1), o se muestra todo de una vez dado que probablemente sea una vista menos usada?

A) Mismo patrón de paginación por cursor (sobre `bought_at`) que la lista de pendientes, reutilizando `common/pagination.js` — consistente con el resto de la app

B) Cargar todo el historial de una vez sin paginación

X) Other (please describe after [Answer]: tag below)

[Answer]: A
