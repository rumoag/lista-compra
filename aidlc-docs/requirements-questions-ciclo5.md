# Ciclo 5 — Preguntas de aclaración: Estadísticas de calidad y gráficas

Contexto: la pantalla de estadísticas actual (`src/stats/`) tiene 3 secciones —
"Más comprados" (ranking), cadencia media de recompra y distribución por día
de la semana / por persona — pero todas se muestran como listas de texto
planas, sin ningún gráfico. Responde estas preguntas para acotar el alcance.

## Question 1
¿Qué quieres decir con "estadísticas de calidad"? ¿Se trata de mejorar/enriquecer las estadísticas ya existentes (más informativas, con gráficas), o de añadir un tipo de estadística nueva y distinta que hoy no existe?

A) Mejorar y visualizar con gráficas las estadísticas ya existentes (ranking, cadencia, distribución)

B) Añadir estadísticas nuevas además de mejorar las existentes (indícalo en "Other")

C) Solo añadir gráficas a lo que ya existe, sin cambiar los cálculos

D) Other (please describe after [Answer]: tag below)

[Answer]: b

## Question 2
¿Qué tipo de gráficas prefieres para el ranking de productos más comprados?

A) Gráfico de barras horizontales (uno por producto, longitud = nº de compras)

B) Gráfico de barras verticales

C) Lista con mini-barras de progreso inline (más ligero, sin librería de gráficos)

D) Other (please describe after [Answer]: tag below)

[Answer]: a

## Question 3
¿Qué tipo de gráfica prefieres para la distribución por día de la semana / por persona?

A) Gráfico de barras (uno para día de la semana, otro para persona)

B) Gráfico circular / donut (reparto por persona) + barras para día de la semana

C) Mantener como lista de texto, sin gráfica

D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 4
¿Cómo debe implementarse el renderizado de las gráficas?

A) SVG generado a mano en JS (sin dependencias nuevas, coherente con el resto de la app que no usa librerías de UI)

B) Añadir una librería de gráficos ligera (ej. Chart.js) como nueva dependencia

C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 5
Además de mejorar lo existente, ¿qué nuevas estadísticas te interesaría añadir? (puedes elegir varias separándolas por comas en "Other", o elegir una opción)

A) Gasto/importe total y medio por ticket (si hay datos de precio) — nota: hoy no se registra precio, requeriría añadir ese dato

B) Evolución temporal (nº de compras por mes/semana a lo largo del tiempo)

C) Ninguna estadística nueva, solo mejorar/visualizar las 3 actuales

D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 6
¿Debe verse bien tanto en modo claro como oscuro (la app ya soporta `prefers-color-scheme`)?

A) Sí, las gráficas deben respetar los tokens de color M3 ya definidos en `css/tokens.css` y funcionar en ambos modos

B) No es prioritario por ahora

C) Other (please describe after [Answer]: tag below)

[Answer]: A
