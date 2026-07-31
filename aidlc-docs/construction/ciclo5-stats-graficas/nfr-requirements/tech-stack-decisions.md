# Tech Stack Decisions — Ciclo 5: Estadísticas de calidad con gráficas

## Decisión: Chart.js vía esm.sh

| Aspecto | Decisión |
|---|---|
| Librería | Chart.js |
| Versión | `4.4.4` (fijada, sin rango) |
| Mecanismo de carga | `import Chart from 'https://esm.sh/chart.js@4.4.4/auto'` (build `/auto` registra todos los tipos de gráfico usados: bar, line, doughnut — evita registro manual de escalas/plugins) |
| ¿En `package.json`? | No — mismo criterio que `qrcode`/`@supabase/supabase-js`, ya existentes en el proyecto sin entrada en `package.json` |
| ¿Requiere bundler? | No — módulo ES nativo, cargado igual en dev y producción |
| CSP | Ya permitido (`esm.sh` en `vercel.json`, usado por `qrcode`) |
| Testing | Mock completo vía `vi.mock('https://esm.sh/chart.js@4.4.4/auto', ...)`, mismo patrón que `qr-view.test.js` |

## Alternativas consideradas y descartadas
- **Chartist.js** / **ApexCharts**: descartadas por decisión explícita del usuario (Question 1 = A, Chart.js) — se documenta para referencia futura si se reconsiderase el tamaño de descarga.
- **SVG a mano sin librería**: descartado en Requirements Analysis (Q4 = B, librería en vez de SVG manual).

## Justificación de la excepción a NFR-8/NFR-13 (criterio "sin dependencias de UI nuevas")
Documentada ya en `requirements.md` (NFR-17) durante Requirements Analysis. Esta sección confirma que, técnicamente, la excepción es de bajo riesgo: no introduce build tooling nuevo (se mantiene el criterio "sin bundler"), es reversible (aislada a `src/stats/`), y sigue el mismo patrón arquitectónico ya validado por `qrcode`/`@supabase/supabase-js`.
