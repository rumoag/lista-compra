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

    expect(onChange).toHaveBeenCalledWith({ nameQuery: 'leche', dateFrom: null, dateTo: null });
  });

  it('limpiar filtros resetea todos los campos y emite onChange', () => {
    const container = document.createElement('div');
    const onChange = vi.fn();
    renderHistoryFilters(container, { onChange });

    container.querySelector('[data-testid="history-filter-name-input"]').value = 'leche';
    container.querySelector('[data-testid="history-filter-clear-button"]').click();

    expect(onChange).toHaveBeenLastCalledWith({ nameQuery: '', dateFrom: null, dateTo: null });
  });
});
