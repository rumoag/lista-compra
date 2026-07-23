// Filtros de historial (US-3.2) — UI que emite onChange({ nameQuery, dateFrom, dateTo }).
export function renderHistoryFilters(container, { onChange }) {
  container.innerHTML = `
    <div class="card">
      <input type="text" placeholder="Buscar por nombre" data-testid="history-filter-name-input" />
      <input type="date" data-testid="history-filter-date-from-input" />
      <input type="date" data-testid="history-filter-date-to-input" />
      <button type="button" class="secondary" data-testid="history-filter-clear-button">Limpiar filtros</button>
    </div>
  `;

  const nameInput = container.querySelector('[data-testid="history-filter-name-input"]');
  const dateFromInput = container.querySelector('[data-testid="history-filter-date-from-input"]');
  const dateToInput = container.querySelector('[data-testid="history-filter-date-to-input"]');
  const clearButton = container.querySelector('[data-testid="history-filter-clear-button"]');

  function emitChange() {
    onChange({
      nameQuery: nameInput.value,
      dateFrom: dateFromInput.value || null,
      dateTo: dateToInput.value || null,
    });
  }

  nameInput.addEventListener('input', emitChange);
  dateFromInput.addEventListener('change', emitChange);
  dateToInput.addEventListener('change', emitChange);
  clearButton.addEventListener('click', () => {
    nameInput.value = '';
    dateFromInput.value = '';
    dateToInput.value = '';
    emitChange();
  });
}
