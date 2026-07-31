# Functional Design Plan — Ciclo 5: Estadísticas de calidad con gráficas

**Unit**: `ciclo5-stats-graficas` (sin Units Generation formal — cambio de un único componente existente, `src/stats/`, ver `execution-plan-ciclo5.md`)

## Plan

- [ ] Definir modelo de dominio para la agregación temporal (periodo mes/semana)
- [ ] Definir reglas de negocio nuevas (BR) para: ventana temporal a mostrar, tratamiento de periodos sin compras, límite de elementos en el ranking, comportamiento del selector mes/semana
- [ ] Definir el modelo de lógica de negocio (business-logic-model) para la nueva agregación temporal
- [ ] Definir los componentes de frontend (jerarquía, props, integración con `stats-page.js`)
- [ ] Resolver preguntas de aclaración con el usuario
- [ ] Generar artefactos finales (`business-logic-model.md`, `business-rules.md`, `domain-entities.md`, `frontend-components.md`)

## Preguntas de aclaración

### Question 1: Ventana temporal para la evolución de compras
Los datos ya cargados llegan hasta 2000 compras (`STATS_FETCH_LIMIT`), que en una app de 2 personas puede cubrir varios años. Un gráfico de líneas con demasiados puntos (ej. 3 años de semanas = ~150 puntos) sería difícil de leer.

¿Qué ventana temporal quieres mostrar en la evolución?

A) Todo el histórico disponible (todos los meses/semanas con datos), sin límite

B) Los últimos 12 meses / últimas 12 semanas (según granularidad seleccionada)

C) Los últimos 6 meses / últimas 8 semanas

D) Other (please describe after [Answer]: tag below)

[Answer]: a

### Question 2: Periodos sin compras dentro de la ventana
Dentro de la ventana temporal elegida, es probable que haya meses o semanas sin ninguna compra (ej. viaje, no se actualizó la lista).

¿Cómo se deben mostrar esos periodos en el gráfico de líneas?

A) Se incluyen como punto en 0 (la línea baja a cero y continúa) — más preciso pero puede verse "irregular"

B) Se omiten (la línea solo conecta los periodos que sí tienen datos)

C) Other (please describe after [Answer]: tag below)

[Answer]: a

### Question 3: Límite de elementos en el ranking de productos
Hoy el ranking (`stats-ranking.js`) muestra todos los productos comprados alguna vez, sin límite — con una app en uso durante meses esto puede ser una lista larga y, como gráfico de barras horizontales, ilegible.

¿Quieres limitar el número de productos mostrados en el gráfico de barras del ranking?

A) Sí, mostrar solo el Top 10

B) Sí, mostrar solo el Top 15

C) No, mostrar todos como hoy (scroll si hace falta)

D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4: Comportamiento del selector mes/semana
La Pregunta 1 de la clarificación anterior (respuesta C) pidió "ambas, con un selector para alternar" entre mes y semana para la evolución temporal.

¿Cómo debe comportarse ese selector?

A) Dos pestañas/botones ("Mes" / "Semana") que recalculan el gráfico al vuelo con los datos ya cargados en memoria (sin nueva petición a Supabase)

B) Un desplegable (select) con las mismas dos opciones, mismo comportamiento sin nueva petición

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5: Cadencia de recompra (sección sin gráfica especificada)
FR-37 deja la sección de cadencia media de recompra sin un tipo de gráfica indicado (no se preguntó explícitamente en Requirements Analysis).

¿Qué prefieres para esta sección?

A) Se mantiene exactamente como está hoy (sin gráfica, fuera de alcance de este ciclo)

B) También se convierte en gráfica (indica el tipo en "Other")

C) Other (please describe after [Answer]: tag below)

[Answer]: A
