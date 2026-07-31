# Frontend Components — Ciclo 5: Estadísticas de calidad con gráficas

## Jerarquía (dentro de `src/stats/`)

```
stats-page.js (orquestador, sin cambios de contrato con el resto de la app)
├── stats-ranking.js        (MODIFICADO: BR-69, gráfico de barras horizontales, Top 10)
├── stats-cadence.js        (SIN CAMBIOS: BR-71)
├── stats-distribution.js   (MODIFICADO: gráfico donut por persona + barras por día)
└── stats-timeseries.js     (NUEVO: FR-36, evolución temporal con selector Mes/Semana)
```

## `stats-ranking.js` (modificado)
- **Props**: `{ groups }` (sin cambios de firma respecto a hoy)
- **Comportamiento nuevo**: aplica `computeRanking(groups).slice(0, 10)` (BR-69) y renderiza un gráfico de barras horizontales (una barra por producto, longitud ∝ `purchaseCount`), con el nombre y el número al lado de cada barra (se mantiene la información visible hoy, FR-33.2).
- **Estado vacío**: igual que hoy (`data-testid="stats-ranking-empty"`) cuando `groups.length === 0`.
- **data-testid**: se mantiene `stats-ranking-list` como contenedor del gráfico (aunque deje de ser un `<ol>`) para no romper tests existentes que dependan de localizarlo; los tests se actualizan para verificar el contenido del gráfico en vez de `<li>`.

## `stats-distribution.js` (modificado)
- **Props**: `{ products }` (sin cambios de firma)
- **Sub-componente "Compras por persona"**: gráfico donut, un segmento por persona (`computeDistributionByPerson`), con leyenda (nombre + número/porcentaje).
- **Sub-componente "Compras por día de la semana"**: gráfico de barras (`computeDistributionByWeekday`), una barra por día (Domingo-Sábado).
- **Estado vacío**: igual que hoy (`data-testid="stats-distribution-empty"`).

## `stats-timeseries.js` (nuevo)
- **Props**: `{ products }` — recibe los mismos `products` ya cargados por `stats-page.js` (mismo dataset que `stats-distribution.js`, sin fetch propio).
- **Estado interno**: `granularity` (`'month' | 'week'`), por defecto `'month'` (BR-70).
- **Interacciones**:
  - Dos botones/pestañas "Mes" / "Semana" (BR-70, Question 4 = A). Al pulsar, se recalcula `computeTimeSeries(products, granularity)` y se vuelve a renderizar el gráfico, sin nueva petición a Supabase.
- **Gráfico**: líneas, eje X = `label` de cada `TimeBucket`, eje Y = `count` (FR-36.2).
- **Estado vacío**: si `products.length === 0`, mismo patrón que las demás secciones (`data-testid="stats-timeseries-empty"`, texto "Aún no hay datos suficientes.").

## `stats-page.js` (orquestador, cambio mínimo)
- Añade un contenedor nuevo `#stats-timeseries-container` (con su skeleton correspondiente, mismo patrón que los otros 3 contenedores) y llama a `renderStatsTimeseries(container, { products: data })` tras el fetch existente.
- No cambia la consulta a Supabase (`STATS_FETCH_LIMIT` = 2000 se mantiene, NFR-19).

## Integración con tokens de color (NFR-18)
Todos los componentes de gráfica leen sus colores desde los tokens CSS M3 existentes en `css/tokens.css` (roles `primary`, `secondary`, `tertiary` y variantes de superficie), vía `getComputedStyle(document.documentElement)` o configuración de la librería de gráficos con esos valores — el mecanismo exacto se define en NFR Design, una vez elegida la librería en NFR Requirements.
