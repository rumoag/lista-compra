import { describe, it, expect, vi, beforeEach } from 'vitest';

// El IntersectionObserver real invoca su callback casi inmediatamente al llamar a
// observe(), informando del estado de intersección actual del elemento — incluido
// "true" si el elemento ya es visible en ese momento (ej. una lista vacía, sin scroll
// posible). Este fake replica ese comportamiento para poder detectar condiciones de
// carrera como la de BR-48 (ver "no duplica la primera página" más abajo).
let observedCallback;
class FakeIntersectionObserver {
  constructor(callback) {
    observedCallback = callback;
  }
  observe() {
    Promise.resolve().then(() => observedCallback([{ isIntersecting: true }]));
  }
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

  it('mantener pulsado un item abre el wizard en modo edit con el producto', async () => {
    vi.useFakeTimers();
    const product = makeProduct({ id: 'p1' });
    queueResponse({ data: [product], error: null });
    const container = mount();
    await renderProductList(container, { householdId: 'h1' });
    await vi.advanceTimersByTimeAsync(0); // deja resolver el auto-disparo del observer

    const body = container.querySelector('[data-testid="product-item-p1"] [data-testid="product-item-body"]');
    body.dispatchEvent(new MouseEvent('mousedown'));
    await vi.advanceTimersByTimeAsync(500);
    body.dispatchEvent(new MouseEvent('mouseup'));
    vi.useRealTimers();
    await Promise.resolve(); // fetchSuggestedProducts (mock) resuelve tras el long-press

    expect(openProductWizardModal).toHaveBeenCalledWith(
      expect.objectContaining({ mode: 'edit', product, onSave: expect.any(Function) })
    );
  });

  it('seleccionar 1 item y pulsar "Editar" en el menú del header fijo abre el wizard (exactamente 1 seleccionado)', async () => {
    const product = makeProduct({ id: 'p1' });
    queueResponse({ data: [product], error: null });
    const container = mount();
    await renderProductList(container, { householdId: 'h1' });

    container.querySelector('[data-testid="product-item-p1"] [data-testid="product-item-body"]').click();
    container
      .querySelector('[data-testid="selection-bar-menu-container"] [data-testid="dropdown-menu-toggle"]')
      .click();
    container
      .querySelector('[data-testid="selection-bar-menu-container"] [data-testid="dropdown-menu-edit"]')
      .click();
    await new Promise((r) => setTimeout(r, 0));

    expect(openProductWizardModal).toHaveBeenCalledWith(
      expect.objectContaining({ mode: 'edit', product, onSave: expect.any(Function) })
    );
  });

  it('con 2 seleccionados, el menú del header fijo no ofrece "Editar"', async () => {
    queueResponse({ data: [makeProduct({ id: 'p1' }), makeProduct({ id: 'p2' })], error: null });
    const container = mount();
    await renderProductList(container, { householdId: 'h1' });

    container.querySelector('[data-testid="product-item-p1"] [data-testid="product-item-body"]').click();
    container.querySelector('[data-testid="product-item-p2"] [data-testid="product-item-body"]').click();
    container
      .querySelector('[data-testid="selection-bar-menu-container"] [data-testid="dropdown-menu-toggle"]')
      .click();

    expect(
      container.querySelector('[data-testid="selection-bar-menu-container"] [data-testid="dropdown-menu-edit"]')
    ).toBeNull();
  });

  it('eliminar un único producto seleccionado abre confirmación (BR-42) y borra al confirmar', async () => {
    queueResponse({ data: [makeProduct({ id: 'p1' })], error: null }); // primera página
    queueResponse({ error: null }); // delete().in()
    const container = mount();
    await renderProductList(container, { householdId: 'h1' });

    container.querySelector('[data-testid="product-item-p1"] [data-testid="product-item-body"]').click();
    container.querySelector('[data-testid="selection-bar-delete-button"]').click();

    expect(openConfirmModal).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Eliminar productos', message: '¿Eliminar este producto?' })
    );

    await openConfirmModal.mock.calls[0][0].onConfirm();

    const deleteBuilder = createdBuilders.find((b) => b.delete.mock.calls.length > 0);
    expect(deleteBuilder.in).toHaveBeenCalledWith('id', ['p1']);
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

  it('carga la primera página una sola vez, sin duplicarla (regresión: el observer se activa nada más observar el centinela, antes de que loadFirstPage() termine)', async () => {
    const firstPage = Array.from({ length: 5 }, (_, i) => makeProduct({ id: `p${i}` }));
    queueResponse({ data: firstPage, error: null });
    const container = mount();

    await renderProductList(container, { householdId: 'h1' });
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => setTimeout(r, 0));

    expect(container.querySelectorAll('[data-testid^="product-item-p"]')).toHaveLength(5);
  });

  it('scroll infinito: el centinela visible carga la siguiente página automáticamente en cuanto termina la primera (BR-48)', async () => {
    const firstPage = Array.from({ length: 20 }, (_, i) => makeProduct({ id: `p${i}` }));
    const secondPage = [makeProduct({ id: 'p-extra' })];
    queueResponse({ data: firstPage, error: null });
    queueResponse({ data: secondPage, error: null });
    const container = mount();

    await renderProductList(container, { householdId: 'h1' });
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => setTimeout(r, 0));

    expect(container.querySelector('[data-testid="product-item-p-extra"]')).not.toBeNull();
    expect(container.querySelectorAll('[data-testid^="product-item-p"]')).toHaveLength(21);
  });

  it('scroll infinito manual (simulando un scroll real posterior) carga páginas adicionales sin duplicar', async () => {
    const page1 = Array.from({ length: 20 }, (_, i) => makeProduct({ id: `p${i}` }));
    const page2 = Array.from({ length: 20 }, (_, i) => makeProduct({ id: `q${i}` })); // consumida por el auto-disparo tras la primera carga
    queueResponse({ data: page1, error: null });
    queueResponse({ data: page2, error: null });
    const container = mount();
    await renderProductList(container, { householdId: 'h1' });
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => setTimeout(r, 0));

    queueResponse({ data: [makeProduct({ id: 'p-extra' })], error: null });
    await observedCallback([{ isIntersecting: true }]);

    expect(container.querySelector('[data-testid="product-item-p-extra"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="product-list-items"]').children).toHaveLength(41);
  });

  it('seleccionar todos fuerza cargar todas las páginas restantes antes de seleccionar (BR-43)', async () => {
    const page1 = Array.from({ length: 20 }, (_, i) => makeProduct({ id: `p${i}` }));
    const page2 = Array.from({ length: 20 }, (_, i) => makeProduct({ id: `q${i}` }));
    const page3 = [makeProduct({ id: 'p-last' })];
    queueResponse({ data: page1, error: null });
    queueResponse({ data: page2, error: null }); // consumida por el auto-disparo tras la primera carga
    const container = mount();
    await renderProductList(container, { householdId: 'h1' });
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => setTimeout(r, 0));

    container.querySelector('[data-testid="product-item-p0"] [data-testid="product-item-body"]').click();

    queueResponse({ data: page3, error: null });
    container
      .querySelector('[data-testid="selection-bar-menu-container"] [data-testid="dropdown-menu-toggle"]')
      .click();
    container
      .querySelector('[data-testid="selection-bar-menu-container"] [data-testid="dropdown-menu-select-all"]')
      .click();
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => setTimeout(r, 0));

    expect(container.querySelector('[data-testid="product-item-p-last"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="selection-bar-count"]').textContent).toContain('41');
  });
});
