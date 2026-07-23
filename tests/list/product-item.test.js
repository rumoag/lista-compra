import { describe, it, expect, vi } from 'vitest';
import { renderProductItem } from '../../src/list/product-item.js';

function makeProduct(overrides = {}) {
  return {
    id: 'p1',
    name: 'Leche',
    quantity: '2 litros',
    category: 'Lácteos',
    ...overrides,
  };
}

// jsdom solo dispara el evento "submit" al hacer click en un botón submit
// cuando el <form> está conectado al documento.
function mount(el) {
  document.body.appendChild(el);
  return el;
}

describe('renderProductItem', () => {
  it('muestra nombre, cantidad y categoría', () => {
    const el = mount(renderProductItem(makeProduct(), { onEdit: vi.fn(), onDelete: vi.fn() }));

    expect(el.querySelector('[data-testid="product-item-name"]').textContent).toBe('Leche');
    expect(el.querySelector('[data-testid="product-item-meta"]').textContent).toContain('2 litros');
    expect(el.querySelector('[data-testid="product-item-meta"]').textContent).toContain('Lácteos');
  });

  it('llama a onDelete con el id del producto', () => {
    const onDelete = vi.fn();
    const el = mount(renderProductItem(makeProduct(), { onEdit: vi.fn(), onDelete }));

    el.querySelector('[data-testid="product-item-delete-button"]').click();

    expect(onDelete).toHaveBeenCalledWith('p1');
  });

  it('entra en modo edición y llama a onEdit con los valores actualizados', () => {
    const onEdit = vi.fn();
    const el = mount(renderProductItem(makeProduct(), { onEdit, onDelete: vi.fn() }));

    el.querySelector('[data-testid="product-item-edit-button"]').click();
    el.querySelector('[data-testid="product-item-edit-name"]').value = 'Leche desnatada';
    el.querySelector('[data-testid="product-item-edit-save-button"]').click();

    expect(onEdit).toHaveBeenCalledWith('p1', {
      name: 'Leche desnatada',
      quantity: '2 litros',
      category: 'Lácteos',
    });
  });

  it('muestra error de validación en modo edición sin llamar a onEdit', () => {
    const onEdit = vi.fn();
    const el = mount(renderProductItem(makeProduct(), { onEdit, onDelete: vi.fn() }));

    el.querySelector('[data-testid="product-item-edit-button"]').click();
    el.querySelector('[data-testid="product-item-edit-name"]').value = '';
    el.querySelector('[data-testid="product-item-edit-save-button"]').click();

    expect(onEdit).not.toHaveBeenCalled();
    expect(el.querySelector('[data-testid="product-item-edit-error"]').hidden).toBe(false);
  });

  it('cancelar edición vuelve a la vista normal', () => {
    const el = mount(renderProductItem(makeProduct(), { onEdit: vi.fn(), onDelete: vi.fn() }));

    el.querySelector('[data-testid="product-item-edit-button"]').click();
    el.querySelector('[data-testid="product-item-edit-cancel-button"]').click();

    expect(el.querySelector('[data-testid="product-item-name"]').textContent).toBe('Leche');
  });

  it('no muestra checkbox de selección si no se pasa onToggleSelect (Unidad 1, sin selección múltiple)', () => {
    const el = mount(renderProductItem(makeProduct(), { onEdit: vi.fn(), onDelete: vi.fn() }));

    expect(el.querySelector('[data-testid="product-item-select-checkbox"]')).toBeNull();
  });

  it('muestra checkbox y llama a onToggleSelect al marcarlo (US-2.1)', () => {
    const onToggleSelect = vi.fn();
    const el = mount(
      renderProductItem(makeProduct(), { onEdit: vi.fn(), onDelete: vi.fn(), onToggleSelect })
    );

    const checkbox = el.querySelector('[data-testid="product-item-select-checkbox"]');
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    expect(onToggleSelect).toHaveBeenCalledWith('p1');
  });

  it('refleja el prop selected en el estado inicial del checkbox', () => {
    const el = mount(
      renderProductItem(makeProduct(), { onEdit: vi.fn(), onDelete: vi.fn(), onToggleSelect: vi.fn(), selected: true })
    );

    expect(el.querySelector('[data-testid="product-item-select-checkbox"]').checked).toBe(true);
  });
});
