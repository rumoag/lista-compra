import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/home/households-api.js', () => ({
  createHousehold: vi.fn(),
  updateHousehold: vi.fn(),
}));

const { createHousehold, updateHousehold } = await import('../../src/home/households-api.js');
const { openListFormModal } = await import('../../src/home/list-form-modal.js');

beforeEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = '';
});

describe('openListFormModal — modo create (FR-2)', () => {
  it('preselecciona el primer icono del set y crea con título válido', async () => {
    createHousehold.mockResolvedValue('new-id');
    const onSaved = vi.fn();

    openListFormModal({ mode: 'create', onSaved });

    expect(document.querySelector('[data-testid="list-form-icon-🛒"]').getAttribute('aria-pressed')).toBe('true');

    document.querySelector('[data-testid="list-form-title-input"]').value = 'Mi lista';
    document.querySelector('[data-testid="list-form"]').dispatchEvent(new Event('submit', { cancelable: true }));

    await new Promise((r) => setTimeout(r, 0));

    expect(createHousehold).toHaveBeenCalledWith({ title: 'Mi lista', image_icon: '🛒' });
    expect(onSaved).toHaveBeenCalled();
  });

  it('muestra error de validación de título sin crear (BR-24)', async () => {
    openListFormModal({ mode: 'create', onSaved: vi.fn() });

    document.querySelector('[data-testid="list-form-title-input"]').value = '';
    document.querySelector('[data-testid="list-form"]').dispatchEvent(new Event('submit', { cancelable: true }));

    await new Promise((r) => setTimeout(r, 0));

    expect(createHousehold).not.toHaveBeenCalled();
    expect(document.querySelector('[data-testid="list-form-title-error"]').hidden).toBe(false);
  });

  it('permite elegir otro icono del set', async () => {
    createHousehold.mockResolvedValue('new-id');
    openListFormModal({ mode: 'create', onSaved: vi.fn() });

    document.querySelector('[data-testid="list-form-icon-🥦"]').click();
    document.querySelector('[data-testid="list-form-title-input"]').value = 'Mi lista';
    document.querySelector('[data-testid="list-form"]').dispatchEvent(new Event('submit', { cancelable: true }));

    await new Promise((r) => setTimeout(r, 0));

    expect(createHousehold).toHaveBeenCalledWith({ title: 'Mi lista', image_icon: '🥦' });
  });
});

describe('openListFormModal — modo edit (FR-3, BR-32)', () => {
  it('precarga título e icono actuales y actualiza al guardar', async () => {
    updateHousehold.mockResolvedValue(undefined);
    const household = { id: 'h1', title: 'Casa', image_icon: '🏠' };

    openListFormModal({ mode: 'edit', household, onSaved: vi.fn() });

    expect(document.querySelector('[data-testid="list-form-title-input"]').value).toBe('Casa');
    expect(document.querySelector('[data-testid="list-form-icon-🏠"]').getAttribute('aria-pressed')).toBe('true');

    document.querySelector('[data-testid="list-form-title-input"]').value = 'Casa nueva';
    document.querySelector('[data-testid="list-form"]').dispatchEvent(new Event('submit', { cancelable: true }));

    await new Promise((r) => setTimeout(r, 0));

    expect(updateHousehold).toHaveBeenCalledWith('h1', { title: 'Casa nueva', image_icon: '🏠' });
  });
});
