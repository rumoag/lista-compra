import { describe, it, expect, vi } from 'vitest';
import { renderHistoryFilters } from '../../src/history/history-filters.js';

function toIso(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

describe('renderHistoryFilters', () => {
  it('emite onChange al escribir en el nombre', () => {
    const container = document.createElement('div');
    const onChange = vi.fn();
    renderHistoryFilters(container, { onChange });

    const nameInput = container.querySelector('[data-testid="history-filter-name-input"]');
    nameInput.value = 'leche';
    nameInput.dispatchEvent(new Event('input'));

    expect(onChange).toHaveBeenCalledWith({ nameQuery: 'leche', dateFrom: null, dateTo: null, sortAscending: false });
  });

  it('al escribir un texto y perder el foco, la lupa se convierte en un chip con el texto y una "x"', () => {
    const container = document.createElement('div');
    const onChange = vi.fn();
    renderHistoryFilters(container, { onChange });

    const nameInput = container.querySelector('[data-testid="history-filter-name-input"]');
    nameInput.hidden = false;
    nameInput.value = 'leche';
    nameInput.dispatchEvent(new Event('blur'));

    const valueChip = container.querySelector('[data-testid="history-filter-search-value-chip"]');
    expect(valueChip.hidden).toBe(false);
    expect(container.querySelector('[data-testid="history-filter-search-value-text"]').textContent).toBe('leche');
    expect(container.querySelector('[data-testid="history-filter-search-toggle"]').hidden).toBe(true);
  });

  it('la "x" del chip de búsqueda limpia el texto y emite onChange', () => {
    const container = document.createElement('div');
    const onChange = vi.fn();
    renderHistoryFilters(container, { onChange });

    const nameInput = container.querySelector('[data-testid="history-filter-name-input"]');
    nameInput.value = 'leche';
    nameInput.dispatchEvent(new Event('blur'));

    container.querySelector('[data-testid="history-filter-search-clear-button"]').click();

    expect(onChange).toHaveBeenLastCalledWith({ nameQuery: '', dateFrom: null, dateTo: null, sortAscending: false });
    expect(container.querySelector('[data-testid="history-filter-search-toggle"]').hidden).toBe(false);
  });

  it('el chip de fecha abre un selector con presets y aplica "Hoy" al elegirlo', () => {
    const container = document.createElement('div');
    const onChange = vi.fn();
    renderHistoryFilters(container, { onChange });

    container.querySelector('[data-testid="history-filter-date-chip"]').click();
    document.querySelector('[data-testid="history-date-option-today"]').click();

    const todayIso = new Date().toISOString().slice(0, 10);
    expect(onChange).toHaveBeenLastCalledWith({
      nameQuery: '',
      dateFrom: todayIso,
      dateTo: `${todayIso}T23:59:59.999Z`,
      sortAscending: false,
    });
    expect(container.querySelector('[data-testid="history-filter-date-chip"]').textContent).toBe('Hoy');
    expect(document.querySelector('[data-testid="modal-overlay"]')).toBeNull();
  });

  it('el periodo personalizado permite elegir un rango en el calendario M3 y aplica al confirmar', () => {
    const container = document.createElement('div');
    const onChange = vi.fn();
    renderHistoryFilters(container, { onChange });

    container.querySelector('[data-testid="history-filter-date-chip"]').click();
    document.querySelector('[data-testid="history-date-option-custom"]').click();

    const today = new Date();
    const fromIso = toIso(new Date(today.getFullYear(), today.getMonth(), 5));
    const toIsoDate = toIso(new Date(today.getFullYear(), today.getMonth(), 20));

    document.querySelector(`[data-testid="history-date-calendar-day-${fromIso}"]`).click();
    document.querySelector(`[data-testid="history-date-calendar-day-${toIsoDate}"]`).click();
    document.querySelector('[data-testid="history-date-apply-button"]').click();

    expect(onChange).toHaveBeenLastCalledWith({
      nameQuery: '',
      dateFrom: fromIso,
      dateTo: `${toIsoDate}T23:59:59.999Z`,
      sortAscending: false,
    });
  });

  it('el calendario navega al mes siguiente/anterior sin perder el rango en curso', () => {
    const container = document.createElement('div');
    const onChange = vi.fn();
    renderHistoryFilters(container, { onChange });

    container.querySelector('[data-testid="history-filter-date-chip"]').click();
    document.querySelector('[data-testid="history-date-option-custom"]').click();

    const initialLabel = document.querySelector('[data-testid="history-date-calendar-label"]').textContent;
    const fromIso = toIso(new Date());
    document.querySelector(`[data-testid="history-date-calendar-day-${fromIso}"]`).click();

    document.querySelector('[data-testid="history-date-calendar-next-button"]').click();
    const nextLabel = document.querySelector('[data-testid="history-date-calendar-label"]').textContent;
    expect(nextLabel).not.toBe(initialLabel);

    document.querySelector('[data-testid="history-date-calendar-prev-button"]').click();
    const backLabel = document.querySelector('[data-testid="history-date-calendar-label"]').textContent;
    expect(backLabel).toBe(initialLabel);
    // El día ya elegido sigue marcado como extremo del rango tras volver al mes original.
    expect(document.querySelector(`[data-testid="history-date-calendar-day-${fromIso}"]`).getAttribute('aria-pressed')).toBe(
      'true'
    );
  });

  it('el chip de orden abre un selector y aplica "más antiguo primero" al elegirlo', () => {
    const container = document.createElement('div');
    const onChange = vi.fn();
    renderHistoryFilters(container, { onChange });

    container.querySelector('[data-testid="history-filter-sort-chip"]').click();
    document.querySelector('[data-testid="history-sort-option-asc"]').click();

    expect(onChange).toHaveBeenLastCalledWith({ nameQuery: '', dateFrom: null, dateTo: null, sortAscending: true });
    expect(container.querySelector('[data-testid="history-filter-sort-chip"]').textContent).toBe(
      'Fecha (más antiguo primero)'
    );
  });
});
