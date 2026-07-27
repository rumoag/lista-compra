import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderTicketRow } from '../../src/history/ticket-row.js';

function makePurchase(overrides = {}) {
  return {
    id: 't1',
    household_id: 'h1',
    bought_by: 'Ana',
    bought_at: '2026-07-27T18:30:00.000Z',
    products: [{ id: 'p1' }, { id: 'p2' }],
    ...overrides,
  };
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('renderTicketRow (BR-55)', () => {
  it('muestra fecha/hora, quién compró y el número total de productos', () => {
    const el = renderTicketRow(makePurchase(), { onOpen: vi.fn() });

    expect(el.querySelector('[data-testid="ticket-row-date"]')).not.toBeNull();
    expect(el.querySelector('[data-testid="ticket-row-meta"]').textContent).toContain('Ana');
    expect(el.querySelector('[data-testid="ticket-row-meta"]').textContent).toContain('2 productos');
  });

  it('usa singular cuando hay exactamente 1 producto', () => {
    const el = renderTicketRow(makePurchase({ products: [{ id: 'p1' }] }), { onOpen: vi.fn() });

    expect(el.querySelector('[data-testid="ticket-row-meta"]').textContent).toContain('1 producto');
    expect(el.querySelector('[data-testid="ticket-row-meta"]').textContent).not.toContain('1 productos');
  });

  it('click en la fila invoca onOpen con el purchase', () => {
    const onOpen = vi.fn();
    const purchase = makePurchase();
    const el = renderTicketRow(purchase, { onOpen });
    document.body.appendChild(el);

    el.querySelector('[data-testid="ticket-row-open-area"]').click();

    expect(onOpen).toHaveBeenCalledWith(purchase);
  });
});
