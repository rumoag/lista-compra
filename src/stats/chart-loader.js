// Carga perezosa y cacheada de Chart.js vía esm.sh (sin bundler, mismo patrón que qrcode/supabase-js).
// Si la carga falla (sin conexión, CDN caído), la caché se limpia para permitir reintentar
// en la siguiente llamada en vez de quedar fallada para siempre (nfr-design-patterns.md).
let chartPromise = null;

export function loadChart() {
  if (!chartPromise) {
    chartPromise = import('https://esm.sh/chart.js@4.4.4/auto')
      .then((module) => module.default)
      .catch((err) => {
        chartPromise = null;
        throw err;
      });
  }
  return chartPromise;
}
