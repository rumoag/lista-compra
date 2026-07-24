// Modal genérico reutilizable (BR-33, Unidad 5) — overlay + panel + botón "X" en esquina
// superior derecha. El llamante monta su propio contenido en el nodo devuelto por openModal().

export function openModal({ title, onClose } = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.dataset.testid = 'modal-overlay';

  overlay.innerHTML = `
    <div class="modal-panel" data-testid="modal-panel" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h2 data-testid="modal-title">${escapeHtml(title ?? '')}</h2>
        <button type="button" class="modal-close-button" data-testid="modal-close-button" aria-label="Cerrar">✕</button>
      </div>
      <div class="modal-body" data-testid="modal-body"></div>
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
    close,
  };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
