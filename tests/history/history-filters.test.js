import { describe, it, expect, vi } from 'vitest';
import { renderHistoryFilters } from '../../src/history/history-filters.js';

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

  it('el periodo personalizado permite elegir un rango y aplica al confirmar', () => {
    const container = document.createElement('div');
    const onChange = vi.fn();
    renderHistoryFilters(container, { onChange });

    container.querySelector('[data-testid="history-filter-date-chip"]').click();
    document.querySelector('[data-testid="history-date-option-custom"]').click();
    document.querySelector('[data-testid="history-filter-date-from-input"]').value = '2026-07-01';
    document.querySelector('[data-testid="history-filter-date-to-input"]').value = '2026-07-15';
    document.querySelector('[data-testid="history-date-apply-button"]').click();

    expect(onChange).toHaveBeenLastCalledWith({
      nameQuery: '',
      dateFrom: '2026-07-01',
      dateTo: '2026-07-15T23:59:59.999Z',
      sortAscending: false,
    });
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
