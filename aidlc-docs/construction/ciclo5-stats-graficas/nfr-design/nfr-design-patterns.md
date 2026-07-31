# NFR Design Patterns — Ciclo 5: Estadísticas de calidad con gráficas

## Resilience: fallback si Chart.js no carga
Patrón: cada componente de gráfica (`stats-ranking.js`, `stats-distribution.js`, `stats-timeseries.js`) envuelve el `import('https://esm.sh/chart.js@4.4.4/auto')` en un `try/catch`. Si falla:
- La alternativa textual accesible (prevista en NFR Requirements como `sr-only` para lectores de pantalla) se muestra como **contenido principal visible** en su lugar (se le quita la clase `sr-only`), reutilizando exactamente los mismos datos ya calculados — no hay lógica de cálculo duplicada, solo una rama de presentación distinta.
- No se bloquea el resto de la pantalla: si, por ejemplo, falla la carga para el gráfico de ranking, la evolución temporal y la distribución se siguen intentando renderizar de forma independiente (cada componente hace su propio `import` y su propio `try/catch`).
- Mismo patrón ya usado en la app para fallos de red (ver `stats-page.js`, que ya maneja el `error` de la consulta a Supabase con un mensaje y sin excepción no controlada).

## Performance: colores del tema en el momento de creación del gráfico
Patrón: los componentes de gráfica leen los tokens de color M3 (`getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-...')`) **una sola vez**, en el momento de construir cada `Chart`, igual que ya ocurre implícitamente con cualquier `<canvas>`. No se añade ningún listener de `matchMedia` (decisión explícita, Question 2 = A) — si el usuario cambia el tema del sistema operativo con la pantalla de Estadísticas abierta, los gráficos mantienen los colores del tema con el que se crearon hasta la próxima vez que se entre en la pantalla (navegación fuera y vuelta a entrar, que ya re-ejecuta `renderStatsPage` desde cero).

## Security
Sin patrón de diseño adicional — ya cubierto en NFR Requirements (versión fijada de Chart.js, CSP existente sin cambios).

## Scalability — N/A
No aplica: sin mecanismo de escalado nuevo; volumen de datos acotado por `STATS_FETCH_LIMIT` = 2000, ya decidido en la Unidad 3 original.
