import { describe, it, expect, vi, beforeEach } from 'vitest';

let responseQueue = [];
let createdBuilders = [];

function queueResponse(response) {
  responseQueue.push(response);
}

function makeBuilder() {
  const builder = {};
  ['select', 'eq', 'order', 'limit', 'lt', 'insert', 'update', 'delete', 'in'].forEach((method) => {
    builder[method] = vi.fn(() => builder);
  });
  builder.single = vi.fn(() => builder);
  builder.then = (resolve, reject) =>
    Promise.resolve(responseQueue.shift() ?? { data: [], error: null }).then(resolve, reject);
  createdBuilders.push(builder);
  return builder;
}

vi.mock('../../src/common/supabase-client.js', () => ({
  supabase: { from: vi.fn(() => makeBuilder()) },
}));

let realtimeHandlers = null;
const realtimeUnsubscribe = vi.fn();
vi.mock('../../src/common/realtime-subscription.js', () => ({
  createRealtimeSubscription: vi.fn(() => ({
    subscribe: vi.fn((handlers) => {
      realtimeHandlers = handlers;
    }),
    unsubscribe: realtimeUnsubscribe,
  })),
}));

let modalCallbacks = null;
const ticketModalClose = vi.fn();
vi.mock('../../src/history/ticket-modal.js', () => ({
  openTicketModal: vi.fn((purchase, callbacks) => {
    modalCallbacks = callbacks;
    return { close: ticketModalClose };
  }),
}));

const { openTicketModal } = await import('../../src/history/ticket-modal.js');
const { renderHistoryList } = await import('../../src/history/history-list.js');

function makePurchase(overrides = {}) {
  return {
    id: 't1',
    household_id: 'h1',
    bought_by: 'Ana',
    bought_at: '2026-07-27T18:30:00.000Z',
    products: [{ id: 'p1', name: 'Leche', purchase_id: 't1', status: 'bought', bought_at: '2026-07-27T18:30:00.000Z' }],
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  responseQueue = [];
  createdBuilders = [];
  realtimeHandlers = null;
  modalCallbacks = null;
  document.body.innerHTML = '';
});

function mount() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return container;
}

describe('renderHistoryList (Unidad 7 — tickets)', () => {
  it('carga la primera página y renderiza los tickets', async () => {
    queueResponse({ data: [makePurchase()], error: null });
    const container = mount();

    await renderHistoryList(container, { householdId: 'h1' });

    expect(container.querySelector('[data-testid="ticket-row-t1"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="history-empty"]').hidden).toBe(true);
  });

  it('estado vacío sin filtro', async () => {
    queueResponse({ data: [], error: null });
    const container = mount();

    await renderHistoryList(container, { householdId: 'h1' });

    expect(container.querySelector('[data-testid="history-empty"]').hidden).toBe(false);
    expect(container.querySelector('[data-testid="history-empty"]').textContent).toContain(
      'Aún no hay compras registradas'
    );
  });

  it('click en una fila abre el modal del ticket', async () => {
    const purchase = makePurchase();
    queueResponse({ data: [purchase], error: null });
    const container = mount();
    await renderHistoryList(container, { householdId: 'h1' });

    container.querySelector('[data-testid="ticket-row-open-area"]').click();

    expect(openTicketModal).toHaveBeenCalledWith(
      expect.objectContaining({ id: purchase.id, bought_by: purchase.bought_by }),
      expect.objectContaining({
        onTicketChanged: expect.any(Function),
        onTicketRemoved: expect.any(Function),
        onTicketRestored: expect.any(Function),
      })
    );
  });

  it('onTicketRemoved retira el ticket de la lista', async () => {
    const purchase = makePurchase();
    queueResponse({ data: [purchase], error: null });
    const container = mount();
    await renderHistoryList(container, { householdId: 'h1' });
    container.querySelector('[data-testid="ticket-row-open-area"]').click();

    modalCallbacks.onTicketRemoved(purchase);

    expect(container.querySelector('[data-testid="ticket-row-t1"]')).toBeNull();
    expect(container.querySelector('[data-testid="history-empty"]').hidden).toBe(false);
  });

  it('onTicketRestored reinserta el ticket y muestra un error global', async () => {
    const purchase = makePurchase();
    queueResponse({ data: [purchase], error: null });
    const container = mount();
    await renderHistoryList(container, { householdId: 'h1' });
    container.querySelector('[data-testid="ticket-row-open-area"]').click();
    modalCallbacks.onTicketRemoved(purchase);

    modalCallbacks.onTicketRestored(purchase);

    expect(container.querySelector('[data-testid="ticket-row-t1"]')).not.toBeNull();
    expect(container.querySelector('.error-message')).not.toBeNull();
  });

  it('filtro por nombre deriva los tickets a mostrar a partir de los productos coincidentes (BR-56)', async () => {
    queueResponse({ data: [], error: null }); // primera página inicial
    const container = mount();
    await renderHistoryList(container, { householdId: 'h1' });

    queueResponse({
      data: [{ id: 'p1', name: 'Leche', purchase_id: 't1', bought_at: '2026-07-27T18:30:00.000Z' }],
      error: null,
    }); // fetchProductsForFiltering
    queueResponse({ data: [makePurchase()], error: null }); // purchases .in(purchaseIds)

    container.querySelector('[data-testid="history-filter-name-input"]').value = 'leche';
    container.querySelector('[data-testid="history-filter-name-input"]').dispatchEvent(new Event('input'));
    await new Promise((r) => setTimeout(r, 0));

    const purchasesBuilder = createdBuilders.find((b) => b.in.mock.calls.length > 0);
    expect(purchasesBuilder.in).toHaveBeenCalledWith('id', ['t1']);
    expect(container.querySelector('[data-testid="ticket-row-t1"]')).not.toBeNull();
  });

  it('filtro sin coincidencias muestra el mensaje de "sin resultados"', async () => {
    queueResponse({ data: [], error: null }); // primera página inicial
    const container = mount();
    await renderHistoryList(container, { householdId: 'h1' });

    queueResponse({ data: [], error: null }); // fetchProductsForFiltering sin resultados

    container.querySelector('[data-testid="history-filter-name-input"]').value = 'inexistente';
    container.querySelector('[data-testid="history-filter-name-input"]').dispatchEvent(new Event('input'));
    await new Promise((r) => setTimeout(r, 0));

    expect(container.querySelector('[data-testid="history-empty"]').hidden).toBe(false);
    expect(container.querySelector('[data-testid="history-empty"]').textContent).toContain(
      'No hay resultados para el filtro aplicado'
    );
  });

  it('historial en vivo: INSERT remoto añade el ticket nuevo con sus productos (BR-59)', async () => {
    queueResponse({ data: [], error: null }); // primera página inicial
    const container = mount();
    await renderHistoryList(container, { householdId: 'h1' });

    queueResponse({ data: [{ id: 'p1', name: 'Leche' }], error: null }); // products por purchase_id
    await realtimeHandlers.onInsert({ id: 't2', household_id: 'h1', bought_by: 'Bob', bought_at: '2026-07-27T19:00:00.000Z' });

    expect(container.querySelector('[data-testid="ticket-row-t2"]')).not.toBeNull();
  });

  it('historial en vivo: DELETE remoto retira el ticket y cierra el modal si estaba abierto (BR-59)', async () => {
    const purchase = makePurchase();
    queueResponse({ data: [purchase], error: null });
    const container = mount();
    await renderHistoryList(container, { householdId: 'h1' });
    container.querySelector('[data-testid="ticket-row-open-area"]').click();

    realtimeHandlers.onDelete({ id: 't1' });

    expect(container.querySelector('[data-testid="ticket-row-t1"]')).toBeNull();
    expect(ticketModalClose).toHaveBeenCalled();
    expect(container.querySelector('.error-message')).not.toBeNull();
  });

  it('historial en vivo: los eventos se ignoran mientras hay un filtro activo (BR-59)', async () => {
    queueResponse({ data: [], error: null }); // primera página inicial
    const container = mount();
    await renderHistoryList(container, { householdId: 'h1' });

    queueResponse({ data: [], error: null }); // fetchProductsForFiltering
    container.querySelector('[data-testid="history-filter-name-input"]').value = 'leche';
    container.querySelector('[data-testid="history-filter-name-input"]').dispatchEvent(new Event('input'));
    await new Promise((r) => setTimeout(r, 0));

    await realtimeHandlers.onInsert({ id: 't2', household_id: 'h1', bought_by: 'Bob', bought_at: '2026-07-27T19:00:00.000Z' });

    expect(container.querySelector('[data-testid="ticket-row-t2"]')).toBeNull();
  });

  it('"Cargar más" carga la siguiente página', async () => {
    queueResponse({ data: [makePurchase({ id: 't1' })], error: null });
    const container = mount();
    await renderHistoryList(container, { householdId: 'h1' });

    queueResponse({ data: [makePurchase({ id: 't2', bought_at: '2026-07-26T18:30:00.000Z' })], error: null });
    container.querySelector('[data-testid="history-load-more-button"]').click();
    await new Promise((r) => setTimeout(r, 0));

    expect(container.querySelector('[data-testid="ticket-row-t2"]')).not.toBeNull();
  });

  it('desuscribe Realtime al desmontar (pagehide)', async () => {
    queueResponse({ data: [], error: null });
    const container = mount();
    const cleanup = await renderHistoryList(container, { householdId: 'h1' });

    cleanup();

    expect(realtimeUnsubscribe).toHaveBeenCalled();
  });
});
