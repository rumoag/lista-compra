// Fila de la lista principal de historial (BR-55) — icono de ticket, título del ticket
// (dónde se compró, seguimiento) seguido de la fecha corta ("Sáb, 18 jul 2024", BR-63) en
// la misma línea, y número total de productos. Click abre el modal de detalle (Unidad 7).
// Sin borde propio (BR-63) — se apoya en el contenedor de la lista.
import { icon } from '../common/icon.js';
import { escapeHtml } from '../common/escape-html.js';

export function renderTicketRow(purchase, { onOpen }) {
  const el = document.createElement('div');
  el.className = 'product-item ticket-row';
  el.dataset.testid = `ticket-row-${purchase.id}`;

  el.innerHTML = `
    <div class="ticket-row-open-area" data-testid="ticket-row-open-area">
      <div class="ticket-row-icon" aria-hidden="true">${icon('receipt')}</div>
      <div>
        <div data-testid="ticket-row-date"><span data-testid="ticket-row-shop-title">${escapeHtml(
          purchase.title || 'Sin título'
        )}</span> · ${formatShortDate(purchase.bought_at)}</div>
        <div class="meta" data-testid="ticket-row-meta">${escapeHtml(purchase.bought_by ?? '')} · ${
          purchase.products.length
        } producto${purchase.products.length === 1 ? '' : 's'}</div>
      </div>
    </div>
  `;

  el.querySelector('[data-testid="ticket-row-open-area"]').addEventListener('click', () => onOpen(purchase));

  return el;
}

// BR-63: "Sáb, 18 jul 2024" — día de la semana y mes abreviados, con la primera letra en
// mayúscula (Intl los devuelve en minúsculas para es-ES).
function formatShortDate(dateValue) {
  const formatted = new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateValue));
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
