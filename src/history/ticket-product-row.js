// Fila de producto dentro del modal de ticket (BR-53) — nombre + cantidad + acciones
// individuales, sin fecha/quién (ya se muestran a nivel de ticket, Q10 de Functional Design).
import { icon } from '../common/icon.js';

export function renderTicketProductRow(product, { onUnmark, onDelete }) {
  const el = document.createElement('div');
  el.className = 'product-item';
  el.dataset.testid = `ticket-product-${product.id}`;

  const quantity = [product.quantity_number, product.quantity_unit].filter(Boolean).join(' ');

  el.innerHTML = `
    <div>
      <div data-testid="ticket-product-name">${escapeHtml(product.name)}</div>
      ${quantity ? `<div class="meta" data-testid="ticket-product-quantity">${escapeHtml(quantity)}</div>` : ''}
    </div>
    <div>
      <button
        type="button"
        class="icon-button"
        data-testid="ticket-product-unmark-button"
        title="Desmarcar"
        aria-label="Desmarcar"
      >${icon('arrow-u-up-left')}</button>
      <button
        type="button"
        class="icon-button"
        data-testid="ticket-product-delete-button"
        title="Eliminar"
        aria-label="Eliminar"
      >${icon('trash')}</button>
    </div>
  `;

  el.querySelector('[data-testid="ticket-product-unmark-button"]').addEventListener('click', () => onUnmark(product.id));
  el.querySelector('[data-testid="ticket-product-delete-button"]').addEventListener('click', () => onDelete(product.id));

  return el;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
