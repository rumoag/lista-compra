// Header de selección en lote (US-2.1, US-2.2; rediseñado a header fijo superpuesto sobre
// la cabecera de la lista). X para deseleccionar todos, contador, y a la derecha: eliminar
// (icono con tooltip en desktop), marcar como comprados (icono+texto) y un menú de 3 puntos
// con "Seleccionar todos" y, si hay exactamente 1 producto seleccionado, "Editar".
import { renderDropdownMenu } from '../common/dropdown-menu.js';
import { icon } from '../common/icon.js';

export function renderSelectionBar(
  container,
  { selectedCount, onDeselectAll, onMarkAsBought, onDeleteSelected, onSelectAll, onEditSelected }
) {
  const wasEmpty = container.hidden || container.innerHTML === '';
  document.body.classList.toggle('has-selection', selectedCount > 0);

  if (selectedCount === 0) {
    container.innerHTML = '';
    container.hidden = true;
    return;
  }

  container.hidden = false;
  // La animación de entrada (BR-61ish, Ciclo 4) solo se reproduce al activarse la
  // selección (0 → N); en cambios posteriores del contador no se vuelve a disparar.
  container.innerHTML = `
    <div class="selection-header ${wasEmpty ? 'selection-header--entering' : ''}" data-testid="selection-bar">
      <div class="selection-header-left">
        <button type="button" class="icon-button" data-testid="selection-bar-close-button" aria-label="Deseleccionar todos">${icon('x')}</button>
        <span data-testid="selection-bar-count">${selectedCount} seleccionados</span>
      </div>
      <div class="selection-header-right">
        <button
          type="button"
          class="icon-button"
          data-testid="selection-bar-delete-button"
          title="Eliminar seleccionados"
          aria-label="Eliminar seleccionados"
        >${icon('trash')}</button>
        <button type="button" class="icon-text-button" data-testid="selection-bar-mark-bought-button">
          <span aria-hidden="true">${icon('check-circle')}</span> Comprados
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

  const actions = [{ testid: 'select-all', label: 'Seleccionar todos', onClick: onSelectAll }];
  if (onEditSelected) {
    actions.push({ testid: 'edit', label: 'Editar', onClick: onEditSelected });
  }

  renderDropdownMenu(container.querySelector('[data-testid="selection-bar-menu-container"]'), { actions });
}
