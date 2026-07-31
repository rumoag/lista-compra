// Distribución de compras por día de la semana (FR-35) y por persona (FR-34).
import { computeDistributionByWeekday, computeDistributionByPerson } from './calculations.js';
import { loadChart } from './chart-loader.js';
import { getChartColors } from './chart-theme.js';

export async function renderStatsDistribution(container, { products }) {
  if (products.length === 0) {
    container.innerHTML =
      '<p class="empty-state" data-testid="stats-distribution-empty">Aún no hay datos suficientes.</p>';
    return;
  }

  const byWeekday = computeDistributionByWeekday(products);
  const byPerson = computeDistributionByPerson(products);

  container.innerHTML = `
    <div class="card">
      <h3>Compras por día de la semana</h3>
      <canvas data-testid="stats-distribution-weekday-canvas" aria-hidden="true"></canvas>
      <ul class="sr-only" data-testid="stats-distribution-weekday-list">
        ${byWeekday.map((d) => `<li>${d.weekday}: ${d.count}</li>`).join('')}
      </ul>
    </div>
    <div class="card">
      <h3>Compras por persona</h3>
      <canvas data-testid="stats-distribution-person-canvas" aria-hidden="true"></canvas>
      <ul class="sr-only" data-testid="stats-distribution-person-list">
        ${byPerson.map((p) => `<li>${escapeHtml(p.person)}: ${p.count}</li>`).join('')}
      </ul>
    </div>
    <p class="meta">Datos acumulados desde el inicio del uso de la app.</p>
  `;

  try {
    const Chart = await loadChart();
    const colors = getChartColors();

    // eslint-disable-next-line no-new
    new Chart(container.querySelector('[data-testid="stats-distribution-weekday-canvas"]'), {
      type: 'bar',
      data: {
        labels: byWeekday.map((d) => d.weekday),
        datasets: [{ data: byWeekday.map((d) => d.count), backgroundColor: colors.secondary }],
      },
      options: { plugins: { legend: { display: false } } },
    });

    // eslint-disable-next-line no-new
    new Chart(container.querySelector('[data-testid="stats-distribution-person-canvas"]'), {
      type: 'doughnut',
      data: {
        labels: byPerson.map((p) => p.person),
        datasets: [
          {
            data: byPerson.map((p) => p.count),
            backgroundColor: [colors.primary, colors.secondary, colors.tertiary, colors.outlineVariant],
          },
        ],
      },
    });
  } catch {
    container.querySelectorAll('.sr-only').forEach((el) => el.classList.remove('sr-only'));
    container.querySelectorAll('canvas').forEach((el) => el.remove());
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
