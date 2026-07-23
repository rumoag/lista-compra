// Formulario de alta de producto (US-1.1) — chips de categoría + texto libre (Question 2 de Requirements).
import { validateProductName, validateQuantity, validateCategory } from '../common/validation.js';

const FREQUENT_CATEGORIES = ['Lácteos', 'Limpieza', 'Fruta', 'Verdura', 'Panadería'];

export function renderProductForm(container, { onSubmit }) {
  container.innerHTML = `
    <form class="product-form card" data-testid="product-form">
      <input
        type="text"
        placeholder="Nombre del producto"
        data-testid="product-form-name-input"
        maxlength="50"
      />
      <div class="error-message" data-testid="product-form-name-error" hidden></div>

      <input
        type="text"
        placeholder="Cantidad (opcional)"
        data-testid="product-form-quantity-input"
        maxlength="50"
      />
      <div class="error-message" data-testid="product-form-quantity-error" hidden></div>

      <div class="chip-group" data-testid="product-form-category-chips">
        ${FREQUENT_CATEGORIES.map(
          (cat) => `<button type="button" class="chip" data-category="${cat}" aria-pressed="false">${cat}</button>`
        ).join('')}
        <button type="button" class="chip" data-category="__other__" aria-pressed="false">Otra…</button>
      </div>
      <input
        type="text"
        placeholder="Escribe una categoría"
        data-testid="product-form-category-input"
        maxlength="40"
        hidden
      />
      <div class="error-message" data-testid="product-form-category-error" hidden></div>

      <button type="submit" data-testid="product-form-submit-button">Añadir</button>
    </form>
  `;

  const form = container.querySelector('[data-testid="product-form"]');
  const nameInput = container.querySelector('[data-testid="product-form-name-input"]');
  const nameError = container.querySelector('[data-testid="product-form-name-error"]');
  const quantityInput = container.querySelector('[data-testid="product-form-quantity-input"]');
  const quantityError = container.querySelector('[data-testid="product-form-quantity-error"]');
  const categoryInput = container.querySelector('[data-testid="product-form-category-input"]');
  const categoryError = container.querySelector('[data-testid="product-form-category-error"]');
  const chips = [...container.querySelectorAll('.chip')];

  let selectedCategory = null;

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
      chip.setAttribute('aria-pressed', 'true');

      if (chip.dataset.category === '__other__') {
        selectedCategory = null;
        categoryInput.hidden = false;
        categoryInput.value = '';
        categoryInput.focus();
      } else {
        selectedCategory = chip.dataset.category;
        categoryInput.hidden = true;
        categoryInput.value = '';
      }
    });
  });

  function showError(el, message) {
    el.textContent = message;
    el.hidden = false;
  }

  function clearErrors() {
    [nameError, quantityError, categoryError].forEach((el) => {
      el.hidden = true;
      el.textContent = '';
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();

    const nameResult = validateProductName(nameInput.value);
    const quantityResult = validateQuantity(quantityInput.value);
    const categoryValue = categoryInput.hidden ? selectedCategory : categoryInput.value;
    const categoryResult = validateCategory(categoryValue);

    let hasError = false;
    if (!nameResult.valid) {
      showError(nameError, nameResult.error);
      hasError = true;
    }
    if (!quantityResult.valid) {
      showError(quantityError, quantityResult.error);
      hasError = true;
    }
    if (!categoryResult.valid) {
      showError(categoryError, categoryResult.error);
      hasError = true;
    }
    if (hasError) return;

    onSubmit({
      name: nameResult.value,
      quantity: quantityResult.value,
      category: categoryResult.value,
    });

    form.reset();
    chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
    categoryInput.hidden = true;
    selectedCategory = null;
  });
}
