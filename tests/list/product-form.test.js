import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderProductForm } from '../../src/list/product-form.js';

describe('renderProductForm', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('llama a onSubmit con los valores válidos del formulario', () => {
    const onSubmit = vi.fn();
    renderProductForm(container, { onSubmit });

    container.querySelector('[data-testid="product-form-name-input"]').value = 'Leche';
    container.querySelector('[data-testid="product-form-quantity-input"]').value = '2 litros';
    container.querySelector('[data-testid="product-form-submit-button"]').click();

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Leche', quantity: '2 litros', category: null });
  });

  it('no llama a onSubmit y muestra error si el nombre está vacío', () => {
    const onSubmit = vi.fn();
    renderProductForm(container, { onSubmit });

    container.querySelector('[data-testid="product-form-submit-button"]').click();

    expect(onSubmit).not.toHaveBeenCalled();
    expect(container.querySelector('[data-testid="product-form-name-error"]').hidden).toBe(false);
  });

  it('selecciona una categoría vía chip', () => {
    const onSubmit = vi.fn();
    renderProductForm(container, { onSubmit });

    container.querySelector('[data-testid="product-form-name-input"]').value = 'Yogur';
    container.querySelector('.chip[data-category="Lácteos"]').click();
    container.querySelector('[data-testid="product-form-submit-button"]').click();

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Yogur', quantity: null, category: 'Lácteos' });
  });

  it('permite escribir una categoría libre al elegir "Otra…"', () => {
    const onSubmit = vi.fn();
    renderProductForm(container, { onSubmit });

    container.querySelector('[data-testid="product-form-name-input"]').value = 'Detergente';
    container.querySelector('.chip[data-category="__other__"]').click();
    container.querySelector('[data-testid="product-form-category-input"]').value = 'Hogar';
    container.querySelector('[data-testid="product-form-submit-button"]').click();

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Detergente', quantity: null, category: 'Hogar' });
  });
});
