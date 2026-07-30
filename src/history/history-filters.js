// Filtros de historial (US-3.2) — chips estilo Google Fotos (búsqueda, fecha, orden) que
// emiten onChange({ nameQuery, dateFrom, dateTo, sortAscending }).
import { openModal } from '../common/modal.js';
import { icon } from '../common/icon.js';

const DATE_PRESETS = [
  { value: 'any', label: 'Cualquier fecha' },
  { value: 'today', label: 'Hoy' },
  { value: 'yesterday', label: 'Ayer' },
  { value: '7d', label: 'Últimos 7 días' },
  { value: '30d', label: 'Últimos 30 días' },
  { value: 'custom', label: 'Periodo personalizado' },
];

const SORT_OPTIONS = [
  { value: false, label: 'Fecha (más reciente primero)' },
  { value: true, label: 'Fecha (más antiguo primero)' },
];

export function renderHistoryFilters(container, { onChange }) {
  container.innerHTML = `
    <div class="chip-group" data-testid="history-filters">
      <button type="button" class="chip chip--icon" data-testid="history-filter-search-toggle" aria-label="Buscar por nombre">${icon('magnifying-glass')}</button>
      <input type="text" class="chip-search-input" placeholder="Buscar producto" data-testid="history-filter-name-input" hidden />
      <button type="button" class="chip" data-testid="history-filter-search-value-chip" hidden>
        <span data-testid="history-filter-search-value-text"></span>
        <span class="chip-remove" data-testid="history-filter-search-clear-button" aria-label="Quitar búsqueda">${icon('x')}</span>
      </button>
      <button type="button" class="chip" data-testid="history-filter-date-chip">Cualquier fecha</button>
      <button type="button" class="chip" data-testid="history-filter-sort-chip">Fecha (más reciente primero)</button>
    </div>
  `;

  const searchToggle = container.querySelector('[data-testid="history-filter-search-toggle"]');
  const nameInput = container.querySelector('[data-testid="history-filter-name-input"]');
  const searchValueChip = container.querySelector('[data-testid="history-filter-search-value-chip"]');
  const searchValueText = container.querySelector('[data-testid="history-filter-search-value-text"]');
  const searchClearButton = container.querySelector('[data-testid="history-filter-search-clear-button"]');
  const dateChip = container.querySelector('[data-testid="history-filter-date-chip"]');
  const sortChip = container.querySelector('[data-testid="history-filter-sort-chip"]');

  let dateFrom = null;
  let dateToRaw = null; // fecha de "hasta" tal cual la elige el usuario (día natural, sin hora)
  let currentDatePreset = 'any';
  let sortAscending = false;

  // El día de "hasta" debe cubrir el día entero: si se emitiera tal cual (medianoche),
  // filterByDateRange excluiría cualquier compra registrada después de las 00:00 de ese
  // día — que es prácticamente cualquier compra real (BR-16 no lo amplía por su cuenta).
  function emitChange() {
    onChange({
      nameQuery: nameInput.value,
      dateFrom,
      dateTo: dateToRaw ? `${dateToRaw}T23:59:59.999Z` : null,
      sortAscending,
    });
  }

  // --- Búsqueda: icono de lupa -> input -> chip con el texto buscado y una "x" para quitarlo ---
  function showSearchInput() {
    searchToggle.hidden = true;
    searchValueChip.hidden = true;
    nameInput.hidden = false;
    nameInput.focus();
  }

  function commitSearch() {
    if (nameInput.value.trim() === '') {
      nameInput.hidden = true;
      searchValueChip.hidden = true;
      searchToggle.hidden = false;
      return;
    }
    nameInput.hidden = true;
    searchToggle.hidden = true;
    searchValueChip.hidden = false;
    searchValueText.textContent = nameInput.value;
  }

  searchToggle.addEventListener('click', showSearchInput);
  searchValueChip.addEventListener('click', showSearchInput);
  nameInput.addEventListener('input', emitChange);
  nameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitSearch();
    }
  });
  nameInput.addEventListener('blur', commitSearch);
  searchClearButton.addEventListener('click', (event) => {
    event.stopPropagation();
    nameInput.value = '';
    commitSearch();
    emitChange();
  });

  // --- Fecha: chip que abre un selector con presets (Cualquier fecha / Hoy / Ayer / ...) ---
  function applyDatePreset(preset) {
    const today = new Date();
    switch (preset) {
      case 'today':
        dateFrom = dateToRaw = toDateInputValue(today);
        break;
      case 'yesterday':
        dateFrom = dateToRaw = toDateInputValue(addDays(today, -1));
        break;
      case '7d':
        dateFrom = toDateInputValue(addDays(today, -6));
        dateToRaw = toDateInputValue(today);
        break;
      case '30d':
        dateFrom = toDateInputValue(addDays(today, -29));
        dateToRaw = toDateInputValue(today);
        break;
      case 'any':
      default:
        dateFrom = null;
        dateToRaw = null;
    }
  }

  function dateChipLabel() {
    if (currentDatePreset === 'custom') {
      const from = dateFrom ? formatDisplayDate(dateFrom) : '…';
      const to = dateToRaw ? formatDisplayDate(dateToRaw) : '…';
      return `${from} - ${to}`;
    }
    return DATE_PRESETS.find((option) => option.value === currentDatePreset)?.label ?? 'Cualquier fecha';
  }

  function openDatePicker() {
    const { body, footer, close } = openModal({ title: 'Fecha' });
    body.innerHTML = `
      <div class="option-list" data-testid="history-date-options"></div>
      <div class="custom-date-range" data-testid="history-date-custom-range" hidden>
        <input type="date" class="text-input" data-testid="history-filter-date-from-input" />
        <input type="date" class="text-input" data-testid="history-filter-date-to-input" />
      </div>
    `;

    const optionsList = body.querySelector('[data-testid="history-date-options"]');
    const customRange = body.querySelector('[data-testid="history-date-custom-range"]');
    const fromInput = body.querySelector('[data-testid="history-filter-date-from-input"]');
    const toInput = body.querySelector('[data-testid="history-filter-date-to-input"]');

    function showApplyButton() {
      footer.innerHTML = `<button type="button" data-testid="history-date-apply-button">Aplicar</button>`;
      footer.querySelector('[data-testid="history-date-apply-button"]').addEventListener('click', () => {
        dateFrom = fromInput.value || null;
        dateToRaw = toInput.value || null;
        currentDatePreset = 'custom';
        dateChip.textContent = dateChipLabel();
        close();
        emitChange();
      });
    }

    DATE_PRESETS.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option-item';
      button.dataset.testid = `history-date-option-${option.value}`;
      button.setAttribute('aria-pressed', String(option.value === currentDatePreset));
      button.textContent = option.label;
      button.addEventListener('click', () => {
        if (option.value === 'custom') {
          customRange.hidden = false;
          fromInput.value = dateFrom ?? '';
          toInput.value = dateToRaw ?? '';
          showApplyButton();
          return;
        }
        applyDatePreset(option.value);
        currentDatePreset = option.value;
        dateChip.textContent = dateChipLabel();
        close();
        emitChange();
      });
      optionsList.appendChild(button);
    });
  }

  dateChip.addEventListener('click', openDatePicker);

  // --- Orden: chip que abre un selector con las dos direcciones de ordenación ---
  function openSortPicker() {
    const { body, close } = openModal({ title: 'Ordenar por' });
    body.innerHTML = `<div class="option-list" data-testid="history-sort-options"></div>`;
    const optionsList = body.querySelector('[data-testid="history-sort-options"]');

    SORT_OPTIONS.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option-item';
      button.dataset.testid = `history-sort-option-${option.value ? 'asc' : 'desc'}`;
      button.setAttribute('aria-pressed', String(option.value === sortAscending));
      button.textContent = option.label;
      button.addEventListener('click', () => {
        sortAscending = option.value;
        sortChip.textContent = option.label;
        close();
        emitChange();
      });
      optionsList.appendChild(button);
    });
  }

  sortChip.addEventListener('click', openSortPicker);
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDisplayDate(isoDate) {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}
