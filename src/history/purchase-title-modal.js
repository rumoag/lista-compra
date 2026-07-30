// Modal que pide el título opcional del ticket ("¿Dónde has comprado?") justo antes de
// confirmar "Marcar como comprado" (Unidad 7, seguimiento) — mismo patrón de formulario
// validado que home/list-form-modal.js.
import { openModal } from '../common/modal.js';
import { validatePurchaseTitle } from '../common/validation.js';

export function openPurchaseTitleModal({ onConfirm }) {
  const { body, footer, close } = openModal({ title: 'Marcar como comprado' });

  body.innerHTML = `
    <form id="purchase-title-form" data-testid="purchase-title-form">
      <label class="form-label" for="purchase-title-input">¿Dónde has comprado? (opcional)</label>
      <input
        type="text"
        id="purchase-title-input"
        class="text-input"
        placeholder="Ej. Mercadona"
        data-testid="purchase-title-input"
        maxlength="50"
      />
      <div class="error-message" data-testid="purchase-title-error" hidden></div>
    </form>
  `;

  footer.innerHTML = `
    <button type="submit" form="purchase-title-form" data-testid="purchase-title-submit-button">Confirmar</button>
  `;

  const form = body.querySelector('[data-testid="purchase-title-form"]');
  const input = body.querySelector('[data-testid="purchase-title-input"]');
  const errorEl = body.querySelector('[data-testid="purchase-title-error"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorEl.hidden = true;

    const result = validatePurchaseTitle(input.value);
    if (!result.valid) {
      errorEl.textContent = result.error;
      errorEl.hidden = false;
      return;
    }

    const submitButton = footer.querySelector('[data-testid="purchase-title-submit-button"]');
    submitButton.disabled = true;
    try {
      await onConfirm(result.value);
      close();
    } catch (err) {
      errorEl.textContent = 'No se pudo completar la acción. Inténtalo de nuevo.';
      errorEl.hidden = false;
      submitButton.disabled = false;
    }
  });

  input.focus();
}
