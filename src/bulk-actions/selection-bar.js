// Barra de acción en lote (US-2.1, US-2.2, ampliada en Unidad 6 con seleccionar/deseleccionar
// todos y eliminar seleccionados, FR-17).
export function renderSelectionBar(container, { selectedCount, allSelected, onMarkAsBought, onToggleSelectAll, onDeleteSelected }) {
  if (selectedCount === 0) {
    container.innerHTML = '';
    container.hidden = true;
    return;
  }

  container.hidden = false;
  container.innerHTML = `
    <div class="card" data-testid="selection-bar">
      <span data-testid="selection-bar-count">${selectedCount} seleccionados</span>
      <button type="button" class="secondary" data-testid="selection-bar-toggle-all-button">${
        allSelected ? 'Deseleccionar todos' : 'Seleccionar todos'
      }</button>
      <button type="button" data-testid="selection-bar-mark-bought-button">Marcar como comprados</button>
      <button type="button" class="danger" data-testid="selection-bar-delete-button">Eliminar seleccionados</button>
    </div>
  `;

  container
    .querySelector('[data-testid="selection-bar-mark-bought-button"]')
    .addEventListener('click', onMarkAsBought);
  container
    .querySelector('[data-testid="selection-bar-toggle-all-button"]')
    .addEventListener('click', onToggleSelectAll);
  container
    .querySelector('[data-testid="selection-bar-delete-button"]')
    .addEventListener('click', onDeleteSelected);
}
