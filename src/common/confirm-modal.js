// Modal de confirmación genérico (generaliza home/delete-confirm-modal.js, Unidad 5,
// para reutilizarlo en el borrado individual y en lote de productos, Unidad 6).
import { openModal } from './modal.js';
import { escapeHtml } from './escape-html.js';

export function openConfirmModal({ title, message, confirmLabel = 'Confirmar', onConfirm }) {
  const { body, footer, close } = openModal({ title });

  body.innerHTML = `
    <p data-testid="confirm-modal-message">${escapeHtml(message)}</p>
    <div class="error-message" role="alert" data-testid="confirm-modal-error" hidden></div>
  `;

  footer.innerHTML = `
    <button type="button" class="secondary" data-testid="confirm-modal-cancel-button">Cancelar</button>
    <button type="button" data-testid="confirm-modal-confirm-button">${escapeHtml(confirmLabel)}</button>
  `;

  const errorEl = body.querySelector('[data-testid="confirm-modal-error"]');
  const confirmButton = footer.querySelector('[data-testid="confirm-modal-confirm-button"]');

  footer.querySelector('[data-testid="confirm-modal-cancel-button"]').addEventListener('click', close);

  confirmButton.addEventListener('click', async () => {
    errorEl.hidden = true;
    confirmButton.disabled = true;
    try {
      await onConfirm();
      close();
    } catch (err) {
      errorEl.textContent = 'No se pudo completar la acción. Inténtalo de nuevo.';
      errorEl.hidden = false;
      confirmButton.disabled = false;
    }
  });
}
