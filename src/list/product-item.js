// Renderiza un producto pendiente (Unidad 6, revisado): sin menú de 3 puntos por item —
// editar/eliminar ya no tienen sentido individualmente, se hacen desde el header fijo de
// selección. Tap alterna selección (BR-41, con fondo resaltado); mantener pulsado abre
// edición directamente.
import { getCategoryIcon } from './categories.js';

const LONG_PRESS_MS = 500;

export function renderProductItem(product, { onEdit, onToggleSelect, selected = false }) {
  const el = document.createElement('div');
  el.className = `product-item${selected ? ' selected' : ''}`;
  el.dataset.testid = `product-item-${product.id}`;
  el.dataset.productId = product.id;

  const quantityText = [product.quantity_number, product.quantity_unit].filter(Boolean).join(' ');

  el.innerHTML = `
    <div class="product-item-body" data-testid="product-item-body">
      ${
        onToggleSelect
          ? `<input type="checkbox" data-testid="product-item-select-checkbox" ${selected ? 'checked' : ''} />`
          : ''
      }
      <span class="product-item-category-icon" data-testid="product-item-category-icon">${getCategoryIcon(product.category)}</span>
      <div>
        <div data-testid="product-item-name">${escapeHtml(product.name)}</div>
        <div class="meta" data-testid="product-item-meta">
          ${quantityText ? escapeHtml(quantityText) + ' · ' : ''}${product.category ? escapeHtml(product.category) : 'Sin categoría'}
        </div>
      </div>
    </div>
  `;

  const body = el.querySelector('[data-testid="product-item-body"]');

  let pressTimer = null;
  let longPressTriggered = false;

  function startPress() {
    longPressTriggered = false;
    pressTimer = setTimeout(() => {
      longPressTriggered = true;
      if (onEdit) onEdit(product);
    }, LONG_PRESS_MS);
  }

  function cancelPress() {
    clearTimeout(pressTimer);
  }

  body.addEventListener('mousedown', startPress);
  body.addEventListener('touchstart', startPress, { passive: true });
  body.addEventListener('mouseup', cancelPress);
  body.addEventListener('mouseleave', cancelPress);
  body.addEventListener('touchend', cancelPress);
  body.addEventListener('touchcancel', cancelPress);

  // BR-41: click en cualquier parte del cuerpo (incluido el propio checkbox, que
  // burbujea hasta aquí) alterna la selección — salvo que el click sea el resultado
  // de un long-press, que ya disparó la edición en su lugar.
  body.addEventListener('click', () => {
    if (longPressTriggered) {
      longPressTriggered = false;
      return;
    }
    if (onToggleSelect) onToggleSelect(product.id);
  });

  return el;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
