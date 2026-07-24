// Header de selección en lote (US-2.1, US-2.2; rediseñado a header fijo superpuesto sobre
// la cabecera de la lista). X para deseleccionar todos, contador, y a la derecha: eliminar
// (icono con tooltip en desktop), marcar como comprados (icono+texto) y "Seleccionar todos"
// dentro de un menú de 3 puntos.
import { renderDropdownMenu } from '../common/dropdown-menu.js';

export function renderSelectionBar(container, { selectedCount, onDeselectAll, onMarkAsBought, onDeleteSelected, onSelectAll }) {
  document.body.classList.toggle('has-selection', selectedCount > 0);

  if (selectedCount === 0) {
    container.innerHTML = '';
    container.hidden = true;
    return;
  }

  container.hidden = false;
  container.innerHTML = `
    <div class="selection-header" data-testid="selection-bar">
      <div class="selection-header-left">
        <button type="button" class="icon-button" data-testid="selection-bar-close-button" aria-label="Deseleccionar todos">✕</button>
        <span data-testid="selection-bar-count">${selectedCount} seleccionados</span>
      </div>
      <div class="selection-header-right">
        <button
          type="button"
          class="icon-button"
          data-testid="selection-bar-delete-button"
          title="Eliminar seleccionados"
          aria-label="Eliminar seleccionados"
        >🗑️</button>
        <button type="button" class="icon-text-button" data-testid="selection-bar-mark-bought-button">
          <span aria-hidden="true">✅</span> Comprados
        </button>
        <div data-testid="selection-bar-menu-container"></div>
      </div>
    </div>
  `;

  container
    .querySelector('[data-testid="selection-bar-close-button"]')
    .addEventListener('click', onDeselectAll);
  container
    .querySelector('[data-testid="selection-bar-mark-bought-button"]')
    .addEventListener('click', onMarkAsBought);
  container
    .querySelector('[data-testid="selection-bar-delete-button"]')
    .addEventListener('click', onDeleteSelected);

  renderDropdownMenu(container.querySelector('[data-testid="selection-bar-menu-container"]'), {
    actions: [{ testid: 'select-all', label: 'Seleccionar todos', onClick: onSelectAll }],
  });
}
