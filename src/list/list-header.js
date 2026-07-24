// Cabecera de la lista (BR-46) — icono+título + menú de 3 puntos (Cambiar nombre/Ver QR/Volver al listado).
import { renderDropdownMenu } from '../common/dropdown-menu.js';
import { openQrModal } from '../common/qr-modal.js';

export function renderListHeader(container, { household, onChangeName }) {
  container.innerHTML = `
    <div class="list-header" data-testid="list-header">
      <div class="list-header-title" data-testid="list-header-title">
        <span data-testid="list-header-icon">${household.image_icon}</span>
        <span>${escapeHtml(household.title)}</span>
      </div>
      <div data-testid="list-header-menu-container"></div>
    </div>
  `;

  renderDropdownMenu(container.querySelector('[data-testid="list-header-menu-container"]'), {
    actions: [
      { testid: 'change-name', label: 'Cambiar nombre', onClick: onChangeName },
      { testid: 'qr', label: 'Ver QR', onClick: () => openQrModal({ householdId: household.id }) },
      { testid: 'back', label: 'Volver al listado de listas', onClick: () => (window.location.href = '/') },
    ],
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
