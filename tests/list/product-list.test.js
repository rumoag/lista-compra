import { describe, it, expect, vi, beforeEach } from 'vitest';

let observedCallback;
class FakeIntersectionObserver {
  constructor(callback) {
    observedCallback = callback;
  }
  observe() {}
  disconnect() {}
}
global.IntersectionObserver = FakeIntersectionObserver;

// Modela el query builder de supabase-js: cada método encadena (devuelve el propio
// builder) y el builder es a la vez "thenable" (awaitable), resolviendo con la
// siguiente respuesta encolada — más fiel que un mockReturnThis()/mockResolvedValue
// simple, que no puede representar ambos comportamientos a la vez.
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

vi.mock('../../src/onboarding/name-prompt.js', () => ({
  getLocalName: vi.fn(() => 'Ana'),
}));

vi.mock('../../src/bulk-actions/realtime-subscription.js', () => ({
  createRealtimeSubscription: vi.fn(() => ({ subscribe: vi.fn(), unsubscribe: vi.fn() })),
}));

vi.mock('../../src/list/suggested-products.js', () => ({
  fetchSuggestedProducts: vi.fn().mockResolvedValue(['Leche']),
}));

vi.mock('../../src/list/product-wizard-modal.js', () => ({
  openProductWizardModal: vi.fn(),
}));

vi.mock('../../src/common/confirm-modal.js', () => ({
  openConfirmModal: vi.fn(),
}));

const { supabase } = await import('../../src/common/supabase-client.js');
const { openProductWizardModal } = await import('../../src/list/product-wizard-modal.js');
const { openConfirmModal } = await import('../../src/common/confirm-modal.js');
const { renderProductList } = await import('../../src/list/product-list.js');

function makeProduct(overrides = {}) {
  return {
    id: `p-${Math.random()}`,
    household_id: 'h1',
    name: 'Leche',
    quantity_number: 1,
    quantity_unit: null,
    category: null,
    status: 'pending',
    added_by: 'Ana',
    created_at: new Date().toISOString(),
    bought_by: null,
    bought_at: null,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  responseQueue = [];
  createdBuilders = [];
  document.body.innerHTML = '';
});

function mount() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return container;
}

describe('renderProductList (Unidad 6)', () => {
  it('carga la primera página y renderiza los items', async () => {
    queueResponse({ data: [makeProduct({ id: 'p1' })], error: null });
    const container = mount();

    await renderProductList(container, { householdId: 'h1' });

    expect(container.querySelector('[data-testid="product-item-p1"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="product-list-empty"]').hidden).toBe(true);
  });

  it('muestra el nuevo mensaje de estado vacío (BR-49)', async () => {
    queueResponse({ data: [], error: null });
    const container = mount();

    await renderProductList(container, { householdId: 'h1' });

    expect(container.querySelector('[data-testid="product-list-empty"]').hidden).toBe(false);
    expect(container.querySelector('[data-testid="product-list-empty"]').textContent).toContain(
      'No hay nada en tu cesta de la compra todavía'
    );
  });

  it('el FAB abre el wizard en modo create con productos sugeridos', async () => {
    queueResponse({ data: [], error: null });
    const container = mount();
    await renderProductList(container, { householdId: 'h1' });

    container.querySelector('[data-testid="product-list-fab-button"]').click();
    await new Promise((r) => setTimeout(r, 0));

    expect(openProductWizardModal).toHaveBeenCalledWith(
      expect.objectContaining({ mode: 'create', suggestedProducts: ['Leche'], onSave: expect.any(Function) })
    );
  });

  it('guardar desde el wizard de creación inserta el producto (optimista + remoto)', async () => {
    queueResponse({ data: [], error: null }); // primera página
    queueResponse({ data: makeProduct({ id: 'server-id' }), error: null }); // insert().select().single()
    const container = mount();
    await renderProductList(container, { householdId: 'h1' });

    container.querySelector('[data-testid="product-list-fab-button"]').click();
    await new Promise((r) => setTimeout(r, 0));

    const { onSave } = openProductWizardModal.mock.calls[0][0];
    await onSave({ name: 'Leche', quantity_number: 2, quantity_unit: 'litros', category: 'Lácteos' });

    const insertBuilder = createdBuilders.find((b) => b.insert.mock.calls.length > 0);
    expect(insertBuilder.insert).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Leche', quantity_number: 2, quantity_unit: 'litros', category: 'Lácteos' })
    );
    expect(container.querySelector('[data-testid="product-item-server-id"]')).not.toBeNull();
  });

  it('editar un item abre el wizard en modo edit con el producto', async () => {
    const product = makeProduct({ id: 'p1' });
    queueResponse({ data: [product], error: null });
    const container = mount();
    await renderProductList(container, { householdId: 'h1' });

    container.querySelector('[data-testid="product-item-p1"] [data-testid="dropdown-menu-toggle"]').click();
    container.querySelector('[data-testid="product-item-p1"] [data-testid="dropdown-menu-edit"]').click();
    await new Promise((r) => setTimeout(r, 0));

    expect(openProductWizardModal).toHaveBeenCalledWith(
      expect.objectContaining({ mode: 'edit', product, onSave: expect.any(Function) })
    );
  });

  it('eliminar un item abre confirmación (BR-42) y borra al confirmar', async () => {
    queueResponse({ data: [makeProduct({ id: 'p1' })], error: null }); // primera página
    queueResponse({ error: null }); // delete().eq()
    const container = mount();
    await renderProductList(container, { householdId: 'h1' });

    container.querySelector('[data-testid="product-item-p1"] [data-testid="dropdown-menu-toggle"]').click();
    container.querySelector('[data-testid="product-item-p1"] [data-testid="dropdown-menu-delete"]').click();

    expect(openConfirmModal).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Eliminar producto', onConfirm: expect.any(Function) })
    );

    await openConfirmModal.mock.calls[0][0].onConfirm();

    const deleteBuilder = createdBuilders.find((b) => b.delete.mock.calls.length > 0);
    expect(deleteBuilder.eq).toHaveBeenCalledWith('id', 'p1');
    expect(container.querySelector('[data-testid="product-item-p1"]')).toBeNull();
  });

  it('eliminar seleccionados en lote abre confirmación con el conteo (BR-42)', async () => {
    queueResponse({ data: [makeProduct({ id: 'p1' }), makeProduct({ id: 'p2' })], error: null });
    const container = mount();
    await renderProductList(container, { householdId: 'h1' });

    container.querySelector('[data-testid="product-item-p1"] [data-testid="product-item-body"]').click();
    container.querySelector('[data-testid="product-item-p2"] [data-testid="product-item-body"]').click();

    container.querySelector('[data-testid="selection-bar-delete-button"]').click();

    expect(openConfirmModal).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Eliminar productos', message: '¿Eliminar 2 productos?' })
    );
  });

  it('scroll infinito: el centinela visible carga la siguiente página (BR-48)', async () => {
    const firstPage = Array.from({ length: 20 }, (_, i) => makeProduct({ id: `p${i}` }));
    queueResponse({ data: firstPage, error: null });
    const container = mount();
    await renderProductList(container, { householdId: 'h1' });

    expect(container.querySelector('[data-testid="product-item-p-extra"]')).toBeNull();

    queueResponse({ data: [makeProduct({ id: 'p-extra' })], error: null });
    await observedCallback([{ isIntersecting: true }]);

    expect(container.querySelector('[data-testid="product-item-p-extra"]')).not.toBeNull();
  });

  it('seleccionar todos fuerza cargar todas las páginas restantes antes de seleccionar (BR-43)', async () => {
    const firstPage = Array.from({ length: 20 }, (_, i) => makeProduct({ id: `p${i}` }));
    queueResponse({ data: firstPage, error: null });
    const container = mount();
    await renderProductList(container, { householdId: 'h1' });

    container.querySelector('[data-testid="product-item-p0"] [data-testid="product-item-body"]').click();

    queueResponse({ data: [makeProduct({ id: 'p-last' })], error: null });
    container.querySelector('[data-testid="selection-bar-toggle-all-button"]').click();
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => setTimeout(r, 0));

    expect(container.querySelector('[data-testid="product-item-p-last"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="selection-bar-count"]').textContent).toContain('21');
  });
});
