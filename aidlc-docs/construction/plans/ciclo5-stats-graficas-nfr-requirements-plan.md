# NFR Requirements Plan — Ciclo 5: Estadísticas de calidad con gráficas

## Plan

- [ ] Confirmar el mecanismo de carga de la librería de gráficos (CDN vía esm.sh, mismo patrón que `qrcode`/`@supabase/supabase-js` — sin bundler en este proyecto)
- [ ] Elegir la librería concreta entre las que soportan ese patrón
- [ ] Definir estrategia de testing (mock de la importación esm.sh, mismo patrón que `qr-view.test.js`)
- [ ] Evaluar impacto en rendimiento/tamaño de descarga (PWA usada en móvil)
- [ ] Evaluar accesibilidad (alternativa textual a los gráficos)
- [ ] Resolver preguntas con el usuario
- [ ] Generar `nfr-requirements.md` y `tech-stack-decisions.md`

## Hallazgo técnico relevante
Este proyecto **no usa bundler**: todo el JS se sirve como módulos ES nativos (`<script type="module">`), y las dependencias externas (`@supabase/supabase-js`, `qrcode`) se importan directamente desde `https://esm.sh/...` con versión fijada en la URL, **sin** añadirlas a `package.json` (`npm audit`/`package-lock.json` no las cubre). El CSP de `vercel.json` ya permite `esm.sh`. Los tests las mockean con `vi.mock('https://esm.sh/paquete@version', ...)` (ver `tests/onboarding/qr-view.test.js`), evitando llamadas de red reales y cualquier problema de que `jsdom` no implemente `<canvas>`. Este mismo patrón se aplicaría a la librería de gráficos elegida.

## Preguntas de aclaración

### Question 1: Librería de gráficos concreta
Dado que se cargará vía esm.sh (sin bundler) y se mockeará en tests (no se ejecuta renderizado real de `<canvas>`/SVG durante `npm test`), la limitación técnica de jsdom no es un factor decisivo. La decisión importa sobre todo por tamaño de descarga en el móvil (la app es una PWA) y API de configuración.

¿Qué librería prefieres?

A) **Chart.js** (la más popular, basada en `<canvas>`, ~200KB minificado, incluye animaciones y muchos tipos de gráfico de fábrica)

B) **Chartist.js** (basada en SVG, más ligera ~10KB, menos funciones pero suficiente para barras/líneas/donut simples)

C) **ApexCharts** (basada en SVG, más funciones e interactividad pero más pesada ~150KB)

D) Other (please describe after [Answer]: tag below)

[Answer]: a

### Question 2: Accesibilidad — alternativa textual
Los gráficos (barras, donut, líneas) no son accesibles por sí solos para lectores de pantalla. La app actual no tiene una política de accesibilidad extensa más allá de algunos atributos ARIA puntuales (ej. `role="button"` en el título editable del ticket).

¿Quieres mantener una alternativa textual a los datos junto a cada gráfico (ej. tabla o lista oculta visualmente pero accesible, o `aria-label` resumen)?

A) Sí, cada gráfico debe tener una alternativa textual accesible (tabla `sr-only` o `aria-label` con el resumen de datos)

B) No es prioritario por ahora — mismo nivel de accesibilidad que el resto de la app

C) Other (please describe after [Answer]: tag below)

[Answer]: a

### Question 3: `npm audit` y trazabilidad de la versión
Como la librería no se instala vía npm (mismo patrón que `qrcode`), `npm audit` no la cubrirá automáticamente.

¿Cómo quieres gestionar la trazabilidad de la versión/seguridad de esta dependencia?

A) Fijar una versión exacta en la URL de esm.sh (sin rango, ej. `@4.4.4` no `@^4`) y revisarla manualmente igual que las demás — mismo criterio ya usado para `qrcode`/`supabase-js`

B) Añadirla también a `package.json` como referencia documental (aunque no se instale/bundle), para que quede visible en el repo

C) Other (please describe after [Answer]: tag below)

[Answer]: a
