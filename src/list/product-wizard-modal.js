// Asistente de 3 pasos para crear/editar producto (FR-13, BR-44), modal de pantalla completa.
// Mismo componente para crear y editar (BR-32-equivalente para productos).
import { openModal } from '../common/modal.js';
import { validateProductName, validateCategory, validateQuantityNumber, validateQuantityUnit } from '../common/validation.js';
import { FREQUENT_CATEGORIES, getCategoryIcon } from './categories.js';

const QUANTITY_MIN = 1;
const QUANTITY_MAX = 999;

export function openProductWizardModal({ mode, product, suggestedProducts = [], onSave }) {
  const isEdit = mode === 'edit';
  const { body, close } = openModal({
    title: isEdit ? 'Editar producto' : 'Añadir producto',
    fullScreen: true,
  });

  const isNameSuggested = isEdit && suggestedProducts.includes(product?.name);

  const state = {
    step: 1,
    name: isEdit ? product.name : '',
    isCustomName: isEdit ? !isNameSuggested : false,
    quantityNumber: isEdit ? product.quantity_number : QUANTITY_MIN,
    quantityUnit: isEdit ? (product.quantity_unit ?? '') : '',
    category: isEdit ? (product.category ?? '') : '',
    isCustomCategory: isEdit ? Boolean(product.category) && !FREQUENT_CATEGORIES.includes(product.category) : false,
  };

  function renderStep() {
    if (state.step === 1) renderStep1();
    else if (state.step === 2) renderStep2();
    else renderStep3();
  }

  // --- Paso 1: producto -------------------------------------------------
  function renderStep1() {
    body.innerHTML = `
      <label class="form-label">Selecciona tu producto</label>
      <div class="chip-group" data-testid="wizard-product-chips">
        ${suggestedProducts
          .map(
            (name) =>
              `<button type="button" class="chip" data-testid="wizard-product-chip-${name}" data-name="${escapeAttr(name)}" aria-pressed="${!state.isCustomName && state.name === name}">${escapeHtml(name)}</button>`
          )
          .join('')}
        <button type="button" class="chip" data-testid="wizard-product-chip-other" aria-pressed="${state.isCustomName}">Otros</button>
      </div>
      <input
        type="text"
        data-testid="wizard-product-name-input"
        maxlength="50"
        placeholder="Nombre del producto"
        value="${escapeAttr(state.isCustomName ? state.name : '')}"
        ${state.isCustomName ? '' : 'hidden'}
      />
      <div class="error-message" data-testid="wizard-step1-error" hidden></div>
      <div class="wizard-actions">
        <button type="button" data-testid="wizard-next-button">Siguiente</button>
      </div>
    `;

    const nameInput = body.querySelector('[data-testid="wizard-product-name-input"]');
    const errorEl = body.querySelector('[data-testid="wizard-step1-error"]');

    suggestedProducts.forEach((name) => {
      body.querySelector(`[data-testid="wizard-product-chip-${name}"]`).addEventListener('click', () => {
        state.name = name;
        state.isCustomName = false;
        renderStep1();
      });
    });

    body.querySelector('[data-testid="wizard-product-chip-other"]').addEventListener('click', () => {
      state.isCustomName = true;
      renderStep1();
      body.querySelector('[data-testid="wizard-product-name-input"]').focus();
    });

    body.querySelector('[data-testid="wizard-next-button"]').addEventListener('click', () => {
      const candidateName = state.isCustomName ? nameInput.value : state.name;
      const result = validateProductName(candidateName);
      if (!result.valid) {
        errorEl.textContent = result.error;
        errorEl.hidden = false;
        return;
      }
      state.name = result.value;
      state.step = 2;
      renderStep();
    });
  }

  // --- Paso 2: cantidad ---------------------------------------------------
  function renderStep2() {
    body.innerHTML = `
      <label class="form-label">Cantidad</label>
      <div class="quantity-stepper" data-testid="wizard-quantity-stepper">
        <button type="button" data-testid="wizard-quantity-decrement" aria-label="Menos">−</button>
        <input
          type="number"
          inputmode="numeric"
          data-testid="wizard-quantity-input"
          min="${QUANTITY_MIN}"
          max="${QUANTITY_MAX}"
          value="${state.quantityNumber}"
        />
        <button type="button" data-testid="wizard-quantity-increment" aria-label="Más">+</button>
      </div>
      <input
        type="text"
        class="text-input"
        data-testid="wizard-quantity-unit-input"
        maxlength="20"
        placeholder="Unidad (opcional, ej. litros)"
        value="${escapeAttr(state.quantityUnit)}"
      />
      <div class="error-message" data-testid="wizard-step2-error" hidden></div>
      <div class="wizard-actions">
        <button type="button" class="secondary" data-testid="wizard-back-button">Atrás</button>
        <button type="button" data-testid="wizard-next-button">Siguiente</button>
      </div>
    `;

    const quantityInput = body.querySelector('[data-testid="wizard-quantity-input"]');
    const unitInput = body.querySelector('[data-testid="wizard-quantity-unit-input"]');
    const errorEl = body.querySelector('[data-testid="wizard-step2-error"]');

    function clamp(value) {
      return Math.min(QUANTITY_MAX, Math.max(QUANTITY_MIN, value));
    }

    body.querySelector('[data-testid="wizard-quantity-decrement"]').addEventListener('click', () => {
      quantityInput.value = clamp((Number(quantityInput.value) || QUANTITY_MIN) - 1);
    });
    body.querySelector('[data-testid="wizard-quantity-increment"]').addEventListener('click', () => {
      quantityInput.value = clamp((Number(quantityInput.value) || QUANTITY_MIN) + 1);
    });

    function readIntoState() {
      state.quantityNumber = Number(quantityInput.value);
      state.quantityUnit = unitInput.value;
    }

    body.querySelector('[data-testid="wizard-back-button"]').addEventListener('click', () => {
      readIntoState();
      state.step = 1;
      renderStep();
    });

    body.querySelector('[data-testid="wizard-next-button"]').addEventListener('click', () => {
      const numberResult = validateQuantityNumber(quantityInput.value);
      const unitResult = validateQuantityUnit(unitInput.value);
      if (!numberResult.valid) {
        errorEl.textContent = numberResult.error;
        errorEl.hidden = false;
        return;
      }
      if (!unitResult.valid) {
        errorEl.textContent = unitResult.error;
        errorEl.hidden = false;
        return;
      }
      state.quantityNumber = numberResult.value;
      state.quantityUnit = unitResult.value;
      state.step = 3;
      renderStep();
    });
  }

  // --- Paso 3: categoría ---------------------------------------------------
  function renderStep3() {
    body.innerHTML = `
      <label class="form-label">Categoría</label>
      <div class="chip-group" data-testid="wizard-category-chips">
        ${FREQUENT_CATEGORIES.map(
          (category) =>
            `<button type="button" class="chip" data-testid="wizard-category-chip-${category}" data-category="${escapeAttr(category)}" aria-pressed="${!state.isCustomCategory && state.category === category}">${getCategoryIcon(category)} ${escapeHtml(category)}</button>`
        ).join('')}
        <button type="button" class="chip" data-testid="wizard-category-chip-other" aria-pressed="${state.isCustomCategory}">Otra…</button>
      </div>
      <input
        type="text"
        data-testid="wizard-category-input"
        maxlength="40"
        placeholder="Escribe una categoría"
        value="${escapeAttr(state.isCustomCategory ? state.category : '')}"
        ${state.isCustomCategory ? '' : 'hidden'}
      />
      <div class="error-message" data-testid="wizard-step3-error" hidden></div>
      <div class="wizard-actions">
        <button type="button" class="secondary" data-testid="wizard-back-button">Atrás</button>
        <button type="button" data-testid="wizard-save-button">Guardar</button>
      </div>
    `;

    const categoryInput = body.querySelector('[data-testid="wizard-category-input"]');
    const errorEl = body.querySelector('[data-testid="wizard-step3-error"]');

    FREQUENT_CATEGORIES.forEach((category) => {
      body.querySelector(`[data-testid="wizard-category-chip-${category}"]`).addEventListener('click', () => {
        state.category = category;
        state.isCustomCategory = false;
        renderStep3();
      });
    });

    body.querySelector('[data-testid="wizard-category-chip-other"]').addEventListener('click', () => {
      state.isCustomCategory = true;
      renderStep3();
      body.querySelector('[data-testid="wizard-category-input"]').focus();
    });

    body.querySelector('[data-testid="wizard-back-button"]').addEventListener('click', () => {
      state.category = state.isCustomCategory ? categoryInput.value : state.category;
      state.step = 2;
      renderStep();
    });

    body.querySelector('[data-testid="wizard-save-button"]').addEventListener('click', async () => {
      const candidateCategory = state.isCustomCategory ? categoryInput.value : state.category;
      const result = validateCategory(candidateCategory);
      if (!result.valid) {
        errorEl.textContent = result.error;
        errorEl.hidden = false;
        return;
      }

      const saveButton = body.querySelector('[data-testid="wizard-save-button"]');
      saveButton.disabled = true;
      try {
        await onSave({
          name: state.name,
          quantity_number: state.quantityNumber,
          quantity_unit: state.quantityUnit || null,
          category: result.value,
        });
        close();
      } catch (err) {
        errorEl.textContent = 'No se pudo guardar el producto. Inténtalo de nuevo.';
        errorEl.hidden = false;
        saveButton.disabled = false;
      }
    });
  }

  renderStep();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function escapeAttr(value) {
  return escapeHtml(value);
}
