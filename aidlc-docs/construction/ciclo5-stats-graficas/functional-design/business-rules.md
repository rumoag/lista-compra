# Business Rules — Ciclo 5: Estadísticas de calidad con gráficas

## BR-67: Ventana temporal de la evolución de compras
La evolución temporal (FR-36) muestra **todo el histórico disponible** dentro de los datos ya cargados por `stats-page.js` (hasta `STATS_FETCH_LIMIT` = 2000 compras), sin recortar a una ventana de N meses/semanas. (Respuesta del usuario: Question 1 = A)

## BR-68: Periodos sin compras se muestran como cero
Al construir la serie de `TimeBucket`, los periodos (mes o semana) comprendidos entre el primer y el último periodo con datos que no tengan ninguna compra se incluyen igualmente en la serie con `count = 0`, de modo que la línea del gráfico pase por cero en vez de saltar ese periodo. (Respuesta del usuario: Question 2 = A)

## BR-69: Límite del ranking de productos más comprados
El gráfico de barras horizontales del ranking (FR-33) muestra como máximo los **10 productos** con mayor `purchaseCount` (`computeRanking` ya ordena de mayor a menor; se toman los 10 primeros). Productos por debajo del Top 10 no se muestran en el gráfico. (Respuesta del usuario: Question 3 = A)

## BR-70: Selector de granularidad mes/semana
La evolución temporal ofrece dos botones/pestañas ("Mes" / "Semana"). Cambiar de granularidad recalcula la agregación **en memoria**, a partir de los mismos `products` ya cargados en el fetch inicial de `stats-page.js` — no dispara una nueva consulta a Supabase. El estado por defecto al cargar la pantalla es "Mes". (Respuesta del usuario: Question 4 = A)

## BR-71: Cadencia de recompra sin cambios
La sección de cadencia media de recompra (`stats-cadence.js`) se mantiene en su presentación actual (sin gráfica) — fuera de alcance de este ciclo. (Respuesta del usuario: Question 5 = A)
