// Distribución de compras por día de la semana y por persona (US-4.3) — listas simples.
import { computeDistributionByWeekday, computeDistributionByPerson } from './calculations.js';

export function renderStatsDistribution(container, { products }) {
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
      <ul data-testid="stats-distribution-weekday-list">
        ${byWeekday.map((d) => `<li>${d.weekday}: ${d.count}</li>`).join('')}
      </ul>
    </div>
    <div class="card">
      <h3>Compras por persona</h3>
      <ul data-testid="stats-distribution-person-list">
        ${byPerson.map((p) => `<li>${escapeHtml(p.person)}: ${p.count}</li>`).join('')}
      </ul>
    </div>
    <p class="meta">Datos acumulados desde el inicio del uso de la app.</p>
  `;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
