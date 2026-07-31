# NFR Requirements — Ciclo 5: Estadísticas de calidad con gráficas

## Scalability / Performance
- La app es una PWA usada principalmente en móvil por 2 personas (household). Se prioriza tamaño de descarga bajo sobre número de features del gráfico — decisión del usuario de todas formas fue Chart.js (Question 1 = A), asumiendo el coste de ~200KB minificado vía CDN (esm.sh sirve el paquete ya minificado y cacheable por el navegador entre visitas).
- Sin cambios al límite de fetch existente (`STATS_FETCH_LIMIT` = 2000, NFR-19); el cálculo de `computeTimeSeries` es O(n) sobre ese máximo, sin impacto de rendimiento relevante.

## Tech Stack Selection
- **Librería de gráficos**: **Chart.js**, cargada vía `https://esm.sh/chart.js@4.4.4` (misma convención que `qrcode@1.5.4` y `@supabase/supabase-js@2.110.8` — sin bundler, sin entrada en `package.json`, ver `tech-stack-decisions.md`).
- **Sin dependencias de build nuevas**: no se introduce ningún paso de bundling; el módulo se importa como ES module nativo, igual que el resto del proyecto (NFR-8 se mantiene en cuanto a "sin build tool nuevo", aunque se documenta la excepción de "sin dependencias de UI nuevas" ya aceptada en Requirements Analysis, NFR-17).

## Reliability / Testing
- **Estrategia de testing**: se mockea `https://esm.sh/chart.js@4.4.4` con `vi.mock(...)` en los tests de cada componente de `src/stats/`, mismo patrón que `tests/onboarding/qr-view.test.js` — se verifica que Chart.js se instancia con la configuración/datos correctos (tipo de gráfico, labels, datasets), no el renderizado real de píxeles. Esto evita cualquier problema de que `jsdom` no implemente `<canvas>` (no se necesita el paquete nativo `canvas`).
- Si un componente necesita el elemento `<canvas>` en el DOM para instanciar `new Chart(ctx, ...)`, el mock de Chart.js sustituye también el constructor, por lo que no hace falta un polyfill de canvas en `vitest.config.js`.

## Security
- **Versión fijada**: `chart.js@4.4.4` (versión exacta en la URL de esm.sh, sin rango `^`/`~`) — Question 3 = A, mismo criterio que las dependencias CDN existentes. No se añade a `package.json` (`npm audit` no la cubre; revisión manual de CVEs de Chart.js queda como responsabilidad del mismo proceso manual ya aplicado a `qrcode`/`supabase-js`).
- El CSP existente en `vercel.json` ya permite `esm.sh` (usado por `qrcode`/`@supabase/supabase-js`) — sin cambios de CSP necesarios.

## Usability / Accessibility
- **Alternativa textual accesible** (Question 2 = A): cada gráfico nuevo mantiene, además del `<canvas>`, un elemento de texto (tabla o lista) visualmente oculto (`sr-only`, mismo patrón de utilidad CSS a crear si no existe ya) con los mismos datos que el gráfico, para lectores de pantalla. Se aplica a los 4 gráficos: ranking (Top 10), distribución por persona (donut), distribución por día (barras) y evolución temporal (líneas).
- Los `data-testid` existentes que dependían de la estructura de lista (`stats-ranking-list`, `stats-distribution-weekday-list`, `stats-distribution-person-list`) se reutilizan para localizar esa alternativa textual accesible, de modo que los tests existentes sigan verificando el contenido de datos sin depender del renderizado del `<canvas>`.

## Maintainability
- Las funciones de cálculo (`calculations.js`) permanecen 100% independientes de Chart.js — reciben/devuelven datos planos (arrays/objetos), y son los componentes de `src/stats/` los que traducen esos datos al formato de configuración de Chart.js. Esto mantiene el mismo patrón de separación cálculo/presentación ya establecido en el proyecto (NFR-20) y facilita cambiar de librería en el futuro si hiciera falta.
