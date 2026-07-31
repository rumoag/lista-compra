// Tarjeta de una lista activa (FR-1) — icono, título, participantes truncados, menú de 3 puntos.
import { renderDropdownMenu } from '../common/dropdown-menu.js';
import { escapeHtml } from '../common/escape-html.js';
import { formatParticipants } from './participants.js';

export function renderCreateListCard(onClick) {
  const el = document.createElement('div');
  el.className = 'card list-card list-card--create';
  el.dataset.testid = 'home-create-list-button';

  el.innerHTML = `
    <div class="list-card-main" data-testid="list-card-open-area">
      <div class="list-card-icon list-card-icon--create" data-testid="list-card-icon">+</div>
      <div>
        <div class="list-card-title" data-testid="list-card-title">Crear nueva lista</div>
        <div class="meta" data-testid="list-card-participants">Toca para empezar</div>
      </div>
    </div>
  `;

  el.addEventListener('click', onClick);

  return el;
}

export function renderListCard(household, { onEdit, onDelete, onViewQr, onOpen }) {
  const el = document.createElement('div');
  el.className = 'card list-card';
  el.dataset.testid = `list-card-${household.id}`;

  el.innerHTML = `
    <div class="list-card-main" data-testid="list-card-open-area">
      <div class="list-card-icon" data-testid="list-card-icon">${household.image_icon}</div>
      <div>
        <div class="list-card-title" data-testid="list-card-title">${escapeHtml(household.title)}</div>
        <div class="meta" data-testid="list-card-participants">${escapeHtml(formatParticipants(household.participants))}</div>
      </div>
    </div>
    <div data-testid="list-card-menu-container"></div>
  `;

  el.addEventListener('click', () => onOpen(household.id));

  renderDropdownMenu(el.querySelector('[data-testid="list-card-menu-container"]'), {
    actions: [
      { testid: 'edit', label: 'Editar', onClick: () => onEdit(household) },
      { testid: 'qr', label: 'Ver QR', onClick: () => onViewQr(household) },
      { testid: 'delete', label: 'Eliminar', onClick: () => onDelete(household) },
    ],
  });

  return el;
}
