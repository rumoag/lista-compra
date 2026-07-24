import { describe, it, expect, vi, beforeEach } from 'vitest';
import { openChangeNameModal } from '../../src/list/change-name-modal.js';
import { getLocalName, setLocalName } from '../../src/onboarding/name-prompt.js';

beforeEach(() => {
  document.body.innerHTML = '';
  localStorage.clear();
});

describe('openChangeNameModal (BR-45)', () => {
  it('abre un modal con el formulario precargado con el nombre actual', () => {
    setLocalName('Yo');
    openChangeNameModal({ onSaved: vi.fn() });

    expect(document.querySelector('[data-testid="modal-title"]').textContent).toBe('Cambiar nombre');
    expect(document.querySelector('[data-testid="name-prompt-input"]').value).toBe('Yo');
  });

  it('guardar actualiza localStorage, cierra el modal y llama a onSaved', () => {
    const onSaved = vi.fn();
    openChangeNameModal({ onSaved });

    document.querySelector('[data-testid="name-prompt-input"]').value = 'Mi pareja';
    document.querySelector('[data-testid="name-prompt-save-button"]').click();

    expect(getLocalName()).toBe('Mi pareja');
    expect(onSaved).toHaveBeenCalledWith('Mi pareja');
    expect(document.querySelector('[data-testid="modal-overlay"]')).toBeNull();
  });
});
