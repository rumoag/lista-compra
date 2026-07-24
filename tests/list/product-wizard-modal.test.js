import { describe, it, expect, vi, beforeEach } from 'vitest';
import { openProductWizardModal } from '../../src/list/product-wizard-modal.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

function goToStep2ViaChip(name = 'Leche') {
  document.querySelector(`[data-testid="wizard-product-chip-${name}"]`).click();
  document.querySelector('[data-testid="wizard-next-button"]').click();
}

describe('openProductWizardModal — modo create (FR-13)', () => {
  it('paso 1: seleccionar un chip sugerido y avanzar', () => {
    openProductWizardModal({ mode: 'create', suggestedProducts: ['Leche', 'Pan'], onSave: vi.fn() });

    expect(document.querySelector('[data-testid="modal-title"]').textContent).toBe('Añadir producto');
    goToStep2ViaChip('Leche');

    expect(document.querySelector('[data-testid="wizard-quantity-input"]')).not.toBeNull();
  });

  it('paso 1: no permite avanzar sin seleccionar/escribir producto', () => {
    openProductWizardModal({ mode: 'create', suggestedProducts: ['Leche'], onSave: vi.fn() });

    document.querySelector('[data-testid="wizard-next-button"]').click();

    expect(document.querySelector('[data-testid="wizard-step1-error"]').hidden).toBe(false);
    expect(document.querySelector('[data-testid="wizard-quantity-input"]')).toBeNull();
  });

  it('paso 1: chip "Otros" revela input y valida como BR-1', () => {
    openProductWizardModal({ mode: 'create', suggestedProducts: [], onSave: vi.fn() });

    document.querySelector('[data-testid="wizard-product-chip-other"]').click();
    document.querySelector('[data-testid="wizard-product-name-input"]').value = 'Leche (2%)';
    document.querySelector('[data-testid="wizard-next-button"]').click();

    expect(document.querySelector('[data-testid="wizard-step1-error"]').hidden).toBe(false);
  });

  it('paso 2: stepper +/- respeta límites 1-999 (BR-35)', () => {
    openProductWizardModal({ mode: 'create', suggestedProducts: ['Leche'], onSave: vi.fn() });
    goToStep2ViaChip();

    const input = document.querySelector('[data-testid="wizard-quantity-input"]');
    expect(input.value).toBe('1');

    document.querySelector('[data-testid="wizard-quantity-decrement"]').click();
    expect(input.value).toBe('1');

    for (let i = 0; i < 1000; i++) {
      document.querySelector('[data-testid="wizard-quantity-increment"]').click();
    }
    expect(input.value).toBe('999');
  });

  it('paso 2: Atrás vuelve al paso 1 conservando la selección', () => {
    openProductWizardModal({ mode: 'create', suggestedProducts: ['Leche'], onSave: vi.fn() });
    goToStep2ViaChip('Leche');

    document.querySelector('[data-testid="wizard-back-button"]').click();

    expect(document.querySelector('[data-testid="wizard-product-chip-Leche"]').getAttribute('aria-pressed')).toBe(
      'true'
    );
  });

  it('flujo completo: producto + cantidad + categoría llama a onSave con los valores correctos', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    openProductWizardModal({ mode: 'create', suggestedProducts: ['Leche'], onSave });
    goToStep2ViaChip('Leche');

    document.querySelector('[data-testid="wizard-quantity-increment"]').click();
    document.querySelector('[data-testid="wizard-quantity-unit-input"]').value = 'litros';
    document.querySelector('[data-testid="wizard-next-button"]').click();

    document.querySelector('[data-testid="wizard-category-chip-Lácteos"]').click();
    document.querySelector('[data-testid="wizard-save-button"]').click();
    await new Promise((r) => setTimeout(r, 0));

    expect(onSave).toHaveBeenCalledWith({
      name: 'Leche',
      quantity_number: 2,
      quantity_unit: 'litros',
      category: 'Lácteos',
    });
    expect(document.querySelector('[data-testid="modal-overlay"]')).toBeNull();
  });

  it('categoría "Otra…" con texto libre se guarda tal cual', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    openProductWizardModal({ mode: 'create', suggestedProducts: ['Leche'], onSave });
    goToStep2ViaChip('Leche');
    document.querySelector('[data-testid="wizard-next-button"]').click();

    document.querySelector('[data-testid="wizard-category-chip-other"]').click();
    document.querySelector('[data-testid="wizard-category-input"]').value = 'Bricolaje';
    document.querySelector('[data-testid="wizard-save-button"]').click();
    await new Promise((r) => setTimeout(r, 0));

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ category: 'Bricolaje' }));
  });

  it('muestra error genérico si onSave falla, sin cerrar el modal', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('boom'));
    openProductWizardModal({ mode: 'create', suggestedProducts: ['Leche'], onSave });
    goToStep2ViaChip('Leche');
    document.querySelector('[data-testid="wizard-next-button"]').click();
    document.querySelector('[data-testid="wizard-category-chip-Fruta"]').click();
    document.querySelector('[data-testid="wizard-save-button"]').click();
    await new Promise((r) => setTimeout(r, 0));

    expect(document.querySelector('[data-testid="wizard-step3-error"]').hidden).toBe(false);
    expect(document.querySelector('[data-testid="modal-overlay"]')).not.toBeNull();
  });

  it('cerrar con la X en cualquier paso descarta sin confirmación (BR-44)', () => {
    openProductWizardModal({ mode: 'create', suggestedProducts: ['Leche'], onSave: vi.fn() });
    goToStep2ViaChip('Leche');

    document.querySelector('[data-testid="modal-close-button"]').click();

    expect(document.querySelector('[data-testid="modal-overlay"]')).toBeNull();
  });
});

describe('openProductWizardModal — modo edit', () => {
  it('precarga nombre, cantidad, unidad y categoría del producto', () => {
    const product = {
      id: 'p1',
      name: 'Huevos',
      quantity_number: 6,
      quantity_unit: 'unidades',
      category: 'Fruta',
    };
    openProductWizardModal({ mode: 'edit', product, suggestedProducts: ['Leche'], onSave: vi.fn() });

    expect(document.querySelector('[data-testid="modal-title"]').textContent).toBe('Editar producto');
    expect(document.querySelector('[data-testid="wizard-product-chip-other"]').getAttribute('aria-pressed')).toBe(
      'true'
    );
    expect(document.querySelector('[data-testid="wizard-product-name-input"]').value).toBe('Huevos');

    document.querySelector('[data-testid="wizard-next-button"]').click();
    expect(document.querySelector('[data-testid="wizard-quantity-input"]').value).toBe('6');
    expect(document.querySelector('[data-testid="wizard-quantity-unit-input"]').value).toBe('unidades');

    document.querySelector('[data-testid="wizard-next-button"]').click();
    expect(document.querySelector('[data-testid="wizard-category-chip-Fruta"]').getAttribute('aria-pressed')).toBe(
      'true'
    );
  });

  it('si el nombre actual está entre los sugeridos, se preselecciona el chip (no "Otros")', () => {
    const product = { id: 'p1', name: 'Leche', quantity_number: 1, quantity_unit: null, category: null };
    openProductWizardModal({ mode: 'edit', product, suggestedProducts: ['Leche', 'Pan'], onSave: vi.fn() });

    expect(document.querySelector('[data-testid="wizard-product-chip-Leche"]').getAttribute('aria-pressed')).toBe(
      'true'
    );
    expect(document.querySelector('[data-testid="wizard-product-chip-other"]').getAttribute('aria-pressed')).toBe(
      'false'
    );
  });
});
