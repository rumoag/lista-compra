import { describe, it, expect, vi, beforeEach } from 'vitest';
import { openModal } from '../../src/common/modal.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('openModal (BR-33)', () => {
  it('renderiza el título y un botón de cerrar', () => {
    openModal({ title: 'Mi modal' });

    expect(document.querySelector('[data-testid="modal-title"]').textContent).toBe('Mi modal');
    expect(document.querySelector('[data-testid="modal-close-button"]')).not.toBeNull();
  });

  it('devuelve el nodo body para que el llamante monte contenido', () => {
    const { body } = openModal({ title: 'Mi modal' });
    body.innerHTML = '<p data-testid="custom-content">hola</p>';

    expect(document.querySelector('[data-testid="custom-content"]').textContent).toBe('hola');
  });

  it('cierra al pulsar la X', () => {
    const onClose = vi.fn();
    openModal({ title: 'Mi modal', onClose });

    document.querySelector('[data-testid="modal-close-button"]').click();

    expect(document.querySelector('[data-testid="modal-overlay"]')).toBeNull();
    expect(onClose).toHaveBeenCalled();
  });

  it('cierra al hacer click en el overlay (fuera del panel)', () => {
    openModal({ title: 'Mi modal' });

    document.querySelector('[data-testid="modal-overlay"]').click();

    expect(document.querySelector('[data-testid="modal-overlay"]')).toBeNull();
  });

  it('no cierra al hacer click dentro del panel', () => {
    openModal({ title: 'Mi modal' });

    document.querySelector('[data-testid="modal-panel"]').click();

    expect(document.querySelector('[data-testid="modal-overlay"]')).not.toBeNull();
  });

  it('close() cierra el modal programáticamente', () => {
    const { close } = openModal({ title: 'Mi modal' });

    close();

    expect(document.querySelector('[data-testid="modal-overlay"]')).toBeNull();
  });
});
