// Menú desplegable de 3 puntos (FR-1) — Eliminar / Editar / Ver QR.
export function renderListActionsMenu(container, { onEdit, onDelete, onViewQr }) {
  container.innerHTML = `
    <div class="list-actions-menu" data-testid="list-actions-menu">
      <button type="button" class="secondary" data-testid="list-actions-menu-toggle" aria-label="Más opciones">⋮</button>
      <div class="list-actions-menu-dropdown" data-testid="list-actions-menu-dropdown" hidden>
        <button type="button" data-testid="list-actions-menu-edit">Editar</button>
        <button type="button" data-testid="list-actions-menu-qr">Ver QR</button>
        <button type="button" data-testid="list-actions-menu-delete">Eliminar</button>
      </div>
    </div>
  `;

  const toggle = container.querySelector('[data-testid="list-actions-menu-toggle"]');
  const dropdown = container.querySelector('[data-testid="list-actions-menu-dropdown"]');

  function close() {
    dropdown.hidden = true;
    document.removeEventListener('click', onOutsideClick);
  }

  function onOutsideClick(event) {
    if (!container.contains(event.target)) close();
  }

  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    dropdown.hidden = !dropdown.hidden;
    if (!dropdown.hidden) {
      document.addEventListener('click', onOutsideClick);
    }
  });

  container.querySelector('[data-testid="list-actions-menu-edit"]').addEventListener('click', (event) => {
    event.stopPropagation();
    close();
    onEdit();
  });
  container.querySelector('[data-testid="list-actions-menu-qr"]').addEventListener('click', (event) => {
    event.stopPropagation();
    close();
    onViewQr();
  });
  container.querySelector('[data-testid="list-actions-menu-delete"]').addEventListener('click', (event) => {
    event.stopPropagation();
    close();
    onDelete();
  });
}
