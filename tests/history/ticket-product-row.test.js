import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderTicketProductRow } from '../../src/history/ticket-product-row.js';

function makeProduct(overrides = {}) {
  return {
    id: 'p1',
    name: 'Leche',
    quantity_number: 2,
    quantity_unit: 'litros',
    ...overrides,
  };
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('renderTicketProductRow (BR-53)', () => {
  it('muestra nombre y cantidad', () => {
    const el = renderTicketProductRow(makeProduct(), { onUnmark: vi.fn(), onDelete: vi.fn() });

    expect(el.querySelector('[data-testid="ticket-product-name"]').textContent).toBe('Leche');
    expect(el.querySelector('[data-testid="ticket-product-quantity"]').textContent).toBe('2 litros');
  });

  it('omite la cantidad si no hay quantity_number ni quantity_unit', () => {
    const el = renderTicketProductRow(makeProduct({ quantity_number: null, quantity_unit: null }), {
      onUnmark: vi.fn(),
      onDelete: vi.fn(),
    });

    expect(el.querySelector('[data-testid="ticket-product-quantity"]')).toBeNull();
  });

  it('click en "Desmarcar" invoca onUnmark con el id', () => {
    const onUnmark = vi.fn();
    const el = renderTicketProductRow(makeProduct(), { onUnmark, onDelete: vi.fn() });

    el.querySelector('[data-testid="ticket-product-unmark-button"]').click();

    expect(onUnmark).toHaveBeenCalledWith('p1');
  });

  it('click en "Eliminar" invoca onDelete con el id', () => {
    const onDelete = vi.fn();
    const el = renderTicketProductRow(makeProduct(), { onUnmark: vi.fn(), onDelete });

    el.querySelector('[data-testid="ticket-product-delete-button"]').click();

    expect(onDelete).toHaveBeenCalledWith('p1');
  });
});
