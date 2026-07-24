// Topbar superior: saludo con nombre local (BR-45) + menú de 3 puntos de la lista (BR-46,
// movido aquí desde list-header.js para que este contenedor tenga el mismo tamaño que el
// header fijo de selección y el cambio entre ambos no salte visualmente).
import { getLocalName } from '../onboarding/name-prompt.js';
import { renderDropdownMenu } from '../common/dropdown-menu.js';
import { openQrModal } from '../common/qr-modal.js';

export function renderGreeting(container, { household, onChangeName }) {
  container.innerHTML = `
    <div class="list-topbar" data-testid="list-topbar">
      <button type="button" class="greeting" data-testid="greeting">Hola, ${escapeHtml(getLocalName() ?? '')}</button>
      <div data-testid="list-topbar-menu-container"></div>
    </div>
  `;

  container.querySelector('[data-testid="greeting"]').addEventListener('click', onChangeName);

  renderDropdownMenu(container.querySelector('[data-testid="list-topbar-menu-container"]'), {
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
