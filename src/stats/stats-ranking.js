// Ranking de productos más comprados (US-4.1, BR-69) — gráfico de barras horizontales.
import { computeRanking } from './calculations.js';
import { loadChart } from './chart-loader.js';
import { getChartColors } from './chart-theme.js';

const RANKING_LIMIT = 10;

export async function renderStatsRanking(container, { groups }) {
  if (groups.length === 0) {
    container.innerHTML = '<p class="empty-state" data-testid="stats-ranking-empty">Aún no hay datos suficientes.</p>';
    return;
  }

  const top = computeRanking(groups).slice(0, RANKING_LIMIT);

  container.innerHTML = `
    <div class="card">
      <h3>Más comprados</h3>
      <canvas data-testid="stats-ranking-canvas" aria-hidden="true"></canvas>
      <ol class="sr-only" data-testid="stats-ranking-list">
        ${top
          .map(
            (g, i) =>
              `<li data-testid="stats-ranking-item-${i}">${escapeHtml(g.displayName)} — ${g.purchaseCount} veces</li>`
          )
          .join('')}
      </ol>
    </div>
  `;

  try {
    const Chart = await loadChart();
    const colors = getChartColors();
    const canvas = container.querySelector('[data-testid="stats-ranking-canvas"]');
    // eslint-disable-next-line no-new
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: top.map((g) => g.displayName),
        datasets: [{ data: top.map((g) => g.purchaseCount), backgroundColor: colors.primary }],
      },
      options: { indexAxis: 'y', plugins: { legend: { display: false } } },
    });
  } catch {
    showFallback(container);
  }
}

function showFallback(container) {
  container.querySelector('[data-testid="stats-ranking-list"]')?.classList.remove('sr-only');
  container.querySelector('[data-testid="stats-ranking-canvas"]')?.remove();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
