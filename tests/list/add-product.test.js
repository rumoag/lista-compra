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

vi.mock('../../src/onboarding/name-prompt.js', () => ({
  getLocalName: vi.fn(() => 'Ana'),
}));

vi.mock('../../src/list/suggested-products.js', () => ({
  fetchSuggestedProducts: vi.fn().mockResolvedValue(['Leche']),
}));

vi.mock('../../src/list/product-wizard-modal.js', () => ({
  openProductWizardModal: vi.fn(),
}));

const { openProductWizardModal } = await import('../../src/list/product-wizard-modal.js');
const { openAddProductWizard } = await import('../../src/list/add-product.js');

beforeEach(() => {
  vi.clearAllMocks();
  responseQueue = [];
  createdBuilders = [];
});

describe('openAddProductWizard (FAB persistente entre vistas, Unidad 6)', () => {
  it('abre el wizard en modo create con los productos sugeridos del household', async () => {
    await openAddProductWizard({ householdId: 'h1' });

    expect(openProductWizardModal).toHaveBeenCalledWith(
      expect.objectContaining({ mode: 'create', suggestedProducts: ['Leche'], onSave: expect.any(Function) })
    );
  });

  it('guardar desde el wizard inserta el producto directamente en supabase', async () => {
    queueResponse({ error: null }); // insert()
    await openAddProductWizard({ householdId: 'h1' });

    const { onSave } = openProductWizardModal.mock.calls[0][0];
    await onSave({ name: 'Leche', quantity_number: 2, quantity_unit: 'litros', category: 'Lácteos' });

    const insertBuilder = createdBuilders.find((b) => b.insert.mock.calls.length > 0);
    expect(insertBuilder.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        household_id: 'h1',
        name: 'Leche',
        quantity_number: 2,
        quantity_unit: 'litros',
        category: 'Lácteos',
        status: 'pending',
        added_by: 'Ana',
      })
    );
  });

  it('propaga el error si el insert falla, para que el wizard muestre el mensaje', async () => {
    queueResponse({ error: new Error('boom') });
    await openAddProductWizard({ householdId: 'h1' });

    const { onSave } = openProductWizardModal.mock.calls[0][0];
    await expect(
      onSave({ name: 'Leche', quantity_number: 1, quantity_unit: null, category: 'Otros' })
    ).rejects.toThrow('boom');
  });
});
