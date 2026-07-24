import { describe, it, expect, vi } from 'vitest';
import { renderProductItem } from '../../src/list/product-item.js';

function makeProduct(overrides = {}) {
  return {
    id: 'p1',
    name: 'Leche',
    quantity_number: 2,
    quantity_unit: 'litros',
    category: 'Lácteos',
    ...overrides,
  };
}

function mount(el) {
  document.body.appendChild(el);
  return el;
}

describe('renderProductItem (Unidad 6)', () => {
  it('muestra nombre, cantidad+unidad, categoría e icono de categoría', () => {
    const el = mount(renderProductItem(makeProduct(), { onEdit: vi.fn(), onDelete: vi.fn() }));

    expect(el.querySelector('[data-testid="product-item-name"]').textContent).toBe('Leche');
    expect(el.querySelector('[data-testid="product-item-meta"]').textContent).toContain('2 litros');
    expect(el.querySelector('[data-testid="product-item-meta"]').textContent).toContain('Lácteos');
    expect(el.querySelector('[data-testid="product-item-category-icon"]').textContent).toBe('🥛');
  });

  it('sin categoría muestra el icono genérico y "Sin categoría"', () => {
    const el = mount(renderProductItem(makeProduct({ category: null }), { onEdit: vi.fn(), onDelete: vi.fn() }));

    expect(el.querySelector('[data-testid="product-item-category-icon"]').textContent).toBe('📦');
    expect(el.querySelector('[data-testid="product-item-meta"]').textContent).toContain('Sin categoría');
  });

  it('llama a onEdit con el producto completo desde el menú de 3 puntos', () => {
    const onEdit = vi.fn();
    const product = makeProduct();
    const el = mount(renderProductItem(product, { onEdit, onDelete: vi.fn() }));

    el.querySelector('[data-testid="dropdown-menu-toggle"]').click();
    el.querySelector('[data-testid="dropdown-menu-edit"]').click();

    expect(onEdit).toHaveBeenCalledWith(product);
  });

  it('llama a onDelete con el id desde el menú de 3 puntos', () => {
    const onDelete = vi.fn();
    const el = mount(renderProductItem(makeProduct(), { onEdit: vi.fn(), onDelete }));

    el.querySelector('[data-testid="dropdown-menu-toggle"]').click();
    el.querySelector('[data-testid="dropdown-menu-delete"]').click();

    expect(onDelete).toHaveBeenCalledWith('p1');
  });

  it('no muestra checkbox si no se pasa onToggleSelect', () => {
    const el = mount(renderProductItem(makeProduct(), { onEdit: vi.fn(), onDelete: vi.fn() }));

    expect(el.querySelector('[data-testid="product-item-select-checkbox"]')).toBeNull();
  });

  it('click en el cuerpo del item llama a onToggleSelect (BR-41)', () => {
    const onToggleSelect = vi.fn();
    const el = mount(renderProductItem(makeProduct(), { onEdit: vi.fn(), onDelete: vi.fn(), onToggleSelect }));

    el.querySelector('[data-testid="product-item-body"]').click();

    expect(onToggleSelect).toHaveBeenCalledWith('p1');
  });

  it('click en el menú de 3 puntos NO alterna la selección (BR-41)', () => {
    const onToggleSelect = vi.fn();
    const el = mount(renderProductItem(makeProduct(), { onEdit: vi.fn(), onDelete: vi.fn(), onToggleSelect }));

    el.querySelector('[data-testid="dropdown-menu-toggle"]').click();

    expect(onToggleSelect).not.toHaveBeenCalled();
  });

  it('refleja el prop selected en el estado inicial del checkbox', () => {
    const el = mount(
      renderProductItem(makeProduct(), { onEdit: vi.fn(), onDelete: vi.fn(), onToggleSelect: vi.fn(), selected: true })
    );

    expect(el.querySelector('[data-testid="product-item-select-checkbox"]').checked).toBe(true);
  });
});
