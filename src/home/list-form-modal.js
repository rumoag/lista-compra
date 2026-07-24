// Modal compartido de crear/editar lista (FR-2, FR-3, BR-32).
import { openModal } from '../common/modal.js';
import { validateHouseholdTitle, validateHouseholdIcon, HOUSEHOLD_ICON_SET } from '../common/validation.js';
import { createHousehold, updateHousehold } from './households-api.js';

export function openListFormModal({ mode, household, onSaved }) {
  const isEdit = mode === 'edit';
  const { body, close } = openModal({ title: isEdit ? 'Editar lista' : 'Crear nueva lista' });

  let selectedIcon = isEdit ? household.image_icon : HOUSEHOLD_ICON_SET[0];

  body.innerHTML = `
    <form data-testid="list-form">
      <input
        type="text"
        placeholder="Título de la lista"
        data-testid="list-form-title-input"
        maxlength="50"
        value="${isEdit ? escapeAttr(household.title) : ''}"
      />
      <div class="error-message" data-testid="list-form-title-error" hidden></div>

      <div class="icon-picker" data-testid="list-form-icon-picker">
        ${HOUSEHOLD_ICON_SET.map(
          (icon) =>
            `<button type="button" class="icon-picker-option" data-testid="list-form-icon-${icon}" data-icon="${icon}" aria-pressed="${icon === selectedIcon}">${icon}</button>`
        ).join('')}
      </div>
      <div class="error-message" data-testid="list-form-icon-error" hidden></div>

      <button type="submit" data-testid="list-form-submit-button">${isEdit ? 'Guardar' : 'Crear'}</button>
    </form>
  `;

  const form = body.querySelector('[data-testid="list-form"]');
  const titleInput = body.querySelector('[data-testid="list-form-title-input"]');
  const titleError = body.querySelector('[data-testid="list-form-title-error"]');
  const iconError = body.querySelector('[data-testid="list-form-icon-error"]');
  const iconButtons = [...body.querySelectorAll('.icon-picker-option')];

  iconButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectedIcon = button.dataset.icon;
      iconButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.icon === selectedIcon)));
    });
  });

  function clearErrors() {
    titleError.hidden = true;
    iconError.hidden = true;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();

    const titleResult = validateHouseholdTitle(titleInput.value);
    const iconResult = validateHouseholdIcon(selectedIcon);

    let hasError = false;
    if (!titleResult.valid) {
      titleError.textContent = titleResult.error;
      titleError.hidden = false;
      hasError = true;
    }
    if (!iconResult.valid) {
      iconError.textContent = iconResult.error;
      iconError.hidden = false;
      hasError = true;
    }
    if (hasError) return;

    const submitButton = body.querySelector('[data-testid="list-form-submit-button"]');
    submitButton.disabled = true;

    try {
      if (isEdit) {
        await updateHousehold(household.id, { title: titleResult.value, image_icon: iconResult.value });
      } else {
        await createHousehold({ title: titleResult.value, image_icon: iconResult.value });
      }
      close();
      onSaved();
    } catch (err) {
      titleError.textContent = 'No se pudo guardar la lista. Inténtalo de nuevo.';
      titleError.hidden = false;
      submitButton.disabled = false;
    }
  });
}

function escapeAttr(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
