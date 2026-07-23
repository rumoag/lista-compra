// Barra de acción en lote (US-2.1, US-2.2).
export function renderSelectionBar(container, { selectedCount, onMarkAsBought }) {
  if (selectedCount === 0) {
    container.innerHTML = '';
    container.hidden = true;
    return;
  }

  container.hidden = false;
  container.innerHTML = `
    <div class="card" data-testid="selection-bar">
      <span data-testid="selection-bar-count">${selectedCount} seleccionados</span>
      <button type="button" data-testid="selection-bar-mark-bought-button">Marcar como comprados</button>
    </div>
  `;

  container
    .querySelector('[data-testid="selection-bar-mark-bought-button"]')
    .addEventListener('click', onMarkAsBought);
}
