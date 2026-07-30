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

vi.mock('../../src/common/confirm-modal.js', () => ({
  openConfirmModal: vi.fn(),
}));

const { supabase } = await import('../../src/common/supabase-client.js');
const { openConfirmModal } = await import('../../src/common/confirm-modal.js');
const { openTicketModal } = await import('../../src/history/ticket-modal.js');

function makePurchase(overrides = {}) {
  return {
    id: 't1',
    household_id: 'h1',
    bought_by: 'Ana',
    bought_at: '2026-07-27T18:30:00.000Z',
    title: null,
    products: [
      { id: 'p1', name: 'Leche', quantity_number: 1, quantity_unit: null },
      { id: 'p2', name: 'Pan', quantity_number: 1, quantity_unit: null },
    ],
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  responseQueue = [];
  createdBuilders = [];
  document.body.innerHTML = '';
});

describe('openTicketModal', () => {
  it('renderiza todos los productos del ticket', () => {
    const purchase = makePurchase();
    openTicketModal(purchase, { onTicketChanged: vi.fn(), onTicketRemoved: vi.fn(), onTicketRestored: vi.fn() });

    expect(document.querySelector('[data-testid="ticket-product-p1"]')).not.toBeNull();
    expect(document.querySelector('[data-testid="ticket-product-p2"]')).not.toBeNull();
  });

  it('desmarcar un producto abre confirmación antes de actuar (BR-53)', () => {
    const purchase = makePurchase();
    openTicketModal(purchase, { onTicketChanged: vi.fn(), onTicketRemoved: vi.fn(), onTicketRestored: vi.fn() });

    document
      .querySelector('[data-testid="ticket-product-p1"] [data-testid="ticket-product-unmark-button"]')
      .click();

    expect(openConfirmModal).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Desmarcar producto', onConfirm: expect.any(Function) })
    );
    expect(document.querySelector('[data-testid="ticket-product-p1"]')).not.toBeNull();
  });

  it('confirmar desmarcar un producto (no el último) lo quita de la vista y actualiza remoto (BR-53)', async () => {
    queueResponse({ error: null }); // update products
    const purchase = makePurchase();
    const onTicketChanged = vi.fn();
    openTicketModal(purchase, { onTicketChanged, onTicketRemoved: vi.fn(), onTicketRestored: vi.fn() });

    document
      .querySelector('[data-testid="ticket-product-p1"] [data-testid="ticket-product-unmark-button"]')
      .click();
    await openConfirmModal.mock.calls[0][0].onConfirm();

    const updateBuilder = createdBuilders.find((b) => b.update.mock.calls.length > 0);
    expect(updateBuilder.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'pending', bought_by: null, bought_at: null, purchase_id: null })
    );
    expect(updateBuilder.eq).toHaveBeenCalledWith('id', 'p1');
    expect(document.querySelector('[data-testid="ticket-product-p1"]')).toBeNull();
    expect(purchase.products).toHaveLength(1);
    expect(onTicketChanged).toHaveBeenCalledWith(purchase);
  });

  it('eliminar un producto abre confirmación antes de actuar (BR-53)', () => {
    const purchase = makePurchase();
    openTicketModal(purchase, { onTicketChanged: vi.fn(), onTicketRemoved: vi.fn(), onTicketRestored: vi.fn() });

    document
      .querySelector('[data-testid="ticket-product-p1"] [data-testid="ticket-product-delete-button"]')
      .click();

    expect(openConfirmModal).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Eliminar producto', onConfirm: expect.any(Function) })
    );
    expect(document.querySelector('[data-testid="ticket-product-p1"]')).not.toBeNull();
  });

  it('confirmar eliminar el último producto del ticket borra también el purchase huérfano y cierra el modal (BR-54)', async () => {
    const purchase = makePurchase({
      products: [{ id: 'p1', name: 'Leche', quantity_number: 1, quantity_unit: null }],
    });
    queueResponse({ error: null }); // delete producto
    queueResponse({ error: null }); // delete purchases (huérfano)
    const onTicketRemoved = vi.fn();
    openTicketModal(purchase, { onTicketChanged: vi.fn(), onTicketRemoved, onTicketRestored: vi.fn() });

    document
      .querySelector('[data-testid="ticket-product-p1"] [data-testid="ticket-product-delete-button"]')
      .click();
    await openConfirmModal.mock.calls[0][0].onConfirm();

    const deleteBuilders = createdBuilders.filter((b) => b.delete.mock.calls.length > 0);
    expect(deleteBuilders).toHaveLength(2);
    expect(onTicketRemoved).toHaveBeenCalledWith(purchase);
    expect(document.querySelector('[data-testid="modal-overlay"]')).toBeNull();
  });

  it('si falla la operación remota de un producto individual, se revierte y se muestra error', async () => {
    queueResponse({ error: new Error('boom') }); // update products falla
    const purchase = makePurchase();
    openTicketModal(purchase, { onTicketChanged: vi.fn(), onTicketRemoved: vi.fn(), onTicketRestored: vi.fn() });

    document
      .querySelector('[data-testid="ticket-product-p1"] [data-testid="ticket-product-unmark-button"]')
      .click();
    await openConfirmModal.mock.calls[0][0].onConfirm();

    expect(document.querySelector('[data-testid="ticket-product-p1"]')).not.toBeNull();
    expect(purchase.products).toHaveLength(2);
    expect(document.querySelector('[data-testid="ticket-modal-error"]').hidden).toBe(false);
  });

  it('"Deshacer ticket" abre confirmación con el conteo de productos (BR-51)', () => {
    const purchase = makePurchase();
    openTicketModal(purchase, { onTicketChanged: vi.fn(), onTicketRemoved: vi.fn(), onTicketRestored: vi.fn() });

    document.querySelector('[data-testid="ticket-modal-undo-button"]').click();

    expect(openConfirmModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Deshacer compra',
        message: expect.stringContaining('2 productos'),
        onConfirm: expect.any(Function),
      })
    );
  });

  it('confirmar "Deshacer ticket" revierte los productos a pending y borra el purchase, y retira el ticket (BR-51)', async () => {
    queueResponse({ error: null }); // update products
    queueResponse({ error: null }); // delete purchases
    const purchase = makePurchase();
    const onTicketRemoved = vi.fn();
    openTicketModal(purchase, { onTicketChanged: vi.fn(), onTicketRemoved, onTicketRestored: vi.fn() });

    document.querySelector('[data-testid="ticket-modal-undo-button"]').click();
    await openConfirmModal.mock.calls[0][0].onConfirm();

    const updateBuilder = createdBuilders.find((b) => b.update.mock.calls.length > 0);
    expect(updateBuilder.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'pending', bought_by: null, bought_at: null, purchase_id: null })
    );
    expect(updateBuilder.in).toHaveBeenCalledWith('id', ['p1', 'p2']);
    expect(onTicketRemoved).toHaveBeenCalledWith(purchase);
    expect(document.querySelector('[data-testid="modal-overlay"]')).toBeNull();
  });

  it('"Eliminar ticket" abre confirmación y, al confirmar, borra el purchase (cascade) y retira el ticket (BR-52)', async () => {
    queueResponse({ error: null }); // delete purchases
    const purchase = makePurchase();
    const onTicketRemoved = vi.fn();
    openTicketModal(purchase, { onTicketChanged: vi.fn(), onTicketRemoved, onTicketRestored: vi.fn() });

    document.querySelector('[data-testid="ticket-modal-delete-button"]').click();
    expect(openConfirmModal).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Eliminar compra', message: expect.stringContaining('2 productos') })
    );

    await openConfirmModal.mock.calls[0][0].onConfirm();

    const deleteBuilder = createdBuilders.find((b) => b.delete.mock.calls.length > 0);
    expect(deleteBuilder.eq).toHaveBeenCalledWith('id', 't1');
    expect(onTicketRemoved).toHaveBeenCalledWith(purchase);
    expect(document.querySelector('[data-testid="modal-overlay"]')).toBeNull();
  });

  it('si "Eliminar ticket" falla remotamente, se restaura el ticket en la lista (BR-52)', async () => {
    queueResponse({ error: new Error('boom') }); // delete purchases falla
    const purchase = makePurchase();
    const onTicketRestored = vi.fn();
    openTicketModal(purchase, { onTicketChanged: vi.fn(), onTicketRemoved: vi.fn(), onTicketRestored });

    document.querySelector('[data-testid="ticket-modal-delete-button"]').click();
    await openConfirmModal.mock.calls[0][0].onConfirm();

    expect(onTicketRestored).toHaveBeenCalledWith(purchase);
  });

  it('la cabecera del modal muestra el título del ticket en vez de la fecha/hora (seguimiento)', () => {
    const purchase = makePurchase({ title: 'Mercadona' });
    openTicketModal(purchase, { onTicketChanged: vi.fn(), onTicketRemoved: vi.fn(), onTicketRestored: vi.fn() });

    expect(document.querySelector('[data-testid="modal-title"]').textContent).toBe('Mercadona');
  });

  it('el recibo siempre muestra el texto fijo "TICKET DE COMPRA", no el título del ticket (seguimiento)', () => {
    const purchase = makePurchase({ title: 'Mercadona' });
    openTicketModal(purchase, { onTicketChanged: vi.fn(), onTicketRemoved: vi.fn(), onTicketRestored: vi.fn() });

    expect(document.querySelector('[data-testid="ticket-modal-header"]').textContent).toContain('TICKET DE COMPRA');
    expect(document.querySelector('[data-testid="ticket-modal-header"]').textContent).not.toContain('Mercadona');
  });

  it('muestra un placeholder "Sin título" en la cabecera del modal cuando el ticket no tiene título (seguimiento)', () => {
    const purchase = makePurchase({ title: null });
    openTicketModal(purchase, { onTicketChanged: vi.fn(), onTicketRemoved: vi.fn(), onTicketRestored: vi.fn() });

    expect(document.querySelector('[data-testid="modal-title"]').textContent).toBe('Sin título');
  });

  it('click en la cabecera del modal abre un input para editar el título (seguimiento)', () => {
    const purchase = makePurchase({ title: 'Mercadona' });
    openTicketModal(purchase, { onTicketChanged: vi.fn(), onTicketRemoved: vi.fn(), onTicketRestored: vi.fn() });

    document.querySelector('[data-testid="modal-title"]').click();

    const input = document.querySelector('[data-testid="modal-title-input"]');
    expect(input).not.toBeNull();
    expect(input.value).toBe('Mercadona');
  });

  it('editar el título desde la cabecera del modal (Enter) lo guarda y actualiza el título del modal (seguimiento)', async () => {
    queueResponse({ error: null }); // update purchases (title)
    const purchase = makePurchase({ title: null });
    const onTicketChanged = vi.fn();
    openTicketModal(purchase, { onTicketChanged, onTicketRemoved: vi.fn(), onTicketRestored: vi.fn() });

    document.querySelector('[data-testid="modal-title"]').click();
    const input = document.querySelector('[data-testid="modal-title-input"]');
    input.value = 'Lidl';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await new Promise((r) => setTimeout(r, 0));

    const updateBuilder = createdBuilders.find((b) => b.update.mock.calls.length > 0);
    expect(updateBuilder.update).toHaveBeenCalledWith({ title: 'Lidl' });
    expect(updateBuilder.eq).toHaveBeenCalledWith('id', 't1');
    expect(purchase.title).toBe('Lidl');
    expect(document.querySelector('[data-testid="modal-title"]').textContent).toBe('Lidl');
    expect(document.querySelector('[data-testid="modal-title-input"]')).toBeNull();
    expect(onTicketChanged).toHaveBeenCalledWith(purchase);
  });

  it('salir del campo de título (blur) también guarda el cambio (seguimiento)', async () => {
    queueResponse({ error: null }); // update purchases (title)
    const purchase = makePurchase({ title: null });
    const onTicketChanged = vi.fn();
    openTicketModal(purchase, { onTicketChanged, onTicketRemoved: vi.fn(), onTicketRestored: vi.fn() });

    document.querySelector('[data-testid="modal-title"]').click();
    const input = document.querySelector('[data-testid="modal-title-input"]');
    input.value = 'Lidl';
    input.dispatchEvent(new Event('blur'));
    await new Promise((r) => setTimeout(r, 0));

    expect(purchase.title).toBe('Lidl');
    expect(document.querySelector('[data-testid="modal-title"]').textContent).toBe('Lidl');
  });

  it('cancelar la edición del título (Escape) vuelve a la vista de lectura sin guardar (seguimiento)', () => {
    const purchase = makePurchase({ title: 'Mercadona' });
    openTicketModal(purchase, { onTicketChanged: vi.fn(), onTicketRemoved: vi.fn(), onTicketRestored: vi.fn() });

    document.querySelector('[data-testid="modal-title"]').click();
    const input = document.querySelector('[data-testid="modal-title-input"]');
    input.value = 'Lidl';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(document.querySelector('[data-testid="modal-title"]').textContent).toBe('Mercadona');
    expect(document.querySelector('[data-testid="modal-title-input"]')).toBeNull();
    expect(createdBuilders.some((b) => b.update.mock.calls.length > 0)).toBe(false);
  });
});
