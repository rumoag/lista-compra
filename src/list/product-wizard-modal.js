// Asistente de 4 pasos para crear/editar producto (FR-13, BR-44), modal de pantalla completa.
// Mismo componente para crear y editar (BR-32-equivalente para productos).
// Header (título + X) / Body (contenido del paso) / Footer (barra de progreso + acciones)
// son regiones fijas provistas por openModal(); solo el body y el footer se redibujan
// al cambiar de paso.
import { openModal } from '../common/modal.js';
import {
  validateProductName,
  validateCategory,
  validateQuantityNumber,
  validateQuantityUnit,
  validateNote,
} from '../common/validation.js';
import { FREQUENT_CATEGORIES, getCategoryIcon } from './categories.js';

const QUANTITY_MIN = 1;
const QUANTITY_MAX = 999;
const TOTAL_STEPS = 4;

export function openProductWizardModal({ mode, product, suggestedProducts = [], onSave }) {
  const isEdit = mode === 'edit';
  const { body, footer, close } = openModal({
    title: isEdit ? 'Editar producto' : 'Añadir producto',
    fullScreen: true,
  });

  const state = {
    step: 1,
    name: isEdit ? product.name : '',
    quantityNumber: isEdit ? product.quantity_number : QUANTITY_MIN,
    quantityUnit: isEdit ? (product.quantity_unit ?? '') : '',
    category: isEdit ? (product.category ?? '') : '',
    isCustomCategory: isEdit ? Boolean(product.category) && !FREQUENT_CATEGORIES.includes(product.category) : false,
    note: isEdit ? (product.note ?? '') : '',
  };

  function renderStep() {
    if (state.step === 1) renderStep1();
    else if (state.step === 2) renderStep2();
    else if (state.step === 3) renderStep3();
    else renderStep4();
  }

  function renderProgressAndActions({ back, backLabel = 'Atrás', nextTestId, nextLabel }) {
    footer.innerHTML = `
      <div class="wizard-progress" data-testid="wizard-progress">
        ${Array.from({ length: TOTAL_STEPS })
          .map((_, index) => `<span class="wizard-progress-segment" data-active="${index + 1 === state.step}"></span>`)
          .join('')}
      </div>
      <div class="wizard-actions" style="justify-content: ${back ? 'space-between' : 'flex-end'}">
        ${back ? `<button type="button" class="secondary" data-testid="wizard-back-button">${backLabel}</button>` : ''}
        <button type="button" data-testid="${nextTestId}">${nextLabel}</button>
      </div>
    `;
  }

  // --- Paso 1: producto -------------------------------------------------
  function renderStep1() {
    body.innerHTML = `
      <label class="form-label">Selecciona tu producto</label>
      <input
        type="text"
        class="text-input"
        data-testid="wizard-product-name-input"
        maxlength="50"
        placeholder="Nombre del producto"
        value="${escapeAttr(state.name)}"
        autocomplete="off"
      />
      <div class="chip-group" data-testid="wizard-product-chips">
        ${suggestedProducts
          .map(
            (name) =>
              `<button type="button" class="chip" data-testid="wizard-product-chip-${name}" data-name="${escapeAttr(name)}" aria-pressed="${state.name === name}">${escapeHtml(name)}</button>`
          )
          .join('')}
      </div>
      <div class="error-message" data-testid="wizard-step1-error" hidden></div>
    `;

    const nameInput = body.querySelector('[data-testid="wizard-product-name-input"]');
    const errorEl = body.querySelector('[data-testid="wizard-step1-error"]');

    suggestedProducts.forEach((name) => {
      body.querySelector(`[data-testid="wizard-product-chip-${name}"]`).addEventListener('click', () => {
        state.name = name;
        renderStep1();
      });
    });

    nameInput.addEventListener('input', () => {
      state.name = nameInput.value;
    });

    renderProgressAndActions({ back: false, nextTestId: 'wizard-next-button', nextLabel: 'Siguiente' });

    footer.querySelector('[data-testid="wizard-next-button"]').addEventListener('click', () => {
      const result = validateProductName(nameInput.value);
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
          autocomplete="off"
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
        autocomplete="off"
      />
      <div class="error-message" data-testid="wizard-step2-error" hidden></div>
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

    renderProgressAndActions({ back: true, nextTestId: 'wizard-next-button', nextLabel: 'Siguiente' });

    footer.querySelector('[data-testid="wizard-back-button"]').addEventListener('click', () => {
      readIntoState();
      state.step = 1;
      renderStep();
    });

    footer.querySelector('[data-testid="wizard-next-button"]').addEventListener('click', () => {
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
        class="text-input"
        data-testid="wizard-category-input"
        maxlength="40"
        placeholder="Escribe una categoría"
        value="${escapeAttr(state.isCustomCategory ? state.category : '')}"
        autocomplete="off"
        ${state.isCustomCategory ? '' : 'hidden'}
      />
      <div class="error-message" data-testid="wizard-step3-error" hidden></div>
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

    renderProgressAndActions({ back: true, nextTestId: 'wizard-next-button', nextLabel: 'Siguiente' });

    footer.querySelector('[data-testid="wizard-back-button"]').addEventListener('click', () => {
      state.category = state.isCustomCategory ? categoryInput.value : state.category;
      state.step = 2;
      renderStep();
    });

    footer.querySelector('[data-testid="wizard-next-button"]').addEventListener('click', () => {
      const candidateCategory = state.isCustomCategory ? categoryInput.value : state.category;
      const result = validateCategory(candidateCategory);
      if (!result.valid) {
        errorEl.textContent = result.error;
        errorEl.hidden = false;
        return;
      }
      state.category = result.value;
      state.step = 4;
      renderStep();
    });
  }

  // --- Paso 4: nota ---------------------------------------------------
  function renderStep4() {
    body.innerHTML = `
      <label class="form-label">Nota (opcional)</label>
      <textarea
        class="text-input"
        data-testid="wizard-note-input"
        maxlength="200"
        rows="4"
        placeholder="Añade una nota, ej. marca preferida"
        autocomplete="off"
      >${escapeHtml(state.note)}</textarea>
      <div class="error-message" data-testid="wizard-step4-error" hidden></div>
    `;

    const noteInput = body.querySelector('[data-testid="wizard-note-input"]');
    const errorEl = body.querySelector('[data-testid="wizard-step4-error"]');

    renderProgressAndActions({ back: true, nextTestId: 'wizard-save-button', nextLabel: 'Guardar' });

    footer.querySelector('[data-testid="wizard-back-button"]').addEventListener('click', () => {
      state.note = noteInput.value;
      state.step = 3;
      renderStep();
    });

    footer.querySelector('[data-testid="wizard-save-button"]').addEventListener('click', async () => {
      const result = validateNote(noteInput.value);
      if (!result.valid) {
        errorEl.textContent = result.error;
        errorEl.hidden = false;
        return;
      }

      const saveButton = footer.querySelector('[data-testid="wizard-save-button"]');
      saveButton.disabled = true;
      try {
        await onSave({
          name: state.name,
          quantity_number: state.quantityNumber,
          quantity_unit: state.quantityUnit || null,
          category: state.category,
          note: result.value,
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

  if (!isEdit) {
    const nameInput = body.querySelector('[data-testid="wizard-product-name-input"]');
    nameInput.focus();
    nameInput.select();
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function escapeAttr(value) {
  return escapeHtml(value);
}
