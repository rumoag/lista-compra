// Topbar superior (BR-45/BR-46): título de la lista (icono+nombre) a la izquierda, y a la
// derecha un botón circular con la inicial del nombre local que abre el menú de opciones de
// la lista — el saludo "Hola, X" vive ahora como primera entrada de ese menú en vez de como
// texto suelto en la topbar, y el toggle deja de ser "3 puntos" para mostrar la inicial.
// (Seguimiento) "Editar lista de la compra" justo después del saludo abre el mismo modal de
// crear/editar lista (title+icon) que usa home/list-card.js, ver main.js.
import { getLocalName } from '../onboarding/name-prompt.js';
import { renderDropdownMenu } from '../common/dropdown-menu.js';
import { openQrModal } from '../common/qr-modal.js';

export function renderGreeting(container, { household, onChangeName, onEditList }) {
  const name = getLocalName() ?? '';
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  container.innerHTML = `
    <div class="list-topbar" data-testid="list-topbar">
      <div class="list-header-title" data-testid="list-header-title">
        <span data-testid="list-header-icon">${escapeHtml(household.image_icon)}</span>
        <span>${escapeHtml(household.title)}</span>
      </div>
      <div data-testid="list-topbar-menu-container"></div>
    </div>
  `;

  renderDropdownMenu(container.querySelector('[data-testid="list-topbar-menu-container"]'), {
    toggleClass: 'avatar-button',
    toggleContent: escapeHtml(initial),
    toggleLabel: 'Opciones de la lista',
    actions: [
      { testid: 'change-name', label: `Hola, ${escapeHtml(name)}`, onClick: onChangeName },
      { testid: 'edit-list', label: 'Editar lista de la compra', onClick: onEditList },
      { testid: 'qr', label: 'Ver QR', onClick: () => openQrModal({ householdId: household.id }) },
      { testid: 'back', label: 'Volver al listado de listas', onClick: () => (window.location.href = '/') },
    ],
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
