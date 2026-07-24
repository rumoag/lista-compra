// Renderiza un producto pendiente (Unidad 6): icono de categoría, menú de 3 puntos
// (Editar/Eliminar, BR-40) en vez de botones inline, y selección por click en el cuerpo (BR-41).
import { renderDropdownMenu } from '../common/dropdown-menu.js';
import { getCategoryIcon } from './categories.js';

export function renderProductItem(product, { onEdit, onDelete, onToggleSelect, selected = false }) {
  const el = document.createElement('div');
  el.className = 'product-item';
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
    <div data-testid="product-item-menu-container"></div>
  `;

  // BR-41: click en cualquier parte del cuerpo (incluido el propio checkbox, que
  // burbujea hasta aquí) alterna la selección. El re-render posterior del padre con
  // el `selected` actualizado es lo que refleja el nuevo estado del checkbox.
  el.querySelector('[data-testid="product-item-body"]').addEventListener('click', () => {
    if (onToggleSelect) onToggleSelect(product.id);
  });

  renderDropdownMenu(el.querySelector('[data-testid="product-item-menu-container"]'), {
    actions: [
      { testid: 'edit', label: 'Editar', onClick: () => onEdit(product) },
      { testid: 'delete', label: 'Eliminar', onClick: () => onDelete(product.id) },
    ],
  });

  return el;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
