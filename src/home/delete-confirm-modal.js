// Modal de confirmación de borrado (FR-5, BR-31) — confirmación simple, sin reescribir el título.
import { openModal } from '../common/modal.js';
import { deleteHousehold } from './households-api.js';

export function openDeleteConfirmModal({ household, onConfirmed }) {
  const { body, close } = openModal({ title: 'Eliminar lista' });

  body.innerHTML = `
    <p data-testid="delete-confirm-message">¿Eliminar esta lista? Se borrarán todos sus productos e historial.</p>
    <div class="error-message" data-testid="delete-confirm-error" hidden></div>
    <div class="delete-confirm-actions">
      <button type="button" class="secondary" data-testid="delete-confirm-cancel-button">Cancelar</button>
      <button type="button" data-testid="delete-confirm-delete-button">Eliminar</button>
    </div>
  `;

  const errorEl = body.querySelector('[data-testid="delete-confirm-error"]');
  const deleteButton = body.querySelector('[data-testid="delete-confirm-delete-button"]');

  body.querySelector('[data-testid="delete-confirm-cancel-button"]').addEventListener('click', close);

  deleteButton.addEventListener('click', async () => {
    errorEl.hidden = true;
    deleteButton.disabled = true;
    try {
      await deleteHousehold(household.id);
      close();
      onConfirmed();
    } catch (err) {
      errorEl.textContent = 'No se pudo eliminar la lista. Inténtalo de nuevo.';
      errorEl.hidden = false;
      deleteButton.disabled = false;
    }
  });
}
