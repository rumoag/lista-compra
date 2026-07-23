// Renderiza un producto pendiente con acciones de editar/eliminar (US-1.3, US-1.4).
import { validateProductName, validateQuantity, validateCategory } from '../common/validation.js';

export function renderProductItem(product, { onEdit, onDelete, onToggleSelect, selected = false }) {
  const el = document.createElement('div');
  el.className = 'product-item';
  el.dataset.testid = `product-item-${product.id}`;
  el.dataset.productId = product.id;

  function renderView() {
    el.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.5rem;">
        ${
          onToggleSelect
            ? `<input type="checkbox" data-testid="product-item-select-checkbox" ${selected ? 'checked' : ''} />`
            : ''
        }
        <div>
          <div data-testid="product-item-name">${escapeHtml(product.name)}</div>
          <div class="meta" data-testid="product-item-meta">
            ${product.quantity ? escapeHtml(product.quantity) + ' · ' : ''}${product.category ? escapeHtml(product.category) : 'Sin categoría'}
          </div>
        </div>
      </div>
      <div>
        <button type="button" class="secondary" data-testid="product-item-edit-button">Editar</button>
        <button type="button" class="secondary" data-testid="product-item-delete-button">Eliminar</button>
      </div>
    `;

    el.querySelector('[data-testid="product-item-edit-button"]').addEventListener('click', renderEditForm);
    el.querySelector('[data-testid="product-item-delete-button"]').addEventListener('click', () => {
      onDelete(product.id);
    });

    const checkbox = el.querySelector('[data-testid="product-item-select-checkbox"]');
    if (checkbox && onToggleSelect) {
      checkbox.addEventListener('change', () => onToggleSelect(product.id));
    }
  }

  function renderEditForm() {
    el.innerHTML = `
      <form class="product-form" data-testid="product-item-edit-form" style="width:100%">
        <input type="text" value="${escapeAttr(product.name)}" data-testid="product-item-edit-name" maxlength="50" />
        <input type="text" value="${escapeAttr(product.quantity ?? '')}" data-testid="product-item-edit-quantity" maxlength="50" />
        <input type="text" value="${escapeAttr(product.category ?? '')}" data-testid="product-item-edit-category" maxlength="40" />
        <div class="error-message" data-testid="product-item-edit-error" hidden></div>
        <button type="submit" data-testid="product-item-edit-save-button">Guardar</button>
        <button type="button" class="secondary" data-testid="product-item-edit-cancel-button">Cancelar</button>
      </form>
    `;

    const form = el.querySelector('[data-testid="product-item-edit-form"]');
    const errorEl = el.querySelector('[data-testid="product-item-edit-error"]');

    el.querySelector('[data-testid="product-item-edit-cancel-button"]').addEventListener('click', renderView);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const nameResult = validateProductName(el.querySelector('[data-testid="product-item-edit-name"]').value);
      const quantityResult = validateQuantity(
        el.querySelector('[data-testid="product-item-edit-quantity"]').value
      );
      const categoryResult = validateCategory(
        el.querySelector('[data-testid="product-item-edit-category"]').value
      );

      if (!nameResult.valid || !quantityResult.valid || !categoryResult.valid) {
        errorEl.textContent = nameResult.error || quantityResult.error || categoryResult.error;
        errorEl.hidden = false;
        return;
      }

      onEdit(product.id, {
        name: nameResult.value,
        quantity: quantityResult.value,
        category: categoryResult.value,
      });
    });
  }

  renderView();
  return el;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function escapeAttr(value) {
  return escapeHtml(value);
}
