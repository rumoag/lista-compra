// Ranking de productos más comprados (US-4.1) — lista numérica simple.
import { computeRanking } from './calculations.js';

export function renderStatsRanking(container, { groups }) {
  if (groups.length === 0) {
    container.innerHTML = '<p class="empty-state" data-testid="stats-ranking-empty">Aún no hay datos suficientes.</p>';
    return;
  }

  const ranking = computeRanking(groups);
  container.innerHTML = `
    <div class="card">
      <h3>Más comprados</h3>
      <ol data-testid="stats-ranking-list">
        ${ranking
          .map(
            (g, i) =>
              `<li data-testid="stats-ranking-item-${i}">${escapeHtml(g.displayName)} — ${g.purchaseCount} veces</li>`
          )
          .join('')}
      </ol>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
