// Fila de la lista principal de historial (BR-55) — fecha/hora, quién compró y número
// total de productos del ticket. Click abre el modal de detalle (Unidad 7).

export function renderTicketRow(purchase, { onOpen }) {
  const el = document.createElement('div');
  el.className = 'card product-item ticket-row';
  el.dataset.testid = `ticket-row-${purchase.id}`;

  el.innerHTML = `
    <div class="ticket-row-open-area" data-testid="ticket-row-open-area">
      <div data-testid="ticket-row-date">${new Date(purchase.bought_at).toLocaleString('es-ES')}</div>
      <div class="meta" data-testid="ticket-row-meta">${escapeHtml(purchase.bought_by ?? '')} · ${
        purchase.products.length
      } producto${purchase.products.length === 1 ? '' : 's'}</div>
    </div>
  `;

  el.querySelector('[data-testid="ticket-row-open-area"]').addEventListener('click', () => onOpen(purchase));

  return el;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
