import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

describe('renderProductItem (revisado: sin menú de 3 puntos por item)', () => {
  it('muestra nombre, cantidad+unidad, categoría e icono de categoría', () => {
    const el = mount(renderProductItem(makeProduct(), { onEdit: vi.fn() }));

    expect(el.querySelector('[data-testid="product-item-name"]').textContent).toBe('Leche');
    expect(el.querySelector('[data-testid="product-item-meta"]').textContent).toContain('2 litros');
    expect(el.querySelector('[data-testid="product-item-meta"]').textContent).toContain('Lácteos');
    expect(el.querySelector('[data-testid="product-item-category-icon"]').textContent).toBe('🥛');
  });

  it('sin categoría muestra el icono genérico y "Sin categoría"', () => {
    const el = mount(renderProductItem(makeProduct({ category: null }), { onEdit: vi.fn() }));

    expect(el.querySelector('[data-testid="product-item-category-icon"]').textContent).toBe('📦');
    expect(el.querySelector('[data-testid="product-item-meta"]').textContent).toContain('Sin categoría');
  });

  it('no muestra checkbox si no se pasa onToggleSelect', () => {
    const el = mount(renderProductItem(makeProduct(), { onEdit: vi.fn() }));

    expect(el.querySelector('[data-testid="product-item-select-checkbox"]')).toBeNull();
  });

  it('click en el cuerpo del item llama a onToggleSelect (BR-41)', () => {
    const onToggleSelect = vi.fn();
    const el = mount(renderProductItem(makeProduct(), { onEdit: vi.fn(), onToggleSelect }));

    el.querySelector('[data-testid="product-item-body"]').click();

    expect(onToggleSelect).toHaveBeenCalledWith('p1');
  });

  it('refleja el prop selected en el estado inicial del checkbox y en el fondo', () => {
    const el = mount(
      renderProductItem(makeProduct(), { onEdit: vi.fn(), onToggleSelect: vi.fn(), selected: true })
    );

    expect(el.querySelector('[data-testid="product-item-select-checkbox"]').checked).toBe(true);
    expect(el.classList.contains('selected')).toBe(true);
  });

  it('sin selected no tiene la clase "selected"', () => {
    const el = mount(renderProductItem(makeProduct(), { onEdit: vi.fn(), onToggleSelect: vi.fn() }));

    expect(el.classList.contains('selected')).toBe(false);
  });

  describe('mantener pulsado abre edición', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('mantener pulsado 500ms llama a onEdit con el producto, sin alternar selección', () => {
      const onEdit = vi.fn();
      const onToggleSelect = vi.fn();
      const product = makeProduct();
      const el = mount(renderProductItem(product, { onEdit, onToggleSelect }));
      const body = el.querySelector('[data-testid="product-item-body"]');

      body.dispatchEvent(new MouseEvent('mousedown'));
      vi.advanceTimersByTime(500);
      body.dispatchEvent(new MouseEvent('mouseup'));
      body.click();

      expect(onEdit).toHaveBeenCalledWith(product);
      expect(onToggleSelect).not.toHaveBeenCalled();
    });

    it('soltar antes de 500ms es un tap normal: alterna selección, no llama a onEdit', () => {
      const onEdit = vi.fn();
      const onToggleSelect = vi.fn();
      const el = mount(renderProductItem(makeProduct(), { onEdit, onToggleSelect }));
      const body = el.querySelector('[data-testid="product-item-body"]');

      body.dispatchEvent(new MouseEvent('mousedown'));
      vi.advanceTimersByTime(200);
      body.dispatchEvent(new MouseEvent('mouseup'));
      body.click();

      expect(onEdit).not.toHaveBeenCalled();
      expect(onToggleSelect).toHaveBeenCalledWith('p1');
    });
  });
});
