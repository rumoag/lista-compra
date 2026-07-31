// Evolución de compras a lo largo del tiempo (FR-36, BR-67, BR-68, BR-70) — gráfico de líneas
// con selector Mes/Semana que recalcula en memoria, sin nueva petición a Supabase.
import { computeTimeSeries } from './calculations.js';
import { loadChart } from './chart-loader.js';
import { getChartColors } from './chart-theme.js';

export async function renderStatsTimeseries(container, { products }) {
  if (products.length === 0) {
    container.innerHTML =
      '<p class="empty-state" data-testid="stats-timeseries-empty">Aún no hay datos suficientes.</p>';
    return;
  }

  container.innerHTML = `
    <div class="card">
      <h3>Evolución de compras</h3>
      <div class="chip-group" role="group" aria-label="Granularidad">
        <button type="button" class="chip" data-testid="stats-timeseries-tab-month" aria-pressed="true">Mes</button>
        <button type="button" class="chip" data-testid="stats-timeseries-tab-week" aria-pressed="false">Semana</button>
      </div>
      <canvas data-testid="stats-timeseries-canvas" aria-hidden="true"></canvas>
      <ul class="sr-only" data-testid="stats-timeseries-list"></ul>
    </div>
  `;

  const monthBtn = container.querySelector('[data-testid="stats-timeseries-tab-month"]');
  const weekBtn = container.querySelector('[data-testid="stats-timeseries-tab-week"]');
  const listEl = container.querySelector('[data-testid="stats-timeseries-list"]');
  const canvas = container.querySelector('[data-testid="stats-timeseries-canvas"]');

  let Chart = null;
  let chartFailed = false;
  try {
    Chart = await loadChart();
  } catch {
    chartFailed = true;
  }

  let chartInstance = null;

  function renderGranularity(granularity) {
    const series = computeTimeSeries(products, granularity);
    listEl.innerHTML = series.map((b) => `<li>${b.label}: ${b.count}</li>`).join('');

    monthBtn.setAttribute('aria-pressed', String(granularity === 'month'));
    weekBtn.setAttribute('aria-pressed', String(granularity === 'week'));

    if (chartFailed) {
      listEl.classList.remove('sr-only');
      canvas.remove();
      return;
    }

    const colors = getChartColors();
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(canvas, {
      type: 'line',
      data: {
        labels: series.map((b) => b.label),
        datasets: [{ data: series.map((b) => b.count), borderColor: colors.primary, backgroundColor: colors.primary }],
      },
      options: { plugins: { legend: { display: false } } },
    });
  }

  monthBtn.addEventListener('click', () => renderGranularity('month'));
  weekBtn.addEventListener('click', () => renderGranularity('week'));

  renderGranularity('month');
}
