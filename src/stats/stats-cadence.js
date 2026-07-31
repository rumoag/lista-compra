// Cadencia media entre compras por producto (US-4.2) — lista simple.
import { escapeHtml } from '../common/escape-html.js';

export function renderStatsCadence(container, { groups }) {
  if (groups.length === 0) {
    container.innerHTML = '<p class="empty-state" data-testid="stats-cadence-empty">Aún no hay datos suficientes.</p>';
    return;
  }

  container.innerHTML = `
    <div class="card">
      <h3>Cadencia media de compra</h3>
      <ul data-testid="stats-cadence-list">
        ${groups
          .map((g) => {
            const label =
              g.averageCadenceDays === null
                ? 'sin datos suficientes'
                : `cada ${Math.round(g.averageCadenceDays)} días`;
            return `<li data-testid="stats-cadence-item">${escapeHtml(g.displayName)}: ${label}</li>`;
          })
          .join('')}
      </ul>
    </div>
  `;
}
