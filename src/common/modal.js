// Modal genérico reutilizable (BR-33, Unidad 5) — overlay + panel + botón "X" en esquina
// superior derecha. El llamante monta su propio contenido en el nodo devuelto por openModal().
import { icon } from './icon.js';

export function openModal({ title, onClose, fullScreen = false } = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.dataset.testid = 'modal-overlay';

  overlay.innerHTML = `
    <div class="modal-panel ${fullScreen ? 'modal-panel--fullscreen' : ''}" data-testid="modal-panel" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h2 data-testid="modal-title">${escapeHtml(title ?? '')}</h2>
        <button type="button" class="icon-button modal-close-button" data-testid="modal-close-button" aria-label="Cerrar">${icon('x')}</button>
      </div>
      <div class="modal-body" data-testid="modal-body"></div>
      <div class="modal-footer" data-testid="modal-footer"></div>
    </div>
  `;

  function close() {
    overlay.remove();
    document.removeEventListener('keydown', onKeydown);
    if (onClose) onClose();
  }

  function onKeydown(event) {
    if (event.key === 'Escape') close();
  }

  overlay.querySelector('[data-testid="modal-close-button"]').addEventListener('click', close);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });
  document.addEventListener('keydown', onKeydown);

  document.body.appendChild(overlay);

  return {
    body: overlay.querySelector('[data-testid="modal-body"]'),
    footer: overlay.querySelector('[data-testid="modal-footer"]'),
    // Nodo <h2> del título — expuesto para que llamantes como ticket-modal.js puedan
    // hacerlo interactivo (p.ej. click para editar) sin que openModal conozca ese caso de uso.
    titleEl: overlay.querySelector('[data-testid="modal-title"]'),
    close,
  };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
